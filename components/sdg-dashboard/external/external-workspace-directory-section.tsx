import Link from "next/link";
import { ArrowRight, Eye, FolderClock, ShieldCheck } from "lucide-react";

import type { SdgDashboardProjectRecord } from "@/components/sdg-dashboard/dashboard-data";
import {
  getExternalPortalPath,
  getProjectCurrentStage,
  getProjectReportUploadCount,
} from "@/components/sdg-dashboard/dashboard-data";
import { DashboardIconBadge } from "@/components/sdg-dashboard/dashboard-icon-badge";
import { ExternalApprovalBadge } from "@/components/sdg-dashboard/external-approval-badge";
import { PortalSection } from "@/components/sdg-dashboard/portal-section";
import { ProjectStatusBadge } from "@/components/sdg-dashboard/project-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ExternalWorkspaceDirectorySectionProps {
  projects: SdgDashboardProjectRecord[];
}

export function ExternalWorkspaceDirectorySection({
  projects,
}: ExternalWorkspaceDirectorySectionProps) {
  return (
    <PortalSection
      eyebrow="Daftar workspace"
      title="Project yang bisa direview mitra"
      description="Setiap kartu mewakili satu proyek mandiri. Mitra bisa membuka detail proyek langsung dari daftar ini atau masuk cepat lewat invitation code di atas."
    >
      {projects.length > 0 ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {projects.map((project) => {
            const sharedReports = getProjectReportUploadCount(project, "csr");

            return (
              <Card
                key={project.id}
                className="rounded-[26px] border-border/80 bg-background shadow-[0_20px_38px_-34px_rgba(15,23,42,0.3)]"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <ProjectStatusBadge status={project.status} />
                        <ExternalApprovalBadge
                          status={project.externalApprovalStatus}
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-foreground">
                          {project.name}
                        </h2>
                        <p className="mt-1 text-[15px] text-muted-foreground">
                          {project.externalName}
                        </p>
                      </div>
                    </div>
                    <DashboardIconBadge icon={ShieldCheck} tone="muted" />
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[22px] border border-border/80 bg-muted/10 p-4">
                      <p className="text-xs font-medium text-muted-foreground">
                        Tahap proyek
                      </p>
                      <p className="mt-2 text-[15px] font-semibold text-foreground">
                        {getProjectCurrentStage(project)}
                      </p>
                    </div>
                    <div className="rounded-[22px] border border-border/80 bg-muted/10 p-4">
                      <p className="text-xs font-medium text-muted-foreground">
                        Laporan mitra
                      </p>
                      <p className="mt-2 text-[15px] font-semibold text-foreground">
                        {sharedReports}/3 laporan
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button asChild>
                      <Link href={getExternalPortalPath(project)}>
                        <Eye data-icon="inline-start" />
                        Buka dashboard mitra
                      </Link>
                    </Button>
                    {/* <Button asChild variant="outline">
                      <Link href={getExternalPortalPath(project)}>
                        Lihat detail approval
                        <ArrowRight data-icon="inline-end" />
                      </Link>
                    </Button> */}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[22px] border border-dashed border-border/80 bg-muted/10 px-5 py-6">
          <div className="flex items-start gap-3">
            <DashboardIconBadge icon={FolderClock} tone="muted" size="sm" />
            <div>
              <p className="text-base font-semibold text-foreground">
                Belum ada workspace mitra
              </p>
              <p className="mt-1 text-[15px] leading-7 text-muted-foreground">
                Tim internal belum membagikan workspace eksternal. Setelah
                project siap, invitation code dan akses mitra akan muncul di
                sini.
              </p>
            </div>
          </div>
        </div>
      )}
    </PortalSection>
  );
}
