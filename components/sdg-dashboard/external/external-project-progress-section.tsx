import type {
  MonthlyReport,
  PartnerStageApprovalStatus,
} from "@/components/sdg-dashboard/dashboard-data";
import { ExternalStageApprovalAction } from "@/components/sdg-dashboard/external/external-stage-approval-action";
import { PortalSection } from "@/components/sdg-dashboard/portal-section";
import { Badge } from "@/components/ui/badge";

interface ExternalProjectProgressSectionProps {
  reports: MonthlyReport[];
  approvalStatus: PartnerStageApprovalStatus;
  canApprove: boolean;
  approvalHelperText?: string;
  onApprove: () => void;
}

export function ExternalProjectProgressSection({
  reports,
  approvalStatus,
  canApprove,
  approvalHelperText,
  onApprove,
}: ExternalProjectProgressSectionProps) {
  return (
    <PortalSection
      eyebrow="Progress"
      title="Laporan yang dibagikan ke mitra"
      description="Mitra membaca dokumen bulanan yang memang dibuka oleh tim internal untuk proyek ini lalu bisa memberi persetujuan progress."
      action={
        <ExternalStageApprovalAction
          status={approvalStatus}
          buttonLabel="Setujui progress"
          pendingLabel="Menunggu persetujuan progress"
          approvedLabel="Progress disetujui mitra"
          disabled={!canApprove}
          helperText={approvalHelperText}
          onApprove={onApprove}
        />
      }
    >
      <div className="space-y-3">
        {reports.length > 0 ? (
          reports.map((report) => (
            <div
              key={report.id}
              className="rounded-[22px] border border-border/80 bg-muted/10 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {report.month}
                  </p>
                  <p className="mt-2 text-[15px] font-semibold text-foreground">
                    {report.summary}
                  </p>
                </div>
                <Badge variant={report.summary.trim() ? "success" : "neutral"}>
                  {report.summary.trim() ? "Tersedia" : "Belum ada ringkasan"}
                </Badge>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {report.summary.trim() || "Ringkasan bulan ini belum dibagikan."}
              </p>
            </div>
          ))
        ) : (
          <div className="rounded-[22px] border border-dashed border-border/80 bg-muted/10 px-5 py-6">
            <p className="text-[15px] leading-7 text-muted-foreground">
              Belum ada laporan progress yang benar-benar dibagikan ke mitra.
            </p>
          </div>
        )}
      </div>
    </PortalSection>
  );
}
