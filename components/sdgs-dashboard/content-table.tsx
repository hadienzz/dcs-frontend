import { Badge } from "@/components/ui/badge";
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
        title="Belum ada inisiatif"
        description="Inisiatif yang Anda buat akan muncul di sini."
      />
    );
  }

  return (
    <div className="rounded-lg border border-border/70 bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Inisiatif</TableHead>
            <TableHead>SDGs</TableHead>
            <TableHead>Direktorat</TableHead>
            <TableHead>Status Bukti</TableHead>
            <TableHead>Visibilitas</TableHead>
            <TableHead className="text-right">Diunggah</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="max-w-xs">
                <p className="truncate font-medium text-foreground">
                  {row.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {row.description}
                </p>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1.5">
                  {row.sdgs.slice(0, 4).map((id) => (
                    <SdgIcon key={id} id={id} size="sm" />
                  ))}
                  {row.sdgs.length > 4 ? (
                    <span className="text-xs text-muted-foreground self-center">
                      +{row.sdgs.length - 4}
                    </span>
                  ) : null}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {summarizeDirectorates(row)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={row.isAvailable === "yes" ? "success" : "neutral"}
                >
                  {row.isAvailable === "yes" ? "Terverifikasi" : "Draf"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={row.publicVisibility === "yes" ? "default" : "outline"}
                >
                  {row.publicVisibility === "yes" ? "Publikasi" : "Internal"}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {dateFormatter.format(new Date(row.createdAt))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
