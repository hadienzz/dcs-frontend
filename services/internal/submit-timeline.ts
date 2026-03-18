import axiosInstance from "@/utils/axios";
import type { BackendProjectResponse, TimelineFormPayload } from "@/types/internal";
import { mapApiProjectToDashboardProject } from "@/services/internal/project-mapper";
import { getProjectFromResponse } from "@/services/internal/project-api";

const submitTimeline = async (
  projectSlug: string,
  payload: TimelineFormPayload,
) => {
  const { data } = await axiosInstance.post<BackendProjectResponse>(
    `/api/projects/${projectSlug}/stages/timeline/submit`,
    payload,
  );

  return mapApiProjectToDashboardProject(getProjectFromResponse(data));
};

export default submitTimeline;
