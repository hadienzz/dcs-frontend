import * as React from "react";

import { cn } from "@/lib/utils";

export const inputBaseClassName =
  "flex h-12 w-full rounded-xl border border-border/80 bg-background px-4 text-[15px] text-foreground shadow-sm transition-[border-color,box-shadow,background-color] placeholder:text-muted-foreground/80 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-60";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(inputBaseClassName, className)}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
