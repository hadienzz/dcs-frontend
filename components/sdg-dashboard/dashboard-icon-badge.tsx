import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type IconTone = "primary" | "muted" | "success" | "warning";
type IconSize = "sm" | "md" | "lg";

interface DashboardIconBadgeProps {
  icon: LucideIcon;
  tone?: IconTone;
  size?: IconSize;
  className?: string;
}

const toneClassNames: Record<IconTone, string> = {
  primary: "border-primary/12 bg-primary/[0.08] text-primary",
  muted: "border-border/80 bg-muted/12 text-muted-foreground",
  success: "border-emerald-200/80 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200/80 bg-amber-50 text-amber-700",
};

const sizeClassNames: Record<IconSize, string> = {
  sm: "size-10 rounded-xl",
  md: "size-11 rounded-[14px]",
  lg: "size-14 rounded-[18px]",
};

const iconSizeClassNames: Record<IconSize, string> = {
  sm: "size-4",
  md: "size-[18px]",
  lg: "size-5",
};

export function DashboardIconBadge({
  icon: Icon,
  tone = "primary",
  size = "md",
  className,
}: DashboardIconBadgeProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center border shadow-[0_12px_22px_-18px_rgba(15,23,42,0.25),inset_0_1px_0_rgba(255,255,255,0.72)]",
        toneClassNames[tone],
        sizeClassNames[size],
        className,
      )}
    >
      <Icon className={cn(iconSizeClassNames[size], "stroke-[1.9]")} />
    </div>
  );
}
