import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SectionCardProps {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function SectionCard({
  eyebrow,
  title,
  description,
  action,
  children,
}: SectionCardProps) {
  return (
    <Card className="overflow-hidden rounded-[24px] border-border/80 bg-background shadow-[0_20px_48px_-36px_rgba(15,23,42,0.36)]">
      <CardHeader className="border-b border-border/60 bg-[linear-gradient(180deg,rgba(182,37,42,0.05),rgba(182,37,42,0.016)_62%,rgba(182,37,42,0)_100%)] pb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {eyebrow}
            </p>
            <div className="flex flex-col gap-1">
              <CardTitle className="text-[1.375rem] font-semibold leading-tight text-foreground">
                {title}
              </CardTitle>
              {description ? (
                <p className="max-w-3xl text-[15px] leading-7 text-muted-foreground">
                  {description}
                </p>
              ) : null}
            </div>
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      </CardHeader>
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  );
}
