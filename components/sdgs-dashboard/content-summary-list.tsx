import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
 * - "Numbered" mode mirrors the "popular" panel from the design reference.
 * - Default mode shows the SDG icon stack + visibility badge ("recent" panel).
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
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <Link
          href={viewAllHref}
          className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          Lihat semua
        </Link>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {visible.length === 0 ? (
          <p className="rounded-md border border-dashed border-border/70 bg-muted/10 px-4 py-6 text-center text-sm text-muted-foreground">
            {emptyText}
          </p>
        ) : (
          visible.map((row, index) => (
            <div
              key={row.id}
              className="flex items-center gap-3 rounded-md border border-border/60 bg-card px-3 py-3 transition-colors hover:bg-muted/15"
            >
              {numbered ? (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted/30 text-sm font-semibold text-muted-foreground">
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
                <p className="truncate text-sm font-medium text-foreground">
                  {row.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {row.sdgs.length} SDG · {row.directorates.length} direktorat
                </p>
              </div>
              <Badge
                variant={row.publicVisibility === "yes" ? "default" : "neutral"}
                className="shrink-0"
              >
                {row.publicVisibility === "yes" ? "Publikasi" : "Internal"}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
