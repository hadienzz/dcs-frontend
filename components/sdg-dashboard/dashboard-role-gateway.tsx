"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  FolderKanban,
  ShieldCheck,
} from "lucide-react";

import {
  getInternalDashboardPath,
  type SdgDashboardProjectRecord,
} from "@/components/sdg-dashboard/dashboard-data";
import { DashboardIconBadge } from "@/components/sdg-dashboard/dashboard-icon-badge";
import { PortalMetricCard } from "@/components/sdg-dashboard/portal-metric-card";
import { Button } from "@/components/ui/button";
import { useSdgDashboardProjects } from "@/hooks/use-sdg-dashboard-projects";

function countProjectsByStatus(
  projects: SdgDashboardProjectRecord[],
  status: "ongoing" | "completed",
) {
  return projects.filter((project) => project.status === status).length;
}

export function DashboardRoleGateway() {
  const { projects } = useSdgDashboardProjects();
  const ongoingProjectsCount = countProjectsByStatus(projects, "ongoing");
  const completedProjectsCount = countProjectsByStatus(projects, "completed");

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f4ef_0%,#f4ede4_32%,#f8f6f2_100%)]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="overflow-hidden rounded-[32px] border border-border/80 bg-background shadow-[0_32px_60px_-40px_rgba(15,23,42,0.38)]">
          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div className="max-w-4xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                SDGs Collaboration Workspace
              </p>
              <h1 className="mt-4 text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-[3rem]">
                Pilih area kerja sesuai entity yang memakai dashboard.
              </h1>
              <p className="mt-5 text-[15px] leading-7 text-muted-foreground sm:text-base">
                Area internal dipakai tim SDGs untuk mengelola proposal, timeline,
                RAB, realisasi, dan laporan setiap proyek. Area eksternal dipakai
                mitra untuk meninjau proposal, melihat progres yang dibagikan,
                lalu memberi keputusan approval.
              </p>
            </div>

            <div className="rounded-[26px] border border-border/70 bg-[linear-gradient(180deg,rgba(182,37,42,0.08),rgba(182,37,42,0.02)_64%,rgba(182,37,42,0)_100%)] p-5">
              <div className="flex items-start gap-3">
                <DashboardIconBadge icon={FolderKanban} />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Konteks dashboard
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Setiap proyek berdiri sendiri. Tidak ada total RAB lintas proyek
                    yang dicampur di area internal maupun eksternal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <PortalMetricCard
            icon={FolderKanban}
            label="Total proyek"
            value={`${projects.length}`}
            helper="Jumlah workspace proyek yang tersimpan di dashboard."
          />
          <PortalMetricCard
            icon={Building2}
            label="Project ongoing"
            value={`${ongoingProjectsCount}`}
            helper="Proyek yang masih aktif dipantau dan dikerjakan."
          />
          <PortalMetricCard
            icon={ShieldCheck}
            label="Arsip selesai"
            value={`${completedProjectsCount}`}
            helper="Proyek yang sudah selesai dan masuk arsip."
          />
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-[28px] border border-border/80 bg-background p-6 shadow-[0_24px_44px_-34px_rgba(15,23,42,0.35)]">
            <div className="flex items-start justify-between gap-4">
              <DashboardIconBadge icon={Building2} size="lg" />
              <span className="rounded-full border border-primary/15 bg-primary/[0.08] px-3 py-1 text-xs font-semibold text-primary">
                Internal SDGs
              </span>
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-foreground">
              Workspace internal untuk tim SDGs
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
              Dipakai untuk membuat dan mengelola proyek per mitra, mengisi
              proposal, menyusun timeline, mencatat detail RAB serta pengeluaran,
              lalu mengatur apa saja yang dibagikan ke mitra.
            </p>
            <div className="mt-6">
              <Button asChild size="lg">
                <Link href={getInternalDashboardPath()}>
                  Buka area internal
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-[28px] border border-border/80 bg-background p-6 shadow-[0_24px_44px_-34px_rgba(15,23,42,0.35)]">
            <div className="flex items-start justify-between gap-4">
              <DashboardIconBadge icon={ShieldCheck} size="lg" />
              <span className="rounded-full border border-border/80 bg-muted/10 px-3 py-1 text-xs font-semibold text-foreground">
                Portal Mitra
              </span>
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-foreground">
              Workspace eksternal untuk mitra
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
              Dipakai mitra untuk mengunduh proposal, melihat detail RAB dan
              pengeluaran yang dibagikan, memantau progress, lalu memberi persetujuan atau
              meminta revisi proposal dari tim internal.
            </p>
            <div className="mt-6">
              <Button asChild size="lg" variant="outline">
                <Link href="/sdgdashboard/external">
                  Buka area eksternal
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
