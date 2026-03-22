import type {
  BudgetItem,
  MonthlyReport,
  ProposalFields,
  ProjectParticipant,
  SdgDashboardProjectRecord,
} from "@/components/sdg-dashboard/dashboard-data";
import { normalizeProjectRecord } from "@/components/sdg-dashboard/dashboard-data";
import { normalizeSdgGoalNumbers, type ProposalSdgSource } from "@/lib/sdg-goals";
import type {
  BackendBudgetExpenseItem,
  BackendBudgetItem,
  BackendProgressReport,
  BackendProject,
  BackendProjectStage,
  BackendStageDocument,
  BackendStageSubmission,
  BackendVisibilityScope,
} from "@/types/internal";

function getStage(project: BackendProject, stageKey: BackendProjectStage["stage_key"]) {
  return project.stages.find((stage) => stage.stage_key === stageKey) ?? null;
}

function getLatestSubmission(stage: BackendProjectStage | null) {
  return stage?.submissions[0] ?? null;
}

function getLatestReviewNote(stage: BackendProjectStage | null) {
  const latestReview = stage?.submissions
    .flatMap((submission) => submission.reviews)
    .sort((left, right) => {
      const leftDate = new Date(left.reviewed_at ?? left.created_at).getTime();
      const rightDate = new Date(right.reviewed_at ?? right.created_at).getTime();

      return rightDate - leftDate;
    })[0];

  return {
    note: latestReview?.review_note?.trim() ?? "",
    updatedAt:
      latestReview?.reviewed_at ??
      latestReview?.created_at ??
      stage?.approved_at ??
      null,
  };
}

function toVisibilityScope(scope: BackendVisibilityScope) {
  return scope === "INTERNAL" ? ("internal" as const) : ("csr" as const);
}

function toProposalSdgSource(value?: string | null): ProposalSdgSource {
  if (value === "ai") {
    return "ai";
  }

  if (value === "manual") {
    return "manual";
  }

  return null;
}

function toExpenseDate(value: string) {
  return value.slice(0, 10);
}

function mapBudgetExpenses(expenses: BackendBudgetExpenseItem[]) {
  return expenses.map((expense) => ({
    id: expense.id,
    description: expense.description,
    date: toExpenseDate(expense.date),
    amount: Number(expense.amount) || 0,
  }));
}

function mapBudgetItems(items: BackendBudgetItem[]): BudgetItem[] {
  return items.map((item) => {
    const expenses = mapBudgetExpenses(item.expenses);
    const spentAmount = expenses.reduce((total, expense) => total + expense.amount, 0);

    return {
      id: item.id,
      category: item.category,
      description: item.description,
      volume: Number(item.volume) || 0,
      unit: item.unit,
      unitCost: Number(item.unit_cost) || 0,
      spentAmount,
      visibilityScope: toVisibilityScope(item.visibility_scope),
      expenses,
    };
  });
}

function mapMonthlyReports(reports: BackendProgressReport[]): MonthlyReport[] {
  return reports.map((report) => ({
    id: report.id,
    month: report.month,
    summary: report.summary,
    fileName: null,
    visibilityScope: toVisibilityScope(report.visibility_scope),
  }));
}

function mapParticipants(project: BackendProject): ProjectParticipant[] {
  const ownerName =
    project.internal_owner.pic_name?.trim() ||
    project.internal_owner.email.split("@")[0] ||
    "Admin SDGs";
  const participants: ProjectParticipant[] = [
    {
      id: `owner-${project.internal_owner.id}`,
      name: ownerName,
      role: "Project owner",
      status: "joined",
      joinedAt: project.created_at,
    },
  ];

  project.external_members.forEach((member) => {
    participants.push({
      id: member.id,
      name:
        member.external_user.pic_name?.trim() ||
        member.external_user.agency_name?.trim() ||
        member.external_user.email.split("@")[0] ||
        "Mitra eksternal",
      role: "Mitra eksternal",
      status: member.joined_at ? "joined" : "invited",
      joinedAt: member.joined_at ?? null,
    });
  });

  if (
    !project.external_members.length &&
    project.partner_organization_name?.trim()
  ) {
    participants.push({
      id: `partner-${project.id}`,
      name: project.partner_organization_name,
      role: "Mitra eksternal",
      status: "invited",
      joinedAt: null,
    });
  }

  return participants;
}

function deriveProposalStatus(stage: BackendProjectStage | null) {
  const latestSubmission = getLatestSubmission(stage);

  if (!stage || !latestSubmission) {
    return "draft" as const;
  }

  if (stage.status === "APPROVED") {
    return "approved" as const;
  }

  if (stage.status === "UNDER_REVIEW" || stage.status === "SUBMITTED") {
    return "submitted" as const;
  }

  if (stage.status === "REVISION_REQUESTED") {
    return "draft" as const;
  }

  return latestSubmission.submission_status === "DRAFT"
    ? ("draft" as const)
    : ("submitted" as const);
}

