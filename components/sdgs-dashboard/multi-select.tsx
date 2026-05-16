"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  emptyText?: string;
  id?: string;
}

/**
 * Lightweight multi-select. Renders a trigger button with a search/list popout
 * and the selected items as removable chips. Built without Radix Popover so it
 * works in dcs-redesign's component set without new deps.
 */
export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Pilih item…",
  emptyText = "Tidak ada hasil",
  id,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const reactId = useId();
  const triggerId = id ?? reactId;

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const selected = options.filter((o) => value.includes(o.value));

  const filtered = query
    ? options.filter((o) =>
        o.label.toLowerCase().includes(query.toLowerCase()),
      )
    : options;

  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);

  return (
    <div className="space-y-2" ref={containerRef}>
      <div className="relative">
        <Button
          id={triggerId}
          type="button"
          variant="outline"
          className="w-full h-12 justify-between font-normal"
          onClick={() => setOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className={cn(selected.length === 0 && "text-muted-foreground")}>
            {selected.length ? `${selected.length} dipilih` : placeholder}
          </span>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>

        {open ? (
          <div
            className="absolute z-30 mt-2 w-full rounded-xl border border-border/80 bg-popover text-popover-foreground shadow-[0_24px_60px_-32px_rgba(15,23,42,0.45)]"
            role="listbox"
          >
            <div className="p-2 border-b border-border/60">
              <Input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari…"
                className="h-9"
              />
            </div>
            <ul className="max-h-64 overflow-auto p-1">
              {filtered.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                  {emptyText}
                </li>
              ) : (
                filtered.map((opt) => {
                  const checked = value.includes(opt.value);
                  return (
                    <li key={opt.value}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={checked}
                        onClick={() => toggle(opt.value)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                          checked
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted/40",
                        )}
                      >
                        <Check
                          className={cn(
                            "h-4 w-4",
                            checked ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {opt.label}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        ) : null}
      </div>

      {selected.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((s) => (
            <Badge key={s.value} variant="neutral" className="gap-1 pr-1">
              {s.label}
              <button
                type="button"
                onClick={() => toggle(s.value)}
                className="rounded p-0.5 hover:bg-muted-foreground/15"
                aria-label={`Hapus ${s.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  );
}
