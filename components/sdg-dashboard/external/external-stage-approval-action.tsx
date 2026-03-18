import type { PartnerStageApprovalStatus } from "@/components/sdg-dashboard/dashboard-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ExternalStageApprovalActionProps {
  status: PartnerStageApprovalStatus;
  buttonLabel: string;
  pendingLabel: string;
  approvedLabel: string;
  helperText?: string;
  disabled?: boolean;
  onApprove: () => void;
}

export function ExternalStageApprovalAction({
  status,
  buttonLabel,
  pendingLabel,
  approvedLabel,
  helperText,
  disabled = false,
  onApprove,
}: ExternalStageApprovalActionProps) {
  const isApproved = status === "approved";

  return (
    <div className="flex flex-col items-stretch gap-2 sm:min-w-[220px] sm:items-end">
      <Badge
        variant={isApproved ? "success" : "warning"}
        className="justify-center sm:justify-start"
      >
        {isApproved ? approvedLabel : pendingLabel}
      </Badge>
      <Button
        type="button"
        size="sm"
        variant={isApproved ? "outline" : "default"}
        disabled={disabled || isApproved}
        onClick={onApprove}
      >
        {isApproved ? "Tahap disetujui" : buttonLabel}
      </Button>
      {!isApproved && helperText ? (
        <p className="max-w-[240px] text-xs leading-5 text-muted-foreground sm:text-right">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
