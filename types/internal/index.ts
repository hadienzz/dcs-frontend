import type { ApiResponse } from "@/types/api";

export const SDG_DASHBOARD_PROJECTS_QUERY_KEY = ["sdg-dashboard", "projects"] as const;
export const SDG_DASHBOARD_PROJECT_DETAIL_QUERY_KEY = [
  "sdg-dashboard",
  "project",
] as const;

export type ProjectStatusFilter = "ongoing" | "completed";
export type BackendProjectStatus = "ONGOING" | "COMPLETED";
export type BackendStageStatus =
  | "NOT_STARTED"
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "REVISION_REQUESTED"
  | "APPROVED";
export type BackendSubmissionStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "REVISION_REQUESTED"
  | "APPROVED"
  | "REJECTED";
export type BackendReviewDecision =
  | "APPROVED"
  | "REVISION_REQUESTED"
  | "REJECTED";
export type BackendStageKey =
  | "PROPOSAL"
  | "TIMELINE"
  | "BUDGET_RAB"
  | "PROGRESS";
export type BackendVisibilityScope = "INTERNAL" | "SHARED";
export type BackendProposalSubmissionMode = "FORM" | "PDF";

export interface CreateProjectFormValues {
  title: string;
  partner_organization_name: string;
}

export const CREATE_PROJECT_INITIAL_VALUES = {
  title: "",
  partner_organization_name: "",
};

export interface CreateProjectPayload extends CreateProjectFormValues {
  slug: string;
}

export interface BackendUserSummary {
  id: string;
  email: string;
  role: "INTERNAL" | "EXTERNAL";
  pic_name?: string | null;
  agency_name?: string | null;
  created_at?: string;
}

export interface BackendProjectInvitation {
  id: string;
  invitation_code: string;
  is_active: boolean;
  usage_count: number;
  last_used_at?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface BackendProjectExternalMember {
  id: string;
  joined_at?: string | null;
  created_at: string;
  external_user_id: string;
  external_user: BackendUserSummary;
  invitation?: Pick<
    BackendProjectInvitation,
    "id" | "invitation_code" | "is_active" | "usage_count" | "last_used_at"
  > | null;
}

export interface BackendProposalContent {
  id: string;
  submission_id: string;
  mode: BackendProposalSubmissionMode;
  fields: Record<string, string>;
  sdg_goals: number[];
  sdg_reasoning?: string | null;
  sdg_source?: string | null;
  sdg_updated_at?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface BackendTimelineItem {
  id: string;
  item_order: number;
  week_label: string;
  focus: string;
  deliverable: string;
  owner: string;
  created_at: string;
  updated_at?: string | null;
}

export interface BackendBudgetExpenseItem {
  id: string;
  description: string;
  date: string;
  amount: number;
  created_at: string;
  updated_at?: string | null;
}

export interface BackendBudgetItem {
  id: string;
  category: string;
  description: string;
  volume: number;
  unit: string;
  unit_cost: number;
  visibility_scope: BackendVisibilityScope;
  created_at: string;
  updated_at?: string | null;
  expenses: BackendBudgetExpenseItem[];
}

export interface BackendProgressReport {
  id: string;
  report_order: number;
  month: string;
  summary: string;
  visibility_scope: BackendVisibilityScope;
  created_at: string;
  updated_at?: string | null;
}

export interface BackendStageDocument {
  id: string;
  file_name: string;
  file_url: string;
  mime_type: string;
  visibility: "INTERNAL_ONLY" | "SHARED";
  created_at: string;
}

export interface BackendStageReview {
  id: string;
  decision: BackendReviewDecision;
  review_note?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  reviewer: BackendUserSummary;
}

export interface BackendStageSubmission {
  id: string;
  stage_id: string;
  submitted_by: string;
  version_no: number;
  title?: string | null;
  notes?: string | null;
  submission_status: BackendSubmissionStatus;
  submitted_at?: string | null;
  created_at: string;
  updated_at?: string | null;
  user: BackendUserSummary;
  proposal_content?: BackendProposalContent | null;
  timeline_items: BackendTimelineItem[];
  budget_items: BackendBudgetItem[];
  progress_reports: BackendProgressReport[];
  documents: BackendStageDocument[];
  reviews: BackendStageReview[];
}

export interface BackendProjectStage {
  id: string;
  stage_key: BackendStageKey;
  stage_name: string;
  stage_order: number;
  status: BackendStageStatus;
  is_locked: boolean;
  approved_submission_id?: string | null;
  approved_at?: string | null;
  approved_by?: string | null;
  approved_by_user?: BackendUserSummary | null;
  submissions: BackendStageSubmission[];
}

export interface BackendProject {
  id: string;
  title: string;
  slug?: string | null;
  description?: string | null;
  internal_owner_id: string;
  partner_organization_name?: string | null;
  status: BackendProjectStatus;
  current_stage_order: number;
  created_at: string;
  updated_at?: string | null;
  completed_at?: string | null;
  internal_owner: BackendUserSummary;
  external_members: BackendProjectExternalMember[];
  invitations: BackendProjectInvitation[];
  stages: BackendProjectStage[];
}

export type BackendProjectsResponse = ApiResponse<{
  projects?: BackendProject[];
}>;

export type BackendProjectResponse = ApiResponse<{
  project?: BackendProject;
}>;

export interface InternalProjectSummary {
  id: string;
  title: string;
  slug: string;
  partnerOrganizationName: string;
  status: BackendProjectStatus;
  createdAt: string;
  updatedAt: string | null;
  invitationCode: string | null;
}

export interface ProposalFormPayload {
  mode: "form";
  fields: Record<string, string>;
  sdg_goals: number[];
  sdg_reasoning: string;
  sdg_source: string;
}

export interface UploadedProposalDocument {
  name: string;
  url: string;
  mimeType?: string;
  size?: number;
  uploadedAt?: string;
}

export interface ProposalPdfPayload {
  mode: "pdf";
  document: {
    file_name: string;
    file_url: string;
    mime_type?: string;
    file_size?: number;
  };
  sdg_goals: number[];
  sdg_reasoning: string;
  sdg_source: string;
}

export type ProposalSubmissionPayload = ProposalFormPayload | ProposalPdfPayload;

export interface TimelineFormPayload {
  items: Array<{
    week_label: string;
    focus: string;
    deliverable: string;
    owner: string;
  }>;
}

export interface BudgetFormPayload {
  items: Array<{
    category: string;
    description: string;
    volume: number;
    unit: string;
    unit_cost: number;
    visibility_scope: BackendVisibilityScope;
    expenses: Array<{
      description: string;
      date: string;
      amount: number;
    }>;
  }>;
}

export interface ProgressFormPayload {
  reports: Array<{
    month: string;
    summary: string;
    visibility_scope: BackendVisibilityScope;
  }>;
}

export interface UpdateProjectStatusPayload {
  status: BackendProjectStatus;
}

export type BackendProposalDocumentUploadResponse = ApiResponse<{
  document?: UploadedProposalDocument;
}>;
