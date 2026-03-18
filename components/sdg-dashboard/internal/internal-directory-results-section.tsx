import { FolderSearch } from "lucide-react";

import type { SdgDashboardProjectRecord, SdgProjectStatus } from "@/components/sdg-dashboard/dashboard-data";
import { DashboardIconBadge } from "@/components/sdg-dashboard/dashboard-icon-badge";
import { PortalSection } from "@/components/sdg-dashboard/portal-section";
import { ProjectListCard } from "@/components/sdg-dashboard/project-list-card";

interface InternalDirectoryResultsSectionProps {
  status: SdgProjectStatus;
  projects: SdgDashboardProjectRecord[];
}

export function InternalDirectoryResultsSection({
  status,
  projects,
}: InternalDirectoryResultsSectionProps) {
  return (
    <PortalSection
      eyebrow={status === "ongoing" ? "Daftar aktif" : "Arsip"}
      title={
        status === "ongoing"
          ? "Project yang masih berjalan"
          : "Project yang sudah selesai"
      }
      description={
        status === "ongoing"
          ? "Buka workspace internal untuk mengelola proposal, RAB, dan progress, atau masuk ke portal mitra untuk melihat sudut pandang eksternal."
          : "Arsip tetap menampilkan proposal, realisasi, dan laporan bulanan agar histori kerja sama mudah ditelusuri."
      }
    >
      {projects.length > 0 ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {projects.map((project) => (
            <ProjectListCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex items-start gap-4 rounded-2xl border border-dashed border-border/80 bg-muted/10 px-5 py-6">
          <DashboardIconBadge icon={FolderSearch} tone="muted" />
          <div>
            <p className="text-base font-semibold text-foreground">
              Belum ada proyek yang cocok
            </p>
            <p className="mt-1 text-[15px] leading-7 text-muted-foreground">
              Coba ubah kata kunci pencarian atau buat project baru untuk mulai
              menata kolaborasi SDGs dengan mitra.
            </p>
          </div>
        </div>
      )}
    </PortalSection>
  );
}

