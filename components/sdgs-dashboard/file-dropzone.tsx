"use client";

import { useRef, useState } from "react";
import { FileText, UploadCloud, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  value?: string;
  onChange: (fileName: string) => void;
  accept?: string;
  label?: string;
  hint?: string;
}

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
          "cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors",
          drag
            ? "border-[#b6252a]/40 bg-[#b6252a]/[0.03]"
            : "border-black/[0.08] bg-[#fafafa] hover:border-[#b6252a]/30 hover:bg-[#b6252a]/[0.02]",
        )}
      >
        <UploadCloud className="mx-auto size-6 text-slate-400" />
        <p className="mt-2 text-sm font-medium text-slate-700">{label}</p>
        <p className="mt-1 text-xs text-slate-400">{hint}</p>
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
        <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-black/[0.06] bg-white px-3 py-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="size-4 shrink-0 text-slate-400" />
            <span className="truncate text-sm text-slate-700">{value}</span>
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Hapus file"
            className="shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
