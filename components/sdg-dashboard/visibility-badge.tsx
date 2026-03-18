import { Eye, Lock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { VisibilityScope } from "@/components/sdg-dashboard/dashboard-data";

interface VisibilityBadgeProps {
  scope: VisibilityScope;
}

export function VisibilityBadge({ scope }: VisibilityBadgeProps) {
  if (scope === "internal") {
    return (
      <Badge variant="neutral">
        <Lock />
        Internal saja
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="border-primary/15 bg-primary/[0.08] text-primary">
      <Eye />
      Bagikan ke mitra
    </Badge>
  );
}
