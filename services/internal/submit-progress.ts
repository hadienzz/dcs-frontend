import axiosInstance from "@/utils/axios";
import type { BackendProjectResponse, ProgressFormPayload } from "@/types/internal";
import { mapApiProjectToDashboardProject } from "@/services/internal/project-mapper";
import { getProjectFromResponse } from "@/services/internal/project-api";

const submitProgress = async (
  projectSlug: string,
  payload: ProgressFormPayload,
) => {
  const { data } = await axiosInstance.post<BackendProjectResponse>(
    `/api/projects/${projectSlug}/stages/progress/submit`,
    payload,
  );

  return mapApiProjectToDashboardProject(getProjectFromResponse(data));
};

export default submitProgress;
