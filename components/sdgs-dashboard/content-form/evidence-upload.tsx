"use client";

import { useId, useRef } from "react";
import { Paperclip, UploadCloud, X } from "lucide-react";

import { cn } from "@/lib/utils";
import dedupeFiles, { getFileDedupKey } from "@/utils/dedupe-files";
import formatFileSize from "@/utils/format-file-size";

export type EvidenceUploadProps = {
  files: File[];
  onChange: (files: File[]) => void;
  errorMessage?: string;
  disabled?: boolean;
  /** Optional accept hint forwarded to the underlying file input. */
  accept?: string;
  className?: string;
};

/**
 * Multi-file upload control that owns no business logic.
 *
 * - Wraps `<input type="file" multiple>` in a styled drop area.
 * - Appends new files via `dedupeFiles` so duplicates by
 *   `(name, size, lastModified)` are dropped.
 * - Lists attached files with their formatted size via `formatFileSize`.
 * - Emits the next `File[]` through `onChange` on every add or remove.
 * - Uses the `--destructive` token for the per-file remove action.
 */
export default function EvidenceUpload({
  files,
  onChange,
  errorMessage,
  disabled = false,
  accept,
  className,
}: EvidenceUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleAppend = (incoming: File[]) => {
    if (incoming.length === 0) return;
    const next = dedupeFiles(files, incoming);
    if (next.length === files.length) return;
    onChange(next);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    handleAppend(Array.from(event.target.files));
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemove = (key: string) => {
    onChange(files.filter((file) => getFileDedupKey(file) !== key));
  };

  const describedBy = errorMessage ? `${inputId}-error` : undefined;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <label
        htmlFor={inputId}
        className={cn(
          "flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-border/80 bg-secondary/5 px-4 py-4 text-sm text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground",
          disabled && "cursor-not-allowed opacity-60 hover:border-border/80",
          errorMessage && "border-destructive text-destructive hover:border-destructive",
        )}
      >
        <span className="flex items-center gap-3">
          <UploadCloud className="size-5 shrink-0" aria-hidden="true" />
          <span className="leading-tight">
            <span className="block text-sm font-medium text-foreground">
              Pilih evidence (bisa lebih dari satu)
            </span>
            <span className="block text-xs">
              File akan ditambahkan ke daftar di bawah.
            </span>
          </span>
        </span>
        <span className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
          Browse file
        </span>
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          disabled={disabled}
          onChange={handleInputChange}
          aria-describedby={describedBy}
          className="sr-only"
        />
      </label>

      {files.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {files.map((file) => {
            const key = getFileDedupKey(file);
            return (
              <li
                key={key}
                className="flex items-center justify-between gap-3 rounded-md border border-border/70 bg-card px-3 py-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <Paperclip
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted-foreground"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(key)}
                  disabled={disabled}
                  aria-label={`Hapus ${file.name}`}
                  className="rounded-md p-1 text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      {errorMessage ? (
        <p id={`${inputId}-error`} className="text-xs text-destructive">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
