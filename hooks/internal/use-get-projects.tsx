"use client";

import { useQuery } from "@tanstack/react-query";

import getProjects from "@/services/internal/get-projects";
import {
  ProjectStatusFilter,
  SDG_DASHBOARD_PROJECTS_QUERY_KEY,
} from "@/types/internal";

interface UseGetProjectsOptions {
  status?: ProjectStatusFilter;
  enabled?: boolean;
}

const useGetProjects = (options?: UseGetProjectsOptions) => {
  return useQuery({
    queryKey: [
      ...SDG_DASHBOARD_PROJECTS_QUERY_KEY,
      "internal",
      options?.status ?? "all",
    ],
    queryFn: () => getProjects(options?.status),
    enabled: options?.enabled,
    refetchOnWindowFocus: false,
  });
};

export default useGetProjects;
