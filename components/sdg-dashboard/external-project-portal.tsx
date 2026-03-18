"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";

import {
  getBudgetItemSubtotal,
  getJoinedParticipants,
  getProjectCurrentStage,
  getProjectPublishedBudgetItems,
  getProjectPublishedMonthlyReports,
  getProjectWorkflowProgress,
} from "@/components/sdg-dashboard/dashboard-data";
import { formatCurrency } from "@/components/sdg-dashboard/dashboard-formatters";
import {
  DashboardNoticeBanner,
  type NoticeTone,
} from "@/components/sdg-dashboard/dashboard-notice-banner";
import { DashboardSectionTabs } from "@/components/sdg-dashboard/dashboard-section-tabs";
import { ExternalProjectApprovalSection } from "@/components/sdg-dashboard/external/external-project-approval-section";
import { ExternalProjectBudgetSection } from "@/components/sdg-dashboard/external/external-project-budget-section";
import { ExternalProjectHeaderSection } from "@/components/sdg-dashboard/external/external-project-header-section";
import { ExternalProjectProgressSection } from "@/components/sdg-dashboard/external/external-project-progress-section";
import { ExternalProjectSidebarSection } from "@/components/sdg-dashboard/external/external-project-sidebar-section";
import { ExternalProjectTimelineSection } from "@/components/sdg-dashboard/external/external-project-timeline-section";
import { ProjectNotFoundState } from "@/components/sdg-dashboard/project-not-found-state";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import useReviewBudget from "@/hooks/external/use-review-budget";
import useReviewProgress from "@/hooks/external/use-review-progress";
import useReviewProposal from "@/hooks/external/use-review-proposal";
import useReviewTimeline from "@/hooks/external/use-review-timeline";
import { useSdgDashboardProject } from "@/hooks/use-sdg-dashboard-projects";
import {
  downloadProjectProposal,
  getProjectProposalDownloadLabel,
} from "@/lib/sdg-dashboard-documents";

interface ExternalProjectPortalProps {
  projectSlug: string;
}

type ExternalProjectTabId = "approval" | "timeline" | "budget" | "progress";

const externalProjectTabs = [
  {
    value: "approval",
    label: "Proposal",
    helper: "Baca dan beri persetujuan atau revisi",
  },
  {
    value: "timeline",
    label: "Timeline",
    helper: "Rencana kerja 3 bulan",
  },
  {
    value: "budget",
    label: "RAB & Pengeluaran",
    helper: "Item anggaran yang dibagikan",
  },
  {
    value: "progress",
    label: "Progress",
    helper: "Laporan bulanan yang dibuka",
  },
] as const;

function LoadingState() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f4ef_0%,#f5efe8_28%,#f7f6f2_100%)]">
      <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="h-64 rounded-[30px] border border-border/80 bg-background shadow-sm" />
        <div className="h-14 rounded-[24px] border border-border/80 bg-background shadow-sm" />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
          <div className="h-[520px] rounded-[28px] border border-border/80 bg-background shadow-sm" />
          <div className="h-[420px] rounded-[28px] border border-border/80 bg-background shadow-sm" />
        </div>
      </div>
    </main>
  );
}

