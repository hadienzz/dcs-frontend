import { FolderSearch, Search } from "lucide-react";

import { DashboardIconBadge } from "@/components/sdg-dashboard/dashboard-icon-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface InternalDirectoryHeroSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
}

export function InternalDirectoryHeroSection({
  eyebrow,
  title,
  description,
  searchQuery,
  onSearchQueryChange,
}: InternalDirectoryHeroSectionProps) {
  return (
    <Card className="overflow-hidden rounded-[30px] border-border/80 bg-background shadow-[0_32px_60px_-42px_rgba(15,23,42,0.35)]">
      <CardContent className="grid gap-6 px-6 py-7 sm:px-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>

        <div className="rounded-[24px] border border-border/70 bg-[linear-gradient(180deg,rgba(182,37,42,0.08),rgba(182,37,42,0.02)_65%,rgba(182,37,42,0)_100%)] p-5">
          <div className="flex items-start gap-3">
            <DashboardIconBadge icon={FolderSearch} />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Cari proyek dengan cepat
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Gunakan nama program atau nama mitra untuk mempersempit daftar.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-border/80 bg-background p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => onSearchQueryChange(event.target.value)}
                placeholder="Cari proyek atau nama mitra"
                className="pl-11"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

