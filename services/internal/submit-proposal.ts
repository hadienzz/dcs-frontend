import axiosInstance from "@/utils/axios";
import type {
  BackendProjectResponse,
  ProposalSubmissionPayload,
} from "@/types/internal";
import { mapApiProjectToDashboardProject } from "@/services/internal/project-mapper";
import { getProjectFromResponse } from "@/services/internal/project-api";

const submitProposal = async (
  projectSlug: string,
  payload: ProposalSubmissionPayload,
) => {
  const { data } = await axiosInstance.post<BackendProjectResponse>(
    `/api/projects/${projectSlug}/stages/proposal/submit`,
    payload,
  );

  return mapApiProjectToDashboardProject(getProjectFromResponse(data));
};

export default submitProposal;
