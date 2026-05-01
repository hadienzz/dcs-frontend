import { Download, Eye, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EnrichedDocumentRecord } from "@/types/document-center";
import { formatDocumentDate } from "@/utils/document-center";

interface DocumentTableProps {
  documents: EnrichedDocumentRecord[];
  onView: (document: EnrichedDocumentRecord) => void;
  onDownload: (document: EnrichedDocumentRecord) => void;
  onEdit: (document: EnrichedDocumentRecord) => void;
  onDelete: (document: EnrichedDocumentRecord) => void;
}

export function DocumentTable({
  documents,
  onView,
  onDownload,
  onEdit,
  onDelete,
}: DocumentTableProps) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-border/80 bg-background shadow-[0_16px_30px_-28px_rgba(15,23,42,0.3)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="border-b border-border/70 bg-muted/20 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            <tr>
              <th className="px-5 py-4">Document</th>
              <th className="px-5 py-4">Division</th>
              <th className="px-5 py-4">Subdivision</th>
              <th className="px-5 py-4">PIC</th>
              <th className="px-5 py-4">Uploaded Account</th>
              <th className="px-5 py-4">Upload Date</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {documents.map((document) => (
              <tr key={document.id} className="align-top">
                <td className="px-5 py-4">
                  <p className="font-semibold text-foreground">{document.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{document.fileName}</p>
                </td>
                <td className="px-5 py-4">
                  <Badge>{document.divisionName}</Badge>
                </td>
                <td className="px-5 py-4">
                  <Badge variant="neutral">{document.subdivisionName}</Badge>
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {document.picName}
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {document.uploadedByAccount}
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {formatDocumentDate(document.uploadedAt)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(document)}
                      aria-label={`Lihat ${document.title}`}
                    >
                      <Eye />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onDownload(document)}
                      aria-label={`Download ${document.title}`}
                    >
                      <Download />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(document)}
                      aria-label={`Edit metadata ${document.title}`}
                    >
                      <Pencil />
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
