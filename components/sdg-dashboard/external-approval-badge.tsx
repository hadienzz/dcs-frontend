import { BadgeCheck, Clock3, RefreshCcw, Send } from "lucide-react";

import {
  getExternalApprovalMeta,
  type ExternalApprovalStatus,
} from "@/components/sdg-dashboard/dashboard-data";
import { Badge } from "@/components/ui/badge";

interface ExternalApprovalBadgeProps {
  status: ExternalApprovalStatus;
}

const approvalIcons = {
  not_sent: Send,
  pending: Clock3,
  revision_requested: RefreshCcw,
  approved: BadgeCheck,
} as const;

export function ExternalApprovalBadge({
  status,
}: ExternalApprovalBadgeProps) {
  const meta = getExternalApprovalMeta(status);
  const Icon = approvalIcons[status];

  return (
    <Badge variant={meta.variant}>
      <Icon />
      {meta.label}
    </Badge>
  );
}
