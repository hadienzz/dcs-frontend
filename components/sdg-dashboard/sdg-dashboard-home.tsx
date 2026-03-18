"use client";

import Link from "next/link";
import {
  ArrowRight,
  FolderArchive,
  FolderClock,
  FolderPlus,
  Handshake,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";

import {
  getProjectsNeedingAttention,
  type SdgDashboardProjectRecord,
} from "@/components/sdg-dashboard/dashboard-data";
import { DashboardIconBadge } from "@/components/sdg-dashboard/dashboard-icon-badge";
import { ProjectListCard } from "@/components/sdg-dashboard/project-list-card";
import { PortalMetricCard } from "@/components/sdg-dashboard/portal-metric-card";
import { PortalSection } from "@/components/sdg-dashboard/portal-section";
import { ExternalApprovalBadge } from "@/components/sdg-dashboard/external-approval-badge";
import { Button } from "@/components/ui/button";
import { useSdgDashboardProjects } from "@/hooks/use-sdg-dashboard-projects";

function filterProjectsByStatus(
  projects: SdgDashboardProjectRecord[],
  status: "ongoing" | "completed",
) {
  return projects.filter((project) => project.status === status);
}

const quickLinks = [
  {
    title: "Project aktif",
    description:
      "Pantau semua proyek yang sedang berjalan dan lihat mana yang menunggu approval mitra.",
    href: "/sdgdashboard/ongoing",
    icon: FolderClock,
  },
  {
    title: "Arsip selesai",
    description:
      "Buka histori program yang sudah ditutup lengkap dengan RAB, realisasi, dan laporan.",
    href: "/sdgdashboard/archive",
    icon: FolderArchive,
  },
  {
    title: "Portal eksternal",
    description:
      "Lihat tampilan yang dipakai pihak eksternal untuk review proposal dan memantau progres.",
    href: "/sdgdashboard/external",
    icon: ShieldCheck,
  },
];

export function SdgDashboardHome() {
  const { projects } = useSdgDashboardProjects();

  const ongoingProjects = filterProjectsByStatus(projects, "ongoing");
  const completedProjects = filterProjectsByStatus(projects, "completed");
  const attentionProjects = getProjectsNeedingAttention(projects);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f4ef_0%,#f5efe7_24%,#f8f6f3_100%)]">
      <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="overflow-hidden rounded-[30px] border border-border/80 bg-background shadow-[0_32px_70px_-44px_rgba(15,23,42,0.38)]">
          <div className="grid gap-8 px-6 py-7 sm:px-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-end">
            <div className="max-w-4xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                SDGs Project Workspace
              </p>
              <h1 className="mt-4 text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-[3rem]">
                Dashboard internal untuk menyiapkan proposal, RAB, progress, dan
                approval mitra dalam satu alur yang lebih jelas.
              </h1>
              <p className="mt-5 max-w-3xl text-[15px] leading-7 text-muted-foreground sm:text-base">
                Halaman ini memisahkan kerja tim SDGs dan mitra eksternal dengan
                lebih rapi. Tim internal menyiapkan dokumen dan realisasi, lalu
                mitra meninjau proposal, melihat progres, dan memberi keputusan
                dari portal eksternal yang terpisah.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/sdgdashboard/create">
                    <FolderPlus data-icon="inline-start" />
                    Buat project baru
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/sdgdashboard/external">
                    <LayoutDashboard data-icon="inline-start" />
                    Buka portal eksternal
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-[28px] border border-border/70 bg-[linear-gradient(180deg,rgba(182,37,42,0.08),rgba(182,37,42,0.02)_62%,rgba(182,37,42,0)_100%)] p-5">
              <div className="flex items-start gap-3">
                <DashboardIconBadge icon={Handshake} />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Yang perlu dicek hari ini
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Fokus ke proposal yang menunggu review atau butuh revisi dari
                    mitra.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {attentionProjects.length > 0 ? (
                  attentionProjects.slice(0, 3).map((project) => (
                    <Link
                      key={project.id}
                      href={`/sdgdashboard/${project.slug}`}
                      className="flex items-start justify-between gap-3 rounded-2xl border border-border/70 bg-background px-4 py-4 transition-colors hover:bg-muted/10"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-semibold text-foreground">
                          {project.name}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {project.externalName}
                        </p>
                      </div>
                      <ExternalApprovalBadge status={project.externalApprovalStatus} />
                    </Link>
                  ))
                ) : (
                  <div className="rounded-2xl border border-border/70 bg-background px-4 py-4">
                    <p className="text-sm font-semibold text-foreground">
                      Semua approval dalam kondisi aman
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Tidak ada proposal yang tertahan di review mitra saat ini.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <PortalMetricCard
            icon={LayoutDashboard}
            label="Total proyek"
            value={`${projects.length}`}
            helper="Semua project yang tersimpan di workspace SDGs."
          />
          <PortalMetricCard
            icon={FolderClock}
            label="Sedang berjalan"
            value={`${ongoingProjects.length}`}
            helper="Project aktif yang masih butuh monitoring rutin."
          />
          <PortalMetricCard
            icon={FolderArchive}
            label="Sudah selesai"
            value={`${completedProjects.length}`}
            helper="Arsip program yang sudah ditutup dan siap ditelusuri kembali."
          />
          <PortalMetricCard
            icon={ShieldCheck}
            label="Butuh approval"
            value={`${attentionProjects.length}`}
            helper="Proposal yang menunggu review atau revisi dari mitra."
          />
        </section>

        <section className="grid gap-4 xl:grid-cols-3">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-[26px] border border-border/80 bg-background p-6 shadow-[0_20px_38px_-34px_rgba(15,23,42,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/20"
            >
              <div className="flex items-start justify-between gap-4">
                <DashboardIconBadge icon={item.icon} size="lg" />
                <ArrowRight className="size-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-foreground">
                {item.title}
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
                {item.description}
              </p>
            </Link>
          ))}
        </section>

        <PortalSection
          eyebrow="Aktif"
          title="Project ongoing yang paling perlu dibuka"
          description="Ringkasan ini memudahkan tim masuk ke workspace yang masih berjalan tanpa harus scroll seluruh arsip."
          action={
            <Button asChild variant="outline">
              <Link href="/sdgdashboard/ongoing">
                Lihat semua ongoing
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          }
        >
          {ongoingProjects.length > 0 ? (
            <div className="grid gap-5 xl:grid-cols-2">
              {ongoingProjects.slice(0, 4).map((project) => (
                <ProjectListCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="flex items-start gap-4 rounded-xl border border-border/80 bg-muted/10 px-5 py-6">
              <DashboardIconBadge icon={FolderClock} tone="muted" />
              <p className="text-[15px] leading-7 text-muted-foreground">
                Belum ada proyek aktif. Buat project baru untuk mulai membuka
                workspace kolaborasi SDGs.
              </p>
            </div>
          )}
        </PortalSection>

        <PortalSection
          eyebrow="Arsip"
          title="Project yang sudah selesai"
          description="Arsip tetap disimpan agar histori proposal, realisasi, dan laporan mitra bisa dibuka kapan saja."
          action={
            <Button asChild variant="outline">
              <Link href="/sdgdashboard/archive">
                Lihat semua arsip
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          }
        >
          {completedProjects.length > 0 ? (
            <div className="grid gap-5 xl:grid-cols-2">
              {completedProjects.slice(0, 4).map((project) => (
                <ProjectListCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="flex items-start gap-4 rounded-xl border border-border/80 bg-muted/10 px-5 py-6">
              <DashboardIconBadge icon={FolderArchive} tone="success" />
              <p className="text-[15px] leading-7 text-muted-foreground">
                Belum ada proyek yang ditandai selesai.
              </p>
            </div>
          )}
        </PortalSection>
      </div>
    </main>
  );
}
