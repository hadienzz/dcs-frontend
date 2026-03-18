import { FolderPlus } from "lucide-react";

import { DashboardIconBadge } from "@/components/sdg-dashboard/dashboard-icon-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface InternalCreateProjectHeroSectionProps {
  setupItems: string[];
}

export function InternalCreateProjectHeroSection({
  setupItems,
}: InternalCreateProjectHeroSectionProps) {
  return (
    <Card className="rounded-[28px] border-border/80 bg-background shadow-[0_28px_56px_-40px_rgba(15,23,42,0.32)]">
      <CardContent className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
        <div>
          <Badge variant="outline" className="bg-muted/10 text-foreground">
            Buat project baru
          </Badge>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Mulai project SDGs baru.
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-muted-foreground sm:text-base">
            Isi nama project dan nama mitra terlebih dahulu. Setelah disimpan,
            workspace internal dan portal mitra akan otomatis disiapkan untuk
            alur proposal sampai monitoring bulanan.
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-[24px] border border-border/80 bg-[linear-gradient(180deg,rgba(182,37,42,0.04),rgba(182,37,42,0.008)_58%,rgba(182,37,42,0)_100%)] p-5">
          <div className="flex items-center gap-3">
            <DashboardIconBadge icon={FolderPlus} />
            <p className="text-sm font-semibold text-foreground">
              Yang akan dibuat
            </p>
          </div>
          {setupItems.map((item, index) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background px-4 py-3.5"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border/80 bg-muted/10 text-sm font-semibold text-foreground">
                {index + 1}
              </div>
              <p className="text-[15px] leading-7 text-foreground">{item}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

