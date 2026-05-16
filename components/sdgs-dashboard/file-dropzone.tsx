"use client";

import { useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  value?: string;
  onChange: (fileName: string) => void;
  accept?: string;
  label?: string;
  hint?: string;
}

/**
 * Mock dropzone — only stores the filename in state since the real upload API
 * is not wired yet. UX matches the sdgs-insight reference.
 */
export function FileDropzone({
  value,
  onChange,
  accept,
  label = "Upload file",
  hint = "PNG, JPG, PDF · max 10MB",
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const open = () => inputRef.current?.click();

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={open}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            open();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDrag(false);
          const file = event.dataTransfer.files?.[0];
          if (file) onChange(file.name);
        }}
        className={cn(
          "rounded-lg border-2 border-dashed p-6 text-center transition-colors cursor-pointer",
          drag
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/30 hover:border-primary/50",
        )}
      >
        <UploadCloud className="h-6 w-6 mx-auto text-muted-foreground" />
        <p className="text-sm font-medium mt-2">{label}</p>
        <p className="text-xs text-muted-foreground mt-1">{hint}</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => {
            const f = event.target.files?.[0];
            if (f) onChange(f.name);
          }}
        />
      </div>

      {value ? (
        <div className="mt-2 flex items-center justify-between gap-2 rounded-md border border-border/70 bg-card px-3 py-2 text-sm">
          <span className="truncate">{value}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onChange("")}
            aria-label="Hapus file"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
