import type {
  BackendProject,
  BackendProjectResponse,
} from "@/types/internal";

export type {
  BackendProject,
  BackendProjectResponse,
  BackendProjectsResponse,
} from "@/types/internal";

export interface JoinProjectPayload {
  invitation_code: string;
}

export interface JoinProjectFormValues {
  invitationCode: string;
}

export const JOIN_PROJECT_INITIAL_VALUES: JoinProjectFormValues = {
  invitationCode: "",
};

export interface ReviewStagePayload {
  decision: "APPROVED" | "REVISION_REQUESTED";
  review_note?: string;
}

export interface ExternalJoinProjectResponse extends BackendProjectResponse {
  data?: {
    project?: BackendProject;
  };
}
