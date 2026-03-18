import axiosInstance from "@/utils/axios";
import type { BackendProjectResponse, TimelineFormPayload } from "@/types/internal";
import { mapApiProjectToDashboardProject } from "@/services/internal/project-mapper";
import { getProjectFromResponse } from "@/services/internal/project-api";

const saveTimelineDraft = async (
  projectSlug: string,
  payload: TimelineFormPayload,
) => {
  const { data } = await axiosInstance.put<BackendProjectResponse>(
    `/api/projects/${projectSlug}/stages/timeline/draft`,
    payload,
  );

  return mapApiProjectToDashboardProject(getProjectFromResponse(data));
};

export default saveTimelineDraft;
