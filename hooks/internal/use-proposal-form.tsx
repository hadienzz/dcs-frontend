"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";

import type {
  ProposalFields,
  SdgDashboardProjectRecord,
} from "@/components/sdg-dashboard/dashboard-data";
import { initialProposalFields } from "@/components/sdg-dashboard/dashboard-data";
import saveProposalDraft from "@/services/internal/save-proposal-draft";
import submitProposal from "@/services/internal/submit-proposal";
import {
  SDG_DASHBOARD_PROJECT_DETAIL_QUERY_KEY,
  SDG_DASHBOARD_PROJECTS_QUERY_KEY,
} from "@/types/internal";
import type { ProposalSdgSource } from "@/lib/sdg-goals";
import { getErrorMessage } from "@/utils/api-error";

interface ProposalFormValues {
  proposalFields: ProposalFields;
  proposalSdgGoals: number[];
  proposalSdgReasoning: string;
  proposalSdgSource: ProposalSdgSource;
}

interface UseProposalFormOptions {
  project: SdgDashboardProjectRecord | null;
  onDraftSuccess?: (project: SdgDashboardProjectRecord) => void;
  onSubmitSuccess?: (project: SdgDashboardProjectRecord) => void;
  onError?: (message: string) => void;
}

const useProposalForm = ({
  project,
  onDraftSuccess,
  onSubmitSuccess,
  onError,
}: UseProposalFormOptions) => {
  const queryClient = useQueryClient();
  const projectSlug = project?.slug ?? "";

  const syncProjectCache = async (nextProject: SdgDashboardProjectRecord) => {
    queryClient.setQueryData(
      [...SDG_DASHBOARD_PROJECT_DETAIL_QUERY_KEY, "internal", nextProject.slug],
      nextProject,
    );
    await queryClient.invalidateQueries({
      queryKey: SDG_DASHBOARD_PROJECTS_QUERY_KEY,
    });
  };

  const saveDraftMutation = useMutation({
    mutationFn: (values: ProposalFormValues) =>
      saveProposalDraft(projectSlug, {
        fields: values.proposalFields as unknown as Record<string, string>,
        sdg_goals: values.proposalSdgGoals,
        sdg_reasoning: values.proposalSdgReasoning,
        sdg_source: values.proposalSdgSource ?? "manual",
      }),
    onSuccess: async (nextProject) => {
      await syncProjectCache(nextProject);
      onDraftSuccess?.(nextProject);
    },
  });

  const submitMutation = useMutation({
    mutationFn: (values: ProposalFormValues) =>
      submitProposal(projectSlug, {
        fields: values.proposalFields as unknown as Record<string, string>,
        sdg_goals: values.proposalSdgGoals,
        sdg_reasoning: values.proposalSdgReasoning,
        sdg_source: values.proposalSdgSource ?? "manual",
      }),
    onSuccess: async (nextProject) => {
      await syncProjectCache(nextProject);
      onSubmitSuccess?.(nextProject);
    },
  });

  const formik = useFormik<ProposalFormValues>({
    enableReinitialize: true,
    initialValues: {
      proposalFields: project?.proposalFields ?? initialProposalFields,
      proposalSdgGoals: project?.proposalSdgGoals ?? [],
      proposalSdgReasoning: project?.proposalSdgReasoning ?? "",
      proposalSdgSource: project?.proposalSdgSource ?? "manual",
    },
    onSubmit: async (values, actions) => {
      actions.setStatus(undefined);

      try {
        await submitMutation.mutateAsync(values);
      } catch (error) {
        const message = getErrorMessage(
          error,
          "Proposal belum bisa dikirim. Coba lagi sebentar.",
        );
        actions.setStatus({
          submitError: message,
        });
        onError?.(message);
      } finally {
        actions.setSubmitting(false);
      }
    },
  });

  const saveDraft = async () => {
    formik.setStatus(undefined);

    try {
      await saveDraftMutation.mutateAsync(formik.values);
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Draft proposal belum bisa disimpan. Coba lagi sebentar.",
      );
      formik.setStatus({
        submitError: message,
      });
      onError?.(message);
    }
  };

  return {
    formik,
    saveDraft,
    isSavingDraft: saveDraftMutation.isPending,
    isSubmitting: submitMutation.isPending,
  };
};

export default useProposalForm;
