import Link from "next/link";
import type { ChangeEvent, FormEvent } from "react";
import { FileText, LoaderCircle, Sparkles, Upload } from "lucide-react";

import type {
  SdgDashboardProjectRecord,
} from "@/components/sdg-dashboard/dashboard-data";
import { ExternalApprovalBadge } from "@/components/sdg-dashboard/external-approval-badge";
import { getExternalPortalPath } from "@/components/sdg-dashboard/dashboard-data";
import { PortalSection } from "@/components/sdg-dashboard/portal-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FieldBlock,
  Textarea,
} from "@/components/sdg-dashboard/internal/internal-form-primitives";
import { InternalStageNotice } from "@/components/sdg-dashboard/internal/internal-stage-notice";
import {
  formatSdgGoalList,
  getProposalSdgSourceLabel,
  sdgGoalOptions,
} from "@/lib/sdg-goals";

interface InternalProjectProposalSectionProps {
  project: SdgDashboardProjectRecord;
  onProposalPdfUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  isUploadingProposalPdf: boolean;
  onProposalSdgGoalToggle: (goal: number) => void;
  onProposalSdgReasoningChange: (value: string) => void;
  onGenerateProposalSdgWithAi: () => void;
  isGeneratingProposalSdg: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSaveDraft: () => void;
  onDownload: () => void;
  downloadLabel: string;
}

