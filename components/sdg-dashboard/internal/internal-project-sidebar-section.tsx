import Link from "next/link";
import { Eye, ShieldCheck, UsersRound, Wallet } from "lucide-react";

import type { ProjectParticipant } from "@/components/sdg-dashboard/dashboard-data";
import { DashboardIconBadge } from "@/components/sdg-dashboard/dashboard-icon-badge";
import { ParticipantAvatar } from "@/components/sdg-dashboard/participant-avatar";
import { PortalSection } from "@/components/sdg-dashboard/portal-section";
import { Button } from "@/components/ui/button";

interface InternalProjectSidebarSectionProps {
  sharedBudgetLabel: string;
  sharedBudgetItemsCount: number;
  sharedReportsCount: number;
  joinedParticipants: ProjectParticipant[];
  externalHref: string;
}

export function InternalProjectSidebarSection({
  sharedBudgetLabel,
  sharedBudgetItemsCount,
  sharedReportsCount,
  joinedParticipants,
  externalHref,
}: InternalProjectSidebarSectionProps) {
  return (
    <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
      <PortalSection
        eyebrow="Mitra view"
        title="Yang benar-benar terlihat di mitra"
        description="Panel ini membantu tim internal memisahkan data internal dan data yang memang dibagikan ke entity eksternal."
      >
        <div className="space-y-4">
          <div className="rounded-[22px] border border-border/80 bg-muted/10 p-4">
            <div className="flex items-center gap-3">
              <DashboardIconBadge icon={Wallet} tone="muted" size="sm" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Budget yang dibagikan
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {sharedBudgetItemsCount} item tampil ke mitra.
                </p>
              </div>
            </div>
            <p className="mt-4 text-xl font-semibold text-foreground">
              {sharedBudgetLabel}
            </p>
          </div>

          <div className="rounded-[22px] border border-border/80 bg-muted/10 p-4">
            <div className="flex items-center gap-3">
              <DashboardIconBadge icon={ShieldCheck} tone="muted" size="sm" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Laporan yang dibagikan
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Portal mitra hanya menampilkan laporan bertanda CSR.
                </p>
              </div>
            </div>
            <p className="mt-4 text-xl font-semibold text-foreground">
              {sharedReportsCount} laporan
            </p>
          </div>

          <Button asChild className="w-full">
            <Link href={externalHref}>
              <Eye data-icon="inline-start" />
              Preview portal mitra
            </Link>
          </Button>
        </div>
      </PortalSection>

      <PortalSection
        eyebrow="Tim proyek"
        title="Aktor yang ada di proyek ini"
        description="Daftar ini khusus untuk proyek saat ini, jadi setiap workspace tetap berdiri sendiri."
      >
        <div className="space-y-3">
          {joinedParticipants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-start gap-3 rounded-[22px] border border-border/80 bg-muted/10 px-4 py-4"
            >
              <ParticipantAvatar name={participant.name} />
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold text-foreground">
                  {participant.name}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {participant.role}
                </p>
              </div>
            </div>
          ))}

          {joinedParticipants.length === 0 ? (
            <div className="rounded-[22px] border border-dashed border-border/80 bg-muted/10 px-4 py-5">
              <div className="flex items-center gap-3">
                <DashboardIconBadge icon={UsersRound} tone="muted" size="sm" />
                <p className="text-sm leading-6 text-muted-foreground">
                  Belum ada akun yang bergabung ke proyek ini.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </PortalSection>

      {/* <PortalSection
        eyebrow="Boundary"
        title="Peran internal vs mitra"
        description="Supaya penggunaan dashboard lebih jelas untuk tiap entity."
      >
        <div className="space-y-3">
          <div className="rounded-[22px] border border-border/80 bg-background p-4">
            <p className="text-sm font-semibold text-foreground">
              Internal SDGs
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Menulis proposal, menyusun timeline, mencatat RAB, pengeluaran,
              dan progress per proyek.
            </p>
          </div>
          <div className="rounded-[22px] border border-border/80 bg-muted/10 p-4">
            <p className="text-sm font-semibold text-foreground">
              Mitra eksternal
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Melihat item yang dibagikan, mengunduh proposal, lalu memberi
              persetujuan atau permintaan revisi.
            </p>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            Proyek aktif:{" "}
            <span className="font-semibold text-foreground">
              {project.name}
            </span>
          </p>
        </div>
      </PortalSection> */}
    </div>
  );
}
