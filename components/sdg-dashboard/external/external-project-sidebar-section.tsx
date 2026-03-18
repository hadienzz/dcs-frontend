import type { ProjectParticipant } from "@/components/sdg-dashboard/dashboard-data";
import { ParticipantAvatar } from "@/components/sdg-dashboard/participant-avatar";
import { PortalSection } from "@/components/sdg-dashboard/portal-section";

interface ExternalProjectSidebarSectionProps {
  participants: ProjectParticipant[];
  sharedBudgetLabel: string;
  sharedReportsCount: number;
}

export function ExternalProjectSidebarSection({
  participants,
  sharedBudgetLabel,
  sharedReportsCount,
}: ExternalProjectSidebarSectionProps) {
  return (
    <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
      <PortalSection
        eyebrow="Ringkasan mitra"
        title="Akses mitra pada proyek ini"
        description="Panel ini menegaskan bahwa mitra hanya melihat item yang dibagikan, bukan seluruh data internal."
      >
        <div className="space-y-3">
          <div className="rounded-[22px] border border-border/80 bg-muted/10 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Budget yang terlihat
            </p>
            <p className="mt-2 text-lg font-semibold text-foreground">
              {sharedBudgetLabel}
            </p>
          </div>
          <div className="rounded-[22px] border border-border/80 bg-muted/10 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Laporan yang dibuka
            </p>
            <p className="mt-2 text-lg font-semibold text-foreground">
              {sharedReportsCount} laporan
            </p>
          </div>
          <div className="rounded-[22px] border border-border/80 bg-background p-4">
            <p className="text-sm font-semibold text-foreground">
              Fungsi mitra
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Melihat proposal, timeline, RAB, pengeluaran, dan progress yang
              dibagikan, lalu mengirim persetujuan proposal dan persetujuan per tahap
              yang tersedia.
            </p>
          </div>
        </div>
      </PortalSection>

      <PortalSection
        eyebrow="PIC proyek"
        title="Kontak yang tergabung"
        description="Akun yang bergabung ke proyek ini dari sisi mitra maupun internal."
      >
        <div className="space-y-3">
          {participants.map((participant) => (
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
        </div>
      </PortalSection>
    </div>
  );
}
