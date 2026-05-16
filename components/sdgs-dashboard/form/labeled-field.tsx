import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface LabeledFieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}

export function LabeledField({
  label,
  htmlFor,
  hint,
  className,
  children,
}: LabeledFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="text-[13px] font-medium text-slate-700"
      >
        {label}
      </label>
      {children}
      {hint ? (
        <p className="text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}
