import axiosInstance from "@/utils/axios";
import type { BackendProjectResponse, BudgetFormPayload } from "@/types/internal";
import { mapApiProjectToDashboardProject } from "@/services/internal/project-mapper";
import { getProjectFromResponse } from "@/services/internal/project-api";

const saveBudgetDraft = async (
  projectSlug: string,
  payload: BudgetFormPayload,
) => {
  const { data } = await axiosInstance.put<BackendProjectResponse>(
    `/api/projects/${projectSlug}/stages/budget/draft`,
    payload,
  );

  return mapApiProjectToDashboardProject(getProjectFromResponse(data));
};

export default saveBudgetDraft;
