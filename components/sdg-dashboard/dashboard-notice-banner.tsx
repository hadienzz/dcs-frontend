import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type NoticeTone = "success" | "warning" | "neutral";

interface DashboardNoticeBannerProps {
  title: string;
  body: string;
  tone: NoticeTone;
  className?: string;
}

const toneClassNames: Record<NoticeTone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  neutral: "border-border/80 bg-background text-foreground",
};

export function DashboardNoticeBanner({
  title,
  body,
  tone,
  className,
}: DashboardNoticeBannerProps) {
  return (
    <Card className={cn("rounded-2xl shadow-sm", toneClassNames[tone], className)}>
      <CardContent className="px-5 py-4">
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-[15px] leading-7">{body}</p>
      </CardContent>
    </Card>
  );
}

export type { NoticeTone };

