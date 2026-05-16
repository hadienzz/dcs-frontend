import { Inbox, type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-black/[0.08] bg-white py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 ring-1 ring-black/[0.04]">
        <Icon className="size-5 text-slate-400" />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-700">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-slate-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}
