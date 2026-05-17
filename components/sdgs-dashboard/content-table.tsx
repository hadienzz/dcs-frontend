import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { directorateById } from "@/lib/sdgs-dashboard-data";
import type { SdgsContent } from "@/types/sdgs-dashboard";

import { EmptyState } from "./empty-state";
import { SdgIcon } from "./sdg-icon";

interface ContentTableProps {
  data: SdgsContent[];
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function summarizeDirectorates(content: SdgsContent) {
  if (content.directorates.length === 0) return "—";
  const first = directorateById.get(content.directorates[0].directorateId)?.name;
  if (!first) return "—";
  if (content.directorates.length === 1) return first;
  return `${first} +${content.directorates.length - 1}`;
}

export function ContentTable({ data }: ContentTableProps) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="Belum ada dokumen"
        description="Dokumen pemeringkatan yang Anda buat akan muncul di sini."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-black/[0.06] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <Table>
        <TableHeader>
          <TableRow className="border-black/[0.04] hover:bg-transparent">
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Dokumen
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              SDGs
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Direktorat
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Status
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Visibilitas
            </TableHead>
            <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
              Diunggah
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              className="border-black/[0.04] transition-colors hover:bg-slate-50/60"
            >
              <TableCell className="max-w-xs">
                <p className="truncate text-sm font-medium text-slate-900">
                  {row.title}
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-400">
                  {row.description}
                </p>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1.5">
                  {row.sdgs.slice(0, 4).map((id) => (
                    <SdgIcon key={id} id={id} size="sm" />
                  ))}
                  {row.sdgs.length > 4 ? (
                    <span className="self-center text-xs text-slate-400">
                      +{row.sdgs.length - 4}
                    </span>
                  ) : null}
                </div>
              </TableCell>
              <TableCell className="text-sm text-slate-500">
                {summarizeDirectorates(row)}
              </TableCell>
              <TableCell>
                <span
                  className={
                    row.isAvailable === "yes"
                      ? "inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100/80"
                      : "inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200/80"
                  }
                >
                  <span
                    className={
                      row.isAvailable === "yes"
                        ? "size-1.5 rounded-full bg-emerald-500"
                        : "size-1.5 rounded-full bg-slate-400"
                    }
                  />
                  {row.isAvailable === "yes" ? "Terverifikasi" : "Draf"}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={
                    row.publicVisibility === "yes"
                      ? "inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-100/80"
                      : "inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-100/80"
                  }
                >
                  {row.publicVisibility === "yes" ? "Publikasi" : "Internal"}
                </span>
              </TableCell>
              <TableCell className="text-right text-sm text-slate-400">
                {dateFormatter.format(new Date(row.createdAt))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
