import type { LucideIcon } from "lucide-react";

import { DashboardIconBadge } from "@/components/sdg-dashboard/dashboard-icon-badge";
import { cn } from "@/lib/utils";

interface DashboardTabButtonProps {
  icon: LucideIcon;
  label: string;
  helper: string;
  isActive: boolean;
  onClick: () => void;
}

export function DashboardTabButton({
  icon,
  label,
  helper,
  isActive,
  onClick,
}: DashboardTabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex min-h-[78px] min-w-[188px] flex-1 items-start gap-3 rounded-[22px] border px-4 py-3.5 text-left transition-[border-color,background-color,box-shadow,transform] duration-200 xl:min-w-0",
        isActive
          ? "border-primary/18 bg-[linear-gradient(180deg,rgba(182,37,42,0.14),rgba(182,37,42,0.05)_100%)] text-foreground shadow-[0_18px_34px_-28px_rgba(182,37,42,0.45)]"
          : "border-border/80 bg-background text-foreground hover:border-primary/12 hover:bg-muted/12",
      )}
      aria-pressed={isActive}
      aria-current={isActive ? "page" : undefined}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <DashboardIconBadge
          icon={icon}
          size="sm"
          tone={isActive ? "primary" : "muted"}
          className={cn(isActive && "bg-primary/[0.12]")}
        />
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-[15px] font-semibold leading-6">{label}</span>
          <span
            className={cn(
              "line-clamp-2 text-sm leading-5",
              isActive ? "text-foreground/72" : "text-muted-foreground",
            )}
          >
            {helper}
          </span>
        </span>
      </div>
      <span
        className={cn(
          "mt-2 hidden size-2.5 shrink-0 rounded-full transition-colors sm:block",
          isActive ? "bg-primary" : "bg-border",
        )}
      />
      <span className="sr-only">
        {isActive ? `${label} aktif` : `${label} tidak aktif`}
      </span>
    </button>
  );
}
