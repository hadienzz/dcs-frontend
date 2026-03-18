import { Badge } from "@/components/ui/badge";
import { type SdgProjectStatus } from "@/components/sdg-dashboard/dashboard-data";

interface ProjectStatusBadgeProps {
  status: SdgProjectStatus;
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  if (status === "completed") {
    return (
      <Badge variant="success" className="gap-1.5 px-2.5">
        <span
          aria-hidden="true"
          className="size-1.5 rounded-full bg-emerald-600"
        />
        Selesai
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="gap-1.5 border-primary/15 bg-primary/[0.08] px-2.5 text-primary"
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
      Aktif
    </Badge>
  );
}
