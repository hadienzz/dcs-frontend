import * as React from "react";

import { cn } from "@/lib/utils";

export const textareaBaseClassName =
  "flex min-h-32 w-full rounded-xl border border-border/80 bg-background px-4 py-3 text-[15px] text-foreground shadow-sm transition-[border-color,box-shadow,background-color] placeholder:text-muted-foreground/80 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-60";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(textareaBaseClassName, className)}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
