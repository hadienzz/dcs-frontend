import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}

export function SectionCard({
  title,
  description,
  children,
  action,
}: SectionCardProps) {
  return (
    <div className="rounded-xl border border-black/[0.06] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-4 border-b border-black/[0.04] px-5 py-4">
        <div>
          <h3 className="text-[15px] font-semibold text-slate-900">{title}</h3>
          {description ? (
            <p className="mt-0.5 text-sm text-slate-400">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="space-y-4 p-5">{children}</div>
    </div>
  );
}
