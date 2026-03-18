"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import updateProjectStatus from "@/services/internal/update-project-status";
import {
  SDG_DASHBOARD_PROJECT_DETAIL_QUERY_KEY,
  SDG_DASHBOARD_PROJECTS_QUERY_KEY,
  type UpdateProjectStatusPayload,
} from "@/types/internal";

const useUpdateProjectStatus = (projectSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProjectStatusPayload) =>
      updateProjectStatus(projectSlug, payload),
    mutationKey: ["internal", "project-status", projectSlug],
    onSuccess: async (project) => {
      queryClient.setQueryData(
        [...SDG_DASHBOARD_PROJECT_DETAIL_QUERY_KEY, "internal", project.slug],
        project,
      );
      await queryClient.invalidateQueries({
        queryKey: SDG_DASHBOARD_PROJECTS_QUERY_KEY,
      });
    },
  });
};

export default useUpdateProjectStatus;
