import { Folder } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface FolderButtonProps {
  title: string;
  helper: string;
  count: number;
  onClick: () => void;
}

export function FolderButton({
  title,
  helper,
  count,
  onClick,
}: FolderButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[112px] items-start gap-4 rounded-[24px] border border-border/80 bg-background p-5 text-left shadow-[0_16px_30px_-28px_rgba(15,23,42,0.3)] transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_20px_36px_-30px_rgba(182,37,42,0.45)]"
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-[16px] border border-primary/12 bg-primary/[0.08] text-primary">
        <Folder className="size-5 fill-primary/10" />
      </div>
      <div className="min-w-0">
        <p className="line-clamp-2 font-semibold leading-6 text-foreground">
          {title}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{helper}</p>
        <Badge variant="neutral" className="mt-3">
          {count} documents
        </Badge>
      </div>
    </button>
  );
}
