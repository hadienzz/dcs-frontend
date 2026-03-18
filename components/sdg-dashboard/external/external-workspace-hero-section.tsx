import { ArrowRight, KeyRound } from "lucide-react";

import { DashboardIconBadge } from "@/components/sdg-dashboard/dashboard-icon-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ExternalWorkspaceHeroSectionProps {
  invitationCode: string;
  invitationError: string | null;
  onInvitationCodeChange: (value: string) => void;
  onInvitationCodeSubmit: () => void;
}

export function ExternalWorkspaceHeroSection({
  invitationCode,
  invitationError,
  onInvitationCodeChange,
  onInvitationCodeSubmit,
}: ExternalWorkspaceHeroSectionProps) {
  return (
    <Card className="overflow-hidden rounded-[30px] border-border/80 bg-background shadow-[0_32px_60px_-44px_rgba(15,23,42,0.35)]">
      <CardContent className="grid gap-6 px-6 py-7 sm:px-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-end">
        <div className="max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            Portal Mitra
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Area eksternal untuk masuk ke workspace mitra, review proposal,
            dan memberi keputusan approval.
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-muted-foreground sm:text-base">
            Tim internal membagikan invitation code ke PIC mitra. Setelah kode
            dimasukkan, pihak eksternal bisa langsung membuka workspace terkait
            untuk melihat proposal, timeline, budget, dan progress yang dibagikan.
          </p>
        </div>

        <div className="rounded-[24px] border border-border/70 bg-[linear-gradient(180deg,rgba(182,37,42,0.08),rgba(182,37,42,0.02)_64%,rgba(182,37,42,0)_100%)] p-5">
          <div className="flex items-start gap-3">
            <DashboardIconBadge icon={KeyRound} />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Masukkan invitation code
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Gunakan kode dari tim internal untuk langsung mengikuti workspace
                yang sudah dibagikan.
              </p>
            </div>
          </div>

          <form
            className="mt-4 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              onInvitationCodeSubmit();
            }}
          >
            <Input
              value={invitationCode}
              onChange={(event) => onInvitationCodeChange(event.target.value)}
              placeholder="Contoh: SDGS-EXT-4821"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="font-mono uppercase tracking-[0.12em]"
            />

            <Button type="submit" className="w-full sm:w-auto">
              Masuk ke workspace
              <ArrowRight data-icon="inline-end" />
            </Button>
          </form>

          <p className="mt-3 text-xs leading-6 text-muted-foreground">
            Format umum invitation code:{" "}
            <span className="font-mono font-semibold tracking-[0.12em] text-foreground">
              SDGS-EXT-1234
            </span>
            .
          </p>

          {invitationError ? (
            <div className="mt-4 rounded-[18px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
              {invitationError}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Setelah kode valid, mitra akan diarahkan ke workspace yang sesuai.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
