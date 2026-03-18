import axiosInstance from "@/utils/axios";
import type { BackendProjectResponse } from "@/types/internal";
import { mapApiProjectToDashboardProject } from "@/services/internal/project-mapper";
import { getProjectFromResponse } from "@/services/internal/project-api";

const regenerateInvitationCode = async (projectSlug: string) => {
  const { data } = await axiosInstance.post<BackendProjectResponse>(
    `/api/projects/${projectSlug}/invitation/regenerate`,
  );

  return mapApiProjectToDashboardProject(getProjectFromResponse(data));
};

export default regenerateInvitationCode;
