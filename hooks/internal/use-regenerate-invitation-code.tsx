"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import regenerateInvitationCode from "@/services/internal/regenerate-invitation-code";
import {
  SDG_DASHBOARD_PROJECT_DETAIL_QUERY_KEY,
  SDG_DASHBOARD_PROJECTS_QUERY_KEY,
} from "@/types/internal";

const useRegenerateInvitationCode = (projectSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => regenerateInvitationCode(projectSlug),
    mutationKey: ["internal", "invitation-code", projectSlug],
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

export default useRegenerateInvitationCode;
