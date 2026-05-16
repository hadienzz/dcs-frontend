"use client";

import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export type SelectedPill = {
  id: string;
  label: string;
  toneClassName?: string;
};

export type SelectedPillListProps = {
  items: SelectedPill[];
  onRemove: (id: string) => void;
  emptyMessage?: string | null;
  className?: string;
  removeAriaLabel?: (label: string) => string;
};

const defaultRemoveAriaLabel = (label: string) => `Hapus ${label}`;

export default function SelectedPillList({
  items,
  onRemove,
  emptyMessage,
  className,
  removeAriaLabel,
}: SelectedPillListProps) {
  if (items.length === 0) {
    if (emptyMessage === null) {
      return null;
    }
    return (
      <p className={cn("text-xs text-muted-foreground", className)}>
        {emptyMessage ?? "Belum ada pilihan."}
      </p>
    );
  }

  const getRemoveLabel = removeAriaLabel ?? defaultRemoveAriaLabel;

  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <li key={item.id}>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
              item.toneClassName ?? "bg-secondary/15 text-secondary",
            )}
          >
            {item.label}
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="rounded-full p-0.5 text-destructive hover:bg-destructive/10"
              aria-label={getRemoveLabel(item.label)}
            >
              <X size={12} aria-hidden="true" />
            </button>
          </span>
        </li>
      ))}
    </ul>
  );
}
