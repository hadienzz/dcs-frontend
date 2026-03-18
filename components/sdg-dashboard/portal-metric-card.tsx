import type { LucideIcon } from "lucide-react";

import { DashboardIconBadge } from "@/components/sdg-dashboard/dashboard-icon-badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PortalMetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  helper: string;
  className?: string;
}

export function PortalMetricCard({
  icon: Icon,
  label,
  value,
  helper,
  className,
}: PortalMetricCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden rounded-[24px] border-border/80 bg-background shadow-[0_18px_32px_-28px_rgba(15,23,42,0.28)] transition-transform duration-200 hover:-translate-y-0.5",
        className,
      )}
    >
      <CardContent className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <DashboardIconBadge icon={Icon} tone="muted" />
            <p className="text-sm font-semibold text-foreground">{label}</p>
          </div>
          <span className="mt-1 size-2.5 shrink-0 rounded-full bg-primary/55" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-semibold leading-tight text-foreground sm:text-[28px]">
            {value}
          </p>
          <p className="max-w-[30ch] text-sm leading-6 text-muted-foreground">
            {helper}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
