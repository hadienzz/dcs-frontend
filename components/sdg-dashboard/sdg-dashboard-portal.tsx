"use client";

import Link from "next/link";
import type { ChangeEvent, FormEvent } from "react";
import {
  useMemo,
  useState,
} from "react";
import { ArrowLeft } from "lucide-react";

import {
  dashboardTabs,
  getExternalApprovalMeta,
  getExternalPortalPath,
  getBudgetItemSubtotal,
  getJoinedParticipants,
  getProjectBudgetTotals,
  getProjectCurrentStage,
  getProjectPublishedBudgetItems,
  getProjectPublishedMonthlyReports,
  getProjectReportUploadCount,
  getProjectWorkflowProgress,
  type DashboardTabId,
  type SdgDashboardProjectRecord,
} from "@/components/sdg-dashboard/dashboard-data";
import { formatCurrency } from "@/components/sdg-dashboard/dashboard-formatters";
import {
  DashboardNoticeBanner,
  type NoticeTone,
} from "@/components/sdg-dashboard/dashboard-notice-banner";
import { DashboardSectionTabs } from "@/components/sdg-dashboard/dashboard-section-tabs";
import { InternalProjectBudgetSection } from "@/components/sdg-dashboard/internal/internal-project-budget-section";
import { InternalProjectHeaderSection } from "@/components/sdg-dashboard/internal/internal-project-header-section";
import { InternalProjectOverviewSection } from "@/components/sdg-dashboard/internal/internal-project-overview-section";
import { InternalProjectProgressSection } from "@/components/sdg-dashboard/internal/internal-project-progress-section";
import { InternalProjectProposalSection } from "@/components/sdg-dashboard/internal/internal-project-proposal-section";
import { InternalProjectSidebarSection } from "@/components/sdg-dashboard/internal/internal-project-sidebar-section";
import { InternalProjectTimelineSection } from "@/components/sdg-dashboard/internal/internal-project-timeline-section";
import { ProjectNotFoundState } from "@/components/sdg-dashboard/project-not-found-state";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import useBudgetForm from "@/hooks/internal/use-budget-form";
import useProgressForm from "@/hooks/internal/use-progress-form";
import useProposalForm from "@/hooks/internal/use-proposal-form";
import useRegenerateInvitationCode from "@/hooks/internal/use-regenerate-invitation-code";
import useTimelineForm from "@/hooks/internal/use-timeline-form";
import useUpdateProjectStatus from "@/hooks/internal/use-update-project-status";
import { useSdgDashboardProject } from "@/hooks/use-sdg-dashboard-projects";
import {
  downloadProjectProposal,
  getProjectProposalDownloadLabel,
  readPdfFileAsDataUrl,
  readPdfUrlAsDataUrl,
} from "@/lib/sdg-dashboard-documents";
import {
  analyzePdfProposalSdg,
} from "@/lib/sdg-dashboard-proposal-ai";
import { formatSdgGoalList, normalizeSdgGoalNumbers } from "@/lib/sdg-goals";
import uploadProposalDocument from "@/services/internal/upload-proposal-document";

interface SdgDashboardPortalProps {
  projectSlug: string;
}

interface NoticeState {
  title: string;
  body: string;
  tone: NoticeTone;
}

