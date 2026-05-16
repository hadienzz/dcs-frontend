import type { ReactNode } from "react";

import { DashboardSidebar } from "./dashboard-sidebar";
import { SidebarProvider } from "./sidebar-context";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/15">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
