import axiosInstance from "@/utils/axios";
import type { BackendProjectResponse, ProposalFormPayload } from "@/types/internal";
import { mapApiProjectToDashboardProject } from "@/services/internal/project-mapper";
import { getProjectFromResponse } from "@/services/internal/project-api";

const saveProposalDraft = async (
  projectSlug: string,
  payload: ProposalFormPayload,
) => {
  const { data } = await axiosInstance.put<BackendProjectResponse>(
    `/api/projects/${projectSlug}/stages/proposal/draft`,
    payload,
  );

  return mapApiProjectToDashboardProject(getProjectFromResponse(data));
};

export default saveProposalDraft;