export function InternalProjectProposalSection({
  project,
  onProposalPdfUpload,
  isUploadingProposalPdf,
  onProposalSdgGoalToggle,
  onProposalSdgReasoningChange,
  onGenerateProposalSdgWithAi,
  isGeneratingProposalSdg,
  onSubmit,
  onSaveDraft,
  onDownload,
  downloadLabel,
}: InternalProjectProposalSectionProps) {
  const pdfFileName = project.proposalPdfName || `${project.slug}-proposal.pdf`;
  const selectedSdgGoalsLabel = formatSdgGoalList(project.proposalSdgGoals);
  const proposalSdgSourceLabel = getProposalSdgSourceLabel(project.proposalSdgSource);
  const hasProposalDownload = Boolean(project.proposalPdfDataUrl || project.proposalPdfUrl);
  const isPdfModeWithoutDocument = !project.proposalPdfName;
  const isPdfDraftDisabled = !project.proposalPdfUrl;
  const aiButtonTitle = isGeneratingProposalSdg
    ? "AI sedang menganalisis proposal"
    : project.proposalPdfDataUrl || project.proposalPdfUrl
      ? "Analisis SDG dari PDF dengan AI"
      : "Upload PDF untuk analisis AI";
  const aiButtonCtaLabel = isGeneratingProposalSdg
    ? "Menganalisis..."
    : "Analisis sekarang";

  return (
    <PortalSection
      eyebrow="Step 1"
      title="Upload proposal PDF dan kirim ke mitra"
      description="Tahap proposal memakai file PDF sebagai sumber utama. Upload dokumen final, validasi SDG, lalu kirim ke mitra dari workspace yang sama."
      action={<ExternalApprovalBadge status={project.externalApprovalStatus} />}
    >
      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="rounded-2xl border border-border/80 bg-muted/10 p-5">
            <p className="text-sm font-semibold text-foreground">
              Format proposal yang dibagikan
            </p>
            <p className="mt-2 text-[15px] leading-7 text-muted-foreground">
              Mitra akan menerima file PDF yang diunggah langsung dari workspace SDGs.
            </p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-background p-5">
            <p className="text-xs font-medium text-muted-foreground">
              Dokumen yang bisa diunduh
            </p>
            <p className="mt-2 text-[15px] font-semibold text-foreground">
              {pdfFileName}
            </p>
            <div className="mt-4">
              <Button type="button" variant="outline" onClick={onDownload}>
                <FileText data-icon="inline-start" />
                {downloadLabel}
              </Button>
            </div>
          </div>
        </div>

        {project.externalApprovalStatus === "revision_requested" ? (
          <InternalStageNotice
            title="Mitra meminta revisi proposal"
            description={
              project.externalApprovalNote ||
              "Periksa catatan mitra lalu kirim ulang proposal setelah revisi selesai."
            }
          />
        ) : null}

        <div
          key="proposal-pdf-mode"
          className="space-y-4 rounded-[24px] border border-border/80 bg-background p-5 sm:p-6"
        >
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Upload proposal PDF
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Gunakan satu file PDF final. File yang kamu unggah di sini akan menjadi
                dokumen yang dibagikan ke mitra.
              </p>
            </div>

            <label
              htmlFor="proposal-pdf"
              className="block cursor-pointer rounded-[20px] border border-dashed border-border/80 bg-muted/10 p-5 transition-colors hover:bg-muted/15"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-background text-primary">
                    <Upload className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {project.proposalPdfName ? "Ganti file PDF" : "Pilih file PDF"}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {isUploadingProposalPdf
                        ? "Dokumen sedang diunggah ke server."
                        : project.proposalPdfName && !project.proposalPdfUrl
                          ? "File dipilih dan akan diunggah saat klik Kirim ke mitra."
                          : project.proposalPdfName
                            ? "Upload baru akan menggantikan file yang aktif sekarang."
                            : "Hanya format PDF yang diterima."}
                    </p>
                  </div>
                </div>

                <span className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground">
                  {isUploadingProposalPdf ? (
                    <>
                      <LoaderCircle className="mr-2 size-4 animate-spin" />
                      Mengunggah...
                    </>
                  ) : project.proposalPdfName ? (
                    "Upload ulang"
                  ) : (
                    "Pilih file"
                  )}
                </span>
              </div>
            </label>

            <input
              id="proposal-pdf"
              type="file"
              accept="application/pdf"
              className="sr-only"
              disabled={isUploadingProposalPdf}
              onChange={onProposalPdfUpload}
            />

            <div className="flex flex-col gap-3 rounded-[20px] border border-border/80 bg-muted/10 p-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">File aktif</p>
                <p className="mt-2 break-words text-sm font-semibold text-foreground">
                  {project.proposalPdfName ?? "Belum ada file PDF yang diunggah"}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {project.proposalPdfName && !project.proposalPdfUrl
                    ? "File siap dikirim dan akan diupload ke backend saat klik Kirim ke mitra."
                    : project.proposalPdfName
                    ? "Dokumen ini akan muncul di portal mitra saat proposal dikirim."
                    : "Upload proposal final terlebih dahulu sebelum kirim ke mitra."}
                </p>
              </div>

              {project.proposalPdfName ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled={!hasProposalDownload}
                  onClick={onDownload}
                >
                  <FileText data-icon="inline-start" />
                  Lihat file
                </Button>
              ) : null}
            </div>
          </div>

        <div className="space-y-5 rounded-[24px] border border-border/80 bg-background p-5 sm:p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Pemetaan SDG proposal
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Pilih SDG secara manual atau minta AI membaca isi PDF proposal.
              </p>
            </div>

            <div className="w-full sm:w-auto sm:min-w-[320px]">
              <Button
                type="button"
                variant="outline"
                onClick={onGenerateProposalSdgWithAi}
                disabled={
                  isGeneratingProposalSdg ||
                  (!project.proposalPdfDataUrl && !project.proposalPdfUrl)
                }
                className="h-auto w-full items-center justify-between gap-3 whitespace-normal rounded-[20px] border-primary/15 bg-[linear-gradient(180deg,rgba(182,37,42,0.05),rgba(182,37,42,0.015))] px-4 py-3 text-left shadow-none hover:border-primary/25 hover:bg-[linear-gradient(180deg,rgba(182,37,42,0.08),rgba(182,37,42,0.03))]"
              >
                <span className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {isGeneratingProposalSdg ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <Sparkles className="size-4" />
                    )}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {aiButtonTitle}
                  </span>
                </span>
                <span className="inline-flex shrink-0 items-center rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                  {aiButtonCtaLabel}
                </span>
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant={project.proposalSdgGoals.length ? "outline" : "neutral"}>
              {project.proposalSdgGoals.length
                ? selectedSdgGoalsLabel
                : "Belum ada SDG dipilih"}
            </Badge>
            <Badge variant="neutral">Sumber: {proposalSdgSourceLabel}</Badge>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Nomor SDG terkait</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {sdgGoalOptions.map((option) => {
                const isSelected = project.proposalSdgGoals.includes(option.value);

                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => onProposalSdgGoalToggle(option.value)}
                    className={
                      isSelected
                        ? "rounded-full border border-primary/15 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
                        : "rounded-full border border-border/80 bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/10"
                    }
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <FieldBlock
            htmlFor="proposal-sdg-reasoning"
            label="Alasan klasifikasi SDG"
            hint="Bagian ini bisa diisi manual atau diperbarui dari hasil analisis AI."
          >
            <Textarea
              id="proposal-sdg-reasoning"
              className="min-h-28"
              value={project.proposalSdgReasoning}
              onChange={(event) =>
                onProposalSdgReasoningChange(event.target.value)
              }
              placeholder="Jelaskan kenapa isi PDF ini masuk ke SDG tertentu."
            />
          </FieldBlock>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            type="submit"
            disabled={isUploadingProposalPdf || isPdfModeWithoutDocument}
          >
            Kirim ke mitra
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isUploadingProposalPdf || isPdfModeWithoutDocument || isPdfDraftDisabled}
            onClick={onSaveDraft}
          >
            Simpan draft
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!hasProposalDownload}
            onClick={onDownload}
          >
            <FileText data-icon="inline-start" />
            {downloadLabel}
          </Button>
          <Button asChild variant="secondary">
            <Link href={getExternalPortalPath(project)}>Lihat tampilan mitra</Link>
          </Button>
        </div>
      </form>
    </PortalSection>
  );
}
