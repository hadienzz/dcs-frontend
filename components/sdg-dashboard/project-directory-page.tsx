"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  FolderPlus,
  FolderSearch,
} from "lucide-react";

import type {
  SdgDashboardProjectRecord,
  SdgProjectStatus,
} from "@/components/sdg-dashboard/dashboard-data";
import {
  getInternalCreateProjectPath,
  getInternalDashboardPath,
  getProjectsNeedingAttention,
} from "@/components/sdg-dashboard/dashboard-data";
import { InternalDirectoryHeroSection } from "@/components/sdg-dashboard/internal/internal-directory-hero-section";
import { InternalDirectoryResultsSection } from "@/components/sdg-dashboard/internal/internal-directory-results-section";
import { PortalMetricCard } from "@/components/sdg-dashboard/portal-metric-card";
import { Button } from "@/components/ui/button";
import { useSdgDashboardProjects } from "@/hooks/use-sdg-dashboard-projects";

interface ProjectDirectoryPageProps {
  status: SdgProjectStatus;
  eyebrow: string;
  title: string;
  description: string;
}

function filterProjectsByStatus(
  projects: SdgDashboardProjectRecord[],
  status: SdgProjectStatus,
) {
  return projects.filter((project) => project.status === status);
}

export function ProjectDirectoryPage({
  status,
  eyebrow,
  title,
  description,
}: ProjectDirectoryPageProps) {
  const { projects } = useSdgDashboardProjects();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    const projectsByStatus = filterProjectsByStatus(projects, status);
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return projectsByStatus;
    }

    return projectsByStatus.filter((project) =>
      `${project.name} ${project.externalName}`.toLowerCase().includes(normalizedQuery),
    );
  }, [projects, searchQuery, status]);

  const projectsByStatus = filterProjectsByStatus(projects, status);
  const attentionProjects = getProjectsNeedingAttention(projects);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f3ef_0%,#f5efe8_28%,#f8f6f3_100%)]">
      <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="outline">
            <Link href={getInternalDashboardPath()}>
              <ArrowLeft data-icon="inline-start" />
              Kembali ke dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link href={getInternalCreateProjectPath()}>
              <FolderPlus data-icon="inline-start" />
              Buat project baru
            </Link>
          </Button>
        </div>

        <InternalDirectoryHeroSection
          eyebrow={eyebrow}
          title={title}
          description={description}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
        />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <PortalMetricCard
            icon={FolderSearch}
            label="Total proyek"
            value={`${projectsByStatus.length}`}
            helper={`Jumlah proyek ${status === "ongoing" ? "aktif" : "yang sudah diarsipkan"}.`}
          />
          <PortalMetricCard
            icon={FolderPlus}
            label="Butuh perhatian"
            value={`${attentionProjects.length}`}
            helper="Proposal yang masih menunggu review mitra atau revisi."
          />
          <PortalMetricCard
            icon={ArrowRight}
            label="Sedang ditampilkan"
            value={`${filteredProjects.length}`}
            helper="Jumlah proyek yang cocok dengan filter saat ini."
          />
          <PortalMetricCard
            icon={FolderSearch}
            label={status === "ongoing" ? "Project ongoing" : "Project arsip"}
            value={`${projectsByStatus.length}`}
            helper={
              status === "ongoing"
                ? "Setiap proyek punya dashboard dan RAB sendiri-sendiri."
                : "Arsip disimpan per proyek tanpa ringkasan finansial lintas proyek."
            }
          />
        </section>

        <InternalDirectoryResultsSection
          status={status}
          projects={filteredProjects}
        />
      </div>
    </main>
  );
}
