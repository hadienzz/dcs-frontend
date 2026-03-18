import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex min-h-7 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none whitespace-nowrap tracking-[0.01em] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-primary/15 bg-primary/[0.08] text-primary",
        secondary: "border-secondary/15 bg-secondary/[0.08] text-secondary",
        outline: "border-border/80 bg-background text-foreground",
        neutral: "border-border/70 bg-muted/15 text-muted-foreground",
        success: "border-emerald-200/80 bg-emerald-50 text-emerald-700",
        warning: "border-amber-200/80 bg-amber-50 text-amber-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
