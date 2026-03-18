import Link from "next/link";
import { FolderPlus, FolderSearch, ShieldCheck } from "lucide-react";

import {
  getInternalCreateProjectPath,
  getInternalOngoingProjectsPath,
} from "@/components/sdg-dashboard/dashboard-data";
import { DashboardIconBadge } from "@/components/sdg-dashboard/dashboard-icon-badge";
import { Button } from "@/components/ui/button";

export function InternalHomeHeroSection() {
  return (
    <section className="overflow-hidden rounded-[30px] border border-border/80 bg-background shadow-[0_32px_60px_-44px_rgba(15,23,42,0.35)]">
      <div className="grid gap-8 px-6 py-7 sm:px-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-end">
        <div className="max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            Internal SDGs
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-[3rem]">
            Kelola proyek per mitra tanpa mencampur konteks antar proyek.
          </h1>
          <p className="mt-5 text-[15px] leading-7 text-muted-foreground sm:text-base">
            Area ini khusus untuk tim internal SDGs. Setiap proyek berdiri sendiri,
            jadi proposal, timeline, RAB, pengeluaran, dan progress hanya relevan
            untuk proyek itu saja tanpa digabung ke proyek lain.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={getInternalCreateProjectPath()}>
                <FolderPlus data-icon="inline-start" />
                Buat project baru
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={getInternalOngoingProjectsPath()}>
                <FolderSearch data-icon="inline-start" />
                Lihat ongoing
              </Link>
            </Button>
          </div>
        </div>

        <div className="rounded-[24px] border border-border/70 bg-[linear-gradient(180deg,rgba(182,37,42,0.08),rgba(182,37,42,0.02)_65%,rgba(182,37,42,0)_100%)] p-5">
          <div className="flex items-start gap-3">
            <DashboardIconBadge icon={ShieldCheck} />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Fungsi area internal
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Tim internal menyusun proposal, mencatat RAB dan pengeluaran,
                menentukan visibilitas data, lalu mengirimkannya ke mitra untuk
                direview.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
