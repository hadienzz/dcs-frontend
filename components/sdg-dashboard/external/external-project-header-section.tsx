import type { SdgDashboardProjectRecord } from "@/components/sdg-dashboard/dashboard-data";
import { ExternalApprovalBadge } from "@/components/sdg-dashboard/external-approval-badge";
import { ProjectStatusBadge } from "@/components/sdg-dashboard/project-status-badge";
import { formatDashboardDate } from "@/components/sdg-dashboard/dashboard-formatters";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ExternalProjectHeaderSectionProps {
  project: SdgDashboardProjectRecord;
  currentStageLabel: string;
  workflow: {
    completedSteps: number;
    totalSteps: number;
    percentage: number;
  };
  sharedReportsCount: number;
}

export function ExternalProjectHeaderSection({
  project,
  currentStageLabel,
  workflow,
  sharedReportsCount,
}: ExternalProjectHeaderSectionProps) {
  return (
    <Card className="overflow-hidden rounded-[30px] border-border/80 bg-background shadow-[0_32px_60px_-44px_rgba(15,23,42,0.35)]">
      <CardContent className="grid gap-6 px-6 py-7 sm:px-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-background text-foreground">
              Entity mitra eksternal
            </Badge>
            <ProjectStatusBadge status={project.status} />
            <ExternalApprovalBadge status={project.externalApprovalStatus} />
          </div>

          <div className="max-w-4xl">
            <p className="text-sm font-medium text-muted-foreground">
              Portal ini bersifat baca untuk mitra, kecuali pada keputusan approval
              per tahap review proyek.
            </p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              {project.name}
            </h1>
            <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
              Project ini dikelola oleh tim internal SDGs dan dibagikan ke{" "}
              {project.externalName}. Mitra hanya melihat item yang sengaja
              dibagikan dan memberi persetujuan proposal, timeline, budget, dan
              progress melalui portal ini.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-[22px] border border-border/80 bg-muted/10 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Tahap saat ini
              </p>
              <p className="mt-2 text-[15px] font-semibold text-foreground">
                {currentStageLabel}
              </p>
            </div>
            <div className="rounded-[22px] border border-border/80 bg-muted/10 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Workflow proyek
              </p>
              <p className="mt-2 text-[15px] font-semibold text-foreground">
                {workflow.percentage}% selesai
              </p>
            </div>
            <div className="rounded-[22px] border border-border/80 bg-muted/10 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Laporan yang dibuka
              </p>
              <p className="mt-2 text-[15px] font-semibold text-foreground">
                {sharedReportsCount}/3 laporan
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-border/70 bg-[linear-gradient(180deg,rgba(182,37,42,0.08),rgba(182,37,42,0.02)_64%,rgba(182,37,42,0)_100%)] p-5">
          <p className="text-sm font-semibold text-foreground">Aturan portal mitra</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-[20px] border border-border/80 bg-background p-4">
              <p className="text-sm font-semibold text-foreground">Mitra bisa</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Mengunduh proposal, melihat RAB dan pengeluaran yang dibagikan,
                membaca progress, lalu memberi persetujuan di setiap tahap review yang
                tersedia.
              </p>
            </div>
            <div className="rounded-[20px] border border-border/80 bg-background p-4">
              <p className="text-sm font-semibold text-foreground">
                Mitra tidak mengubah data inti
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Pengisian proposal, timeline, RAB, dan laporan tetap dikelola dari
                workspace internal SDGs.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Diperbarui terakhir {formatDashboardDate(project.updatedAt)}.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
