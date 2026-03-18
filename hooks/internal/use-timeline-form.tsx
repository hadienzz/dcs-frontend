"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";

import type {
  SdgDashboardProjectRecord,
  TimelineEntry,
} from "@/components/sdg-dashboard/dashboard-data";
import { initialTimelineEntries } from "@/components/sdg-dashboard/dashboard-data";
import saveTimelineDraft from "@/services/internal/save-timeline-draft";
import submitTimeline from "@/services/internal/submit-timeline";
import {
  SDG_DASHBOARD_PROJECT_DETAIL_QUERY_KEY,
  SDG_DASHBOARD_PROJECTS_QUERY_KEY,
} from "@/types/internal";
import { getErrorMessage } from "@/utils/api-error";

interface TimelineFormValues {
  timelineEntries: TimelineEntry[];
}

interface UseTimelineFormOptions {
  project: SdgDashboardProjectRecord | null;
  onDraftSuccess?: (project: SdgDashboardProjectRecord) => void;
  onSubmitSuccess?: (project: SdgDashboardProjectRecord) => void;
  onError?: (message: string) => void;
}

const useTimelineForm = ({
  project,
  onDraftSuccess,
  onSubmitSuccess,
  onError,
}: UseTimelineFormOptions) => {
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

  const draftMutation = useMutation({
    mutationFn: (values: TimelineFormValues) =>
      saveTimelineDraft(projectSlug, {
        items: values.timelineEntries.map((entry) => ({
          week_label: entry.weekLabel,
          focus: entry.focus,
          deliverable: entry.deliverable,
          owner: entry.owner,
        })),
      }),
    onSuccess: async (nextProject) => {
      await syncProjectCache(nextProject);
      onDraftSuccess?.(nextProject);
    },
  });

  const submitMutation = useMutation({
    mutationFn: (values: TimelineFormValues) =>
      submitTimeline(projectSlug, {
        items: values.timelineEntries.map((entry) => ({
          week_label: entry.weekLabel,
          focus: entry.focus,
          deliverable: entry.deliverable,
          owner: entry.owner,
        })),
      }),
    onSuccess: async (nextProject) => {
      await syncProjectCache(nextProject);
      onSubmitSuccess?.(nextProject);
    },
  });

  const formik = useFormik<TimelineFormValues>({
    enableReinitialize: true,
    initialValues: {
      timelineEntries: project?.timelineEntries?.length
        ? project.timelineEntries
        : initialTimelineEntries,
    },
    onSubmit: async (values, actions) => {
      actions.setStatus(undefined);

      try {
        await submitMutation.mutateAsync(values);
      } catch (error) {
        const message = getErrorMessage(
          error,
          "Timeline belum bisa disimpan. Coba lagi sebentar.",
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

  const updateTimelineEntry = (
    entryId: string,
    field: keyof Omit<TimelineEntry, "id" | "weekLabel">,
    value: string,
  ) => {
    formik.setFieldValue(
      "timelineEntries",
      formik.values.timelineEntries.map((entry) =>
        entry.id === entryId ? { ...entry, [field]: value } : entry,
      ),
    );
  };

  const addTimelineEntry = () => {
    formik.setFieldValue("timelineEntries", [
      ...formik.values.timelineEntries,
      {
        id: `timeline-${formik.values.timelineEntries.length + 1}`,
        weekLabel: `Bulan ${formik.values.timelineEntries.length + 1}`,
        focus: "",
        deliverable: "",
        owner: "Tim SDGs",
      },
    ]);
  };

  const saveDraft = async () => {
    formik.setStatus(undefined);

    try {
      await draftMutation.mutateAsync(formik.values);
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Draft timeline belum bisa disimpan. Coba lagi sebentar.",
      );
      formik.setStatus({
        submitError: message,
      });
      onError?.(message);
    }
  };

  return {
    formik,
    addTimelineEntry,
    updateTimelineEntry,
    saveDraft,
    isSavingDraft: draftMutation.isPending,
    isSubmitting: submitMutation.isPending,
  };
};

export default useTimelineForm;
