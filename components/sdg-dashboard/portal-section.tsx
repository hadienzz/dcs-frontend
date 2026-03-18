import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PortalSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function PortalSection({
  eyebrow,
  title,
  description,
  action,
  children,
  className,
  contentClassName,
}: PortalSectionProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden rounded-[24px] border-border/80 bg-background shadow-[0_16px_30px_-28px_rgba(15,23,42,0.3)]",
        className,
      )}
    >
      <CardHeader className="border-b border-border/60 bg-[linear-gradient(180deg,rgba(182,37,42,0.035),rgba(182,37,42,0.012)_60%,rgba(182,37,42,0)_100%)] pb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-2">
            {eyebrow ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                {eyebrow}
              </p>
            ) : null}
            <div className="flex flex-col gap-1">
              <CardTitle className="text-[1.375rem] font-semibold leading-tight text-foreground">
                {title}
              </CardTitle>
              {description ? (
                <CardDescription className="max-w-3xl text-[15px] leading-7 text-muted-foreground">
                  {description}
                </CardDescription>
              ) : null}
            </div>
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      </CardHeader>
      <CardContent className={cn("p-6", contentClassName)}>{children}</CardContent>
    </Card>
  );
}
