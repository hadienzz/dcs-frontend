import axiosInstance from "@/utils/axios";
import type {
  BackendProjectResponse,
  UpdateProjectStatusPayload,
} from "@/types/internal";
import { mapApiProjectToDashboardProject } from "@/services/internal/project-mapper";
import { getProjectFromResponse } from "@/services/internal/project-api";

const updateProjectStatus = async (
  projectSlug: string,
  payload: UpdateProjectStatusPayload,
) => {
  const { data } = await axiosInstance.patch<BackendProjectResponse>(
    `/api/projects/${projectSlug}/status`,
    payload,
  );

  return mapApiProjectToDashboardProject(getProjectFromResponse(data));
};

export default updateProjectStatus;
