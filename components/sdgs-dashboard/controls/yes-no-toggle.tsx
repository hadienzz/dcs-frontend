"use client";

import { cn } from "@/lib/utils";

export type YesNoToggleProps = {
  /**
   * DOM id assigned to the segmented group container. Consumers that wrap the
   * toggle inside a labelled wrapper (e.g. `FormField`) can point to that
   * label via `aria-labelledby` so assistive technology announces the group.
   */
  id: string;
  value: "yes" | "no";
  onChange: (value: "yes" | "no") => void;
  /** @default "Ya" */
  yesLabel?: string;
  /** @default "Tidak" */
  noLabel?: string;
  disabled?: boolean;
  className?: string;
  "aria-labelledby"?: string;
};

const segmentBaseClass =
  "flex-1 px-4 py-2 text-sm font-medium transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none";

const activeClass = "bg-primary text-primary-foreground";
const inactiveClass =
  "bg-transparent text-muted-foreground hover:bg-secondary/50";
const disabledClass = "opacity-60 cursor-not-allowed";

/**
 * Two-button segmented control for `"yes" | "no"` values.
 *
 * Presentational only - the parent owns the value and handles the change via
 * `onChange`. Active segment uses the `--primary` token; the inactive segment
 * stays transparent with a `--secondary` hover wash. All colors resolve to
 * design tokens defined in `app/globals.css`.
 */
export default function YesNoToggle({
  id,
  value,
  onChange,
  yesLabel = "Ya",
  noLabel = "Tidak",
  disabled = false,
  className,
  "aria-labelledby": ariaLabelledBy,
}: YesNoToggleProps) {
  const isYes = value === "yes";
  const isNo = value === "no";

  const handleSelect = (next: "yes" | "no") => () => {
    if (disabled || next === value) {
      return;
    }
    onChange(next);
  };

  return (
    <div
      id={id}
      role="group"
      aria-labelledby={ariaLabelledBy}
      className={cn(
        "inline-flex w-fit items-stretch overflow-hidden rounded-md border border-input bg-background",
        disabled && disabledClass,
        className,
      )}
    >
      <button
        type="button"
        onClick={handleSelect("yes")}
        aria-pressed={isYes}
        disabled={disabled}
        className={cn(
          segmentBaseClass,
          isYes ? activeClass : inactiveClass,
          disabled && disabledClass,
        )}
      >
        {yesLabel}
      </button>
      <button
        type="button"
        onClick={handleSelect("no")}
        aria-pressed={isNo}
        disabled={disabled}
        className={cn(
          segmentBaseClass,
          "border-l border-input",
          isNo ? activeClass : inactiveClass,
          disabled && disabledClass,
        )}
      >
        {noLabel}
      </button>
    </div>
  );
}
