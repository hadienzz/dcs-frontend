"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

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
        <button
          id={triggerId}
          type="button"
          className="flex h-10 w-full items-center justify-between rounded-lg border border-black/[0.08] bg-white px-3 text-sm transition-colors hover:border-black/[0.12] focus:border-[#b6252a]/30 focus:outline-none focus:ring-2 focus:ring-[#b6252a]/10"
          onClick={() => setOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span
            className={cn(
              selected.length === 0 ? "text-slate-400" : "text-slate-800",
            )}
          >
            {selected.length ? `${selected.length} dipilih` : placeholder}
          </span>
          <ChevronsUpDown className="size-4 text-slate-400" />
        </button>

        {open ? (
          <div
            className="absolute z-30 mt-2 w-full rounded-xl border border-black/[0.06] bg-white shadow-[0_24px_60px_-32px_rgba(15,23,42,0.3)]"
            role="listbox"
          >
            <div className="border-b border-black/[0.04] p-2">
              <Input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari…"
                className="h-9 border-black/[0.08] text-sm placeholder:text-slate-400"
              />
            </div>
            <ul className="max-h-64 overflow-auto p-1">
              {filtered.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-slate-400">
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
                            ? "bg-[#b6252a]/[0.06] text-[#b6252a] font-medium"
                            : "text-slate-700 hover:bg-slate-50",
                        )}
                      >
                        <Check
                          className={cn(
                            "size-4",
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
            <span
              key={s.value}
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 py-1 pl-2.5 pr-1.5 text-[11px] font-medium text-slate-700 ring-1 ring-black/[0.04]"
            >
              {s.label}
              <button
                type="button"
                onClick={() => toggle(s.value)}
                className="rounded-full p-0.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
                aria-label={`Hapus ${s.label}`}
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
