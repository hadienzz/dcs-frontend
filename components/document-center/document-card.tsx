import { Download, Eye, FileText, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { EnrichedDocumentRecord } from "@/types/document-center";
import { formatDocumentDate } from "@/utils/document-center";

interface DocumentCardProps {
  document: EnrichedDocumentRecord;
  onView: (document: EnrichedDocumentRecord) => void;
  onDownload: (document: EnrichedDocumentRecord) => void;
  onEdit: (document: EnrichedDocumentRecord) => void;
  onDelete: (document: EnrichedDocumentRecord) => void;
}

export function DocumentCard({
  document,
  onView,
  onDownload,
  onEdit,
  onDelete,
}: DocumentCardProps) {
  return (
    <Card className="overflow-hidden rounded-[24px] border-border/80 bg-background shadow-[0_16px_30px_-28px_rgba(15,23,42,0.3)]">
      <CardContent className="flex h-full flex-col gap-5 p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-primary/12 bg-primary/[0.08] text-primary">
            <FileText className="size-[18px]" />
          </div>
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-sm font-semibold leading-6 text-foreground">
              {document.title}
            </h3>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {document.fileName}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge>{document.divisionName}</Badge>
          <Badge variant="neutral">{document.subdivisionName}</Badge>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">PIC:</span>{" "}
            {document.picName}
          </p>
          <p>
            <span className="font-medium text-foreground">Uploaded:</span>{" "}
            {document.uploadedByAccount}
          </p>
          <p>{formatDocumentDate(document.uploadedAt)}</p>
        </div>

        <div className="mt-auto flex flex-wrap gap-2 border-t border-border/70 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onView(document)}
            aria-label={`Lihat ${document.title}`}
          >
            <Eye data-icon="inline-start" />
            View
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onDownload(document)}
            aria-label={`Download ${document.title}`}
          >
            <Download data-icon="inline-start" />
            Download
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(document)}
            aria-label={`Edit metadata ${document.title}`}
          >
            <Pencil data-icon="inline-start" />
            Edit
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onDelete(document)}
            aria-label={`Hapus ${document.title}`}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
