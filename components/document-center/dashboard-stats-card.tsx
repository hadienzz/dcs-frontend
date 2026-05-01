import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardStatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  helper: string;
  className?: string;
}

export function DashboardStatsCard({
  icon: Icon,
  label,
  value,
  helper,
  className,
}: DashboardStatsCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden rounded-[24px] border-border/80 bg-background shadow-[0_18px_32px_-28px_rgba(15,23,42,0.28)]",
        className,
      )}
    >
      <CardContent className="flex min-h-[158px] flex-col justify-between gap-5 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-primary/12 bg-primary/[0.08] text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
              <Icon className="size-[18px] stroke-[1.9]" />
            </div>
            <p className="text-sm font-semibold text-foreground">{label}</p>
          </div>
          <span className="mt-1 size-2.5 shrink-0 rounded-full bg-primary/55" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-semibold leading-tight text-foreground sm:text-[28px]">
            {value}
          </p>
          <p className="max-w-[32ch] text-sm leading-6 text-muted-foreground">
            {helper}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
