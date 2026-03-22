"use client";

import { useQueryClient } from "@tanstack/react-query";

import type { SdgDashboardProjectRecord } from "@/components/sdg-dashboard/dashboard-data";
import useGetProjectDetailExternal from "@/hooks/external/use-get-project-detail";
import useGetProjectsExternal from "@/hooks/external/use-get-projects";
import useGetProjectDetailInternal from "@/hooks/internal/use-get-project-detail";
import useGetProjectsInternal from "@/hooks/internal/use-get-projects";
import { useSdgDashboardAuth } from "@/hooks/use-sdg-dashboard-auth";
import { SDG_DASHBOARD_PROJECTS_QUERY_KEY } from "@/types/internal";

export function useSdgDashboardProjects() {
  const queryClient = useQueryClient();
  const { currentAccount, isHydrated } = useSdgDashboardAuth();

  const internalProjectsQuery = useGetProjectsInternal({
    enabled: isHydrated && currentAccount?.role === "internal",
  });

  const externalProjectsQuery = useGetProjectsExternal({
    enabled: isHydrated && currentAccount?.role === "external",
  });

  const projects =
    currentAccount?.role === "external"
      ? (externalProjectsQuery.data ?? [])
      : (internalProjectsQuery.data ?? []);

  return {
    projects: projects as SdgDashboardProjectRecord[],
    refreshProjects: () =>
      queryClient.invalidateQueries({
        queryKey: SDG_DASHBOARD_PROJECTS_QUERY_KEY,
      }),
  };
}

export function useSdgDashboardProject(projectSlug: string) {
  const { currentAccount, isHydrated } = useSdgDashboardAuth();
  const internalProjectQuery = useGetProjectDetailInternal(projectSlug, {
    enabled: isHydrated && currentAccount?.role === "internal",
  });
  const externalProjectQuery = useGetProjectDetailExternal(projectSlug, {
    enabled: isHydrated && currentAccount?.role === "external",
  });

  const activeQuery =
    currentAccount?.role === "external"
      ? externalProjectQuery
      : internalProjectQuery;
  const isReady =
    isHydrated && (activeQuery.isFetched || !activeQuery.isPending);

  return {
    project: activeQuery.data ?? null,
    isReady,
  };
}
