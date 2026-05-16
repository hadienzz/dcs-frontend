"use client";

import { useState, type ReactNode } from "react";
import { LayoutDashboard, ClipboardList } from "lucide-react";

import ShellHeader from "./shell-header";
import ShellMobileDrawer from "./shell-mobile-drawer";
import ShellSidebar from "./shell-sidebar";
import type { ShellNavItem } from "./shell-sidebar-nav";

export type SdgsDashboardShellProps = {
  title?: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  children: ReactNode;
};

const NAV_ITEMS: ShellNavItem[] = [
  { href: "/sdgs-dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/sdgs-dashboard", label: "Content", icon: ClipboardList, exact: true },
];

/**
 * App Shell composition for the SDGs Dashboard.
 *
 * - Owns the desktop `collapsed` state and the mobile drawer `open` state.
 * - Composes `ShellSidebar`, `ShellHeader`, and `ShellMobileDrawer` around
 *   the page-supplied `children`.
 * - Intentionally omits the AI Assistant column from `dock.it-frontend` -
 *   the SDGs dashboard does not use it.
 */
export default function SdgsDashboardShell({
  title,
  subtitle,
  rightSlot,
  children,
}: SdgsDashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex w-full">
        <ShellSidebar
          items={NAV_ITEMS}
          collapsed={collapsed}
          onToggle={() => setCollapsed((prev) => !prev)}
        />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <ShellHeader
            title={title}
            subtitle={subtitle}
            rightSlot={rightSlot}
            onMobileMenuClick={() => setMobileOpen(true)}
          />

          <main className="min-w-0 flex-1 px-4 py-6 lg:px-8">{children}</main>
        </div>
      </div>

      <ShellMobileDrawer
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        items={NAV_ITEMS}
      />
    </div>
  );
}
