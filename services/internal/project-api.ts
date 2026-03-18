import type {
  BackendProject,
  BackendProjectResponse,
  BackendProjectsResponse,
  ProjectStatusFilter,
} from "@/types/internal";
import { ensureApiData } from "@/utils/api-error";

export function buildProjectListQuery(status?: ProjectStatusFilter) {
  if (!status) {
    return undefined;
  }

  return {
    status,
  };
}

export function getProjectFromResponse(data: BackendProjectResponse): BackendProject {
  return ensureApiData(data.data?.project, "Data project tidak ditemukan.");
}

export function getProjectsFromResponse(
  data: BackendProjectsResponse,
): BackendProject[] {
  return data.data?.projects ?? [];
}
