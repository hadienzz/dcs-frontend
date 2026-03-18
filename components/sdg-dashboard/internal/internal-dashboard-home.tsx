"use client";

import { Building2, FolderArchive, FolderClock, ShieldCheck } from "lucide-react";

import type { SdgDashboardProjectRecord } from "@/components/sdg-dashboard/dashboard-data";
import { getProjectsNeedingAttention } from "@/components/sdg-dashboard/dashboard-data";
import { InternalHomeHeroSection } from "@/components/sdg-dashboard/internal/internal-home-hero-section";
import { InternalHomeProjectsSection } from "@/components/sdg-dashboard/internal/internal-home-projects-section";
import { PortalMetricCard } from "@/components/sdg-dashboard/portal-metric-card";
import { useSdgDashboardProjects } from "@/hooks/use-sdg-dashboard-projects";

function filterProjectsByStatus(
  projects: SdgDashboardProjectRecord[],
  status: "ongoing" | "completed",
) {
  return projects.filter((project) => project.status === status);
}

export function InternalDashboardHome() {
  const { projects } = useSdgDashboardProjects();
  const ongoingProjects = filterProjectsByStatus(projects, "ongoing");
  const completedProjects = filterProjectsByStatus(projects, "completed");
  const attentionProjects = getProjectsNeedingAttention(projects);
console.log(projects)
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f4ef_0%,#f5efe7_24%,#f8f6f3_100%)]">
      <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <InternalHomeHeroSection />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <PortalMetricCard
            icon={Building2}
            label="Total proyek"
            value={`${projects.length}`}
            helper="Jumlah workspace proyek yang aktif di area internal."
          />
          <PortalMetricCard
            icon={FolderClock}
            label="Sedang berjalan"
            value={`${ongoingProjects.length}`}
            helper="Project ongoing yang masih dikelola tim internal."
          />
          <PortalMetricCard
            icon={FolderArchive}
            label="Sudah selesai"
            value={`${completedProjects.length}`}
            helper="Project yang sudah ditutup dan dipindah ke arsip."
          />
          <PortalMetricCard
            icon={ShieldCheck}
            label="Butuh respons"
            value={`${attentionProjects.length}`}
            helper="Proposal yang sedang menunggu review atau revisi dari mitra."
          />
        </section>

        <InternalHomeProjectsSection
          ongoingProjects={ongoingProjects}
          completedProjects={completedProjects}
        />
      </div>
    </main>
  );
}
