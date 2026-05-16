import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type StatCardTone =
  | "blue"
  | "emerald"
  | "amber"
  | "violet"
  | "rose"
  | "primary";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  tone?: StatCardTone;
}

const toneStyles: Record<StatCardTone, { bg: string; icon: string }> = {
  blue: { bg: "bg-blue-50 ring-blue-100/60", icon: "text-blue-600" },
  emerald: { bg: "bg-emerald-50 ring-emerald-100/60", icon: "text-emerald-600" },
  amber: { bg: "bg-amber-50 ring-amber-100/60", icon: "text-amber-600" },
  violet: { bg: "bg-violet-50 ring-violet-100/60", icon: "text-violet-600" },
  rose: { bg: "bg-rose-50 ring-rose-100/60", icon: "text-rose-600" },
  primary: { bg: "bg-[#b6252a]/[0.06] ring-[#b6252a]/10", icon: "text-[#b6252a]" },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  tone = "primary",
}: StatCardProps) {
  const style = toneStyles[tone];

  return (
    <div className="rounded-xl border border-black/[0.06] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl ring-1",
            style.bg,
            style.icon,
          )}
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-2xl font-semibold leading-none tracking-tight text-slate-900">
            {value}
          </p>
          <p className="mt-1.5 text-sm text-slate-500">{label}</p>
        </div>
      </div>
      {hint ? (
        <p className="mt-4 text-xs leading-relaxed text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}
