import type {
  SdgDashboardProjectRecord,
} from "@/components/sdg-dashboard/dashboard-data";
import { ExternalApprovalBadge } from "@/components/sdg-dashboard/external-approval-badge";
import { PortalSection } from "@/components/sdg-dashboard/portal-section";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface WorkflowStep {
  key: string;
  label: string;
  description: string;
  done: boolean;
}

interface InternalProjectOverviewSectionProps {
  project: SdgDashboardProjectRecord;
  externalApprovalMeta: {
    label: string;
    helper: string;
    variant: "success" | "warning" | "outline" | "neutral";
  };
  sharedBudgetLabel: string;
  sharedBudgetItemsCount: number;
  sharedReportsCount: number;
  workflowSteps: WorkflowStep[];
}

export function InternalProjectOverviewSection({
  project,
  externalApprovalMeta,
  sharedBudgetLabel,
  sharedBudgetItemsCount,
  sharedReportsCount,
  workflowSteps,
}: InternalProjectOverviewSectionProps) {
  return (
    <div className="space-y-6">
      <PortalSection
        eyebrow="Ringkasan"
        title="Posisi proyek saat ini"
        description="Panel ini membantu tim internal melihat keputusan mitra dan konteks data apa saja yang memang dibagikan ke luar."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/80 bg-muted/10 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <ExternalApprovalBadge status={project.externalApprovalStatus} />
              <Badge variant={externalApprovalMeta.variant}>
                {externalApprovalMeta.label}
              </Badge>
            </div>
            <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
              {externalApprovalMeta.helper}
            </p>
            <div className="mt-4 rounded-2xl border border-border/80 bg-background p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Catatan dari mitra
              </p>
              <p className="mt-2 text-[15px] leading-7 text-foreground">
                {project.externalApprovalNote ||
                  "Belum ada catatan dari mitra. Setelah proposal dikirim, mitra bisa memberi catatan langsung dari portal eksternal."}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 bg-muted/10 p-5">
            <p className="text-sm font-semibold text-foreground">
              Yang dibagikan ke mitra
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/80 bg-background p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Budget mitra
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  {sharedBudgetLabel}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {sharedBudgetItemsCount} item budget dibagikan.
                </p>
              </div>
              <div className="rounded-2xl border border-border/80 bg-background p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Laporan mitra
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  {sharedReportsCount}/3 laporan
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Slot laporan yang terlihat di portal mitra.
                </p>
              </div>
            </div>
          </div>
        </div>
      </PortalSection>

      <PortalSection
        eyebrow="Workflow"
        title="Checklist pelaksanaan"
        description="Urutan ini dibuat agar siapa pun yang membuka proyek bisa langsung paham status proposal, approval, RAB, pengeluaran, dan monitoring bulanan."
      >
        <div className="space-y-3">
          {workflowSteps.map((step, index) => (
            <div
              key={step.key}
              className={cn(
                "grid gap-3 rounded-2xl border p-4 md:grid-cols-[82px_minmax(0,1fr)_auto]",
                step.done
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-border/80 bg-muted/10",
              )}
            >
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Step {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 text-base font-semibold text-foreground">
                  {step.label}
                </p>
              </div>
              <p className="text-[15px] leading-7 text-muted-foreground">
                {step.description}
              </p>
              <div className="flex items-start md:justify-end">
                <Badge variant={step.done ? "success" : "neutral"}>
                  {step.done ? "Selesai" : "Belum"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </PortalSection>
    </div>
  );
}
