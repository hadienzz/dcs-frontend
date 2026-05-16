import type { ReactNode } from "react";

import { DashboardSidebar } from "./dashboard-sidebar";
import { SidebarProvider } from "./sidebar-context";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#fafafa]">
        <DashboardSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 px-5 py-7 md:px-10 md:py-9">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
