import axiosInstance from "@/utils/axios";
import type { BackendProjectResponse, ProgressFormPayload } from "@/types/internal";
import { mapApiProjectToDashboardProject } from "@/services/internal/project-mapper";
import { getProjectFromResponse } from "@/services/internal/project-api";

const saveProgressDraft = async (
  projectSlug: string,
  payload: ProgressFormPayload,
) => {
  const { data } = await axiosInstance.put<BackendProjectResponse>(
    `/api/projects/${projectSlug}/stages/progress/draft`,
    payload,
  );

  return mapApiProjectToDashboardProject(getProjectFromResponse(data));
};

export default saveProgressDraft;
