import { AlertTriangle, Loader2 } from "lucide-react";

import { SectionCard } from "@/components/document-center/section-card";
import { Button } from "@/components/ui/button";

interface DocumentCenterErrorPanelProps {
  message: string;
  isRetrying: boolean;
  onRetry: () => void;
}

export function DocumentCenterErrorPanel({
  message,
  isRetrying,
  onRetry,
}: DocumentCenterErrorPanelProps) {
  return (
    <SectionCard
      eyebrow="Unable to load"
      title="Document Center needs a refresh"
      description={message}
      action={
        <Button type="button" onClick={onRetry} disabled={isRetrying}>
          {isRetrying ? (
            <Loader2 data-icon="inline-start" className="animate-spin" />
          ) : null}
          {isRetrying ? "Retrying..." : "Try again"}
        </Button>
      }
    >
      <div className="flex min-h-[220px] flex-col justify-center rounded-[24px] border border-destructive/15 bg-destructive/[0.04] p-6">
        <div className="mb-4 flex size-12 items-center justify-center rounded-[16px] border border-destructive/20 bg-background text-destructive">
          <AlertTriangle className="size-5" />
        </div>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Data belum bisa ditampilkan. Coba ulangi; kalau masih gagal, hubungi
          admin dengan konteks halaman ini.
        </p>
      </div>
    </SectionCard>
  );
}
