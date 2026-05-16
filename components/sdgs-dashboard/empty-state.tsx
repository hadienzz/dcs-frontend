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
    <div className="flex flex-col items-center justify-center text-center py-16 rounded-lg border border-dashed border-border/70 bg-card/50">
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <p className="font-medium">{title}</p>
      {description ? (
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>
      ) : null}
    </div>
  );
}
