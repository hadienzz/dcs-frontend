import {
  BackendProjectResponse,
  CreateProjectPayload,
  InternalProjectSummary,
} from "@/types/internal";
import axiosInstance from "@/utils/axios";
import { getProjectFromResponse } from "@/services/internal/project-api";

const createProject = async (
  formPayload: CreateProjectPayload,
): Promise<InternalProjectSummary> => {
  const { data } = await axiosInstance.post<BackendProjectResponse>(
    "/api/projects/create",
    formPayload,
  );
  const project = getProjectFromResponse(data);

  return {
    id: project.id,
    title: project.title,
    slug: project.slug ?? project.id,
    partnerOrganizationName: project.partner_organization_name ?? "Mitra eksternal",
    status: project.status,
    createdAt: project.created_at,
    updatedAt: project.updated_at ?? null,
    invitationCode:
      project.invitations.find((invitation) => invitation.is_active)
        ?.invitation_code ??
      project.invitations[0]?.invitation_code ??
      null,
  };
};

export default createProject;
