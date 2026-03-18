"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import reviewBudget from "@/services/external/review-budget";
import type { ReviewStagePayload } from "@/types/external";
import {
  SDG_DASHBOARD_PROJECT_DETAIL_QUERY_KEY,
  SDG_DASHBOARD_PROJECTS_QUERY_KEY,
} from "@/types/internal";

const useReviewBudget = (projectSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReviewStagePayload) => reviewBudget(projectSlug, payload),
    mutationKey: ["external", "review", "budget", projectSlug],
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

export default useReviewBudget;
