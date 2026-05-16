import type { ReactNode } from "react";

import { DashboardShell } from "@/components/sdgs-dashboard/dashboard-shell";
import { Toaster } from "@/components/ui/sonner";

export default function SdgsDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardShell>
      {children}
      <Toaster richColors position="top-right" />
    </DashboardShell>
  );
}
