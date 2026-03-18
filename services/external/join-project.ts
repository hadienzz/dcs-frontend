import axiosInstance from "@/utils/axios";
import type { ExternalJoinProjectResponse, JoinProjectPayload } from "@/types/external";
import { mapApiProjectToDashboardProject } from "@/services/internal/project-mapper";
import { getProjectFromResponse } from "@/services/internal/project-api";

const joinProject = async (payload: JoinProjectPayload) => {
  const { data } = await axiosInstance.post<ExternalJoinProjectResponse>(
    "/api/projects/join",
    payload,
  );

  return mapApiProjectToDashboardProject(getProjectFromResponse(data));
};

export default joinProject;
