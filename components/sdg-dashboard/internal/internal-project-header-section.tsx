import Link from "next/link";
import { Copy, Eye, RefreshCcw, ScrollText } from "lucide-react";

import type { SdgDashboardProjectRecord } from "@/components/sdg-dashboard/dashboard-data";
import { DashboardIconBadge } from "@/components/sdg-dashboard/dashboard-icon-badge";
import { ExternalApprovalBadge } from "@/components/sdg-dashboard/external-approval-badge";
import { ProjectStatusBadge } from "@/components/sdg-dashboard/project-status-badge";
import { formatDashboardDate } from "@/components/sdg-dashboard/dashboard-formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface InternalProjectHeaderSectionProps {
  project: SdgDashboardProjectRecord;
  currentStageLabel: string;
  workflow: {
    completedSteps: number;
    totalSteps: number;
    percentage: number;
  };
  externalHref: string;
  onCopyInvitationCode: () => void;
  onRegenerateInvitationCode: () => void;
  onToggleProjectStatus: () => void;
}

export function InternalProjectHeaderSection({
  project,
  currentStageLabel,
  workflow,
  externalHref,
  onCopyInvitationCode,
  onRegenerateInvitationCode,
  onToggleProjectStatus,
}: InternalProjectHeaderSectionProps) {
  return (
    <Card className="overflow-hidden rounded-[32px] border-border/80 bg-background shadow-[0_32px_60px_-42px_rgba(15,23,42,0.36)]">
      <CardContent className="grid gap-6 p-6 sm:p-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-background text-foreground">
              Workspace internal SDGs
            </Badge>
            <ProjectStatusBadge status={project.status} />
            <ExternalApprovalBadge status={project.externalApprovalStatus} />
          </div>

          <div className="max-w-4xl">
            <p className="text-sm font-medium text-muted-foreground">
              Entity internal mengelola proposal, timeline, RAB, pengeluaran, dan
              laporan per proyek.
            </p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              {project.name}
            </h1>
            <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
              Mitra proyek ini adalah {project.externalName}. Semua isi dashboard
              di halaman ini khusus untuk proyek ini saja, jadi proposal, RAB, dan
              progress tidak tercampur dengan proyek lain.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-[22px] border border-border/80 bg-muted/10 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Tahap aktif
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
              <p className="mt-1 text-sm text-muted-foreground">
                {workflow.completedSteps} dari {workflow.totalSteps} tahap.
              </p>
            </div>
            <div className="rounded-[22px] border border-border/80 bg-muted/10 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Diperbarui terakhir
              </p>
              <p className="mt-2 text-[15px] font-semibold text-foreground">
                {formatDashboardDate(project.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="rounded-[26px] border-border/80 bg-[linear-gradient(180deg,rgba(182,37,42,0.08),rgba(182,37,42,0.02)_68%,rgba(182,37,42,0)_100%)] shadow-none">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <DashboardIconBadge icon={ScrollText} />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Invitation code mitra
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Kode ini dipakai untuk membuka portal mitra yang terpisah dari
                    workspace internal.
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-[20px] border border-border/80 bg-background px-4 py-4">
                <p className="font-mono text-sm font-semibold tracking-[0.18em] text-foreground">
                  {project.invitationCode}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Bagikan hanya ke PIC mitra yang memang perlu akses.
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <Button type="button" variant="outline" onClick={onCopyInvitationCode}>
                  <Copy data-icon="inline-start" />
                  Salin kode
                </Button>
                <Button type="button" variant="outline" onClick={onRegenerateInvitationCode}>
                  <RefreshCcw data-icon="inline-start" />
                  Buat kode baru
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[26px] border-border/80 shadow-none">
            <CardContent className="space-y-4 p-5">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Boundary fungsi
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Internal menyusun pekerjaan dan mitra hanya melihat item yang
                  dibagikan lalu memberi approval atau revisi.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button asChild>
                  <Link href={externalHref}>
                    <Eye data-icon="inline-start" />
                    Buka portal mitra
                  </Link>
                </Button>
                <Button type="button" variant="outline" onClick={onToggleProjectStatus}>
                  {project.status === "completed"
                    ? "Kembalikan ke ongoing"
                    : "Pindahkan ke arsip selesai"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