function deriveExternalApprovalStatus(stage: BackendProjectStage | null) {
  if (!stage) {
    return "not_sent" as const;
  }

  if (stage.status === "APPROVED") {
    return "approved" as const;
  }

  if (stage.status === "REVISION_REQUESTED") {
    return "revision_requested" as const;
  }

  if (stage.status === "UNDER_REVIEW" || stage.status === "SUBMITTED") {
    return "pending" as const;
  }

  return "not_sent" as const;
}

function derivePartnerStageApprovalStatus(stage: BackendProjectStage | null) {
  return stage?.status === "APPROVED" ? ("approved" as const) : ("pending" as const);
}

function mapTimelineEntries(submission: BackendStageSubmission | null) {
  return (submission?.timeline_items ?? []).map((entry) => ({
    id: entry.id,
    weekLabel: entry.week_label,
    focus: entry.focus,
    deliverable: entry.deliverable,
    owner: entry.owner,
  }));
}

function getInvitationCode(project: BackendProject) {
  return (
    project.invitations.find((invitation) => invitation.is_active)?.invitation_code ??
    project.invitations[0]?.invitation_code ??
    ""
  );
}

function getLatestProposalDocument(submission: BackendStageSubmission | null) {
  return submission?.documents[0] ?? null;
}

function deriveProposalMode(
  submission: BackendStageSubmission | null,
  document: BackendStageDocument | null,
) {
  if (submission?.proposal_content?.mode === "PDF" || document) {
    return "pdf" as const;
  }

  return "form" as const;
}

export function mapApiProjectToDashboardProject(
  project: BackendProject,
): SdgDashboardProjectRecord {
  const proposalStage = getStage(project, "PROPOSAL");
  const timelineStage = getStage(project, "TIMELINE");
  const budgetStage = getStage(project, "BUDGET_RAB");
  const progressStage = getStage(project, "PROGRESS");
  const latestProposalSubmission = getLatestSubmission(proposalStage);
  const latestTimelineSubmission = getLatestSubmission(timelineStage);
  const latestBudgetSubmission = getLatestSubmission(budgetStage);
  const latestProgressSubmission = getLatestSubmission(progressStage);
  const proposalContent = latestProposalSubmission?.proposal_content;
  const proposalDocument = getLatestProposalDocument(latestProposalSubmission);
  const proposalReviewMeta = getLatestReviewNote(proposalStage);
  const budgetItems = mapBudgetItems(latestBudgetSubmission?.budget_items ?? []);
  const monthlyReports = mapMonthlyReports(
    latestProgressSubmission?.progress_reports ?? [],
  );

  return normalizeProjectRecord({
    id: project.id,
    slug: project.slug ?? project.id,
    name: project.title,
    externalName: project.partner_organization_name ?? "Mitra eksternal",
    invitationCode: getInvitationCode(project),
    status: project.status === "COMPLETED" ? "completed" : "ongoing",
    createdAt: project.created_at,
    updatedAt: project.updated_at ?? project.created_at,
    participants: mapParticipants(project),
    proposalMode: deriveProposalMode(latestProposalSubmission, proposalDocument),
    proposalStatus: deriveProposalStatus(proposalStage),
    externalApprovalStatus: deriveExternalApprovalStatus(proposalStage),
    externalApprovalNote: proposalReviewMeta.note,
    externalApprovalUpdatedAt: proposalReviewMeta.updatedAt,
    timelineApprovalStatus: derivePartnerStageApprovalStatus(timelineStage),
    budgetApprovalStatus: derivePartnerStageApprovalStatus(budgetStage),
    progressApprovalStatus: derivePartnerStageApprovalStatus(progressStage),
    proposalPdfName: proposalDocument?.file_name ?? null,
    proposalPdfUrl: proposalDocument?.file_url ?? null,
    proposalPdfDataUrl: null,
    proposalSdgGoals: normalizeSdgGoalNumbers(proposalContent?.sdg_goals),
    proposalSdgReasoning: proposalContent?.sdg_reasoning ?? "",
    proposalSdgSource: toProposalSdgSource(proposalContent?.sdg_source),
    proposalSdgUpdatedAt: proposalContent?.sdg_updated_at ?? null,
    proposalFields: proposalContent?.fields as ProposalFields | undefined,
    timelineEntries: mapTimelineEntries(latestTimelineSubmission),
    timelineSaved: Boolean(latestTimelineSubmission?.timeline_items.length),
    budgetItems,
    budgetSaved: Boolean(budgetItems.length),
    monthlyReports,
  });
}

export function mapApiProjectsToDashboardProjects(projects: BackendProject[]) {
  return projects.map((project) => mapApiProjectToDashboardProject(project));
}
