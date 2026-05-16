"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight, LogOut, Target } from "lucide-react";

import { cn } from "@/lib/utils";
import { dashboardNav } from "@/hooks/sdgs-dashboard/use-dashboard-nav";

import { useSidebar } from "./sidebar-context";
import Image from "next/image";

export function DashboardSidebar() {
  const pathname = usePathname() ?? "";
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "hidden md:flex sticky top-0 h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200",
        collapsed ? "w-16" : "w-64",
      )}
      aria-label="Dashboard navigation"
    >
      {/* Brand */}
      <div
        className={cn(
          "flex h-16 items-center gap-2 border-b border-sidebar-border",
          collapsed ? "justify-center px-2" : "px-5",
        )}
      >
        <Image
          src={"/dcslogo.png"}
          width={32}
          height={32}
          alt="SDGs Telkom University"
        />
        {!collapsed ? (
          <div>
            <p className="truncate text-base font-semibold text-sidebar-foreground">
              <span className="text-primary">SDGs</span>
            </p>
            <p className="text-stone-700 text-sm">Telkom University</p>
          </div>
        ) : null}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {dashboardNav.map((item) => {
          const active =
            item.to === "/sdgs-dashboard"
              ? pathname === item.to
              : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              href={item.to}
              title={collapsed ? item.label : undefined}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-md text-sm transition-colors",
                collapsed ? "h-10 w-10 justify-center mx-auto" : "px-3 py-2.5",
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent/10 hover:text-sidebar-foreground",
              )}
            >
              {active && !collapsed ? (
                <span
                  aria-hidden
                  className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                />
              ) : null}
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed ? (
                <span className="truncate">{item.label}</span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-sidebar-border px-2 py-2">
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className={cn(
            "flex w-full items-center gap-2 rounded-md text-xs text-muted-foreground transition-colors hover:bg-sidebar-accent/10 hover:text-sidebar-foreground",
            collapsed ? "h-10 justify-center" : "px-3 py-2",
          )}
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronsLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* User profile */}
      <div
        className={cn(
          "flex items-center gap-3 border-t border-sidebar-border bg-sidebar-accent/5",
          collapsed ? "justify-center px-2 py-3" : "px-4 py-3",
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-background text-xs font-semibold">
          AD
        </div>
        {!collapsed ? (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                Admin SDGs
              </p>
              <p className="truncate text-xs text-muted-foreground">
                admin@telkomuniversity.ac.id
              </p>
            </div>
            <button
              type="button"
              aria-label="Logout"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-sidebar-accent/10 hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </>
        ) : null}
      </div>
    </aside>
  );
}
