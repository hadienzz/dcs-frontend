"use client";

import { useQuery } from "@tanstack/react-query";

import getProjectDetail from "@/services/internal/get-project-detail";
import { SDG_DASHBOARD_PROJECT_DETAIL_QUERY_KEY } from "@/types/internal";

interface UseGetProjectDetailOptions {
  enabled?: boolean;
}

const useGetProjectDetail = (
  projectSlug: string,
  options?: UseGetProjectDetailOptions,
) => {
  return useQuery({
    queryKey: [...SDG_DASHBOARD_PROJECT_DETAIL_QUERY_KEY, "internal", projectSlug],
    queryFn: () => getProjectDetail(projectSlug),
    enabled: Boolean(projectSlug) && options?.enabled !== false,
    refetchOnWindowFocus: false,
  });
};

export default useGetProjectDetail;
