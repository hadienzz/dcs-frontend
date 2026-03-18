import axiosInstance from "@/utils/axios";
import type { BackendProjectResponse } from "@/types/internal";
import { mapApiProjectToDashboardProject } from "@/services/internal/project-mapper";
import { getProjectFromResponse } from "@/services/internal/project-api";

const getProjectDetail = async (projectSlug: string) => {
  const { data } = await axiosInstance.get<BackendProjectResponse>(
    `/api/projects/${projectSlug}`,
  );

  return mapApiProjectToDashboardProject(getProjectFromResponse(data));
};

export default getProjectDetail;