export function ExternalProjectPortal({
  projectSlug,
}: ExternalProjectPortalProps) {
  const { project, isReady } = useSdgDashboardProject(projectSlug);
  const reviewProposalMutation = useReviewProposal(projectSlug);
  const reviewTimelineMutation = useReviewTimeline(projectSlug);
  const reviewBudgetMutation = useReviewBudget(projectSlug);
  const reviewProgressMutation = useReviewProgress(projectSlug);
  const [decisionNote, setDecisionNote] = useState("");
  const [activeTab, setActiveTab] = useState<ExternalProjectTabId>("approval");
  const [notice, setNotice] = useState<{
    title: string;
    body: string;
    tone: NoticeTone;
  }>({
    title: "Portal mitra aktif",
    body: "Mitra dapat melihat progres yang dibagikan dan memberi persetujuan proposal dari halaman ini.",
    tone: "neutral",
  });

  useEffect(() => {
    if (project) {
      setDecisionNote(project.externalApprovalNote);
    }
  }, [project]);

  const externalTabs = useMemo(
    () =>
      externalProjectTabs.map((tab) => ({
        value: tab.value,
        label: tab.label,
        helper: tab.helper,
      })),
    [],
  );

  if (!isReady) {
    return <LoadingState />;
  }

  if (!project) {
    return (
      <ProjectNotFoundState
        title="Workspace mitra tidak ditemukan"
        description="Link yang dibuka belum tersedia. Kembali ke portal mitra untuk memilih proyek lain yang dibagikan."
        href="/sdgdashboard/external"
        ctaLabel="Kembali ke portal mitra"
      />
    );
  }

  const currentProject = project;
  const joinedParticipants = getJoinedParticipants(currentProject);
  const sharedBudgetItems = getProjectPublishedBudgetItems(currentProject);
  const sharedReports = getProjectPublishedMonthlyReports(currentProject);
  const sharedBudgetTotals = sharedBudgetItems.reduce(
    (totals, item) => ({
      totalBudget: totals.totalBudget + getBudgetItemSubtotal(item),
      spentBudget: totals.spentBudget + item.spentAmount,
      remainingBudget:
        totals.remainingBudget +
        Math.max(getBudgetItemSubtotal(item) - item.spentAmount, 0),
    }),
    {
      totalBudget: 0,
      spentBudget: 0,
      remainingBudget: 0,
    },
  );
  const workflow = getProjectWorkflowProgress(currentProject);
  const currentStageLabel = getProjectCurrentStage(currentProject);
  const sharedReportsCount = sharedReports.length;
  const timelineApprovalReady =
    currentProject.externalApprovalStatus === "approved" && currentProject.timelineSaved;
  const budgetApprovalReady =
    currentProject.timelineApprovalStatus === "approved" &&
    currentProject.budgetSaved;
  const progressApprovalReady =
    currentProject.budgetApprovalStatus === "approved" && sharedReportsCount > 0;
  const timelineApprovalHelperText =
    currentProject.externalApprovalStatus !== "approved"
      ? "Setujui proposal terlebih dahulu sebelum menyetujui timeline."
      : !currentProject.timelineSaved
        ? "Tim internal belum menyimpan timeline final untuk direview."
        : "Klik setujui setelah timeline dinilai sudah sesuai."
  const budgetApprovalHelperText =
    currentProject.timelineApprovalStatus !== "approved"
      ? "Setujui timeline terlebih dahulu sebelum menyetujui budget."
      : !currentProject.budgetSaved
        ? "Tim internal belum menyimpan budget final untuk direview."
        : "Klik setujui setelah rincian budget dinilai sudah sesuai."
  const progressApprovalHelperText =
    currentProject.budgetApprovalStatus !== "approved"
      ? "Setujui budget terlebih dahulu sebelum menyetujui progress."
      : sharedReportsCount === 0
        ? "Belum ada laporan mitra yang dibagikan untuk direview."
        : "Klik setujui setelah laporan progress dinilai sudah sesuai."

  async function approveProposal() {
    if (
      !window.confirm(
        "Setujui proposal ini?\n\nSetelah disetujui, mitra akan langsung melanjutkan review tahapan timeline, budget, dan progress yang dibagikan pada workspace ini.",
      )
    ) {
      return;
    }

    try {
      await reviewProposalMutation.mutateAsync({
        decision: "APPROVED",
        review_note: decisionNote.trim() || undefined,
      });
      setNotice({
        title: "Proposal disetujui mitra",
        body: "Proposal disetujui. Mitra sekarang bisa langsung melanjutkan review timeline, budget, dan progress yang dibagikan pada workspace ini.",
        tone: "success",
      });
      setActiveTab("timeline");
    } catch (error) {
      setNotice({
        title: "Persetujuan proposal gagal",
        body:
          error instanceof Error
            ? error.message
            : "Coba lagi sebentar untuk mengirim keputusan proposal.",
        tone: "warning",
      });
    }
  }

  async function requestRevision() {
    try {
      await reviewProposalMutation.mutateAsync({
        decision: "REVISION_REQUESTED",
        review_note: decisionNote.trim() || undefined,
      });
      setNotice({
        title: "Revisi dikirim ke tim SDGs",
        body: "Tim internal akan melihat catatan revisi ini dari workspace mereka sebelum mengirim ulang proposal.",
        tone: "warning",
      });
    } catch (error) {
      setNotice({
        title: "Catatan revisi gagal dikirim",
        body:
          error instanceof Error
            ? error.message
            : "Coba lagi sebentar untuk mengirim revisi proposal.",
        tone: "warning",
      });
    }
  }

  async function approveTimeline() {
    if (
      !window.confirm(
        "Setujui timeline ini?\n\nSetelah disetujui, mitra akan langsung melanjutkan review budget yang dibagikan pada workspace ini.",
      )
    ) {
      return;
    }

    try {
      await reviewTimelineMutation.mutateAsync({
        decision: "APPROVED",
        review_note: decisionNote.trim() || undefined,
      });
      setNotice({
        title: "Timeline disetujui mitra",
        body: "Timeline disetujui. Mitra sekarang bisa langsung melanjutkan review budget yang dibagikan.",
        tone: "success",
      });
      setActiveTab("budget");
    } catch (error) {
      setNotice({
        title: "Persetujuan timeline gagal",
        body:
          error instanceof Error
            ? error.message
            : "Coba lagi sebentar untuk mengirim keputusan timeline.",
        tone: "warning",
      });
    }
  }

  async function approveBudget() {
    if (
      !window.confirm(
        "Setujui budget ini?\n\nSetelah disetujui, mitra akan langsung melanjutkan review progress yang dibagikan pada workspace ini.",
      )
    ) {
      return;
    }

    try {
      await reviewBudgetMutation.mutateAsync({
        decision: "APPROVED",
        review_note: decisionNote.trim() || undefined,
      });
      setNotice({
        title: "Budget disetujui mitra",
        body: "Budget disetujui. Mitra sekarang bisa langsung melanjutkan review progress yang dibagikan.",
        tone: "success",
      });
      setActiveTab("progress");
    } catch (error) {
      setNotice({
        title: "Persetujuan budget gagal",
        body:
          error instanceof Error
            ? error.message
            : "Coba lagi sebentar untuk mengirim keputusan budget.",
        tone: "warning",
      });
    }
  }

  async function approveProgress() {
    if (
      !window.confirm(
        "Setujui progress proyek ini?\n\nKeputusan ini menandakan laporan yang dibagikan pada tahap berjalan sudah diterima mitra.",
      )
    ) {
      return;
    }

    try {
      await reviewProgressMutation.mutateAsync({
        decision: "APPROVED",
        review_note: decisionNote.trim() || undefined,
      });
      setNotice({
        title: "Progress disetujui mitra",
        body: "Progress proyek yang dibagikan sudah diterima mitra dan terekam di workspace ini.",
        tone: "success",
      });
    } catch (error) {
      setNotice({
        title: "Persetujuan progress gagal",
        body:
          error instanceof Error
            ? error.message
            : "Coba lagi sebentar untuk mengirim keputusan progress.",
        tone: "warning",
      });
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f4ef_0%,#f5efe8_28%,#f7f6f2_100%)]">
      <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="outline">
            <Link href="/sdgdashboard/external">
              <ArrowLeft data-icon="inline-start" />
              Kembali ke portal mitra
            </Link>
          </Button>
        </div>

        <ExternalProjectHeaderSection
          project={currentProject}
          currentStageLabel={currentStageLabel}
          workflow={workflow}
          sharedReportsCount={sharedReportsCount}
        />

        <DashboardNoticeBanner
          title={notice.title}
          body={notice.body}
          tone={notice.tone}
        />

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as ExternalProjectTabId)}
          className="gap-5"
        >
          <DashboardSectionTabs items={externalTabs} />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
            <div className="min-w-0">
              <TabsContent value="approval">
                <ExternalProjectApprovalSection
                  project={currentProject}
                  decisionNote={decisionNote}
                  onDecisionNoteChange={setDecisionNote}
                  onApproveProposal={approveProposal}
                  onRequestRevision={requestRevision}
                  onDownloadProposal={() => downloadProjectProposal(currentProject)}
                  proposalDownloadLabel={getProjectProposalDownloadLabel(currentProject)}
                />
              </TabsContent>

              <TabsContent value="timeline">
                <ExternalProjectTimelineSection
                  timelineEntries={currentProject.timelineEntries}
                  approvalStatus={currentProject.timelineApprovalStatus}
                  canApprove={timelineApprovalReady}
                  approvalHelperText={timelineApprovalHelperText}
                  onApprove={approveTimeline}
                />
              </TabsContent>

              <TabsContent value="budget">
                <ExternalProjectBudgetSection
                  budgetItems={sharedBudgetItems}
                  totalBudgetLabel={formatCurrency(sharedBudgetTotals.totalBudget)}
                  spentBudgetLabel={formatCurrency(sharedBudgetTotals.spentBudget)}
                  remainingBudgetLabel={formatCurrency(
                    sharedBudgetTotals.remainingBudget,
                  )}
                  approvalStatus={currentProject.budgetApprovalStatus}
                  canApprove={budgetApprovalReady}
                  approvalHelperText={budgetApprovalHelperText}
                  onApprove={approveBudget}
                />
              </TabsContent>

              <TabsContent value="progress">
                <ExternalProjectProgressSection
                  reports={sharedReports}
                  approvalStatus={currentProject.progressApprovalStatus}
                  canApprove={progressApprovalReady}
                  approvalHelperText={progressApprovalHelperText}
                  onApprove={approveProgress}
                />
              </TabsContent>
            </div>

            <ExternalProjectSidebarSection
              participants={joinedParticipants}
              sharedBudgetLabel={formatCurrency(sharedBudgetTotals.totalBudget)}
              sharedReportsCount={sharedReportsCount}
            />
          </div>
        </Tabs>
      </div>
    </main>
  );
}
