import type { ReactNode } from "react";

import { Input, inputBaseClassName } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function fieldClassName() {
  return cn(inputBaseClassName, "bg-background");
}

export function FieldBlock({
  htmlFor,
  label,
  hint,
  className,
  children,
}: {
  htmlFor: string;
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="text-sm font-semibold text-foreground">
        {label}
      </label>
      {children}
      {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export { Input, Textarea };
