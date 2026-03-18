import axiosInstance from "@/utils/axios";
import type { BackendProjectsResponse, ProjectStatusFilter } from "@/types/internal";
import { mapApiProjectsToDashboardProjects } from "@/services/internal/project-mapper";
import {
  buildProjectListQuery,
  getProjectsFromResponse,
} from "@/services/internal/project-api";

const getProjects = async (status?: ProjectStatusFilter) => {
  const { data } = await axiosInstance.get<BackendProjectsResponse>("/api/projects", {
    params: buildProjectListQuery(status),
  });

  return mapApiProjectsToDashboardProjects(getProjectsFromResponse(data));
};

export default getProjects;
