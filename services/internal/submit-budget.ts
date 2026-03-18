import axiosInstance from "@/utils/axios";
import type { BackendProjectResponse, BudgetFormPayload } from "@/types/internal";
import { mapApiProjectToDashboardProject } from "@/services/internal/project-mapper";
import { getProjectFromResponse } from "@/services/internal/project-api";

const submitBudget = async (
  projectSlug: string,
  payload: BudgetFormPayload,
) => {
  const { data } = await axiosInstance.post<BackendProjectResponse>(
    `/api/projects/${projectSlug}/stages/budget/submit`,
    payload,
  );

  return mapApiProjectToDashboardProject(getProjectFromResponse(data));
};

export default submitBudget;
