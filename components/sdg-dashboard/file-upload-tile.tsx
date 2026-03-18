import { FileText, Upload } from "lucide-react";

import { DashboardIconBadge } from "@/components/sdg-dashboard/dashboard-icon-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadTileProps {
  inputId: string;
  title: string;
  description: string;
  fileName: string | null;
  onFileChange: (fileName: string | null) => void;
  onClear: () => void;
  disabled?: boolean;
  helper?: string;
}

export function FileUploadTile({
  inputId,
  title,
  description,
  fileName,
  onFileChange,
  onClear,
  disabled = false,
  helper,
}: FileUploadTileProps) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-[22px] border border-border/80 bg-background p-5 shadow-[0_14px_26px_-24px_rgba(15,23,42,0.25)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <Badge variant={fileName ? "success" : "neutral"}>
          {fileName ? "Terunggah" : "Kosong"}
        </Badge>
      </div>

      <div className="flex min-h-24 flex-1 items-center rounded-xl border border-dashed border-border/70 bg-muted/10 px-4 py-3">
        {fileName ? (
          <div className="flex min-w-0 items-center gap-3">
            <DashboardIconBadge icon={FileText} tone="muted" />
            <div className="min-w-0">
              <p className="truncate text-[15px] font-medium text-foreground">
                {fileName}
              </p>
              <p className="text-sm text-muted-foreground">
                PDF tersimpan sebagai dokumen tahap ini.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <DashboardIconBadge icon={Upload} tone="muted" size="sm" />
            <p className="text-[15px] leading-7 text-muted-foreground">
              Belum ada file PDF yang diunggah untuk slot ini.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <label
          htmlFor={inputId}
          className={cn(
            buttonVariants({ size: "sm", variant: "outline" }),
            "cursor-pointer",
            disabled && "pointer-events-none opacity-50",
          )}
        >
          <Upload />
          Upload PDF
        </label>
        <input
          id={inputId}
          type="file"
          accept="application/pdf"
          className="sr-only"
          disabled={disabled}
          onChange={(event) => {
            const nextFile = event.target.files?.[0] ?? null;
            onFileChange(nextFile?.name ?? null);
            event.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClear}
          disabled={disabled || !fileName}
        >
          Hapus file
        </Button>
      </div>

      {helper ? <p className="text-sm text-muted-foreground">{helper}</p> : null}
    </div>
  );
}