function getWorkflowSteps(project: SdgDashboardProjectRecord) {
  return [
    {
      key: "workspace",
      label: "Workspace aktif",
      description: "Dashboard proyek sudah siap dipakai tim internal.",
      done: true,
    },
    {
      key: "proposal",
      label: "Proposal dikirim",
      description: "Proposal sudah dibagikan ke portal mitra.",
      done: project.proposalStatus !== "draft",
    },
    {
      key: "proposal-approval",
      label: "Proposal disetujui mitra",
      description: "Mitra memberi keputusan approval atau revisi proposal.",
      done: project.externalApprovalStatus === "approved",
    },
    {
      key: "timeline",
      label: "Timeline tersimpan",
      description: "Rencana kerja 3 bulan sudah siap dipakai.",
      done: project.timelineSaved,
    },
    {
      key: "timeline-approval",
      label: "Timeline disetujui mitra",
      description: "Mitra menyetujui tahapan timeline yang dibagikan.",
      done: project.timelineApprovalStatus === "approved",
    },
    {
      key: "budget",
      label: "RAB & realisasi",
      description: "Budget dan anggaran terpakai sudah terdokumentasi.",
      done: project.budgetSaved,
    },
    {
      key: "budget-approval",
      label: "Budget disetujui mitra",
      description: "Mitra menyetujui RAB dan realisasi yang dibagikan.",
      done: project.budgetApprovalStatus === "approved",
    },
    {
      key: "progress",
      label: "Laporan dibagikan",
      description: "Laporan bulanan yang relevan sudah dibuka ke mitra.",
      done: getProjectReportUploadCount(project, "csr") > 0,
    },
    {
      key: "progress-approval",
      label: "Progress disetujui mitra",
      description: "Mitra menyetujui laporan progress yang dibagikan.",
      done: project.progressApprovalStatus === "approved",
    },
  ];
}

function LoadingState() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f3ef_0%,#f5efe7_28%,#f7f6f2_100%)]">
      <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="h-64 rounded-[32px] border border-border/80 bg-background shadow-sm" />
        <div className="h-14 rounded-[24px] border border-border/80 bg-background shadow-sm" />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
          <div className="h-[520px] rounded-[28px] border border-border/80 bg-background shadow-sm" />
          <div className="h-[420px] rounded-[28px] border border-border/80 bg-background shadow-sm" />
        </div>
      </div>
    </main>
  );
}

function getProposalPreview(
  project: SdgDashboardProjectRecord,
  values: {
    proposalMode: "form" | "pdf";
    proposalFields: SdgDashboardProjectRecord["proposalFields"];
    proposalPdfName: string | null;
    proposalPdfUrl: string | null;
    proposalPdfDataUrl: string | null;
    proposalSdgGoals: number[];
    proposalSdgReasoning: string;
    proposalSdgSource: "manual" | "ai" | null;
  },
) {
  return {
    ...project,
    proposalMode: values.proposalMode,
    proposalFields: values.proposalFields,
    proposalSdgGoals: values.proposalSdgGoals,
    proposalSdgReasoning: values.proposalSdgReasoning,
    proposalSdgSource: values.proposalSdgSource,
    proposalPdfName: values.proposalPdfName,
    proposalPdfUrl: values.proposalPdfUrl,
    proposalPdfDataUrl: values.proposalPdfDataUrl,
  };
}

