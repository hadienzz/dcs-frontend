import type { ReactNode } from "react";

import { SdgDashboardProtectedShell } from "@/components/sdg-dashboard/sdg-dashboard-protected-shell";

export default function SdgDashboardInternalLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SdgDashboardProtectedShell
      requiredRole="internal"
      workspaceLabel="Area internal"
    >
      {children}
    </SdgDashboardProtectedShell>
  );
}
