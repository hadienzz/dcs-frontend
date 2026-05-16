"use client";

import { useId, useMemo, useState } from "react";
import { Popover } from "@base-ui/react";
import { Check, ChevronDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";

import SelectedPillList, {
  type SelectedPill,
} from "./selected-pill-list";

export type MultiSelectOption = {
  value: string;
  label: string;
  /** Optional grouping label rendered as a sticky header. */
  group?: string;
  /** Pill label override; falls back to `label` when omitted. */
  shortLabel?: string;
  /** Optional pill tone class (Tailwind utilities). */
  toneClassName?: string;
};

export type MultiSelectProps = {
  id: string;
  label?: string;
  placeholder?: string;
  options: MultiSelectOption[];
  values: string[];
  onChange: (values: string[]) => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
  errorMessage?: string;
  disabled?: boolean;
  /** Hide selected-pill list above the trigger. Default: false. */
  hidePills?: boolean;
  className?: string;
};

const triggerClass =
  "flex h-12 w-full items-center justify-between gap-2 rounded-xl border border-border/80 bg-background px-4 text-left text-[15px] text-foreground shadow-sm transition-[border-color,box-shadow,background-color] focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-60";

const popupClass =
  "z-50 w-[var(--anchor-width)] overflow-hidden rounded-xl border border-border/80 bg-popover text-popover-foreground shadow-[0_24px_60px_-32px_rgba(15,23,42,0.45)] outline-none";

/**
 * Generic multi-select control with shadcn-style trigger and popover-based
 * checkbox list. Accepts `MultiSelectOption[]` and emits a flat list of
 * selected values. Selection happens through checkbox toggles only -
 * free-text input is not allowed.
 *
 * The component is fully presentational: the parent owns `values` and handles
 * `onChange`. Selected pills are rendered above the trigger through
 * `SelectedPillList`; pass `hidePills` to suppress them.
 */
export default function MultiSelect({
  id,
  label,
  placeholder = "Pilih opsi",
  options,
  values,
  onChange,
  searchPlaceholder = "Cari...",
  emptyMessage = "Tidak ada opsi yang cocok.",
  errorMessage,
  disabled = false,
  hidePills = false,
  className,
}: MultiSelectProps) {
  const [search, setSearch] = useState("");
  const searchId = useId();

  const selectedSet = useMemo(() => new Set(values), [values]);

  const filtered = useMemo(() => {
    const trimmed = search.trim().toLowerCase();
    if (!trimmed) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(trimmed),
    );
  }, [options, search]);

  const grouped = useMemo(() => {
    const groups = new Map<string | undefined, MultiSelectOption[]>();
    for (const option of filtered) {
      const key = option.group;
      const list = groups.get(key) ?? [];
      list.push(option);
      groups.set(key, list);
    }
    return Array.from(groups.entries());
  }, [filtered]);

  const pillItems: SelectedPill[] = useMemo(() => {
    const byValue = new Map(options.map((option) => [option.value, option]));
    return values
      .map((value) => byValue.get(value))
      .filter((option): option is MultiSelectOption => Boolean(option))
      .map((option) => ({
        id: option.value,
        label: option.shortLabel ?? option.label,
        toneClassName: option.toneClassName,
      }));
  }, [options, values]);

  const handleToggle = (value: string) => {
    if (selectedSet.has(value)) {
      onChange(values.filter((entry) => entry !== value));
      return;
    }
    onChange([...values, value]);
  };

  const handleRemovePill = (value: string) => {
    onChange(values.filter((entry) => entry !== value));
  };

  const triggerLabel =
    values.length === 0
      ? placeholder
      : `${values.length} dipilih`;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {!hidePills ? (
        <SelectedPillList
          items={pillItems}
          onRemove={handleRemovePill}
          emptyMessage={null}
        />
      ) : null}

      <Popover.Root>
        <Popover.Trigger
          id={id}
          aria-label={label}
          aria-invalid={errorMessage ? true : undefined}
          aria-describedby={errorMessage ? `${id}-error` : undefined}
          disabled={disabled}
          className={cn(
            triggerClass,
            errorMessage && "border-destructive focus-visible:border-destructive",
          )}
        >
          <span
            className={cn(
              "truncate",
              values.length === 0 && "text-muted-foreground",
            )}
          >
            {triggerLabel}
          </span>
          <ChevronDown
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground"
          />
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Positioner sideOffset={6} className="z-50">
            <Popover.Popup className={popupClass}>
              <div className="border-b border-border/70 p-2">
                <label htmlFor={searchId} className="sr-only">
                  {searchPlaceholder}
                </label>
                <div className="relative">
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    id={searchId}
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={searchPlaceholder}
                    className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none"
                  />
                </div>
              </div>

              <div role="listbox" aria-multiselectable="true" className="max-h-72 overflow-y-auto p-1">
                {filtered.length === 0 ? (
                  <p className="px-2 py-3 text-center text-xs text-muted-foreground">
                    {emptyMessage}
                  </p>
                ) : (
                  grouped.map(([groupName, items]) => (
                    <div key={groupName ?? "__ungrouped"} className="py-1">
                      {groupName ? (
                        <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {groupName}
                        </div>
                      ) : null}
                      <ul className="flex flex-col">
                        {items.map((option) => {
                          const checked = selectedSet.has(option.value);
                          return (
                            <li key={option.value}>
                              <button
                                type="button"
                                role="option"
                                aria-selected={checked}
                                onClick={() => handleToggle(option.value)}
                                className={cn(
                                  "flex w-full items-start gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-secondary/15",
                                  checked && "bg-primary/5 text-primary",
                                )}
                              >
                                <span
                                  className={cn(
                                    "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border",
                                    checked
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-input bg-background",
                                  )}
                                  aria-hidden="true"
                                >
                                  {checked ? <Check className="size-3" /> : null}
                                </span>
                                <span className="flex-1 leading-snug">
                                  {option.label}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))
                )}
              </div>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>

      {errorMessage ? (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