function isSameRecord<T>(left: T, right: T) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function SdgDashboardPortal({ projectSlug }: SdgDashboardPortalProps) {
  const { project, isReady } = useSdgDashboardProject(projectSlug);
  const [activeTab, setActiveTab] = useState<DashboardTabId>("overview");
  const [notice, setNotice] = useState<NoticeState>({
    title: "Workspace internal aktif",
    body: "Area ini dipakai tim SDGs untuk menyusun proposal, timeline, RAB, pengeluaran, dan progress khusus untuk satu proyek.",
    tone: "neutral",
  });
  const [isGeneratingProposalSdg, setIsGeneratingProposalSdg] = useState(false);
  const [isUploadingProposalPdf, setIsUploadingProposalPdf] = useState(false);
  const [pendingProposalPdfFile, setPendingProposalPdfFile] = useState<File | null>(
    null,
  );
  const regenerateInvitationCodeMutation = useRegenerateInvitationCode(projectSlug);
  const updateProjectStatusMutation = useUpdateProjectStatus(projectSlug);

  const proposalForm = useProposalForm({
    project,
    onDraftSuccess: () => {
      setNotice({
        title: "Proposal disimpan sebagai draft",
        body: "Tim internal masih bisa merevisi proposal sebelum dikirim lagi ke mitra.",
        tone: "neutral",
      });
    },
    onSubmitSuccess: () => {
      setNotice({
        title: "Proposal dikirim ke mitra",
        body: "Mitra sekarang bisa meninjau proposal dari portal eksternal dan memberi keputusan approval atau revisi.",
        tone: "success",
      });
    },
    onError: (message) => {
      setNotice({
        title: "Proposal belum tersimpan",
        body: message,
        tone: "warning",
      });
    },
  });
  const timelineForm = useTimelineForm({
    project,
    onSubmitSuccess: () => {
      setNotice({
        title: "Timeline tersimpan",
        body: "Rencana kerja berhasil diperbarui dan menunggu review mitra.",
        tone: "success",
      });
      setActiveTab("budget");
    },
    onError: (message) => {
      setNotice({
        title: "Timeline belum tersimpan",
        body: message,
        tone: "warning",
      });
    },
  });
  const budgetForm = useBudgetForm({
    project,
    onSubmitSuccess: () => {
      setNotice({
        title: "Budget tersimpan",
        body: "RAB dan realisasi anggaran sekarang menunggu review mitra.",
        tone: "success",
      });
      setActiveTab("progress");
    },
    onError: (message) => {
      setNotice({
        title: "Budget belum tersimpan",
        body: message,
        tone: "warning",
      });
    },
  });
  const progressForm = useProgressForm({
    project,
    onDraftSuccess: () => {
      setNotice({
        title: "Draft progress tersimpan",
        body: "Ringkasan bulanan sudah tersimpan sebagai draft di backend.",
        tone: "neutral",
      });
    },
    onSubmitSuccess: () => {
      setNotice({
        title: "Progress tersimpan",
        body: "Ringkasan progress berhasil dibagikan dan siap direview mitra.",
        tone: "success",
      });
    },
    onError: (message) => {
      setNotice({
        title: "Progress belum tersimpan",
        body: message,
        tone: "warning",
      });
    },
  });

  const proposalPreview = useMemo(() => {
    if (!project) {
      return null;
    }

    return getProposalPreview(project, proposalForm.formik.values);
  }, [project, proposalForm.formik.values]);

  const timelineEntries = timelineForm.formik.values.timelineEntries;
  const budgetItems = budgetForm.formik.values.budgetItems;
  const monthlyReports = progressForm.formik.values.monthlyReports;

  if (!isReady) {
    return <LoadingState />;
  }

  if (!project || !proposalPreview) {
    return (
      <ProjectNotFoundState
        title="Project tidak ditemukan"
        description="Project yang kamu buka belum tersedia di dashboard internal. Kembali ke area internal untuk memilih project lain atau membuat workspace baru."
        href="/sdgdashboard/internal"
        ctaLabel="Kembali ke area internal"
      />
    );
  }

  const currentProject = project;
  const joinedParticipants = getJoinedParticipants(currentProject);
  const workflowSteps = getWorkflowSteps(currentProject);
  const workflow = getProjectWorkflowProgress(currentProject);
  const currentStageLabel = getProjectCurrentStage(currentProject);
  const externalApprovalMeta = getExternalApprovalMeta(
    currentProject.externalApprovalStatus,
  );
  const overviewBudgetItems = getProjectPublishedBudgetItems(currentProject);
  const overviewBudgetTotals = overviewBudgetItems.reduce(
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
  const sharedReportsCount = getProjectPublishedMonthlyReports(currentProject).length;
  const timelineUnlocked = currentProject.externalApprovalStatus === "approved";
  const budgetUnlocked = currentProject.timelineApprovalStatus === "approved";
  const progressUnlocked = currentProject.budgetApprovalStatus === "approved";
  const externalHref = getExternalPortalPath(currentProject);
  const budgetPreviewProject = {
    ...currentProject,
    budgetItems,
  };
  const progressPreviewProject = {
    ...currentProject,
    monthlyReports,
  };
  const budgetTotals = getProjectBudgetTotals(budgetPreviewProject);
  const filledReportsCount = getProjectReportUploadCount(progressPreviewProject);
  const sharedProgressReportsCount = getProjectReportUploadCount(
    progressPreviewProject,
    "csr",
  );
  const timelineSaved =
    currentProject.timelineSaved &&
    isSameRecord(currentProject.timelineEntries, timelineEntries);
  const budgetSaved =
    currentProject.budgetSaved && isSameRecord(currentProject.budgetItems, budgetItems);

  async function generateProposalSdgWithAi() {
    setIsGeneratingProposalSdg(true);

    try {
      const result =
        await analyzePdfProposalSdg({
          fileName:
            proposalForm.formik.values.proposalPdfName ||
            `${currentProject.slug}-proposal.pdf`,
          pdfDataUrl:
            proposalForm.formik.values.proposalPdfDataUrl ||
            (proposalForm.formik.values.proposalPdfUrl
              ? await readPdfUrlAsDataUrl(
                  proposalForm.formik.values.proposalPdfUrl,
                )
              : ""),
        });

      proposalForm.formik.setFieldValue(
        "proposalSdgGoals",
        normalizeSdgGoalNumbers(result.sdgGoals),
      );
      proposalForm.formik.setFieldValue("proposalSdgReasoning", result.reasoning);
      proposalForm.formik.setFieldValue("proposalSdgSource", "ai");

      setNotice({
        title: "Pemetaan SDG selesai",
        body: `AI merekomendasikan ${formatSdgGoalList(result.sdgGoals)} untuk proposal ini.`,
        tone: "success",
      });
    } catch (error) {
      setNotice({
        title: "Analisis AI gagal",
        body:
          error instanceof Error
            ? error.message
            : "Coba ulangi analisis SDG setelah koneksi dan API key Gemini siap.",
        tone: "warning",
      });
    } finally {
      setIsGeneratingProposalSdg(false);
    }
  }

  async function handleCopyInvitationCode() {
    try {
      await navigator.clipboard.writeText(currentProject.invitationCode);
      setNotice({
        title: "Invitation code disalin",
        body: "Kode akses siap dibagikan ke mitra eksternal.",
        tone: "success",
      });
    } catch {
      setNotice({
        title: "Clipboard tidak tersedia",
        body: "Silakan salin invitation code langsung dari kartu akses proyek.",
        tone: "warning",
      });
    }
  }

  async function handleRegenerateInvitationCode() {
    try {
      await regenerateInvitationCodeMutation.mutateAsync();
      setNotice({
        title: "Invitation code diperbarui",
        body: "Kode baru siap dibagikan ke PIC mitra yang akan masuk ke portal eksternal.",
        tone: "success",
      });
    } catch (error) {
      setNotice({
        title: "Invitation code belum diperbarui",
        body:
          error instanceof Error
            ? error.message
            : "Coba lagi sebentar untuk membuat invitation code baru.",
        tone: "warning",
      });
    }
  }

  async function handleToggleProjectStatus() {
    try {
      await updateProjectStatusMutation.mutateAsync({
        status: currentProject.status === "completed" ? "ONGOING" : "COMPLETED",
      });
      setNotice({
        title:
          currentProject.status === "completed"
            ? "Project dikembalikan ke ongoing"
            : "Project dipindahkan ke arsip selesai",
        body:
          currentProject.status === "completed"
            ? "Project sekarang kembali muncul pada daftar ongoing."
            : "Project akan muncul di halaman arsip selesai tanpa mencampur data proyek lain.",
        tone: "success",
      });
    } catch (error) {
      setNotice({
        title: "Status project belum diperbarui",
        body:
          error instanceof Error
            ? error.message
            : "Coba lagi sebentar untuk memperbarui status project.",
        tone: "warning",
      });
    }
  }

  function toggleProposalSdgGoal(goal: number) {
    const nextGoals = proposalForm.formik.values.proposalSdgGoals.includes(goal)
      ? proposalForm.formik.values.proposalSdgGoals.filter((item) => item !== goal)
      : [...proposalForm.formik.values.proposalSdgGoals, goal];

    proposalForm.formik.setFieldValue(
      "proposalSdgGoals",
      normalizeSdgGoalNumbers(nextGoals),
    );
    proposalForm.formik.setFieldValue("proposalSdgSource", "manual");
  }

  function updateProposalSdgReasoning(value: string) {
    proposalForm.formik.setFieldValue("proposalSdgReasoning", value);
    proposalForm.formik.setFieldValue("proposalSdgSource", "manual");
  }

  async function handleProposalPdfUpload(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      setNotice({
        title: "Format file belum sesuai",
        body: "Proposal PDF hanya menerima file dengan format PDF.",
        tone: "warning",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setNotice({
        title: "Ukuran file terlalu besar",
        body: "Ukuran proposal PDF maksimal 10MB.",
        tone: "warning",
      });
      return;
    }

    setIsUploadingProposalPdf(true);

    try {
      const pdfDataUrl = await readPdfFileAsDataUrl(file);

      proposalForm.formik.setFieldValue("proposalPdfName", file.name);
      proposalForm.formik.setFieldValue("proposalPdfUrl", null);
      proposalForm.formik.setFieldValue("proposalPdfDataUrl", pdfDataUrl);
      setPendingProposalPdfFile(file);

      setNotice({
        title: "File PDF siap dikirim",
        body: "Dokumen akan diunggah ke backend saat kamu klik Kirim ke mitra.",
        tone: "success",
      });
    } catch (error) {
      setNotice({
        title: "Upload proposal PDF gagal",
        body:
          error instanceof Error
            ? error.message
            : "Coba lagi sebentar untuk mengunggah file proposal.",
        tone: "warning",
      });
    } finally {
      setIsUploadingProposalPdf(false);
    }
  }

  async function handleProposalSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let submissionValues = proposalForm.formik.values;

    if (pendingProposalPdfFile) {
      setIsUploadingProposalPdf(true);

      try {
        const uploadedDocument = await uploadProposalDocument(
          projectSlug,
          pendingProposalPdfFile,
        );

        submissionValues = {
          ...submissionValues,
          proposalPdfName: uploadedDocument.name,
          proposalPdfUrl: uploadedDocument.url,
        };
        await proposalForm.formik.setValues(submissionValues);
        setPendingProposalPdfFile(null);
      } catch (error) {
        
        setNotice({
          title: "Upload proposal PDF gagal",
          body:
            error instanceof Error
              ? error.message
              : "Coba lagi sebentar untuk mengunggah file proposal.",
          tone: "warning",
        });
        return;
      } finally {
        setIsUploadingProposalPdf(false);
      }
    }

    try {
      await proposalForm.submitWithValues(submissionValues);
    } catch {
      return;
    }
  }

  function handleTimelineSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    timelineForm.formik.submitForm();
  }

  function handleBudgetSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    budgetForm.formik.submitForm();
  }

  function handleProgressSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    progressForm.formik.submitForm();
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f3ef_0%,#f5efe7_28%,#f7f6f2_100%)]">
      <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="outline">
            <Link href="/sdgdashboard/internal">
              <ArrowLeft data-icon="inline-start" />
              Kembali ke area internal
            </Link>
          </Button>
        </div>

        <InternalProjectHeaderSection
          project={currentProject}
          currentStageLabel={currentStageLabel}
          workflow={workflow}
          externalHref={externalHref}
          onCopyInvitationCode={handleCopyInvitationCode}
          onRegenerateInvitationCode={handleRegenerateInvitationCode}
          onToggleProjectStatus={handleToggleProjectStatus}
        />

        <DashboardNoticeBanner
          title={notice.title}
          body={notice.body}
          tone={notice.tone}
        />

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as DashboardTabId)}
          className="gap-5"
        >
          <DashboardSectionTabs
            items={dashboardTabs.map((tab) => ({
              value: tab.id,
              label: tab.label,
              helper: tab.helper,
            }))}
          />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
            <div className="min-w-0">
              <TabsContent value="overview">
                <InternalProjectOverviewSection
                  project={currentProject}
                  externalApprovalMeta={externalApprovalMeta}
                  sharedBudgetLabel={formatCurrency(overviewBudgetTotals.totalBudget)}
                  sharedBudgetItemsCount={overviewBudgetItems.length}
                  sharedReportsCount={sharedReportsCount}
                  workflowSteps={workflowSteps}
                />
              </TabsContent>

              <TabsContent value="proposal">
                <InternalProjectProposalSection
                  project={proposalPreview}
                  onProposalPdfUpload={handleProposalPdfUpload}
                  isUploadingProposalPdf={isUploadingProposalPdf}
                  onProposalSdgGoalToggle={toggleProposalSdgGoal}
                  onProposalSdgReasoningChange={updateProposalSdgReasoning}
                  onGenerateProposalSdgWithAi={generateProposalSdgWithAi}
                  isGeneratingProposalSdg={isGeneratingProposalSdg}
                  onSubmit={handleProposalSubmit}
                  onSaveDraft={() => {
                    void proposalForm.saveDraft();
                  }}
                  onDownload={() => downloadProjectProposal(proposalPreview)}
                  downloadLabel={getProjectProposalDownloadLabel(proposalPreview)}
                />
              </TabsContent>

              <TabsContent value="timeline">
                <InternalProjectTimelineSection
                  timelineUnlocked={timelineUnlocked}
                  timelineSaved={timelineSaved}
                  timelineEntries={timelineEntries}
                  onAddTimelineEntry={timelineForm.addTimelineEntry}
                  onUpdateTimelineEntry={timelineForm.updateTimelineEntry}
                  onSaveTimeline={handleTimelineSave}
                  onGoToBudget={() => setActiveTab("budget")}
                />
              </TabsContent>

              <TabsContent value="budget">
                <InternalProjectBudgetSection
                  budgetUnlocked={budgetUnlocked}
                  budgetSaved={budgetSaved}
                  budgetItems={budgetItems}
                  totalBudgetLabel={formatCurrency(budgetTotals.totalBudget)}
                  spentBudgetLabel={formatCurrency(budgetTotals.spentBudget)}
                  remainingBudgetLabel={formatCurrency(budgetTotals.remainingBudget)}
                  onAddBudgetItem={budgetForm.addBudgetItem}
                  onUpdateBudgetItem={budgetForm.updateBudgetItem}
                  onAddBudgetExpense={budgetForm.addBudgetExpense}
                  onUpdateBudgetExpense={budgetForm.updateBudgetExpense}
                  onRemoveBudgetExpense={budgetForm.removeBudgetExpense}
                  onSaveBudget={handleBudgetSave}
                  onGoToProgress={() => setActiveTab("progress")}
                />
              </TabsContent>

              <TabsContent value="progress">
                <InternalProjectProgressSection
                  progressUnlocked={progressUnlocked}
                  monthlyReports={monthlyReports}
                  uploadedReportsCount={filledReportsCount}
                  sharedReportsCount={sharedProgressReportsCount}
                  onUpdateMonthlyReport={progressForm.updateMonthlyReport}
                  onSaveDraft={() => {
                    void progressForm.saveDraft();
                  }}
                  onSubmitProgress={handleProgressSubmit}
                  isSavingDraft={progressForm.isSavingDraft}
                  isSubmitting={progressForm.isSubmitting}
                />
              </TabsContent>
            </div>

            <InternalProjectSidebarSection
              sharedBudgetLabel={formatCurrency(overviewBudgetTotals.totalBudget)}
              sharedBudgetItemsCount={overviewBudgetItems.length}
              sharedReportsCount={sharedReportsCount}
              joinedParticipants={joinedParticipants}
              externalHref={externalHref}
            />
          </div>
        </Tabs>
      </div>
    </main>
  );
}
