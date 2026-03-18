import type {
  PartnerStageApprovalStatus,
  TimelineEntry,
} from "@/components/sdg-dashboard/dashboard-data";
import { ExternalStageApprovalAction } from "@/components/sdg-dashboard/external/external-stage-approval-action";
import { PortalSection } from "@/components/sdg-dashboard/portal-section";
import { Badge } from "@/components/ui/badge";

interface ExternalProjectTimelineSectionProps {
  timelineEntries: TimelineEntry[];
  approvalStatus: PartnerStageApprovalStatus;
  canApprove: boolean;
  approvalHelperText?: string;
  onApprove: () => void;
}

export function ExternalProjectTimelineSection({
  timelineEntries,
  approvalStatus,
  canApprove,
  approvalHelperText,
  onApprove,
}: ExternalProjectTimelineSectionProps) {
  return (
    <PortalSection
      eyebrow="Timeline"
      title="Rencana pelaksanaan 3 bulan"
      description="Mitra melihat garis besar kegiatan, deliverable, dan owner utama tanpa mengubah isi timeline, lalu bisa memberi persetujuan untuk tahapan ini."
      action={
        <ExternalStageApprovalAction
          status={approvalStatus}
          buttonLabel="Setujui timeline"
          pendingLabel="Menunggu persetujuan timeline"
          approvedLabel="Timeline disetujui mitra"
          disabled={!canApprove}
          helperText={approvalHelperText}
          onApprove={onApprove}
        />
      }
    >
      <div className="space-y-3">
        {timelineEntries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-[22px] border border-border/80 bg-muted/10 p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  {entry.weekLabel}
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  {entry.focus}
                </p>
              </div>
              <Badge variant="outline" className="bg-background text-foreground">
                {entry.owner}
              </Badge>
            </div>
            <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
              Deliverable: {entry.deliverable}
            </p>
          </div>
        ))}
      </div>
    </PortalSection>
  );
}
