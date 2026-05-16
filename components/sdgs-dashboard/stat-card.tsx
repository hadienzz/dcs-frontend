import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
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

const toneStyles: Record<StatCardTone, string> = {
  blue: "bg-blue-500 text-white",
  emerald: "bg-emerald-500 text-white",
  amber: "bg-amber-500 text-white",
  violet: "bg-violet-500 text-white",
  rose: "bg-rose-500 text-white",
  primary: "bg-primary text-primary-foreground",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  tone = "primary",
}: StatCardProps) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm",
              toneStyles[tone],
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-2xl font-semibold leading-none text-foreground">
              {value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{label}</p>
          </div>
        </div>
        {hint ? (
          <p className="mt-4 text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
