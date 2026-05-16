import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { SdgsContent } from "@/types/sdgs-dashboard";

import { SdgIcon } from "./sdg-icon";

interface ContentSummaryListProps {
  title: string;
  emptyText: string;
  items: SdgsContent[];
  viewAllHref: string;
  numbered?: boolean;
  /** Limit number of rendered items. Defaults to 4. */
  limit?: number;
}

/**
 * Compact list card used on the dashboard overview.
 */
export function ContentSummaryList({
  title,
  emptyText,
  items,
  viewAllHref,
  numbered = false,
  limit = 4,
}: ContentSummaryListProps) {
  const visible = items.slice(0, limit);

  return (
    <div className="rounded-xl border border-black/[0.06] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between border-b border-black/[0.04] px-5 py-4">
        <h3 className="text-[15px] font-semibold text-slate-900">{title}</h3>
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1 text-[13px] font-medium text-[#b6252a] transition-colors hover:text-[#8f1a20]"
        >
          Lihat semua
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
      <div className="space-y-1 p-3">
        {visible.length === 0 ? (
          <p className="rounded-lg border border-dashed border-black/[0.06] px-4 py-8 text-center text-sm text-slate-400">
            {emptyText}
          </p>
        ) : (
          visible.map((row, index) => (
            <div
              key={row.id}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-50"
            >
              {numbered ? (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-500">
                  {index + 1}
                </div>
              ) : (
                <div className="flex shrink-0 -space-x-1">
                  {row.sdgs.slice(0, 3).map((id) => (
                    <SdgIcon key={id} id={id} size="sm" />
                  ))}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">
                  {row.title}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {row.sdgs.length} SDG · {row.directorates.length} direktorat
                </p>
              </div>
              <span
                className={
                  row.publicVisibility === "yes"
                    ? "shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600 ring-1 ring-blue-100/80"
                    : "shrink-0 rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-200/80"
                }
              >
                {row.publicVisibility === "yes" ? "Publikasi" : "Internal"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
