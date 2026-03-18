import axiosInstance from "@/utils/axios";
import type { BackendProjectResponse } from "@/types/internal";
import type { ReviewStagePayload } from "@/types/external";
import { mapApiProjectToDashboardProject } from "@/services/internal/project-mapper";
import { getProjectFromResponse } from "@/services/internal/project-api";

const reviewProgress = async (projectSlug: string, payload: ReviewStagePayload) => {
  const { data } = await axiosInstance.post<BackendProjectResponse>(
    `/api/projects/${projectSlug}/stages/progress/review`,
    payload,
  );

  return mapApiProjectToDashboardProject(getProjectFromResponse(data));
};

export default reviewProgress;
