import { Badge } from "@/components/ui/badge";
import type { EnrichedActivityLogEntry } from "@/types/document-center";
import { formatDocumentDate } from "@/utils/document-center";

interface ActivityLogTableProps {
  activityLogs: EnrichedActivityLogEntry[];
}

export function ActivityLogTable({ activityLogs }: ActivityLogTableProps) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-border/80 bg-background shadow-[0_16px_30px_-28px_rgba(15,23,42,0.3)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b border-border/70 bg-muted/20 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            <tr>
              <th className="px-5 py-4">Action</th>
              <th className="px-5 py-4">Document</th>
              <th className="px-5 py-4">Division</th>
              <th className="px-5 py-4">Subdivision</th>
              <th className="px-5 py-4">PIC/Inputted By</th>
              <th className="px-5 py-4">Account</th>
              <th className="px-5 py-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {activityLogs.map((log) => (
              <tr key={log.id}>
                <td className="px-5 py-4">
                  <Badge variant="outline">{log.actionLabel}</Badge>
                </td>
                <td className="px-5 py-4 font-medium text-foreground">
                  {log.documentTitle ?? "-"}
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {log.divisionName}
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {log.subdivisionName}
                </td>
                <td className="px-5 py-4 text-muted-foreground">{log.picName}</td>
                <td className="px-5 py-4 text-muted-foreground">{log.account}</td>
                <td className="px-5 py-4 text-muted-foreground">
                  {formatDocumentDate(log.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
