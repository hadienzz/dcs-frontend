import { ChevronLeft, ChevronRight, FileText } from "lucide-react";

import { DocumentCard } from "@/components/document-center/document-card";
import { EmptyState } from "@/components/document-center/empty-state";
import { SectionCard } from "@/components/document-center/section-card";
import { Button } from "@/components/ui/button";
import {
  RECENT_RANGE_OPTIONS,
  RECENT_SORT_OPTIONS,
} from "@/hooks/document-center/document-center-options";
import type {
  EnrichedDocumentRecord,
  RecentDocumentRange,
  RecentDocumentsPagination,
  RecentDocumentSort,
} from "@/types/document-center";

interface OverviewPanelProps {
  recentDocuments: EnrichedDocumentRecord[];
  recentPagination: RecentDocumentsPagination;
  recentRange: RecentDocumentRange;
  recentSort: RecentDocumentSort;
  recentRangeLabel: string;
  firstItem: number;
  lastItem: number;
  onRecentRangeChange: (range: RecentDocumentRange) => void;
  onRecentSortChange: (sort: RecentDocumentSort) => void;
  onRecentPageChange: (page: number) => void;
  documentActions: {
    onView: (document: EnrichedDocumentRecord) => void;
    onDownload: (document: EnrichedDocumentRecord) => void;
    onEdit: (document: EnrichedDocumentRecord) => void;
    onDelete: (document: EnrichedDocumentRecord) => void;
  };
}

export function OverviewPanel({
  recentDocuments,
  recentPagination,
  recentRange,
  recentSort,
  recentRangeLabel,
  firstItem,
  lastItem,
  onRecentRangeChange,
  onRecentSortChange,
  onRecentPageChange,
  documentActions,
}: OverviewPanelProps) {
  return (
    <SectionCard
      eyebrow="Overview"
      title="Recently Uploaded Documents"
      description="Newest document uploads, sortable by upload window."
      action={
        <div className="grid gap-2 sm:grid-cols-[180px_180px]">
          <select
            value={recentRange}
            onChange={(event) =>
              onRecentRangeChange(event.target.value as RecentDocumentRange)
            }
            className="flex h-10 w-full rounded-xl border border-border/80 bg-background px-3 text-sm text-foreground shadow-sm transition-[border-color,box-shadow,background-color] focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/15"
            aria-label="Filter recent uploads by date range"
          >
            {RECENT_RANGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={recentSort}
            onChange={(event) =>
              onRecentSortChange(event.target.value as RecentDocumentSort)
            }
            className="flex h-10 w-full rounded-xl border border-border/80 bg-background px-3 text-sm text-foreground shadow-sm transition-[border-color,box-shadow,background-color] focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/15"
            aria-label="Sort recent uploads"
          >
            {RECENT_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-col gap-2 rounded-[20px] border border-border/70 bg-muted/[0.08] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {recentPagination.totalItems} upload
              {recentPagination.totalItems === 1 ? "" : "s"}
            </p>
            <p className="text-xs text-muted-foreground">
              {recentRangeLabel} - page {recentPagination.page} of{" "}
              {recentPagination.totalPages}
            </p>
          </div>
          <p className="text-xs font-medium text-muted-foreground">
            Showing {firstItem}-{lastItem}
          </p>
        </div>

        {recentDocuments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recentDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                {...documentActions}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<FileText />}
            title="No documents yet"
            description="Uploaded documents will appear here."
          />
        )}

        <div className="flex flex-col gap-3 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {recentPagination.totalItems > 0
              ? `${firstItem}-${lastItem} of ${recentPagination.totalItems} documents`
              : "No documents in this range"}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onRecentPageChange(recentPagination.page - 1)}
              disabled={recentPagination.page <= 1}
            >
              <ChevronLeft data-icon="inline-start" />
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onRecentPageChange(recentPagination.page + 1)}
              disabled={recentPagination.page >= recentPagination.totalPages}
            >
              Next
              <ChevronRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
