import type { ReactNode } from "react";

import { SdgDashboardProtectedShell } from "@/components/sdg-dashboard/sdg-dashboard-protected-shell";

export default function SdgDashboardExternalLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SdgDashboardProtectedShell
      requiredRole="external"
      workspaceLabel="Portal eksternal"
    >
      {children}
    </SdgDashboardProtectedShell>
  );
}
