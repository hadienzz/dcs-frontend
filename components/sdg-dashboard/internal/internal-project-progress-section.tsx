import type { FormEvent } from "react";

import type {
  MonthlyReport,
  VisibilityScope,
} from "@/components/sdg-dashboard/dashboard-data";
import { PortalSection } from "@/components/sdg-dashboard/portal-section";
import { VisibilityBadge } from "@/components/sdg-dashboard/visibility-badge";
import {
  FieldBlock,
  fieldClassName,
  Textarea,
} from "@/components/sdg-dashboard/internal/internal-form-primitives";
import { InternalStageNotice } from "@/components/sdg-dashboard/internal/internal-stage-notice";
import { Button } from "@/components/ui/button";

interface InternalProjectProgressSectionProps {
  progressUnlocked: boolean;
  monthlyReports: MonthlyReport[];
  uploadedReportsCount: number;
  sharedReportsCount: number;
  onUpdateMonthlyReport: (reportId: string, patch: Partial<MonthlyReport>) => void;
  onSaveDraft: () => void;
  onSubmitProgress: (event: FormEvent<HTMLFormElement>) => void;
  isSavingDraft?: boolean;
  isSubmitting?: boolean;
}

export function InternalProjectProgressSection({
  progressUnlocked,
  monthlyReports,
  uploadedReportsCount,
  sharedReportsCount,
  onUpdateMonthlyReport,
  onSaveDraft,
  onSubmitProgress,
  isSavingDraft = false,
  isSubmitting = false,
}: InternalProjectProgressSectionProps) {
  return (
    <div className="space-y-6">
      {!progressUnlocked ? (
        <InternalStageNotice
          title="Progress report menunggu finalisasi budget"
          description="Simpan RAB dan realisasi dulu agar laporan bulanan berjalan dengan baseline biaya yang jelas."
        />
      ) : null}

      <PortalSection
        eyebrow="Step 4"
        title="Monitoring bulanan"
        description="Isi ringkasan progress per bulan lalu tentukan mana yang ikut dibagikan ke mitra dari workspace eksternal."
      >
        <div className="mb-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-[22px] border border-border/80 bg-muted/10 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Slot laporan
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {monthlyReports.length}
            </p>
          </div>
          <div className="rounded-[22px] border border-border/80 bg-muted/10 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Laporan terisi
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {uploadedReportsCount}
            </p>
          </div>
          <div className="rounded-[22px] border border-border/80 bg-muted/10 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Dibagikan ke mitra
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {sharedReportsCount}
            </p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={onSubmitProgress}>
          <fieldset
            disabled={!progressUnlocked}
            className={!progressUnlocked ? "space-y-5 opacity-70" : "space-y-5"}
          >
            <div className="grid gap-5 xl:grid-cols-3">
              {monthlyReports.map((report) => (
                <div key={report.id} className="space-y-3">
                  <div className="rounded-[22px] border border-border/80 bg-background p-4">
                    <FieldBlock
                      htmlFor={`${report.id}-summary`}
                      label={report.month}
                      hint="Tuliskan ringkasan progres yang relevan untuk bulan ini."
                    >
                      <Textarea
                        id={`${report.id}-summary`}
                        className="min-h-32"
                        value={report.summary}
                        onChange={(event) =>
                          onUpdateMonthlyReport(report.id, {
                            summary: event.target.value,
                          })
                        }
                      />
                    </FieldBlock>
                  </div>

                  <div className="rounded-[22px] border border-border/80 bg-background p-4">
                    <FieldBlock
                      htmlFor={`${report.id}-visibility`}
                      label="Visibilitas laporan"
                    >
                      <select
                        id={`${report.id}-visibility`}
                        className={fieldClassName()}
                        value={report.visibilityScope}
                        onChange={(event) =>
                          onUpdateMonthlyReport(report.id, {
                            visibilityScope: event.target.value as VisibilityScope,
                          })
                        }
                      >
                        <option value="csr">Bagikan ke mitra</option>
                        <option value="internal">Internal saja</option>
                      </select>
                    </FieldBlock>
                    <div className="mt-3">
                      <VisibilityBadge scope={report.visibilityScope} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onSaveDraft}
              disabled={!progressUnlocked || isSavingDraft}
            >
              Simpan draft
            </Button>
            <Button type="submit" disabled={!progressUnlocked || isSubmitting}>
              Simpan progress
            </Button>
          </div>
        </form>
      </PortalSection>
    </div>
  );
}
