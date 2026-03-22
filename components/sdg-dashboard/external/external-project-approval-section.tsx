import { FileText, RefreshCcw } from "lucide-react";

import type { SdgDashboardProjectRecord } from "@/components/sdg-dashboard/dashboard-data";
import { PortalSection } from "@/components/sdg-dashboard/portal-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  formatSdgGoalList,
  getProposalSdgSourceLabel,
} from "@/lib/sdg-goals";

interface ExternalProjectApprovalSectionProps {
  project: SdgDashboardProjectRecord;
  decisionNote: string;
  onDecisionNoteChange: (value: string) => void;
  onApproveProposal: () => void;
  onRequestRevision: () => void;
  onDownloadProposal: () => void;
  proposalDownloadLabel: string;
}

export function ExternalProjectApprovalSection({
  project,
  decisionNote,
  onDecisionNoteChange,
  onApproveProposal,
  onRequestRevision,
  onDownloadProposal,
  proposalDownloadLabel,
}: ExternalProjectApprovalSectionProps) {
  const isPdfProposal = project.proposalMode === "pdf";

  return (
    <PortalSection
      eyebrow="Approval proposal"
      title="Tinjau proposal dari tim internal"
      description="Mitra membaca proposal dan memberi keputusan approval atau revisi. Setelah proposal disetujui, mitra bisa langsung lanjut meninjau tahapan timeline, budget, dan progress dari tab berikutnya."
    >
      <div className="space-y-5">
        <div className="rounded-[22px] border border-border/80 bg-muted/10 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Ringkasan proposal
              </p>
              <h2 className="mt-2 text-xl font-semibold text-foreground">
                {isPdfProposal ? project.name : project.proposalFields.title}
              </h2>
            </div>
            <Badge variant="outline" className="bg-background text-foreground">
              {isPdfProposal
                ? "Proposal dikirim sebagai PDF"
                : "Proposal dibuat dari form"}
            </Badge>
          </div>

          <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
            {isPdfProposal
              ? "Tim internal membagikan proposal dalam format PDF final. Gunakan tombol unduh untuk meninjau dokumen lengkap sebelum memberi keputusan approval atau revisi."
              : project.proposalFields.overview}
          </p>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {isPdfProposal ? (
              <div className="rounded-[20px] border border-border/80 bg-background p-4 lg:col-span-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Dokumen proposal
                </p>
                <p className="mt-2 text-[15px] font-semibold text-foreground">
                  {project.proposalPdfName || "proposal.pdf"}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Dokumen ini menjadi sumber utama peninjauan proposal pada portal
                  mitra.
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-[20px] border border-border/80 bg-background p-4">
                  <p className="text-xs font-medium text-muted-foreground">Tema</p>
                  <p className="mt-2 text-[15px] font-semibold text-foreground">
                    {project.proposalFields.theme}
                  </p>
                </div>
                <div className="rounded-[20px] border border-border/80 bg-background p-4">
                  <p className="text-xs font-medium text-muted-foreground">Skema</p>
                  <p className="mt-2 text-[15px] font-semibold text-foreground">
                    {project.proposalFields.scheme}
                  </p>
                </div>
              </>
            )}
            <div className="rounded-[20px] border border-border/80 bg-background p-4 lg:col-span-2">
              <p className="text-xs font-medium text-muted-foreground">SDG terkait</p>
              <p className="mt-2 text-[15px] font-semibold text-foreground">
                {formatSdgGoalList(project.proposalSdgGoals)}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Sumber pemetaan: {getProposalSdgSourceLabel(project.proposalSdgSource)}.
              </p>
            </div>
            {isPdfProposal ? null : (
              <>
                <div className="rounded-[20px] border border-border/80 bg-background p-4 lg:col-span-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Output program
                  </p>
                  <p className="mt-2 text-[15px] leading-7 text-foreground">
                    {project.proposalFields.outputs}
                  </p>
                </div>
                <div className="rounded-[20px] border border-border/80 bg-background p-4 lg:col-span-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Manfaat program
                  </p>
                  <p className="mt-2 text-[15px] leading-7 text-foreground">
                    {project.proposalFields.programBenefits}
                  </p>
                </div>
              </>
            )}
            <div className="rounded-[20px] border border-border/80 bg-background p-4 lg:col-span-2">
              <p className="text-xs font-medium text-muted-foreground">
                Alasan klasifikasi SDG
              </p>
              <p className="mt-2 text-[15px] leading-7 text-foreground">
                {project.proposalSdgReasoning ||
                  "Tim internal belum menambahkan alasan pemetaan SDG untuk proposal ini."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="outline" onClick={onDownloadProposal}>
            <FileText data-icon="inline-start" />
            {proposalDownloadLabel}
          </Button>
        </div>

        <div>
          <label
            htmlFor="external-note"
            className="text-sm font-semibold text-foreground"
          >
            Catatan untuk tim SDGs
          </label>
          <Textarea
            id="external-note"
            className="mt-2"
            value={decisionNote}
            onChange={(event) => onDecisionNoteChange(event.target.value)}
            placeholder="Tambahkan catatan approval atau revisi di sini."
          />
          <p className="mt-2 text-sm text-muted-foreground">
            Catatan ini akan langsung terlihat oleh tim internal di workspace proyek
            yang sama.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={onApproveProposal}
            disabled={
              project.proposalStatus === "draft" ||
              project.externalApprovalStatus === "approved"
            }
          >
            {project.externalApprovalStatus === "approved"
              ? "Proposal disetujui"
              : "Setujui proposal"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onRequestRevision}
            disabled={project.proposalStatus === "draft" && !decisionNote.trim()}
          >
            <RefreshCcw data-icon="inline-start" />
            Minta revisi
          </Button>
        </div>

        {project.externalApprovalStatus === "approved" ? (
          <p className="text-sm text-muted-foreground">
            Approval sudah dikirim. Mitra bisa lanjut memeriksa timeline, budget,
            dan progress dari tab lain tanpa mengirim approval proposal lagi.
          </p>
        ) : null}
      </div>
    </PortalSection>
  );
}
