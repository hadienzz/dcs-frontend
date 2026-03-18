"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import reviewTimeline from "@/services/external/review-timeline";
import type { ReviewStagePayload } from "@/types/external";
import {
  SDG_DASHBOARD_PROJECT_DETAIL_QUERY_KEY,
  SDG_DASHBOARD_PROJECTS_QUERY_KEY,
} from "@/types/internal";

const useReviewTimeline = (projectSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReviewStagePayload) => reviewTimeline(projectSlug, payload),
    mutationKey: ["external", "review", "timeline", projectSlug],
    onSuccess: async (project) => {
      queryClient.setQueryData(
        [...SDG_DASHBOARD_PROJECT_DETAIL_QUERY_KEY, "external", project.slug],
        project,
      );
      await queryClient.invalidateQueries({
        queryKey: SDG_DASHBOARD_PROJECTS_QUERY_KEY,
      });
    },
  });
};

export default useReviewTimeline;
