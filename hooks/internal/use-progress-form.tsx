"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";

import type {
  MonthlyReport,
  SdgDashboardProjectRecord,
} from "@/components/sdg-dashboard/dashboard-data";
import { initialMonthlyReports } from "@/components/sdg-dashboard/dashboard-data";
import saveProgressDraft from "@/services/internal/save-progress-draft";
import submitProgress from "@/services/internal/submit-progress";
import {
  SDG_DASHBOARD_PROJECT_DETAIL_QUERY_KEY,
  SDG_DASHBOARD_PROJECTS_QUERY_KEY,
  type ProgressFormPayload,
} from "@/types/internal";
import { getErrorMessage } from "@/utils/api-error";

interface ProgressFormValues {
  monthlyReports: MonthlyReport[];
}

interface UseProgressFormOptions {
  project: SdgDashboardProjectRecord | null;
  onDraftSuccess?: (project: SdgDashboardProjectRecord) => void;
  onSubmitSuccess?: (project: SdgDashboardProjectRecord) => void;
  onError?: (message: string) => void;
}

const useProgressForm = ({
  project,
  onDraftSuccess,
  onSubmitSuccess,
  onError,
}: UseProgressFormOptions) => {
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

  const mapPayload = (values: ProgressFormValues): ProgressFormPayload => ({
    reports: values.monthlyReports.map((report) => ({
      month: report.month,
      summary: report.summary,
      visibility_scope:
        report.visibilityScope === "internal" ? "INTERNAL" : "SHARED",
    })),
  });

  const draftMutation = useMutation({
    mutationFn: (values: ProgressFormValues) =>
      saveProgressDraft(projectSlug, mapPayload(values)),
    onSuccess: async (nextProject) => {
      await syncProjectCache(nextProject);
      onDraftSuccess?.(nextProject);
    },
  });

  const submitMutation = useMutation({
    mutationFn: (values: ProgressFormValues) =>
      submitProgress(projectSlug, mapPayload(values)),
    onSuccess: async (nextProject) => {
      await syncProjectCache(nextProject);
      onSubmitSuccess?.(nextProject);
    },
  });

  const formik = useFormik<ProgressFormValues>({
    enableReinitialize: true,
    initialValues: {
      monthlyReports: project?.monthlyReports?.length
        ? project.monthlyReports
        : initialMonthlyReports,
    },
    onSubmit: async (values, actions) => {
      actions.setStatus(undefined);

      try {
        await submitMutation.mutateAsync(values);
      } catch (error) {
        const message = getErrorMessage(
          error,
          "Progress belum bisa disimpan. Coba lagi sebentar.",
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

  const updateMonthlyReport = (reportId: string, patch: Partial<MonthlyReport>) => {
    formik.setFieldValue(
      "monthlyReports",
      formik.values.monthlyReports.map((report) =>
        report.id === reportId ? { ...report, ...patch } : report,
      ),
    );
  };

  const saveDraft = async () => {
    formik.setStatus(undefined);

    try {
      await draftMutation.mutateAsync(formik.values);
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Draft progress belum bisa disimpan. Coba lagi sebentar.",
      );
      formik.setStatus({
        submitError: message,
      });
      onError?.(message);
    }
  };

  return {
    formik,
    updateMonthlyReport,
    saveDraft,
    isSavingDraft: draftMutation.isPending,
    isSubmitting: submitMutation.isPending,
  };
};

export default useProgressForm;
