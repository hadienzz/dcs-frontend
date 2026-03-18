import Link from "next/link";
import { ArrowRight, FolderArchive, FolderClock } from "lucide-react";

import type { SdgDashboardProjectRecord } from "@/components/sdg-dashboard/dashboard-data";
import {
  getInternalArchiveProjectsPath,
  getInternalOngoingProjectsPath,
} from "@/components/sdg-dashboard/dashboard-data";
import { DashboardIconBadge } from "@/components/sdg-dashboard/dashboard-icon-badge";
import { ProjectListCard } from "@/components/sdg-dashboard/project-list-card";
import { PortalSection } from "@/components/sdg-dashboard/portal-section";
import { Button } from "@/components/ui/button";

interface InternalHomeProjectsSectionProps {
  ongoingProjects: SdgDashboardProjectRecord[];
  completedProjects: SdgDashboardProjectRecord[];
}

export function InternalHomeProjectsSection({
  ongoingProjects,
  completedProjects,
}: InternalHomeProjectsSectionProps) {
  return (
    <>
      <PortalSection
        eyebrow="Ongoing"
        title="Project yang masih dikelola internal"
        description="Masuk ke workspace proyek untuk melanjutkan proposal, timeline, RAB, pengeluaran, dan progress tanpa mencampur data antar proyek."
        action={
          <Button asChild variant="outline">
            <Link href={getInternalOngoingProjectsPath()}>
              Lihat semua ongoing
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        }
      >
        {ongoingProjects.length > 0 ? (
            <div className="grid gap-4 xl:grid-cols-2">
            {ongoingProjects.slice(0, 4).map((project) => (
              <ProjectListCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="flex items-start gap-4 rounded-2xl border border-border/80 bg-muted/10 px-5 py-6">
            <DashboardIconBadge icon={FolderClock} tone="muted" />
            <p className="text-[15px] leading-7 text-muted-foreground">
              Belum ada proyek ongoing. Buat project baru untuk mulai membuka
              workspace kerja internal.
            </p>
          </div>
        )}
      </PortalSection>

      <PortalSection
        eyebrow="Arsip"
        title="Project yang sudah selesai"
        description="Arsip disimpan terpisah agar histori proposal, RAB, pengeluaran, dan laporan tetap bisa ditelusuri kapan saja."
        action={
          <Button asChild variant="outline">
            <Link href={getInternalArchiveProjectsPath()}>
              Lihat semua arsip
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        }
      >
        {completedProjects.length > 0 ? (
            <div className="grid gap-4 xl:grid-cols-2">
            {completedProjects.slice(0, 4).map((project) => (
              <ProjectListCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="flex items-start gap-4 rounded-2xl border border-border/80 bg-muted/10 px-5 py-6">
            <DashboardIconBadge icon={FolderArchive} tone="success" />
            <p className="text-[15px] leading-7 text-muted-foreground">
              Belum ada proyek yang masuk arsip.
            </p>
          </div>
        )}
      </PortalSection>
    </>
  );
}
