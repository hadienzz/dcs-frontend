"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight, LogOut } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { dashboardNav } from "@/hooks/sdgs-dashboard/use-dashboard-nav";

import { useSidebar } from "./sidebar-context";

export function DashboardSidebar() {
  const pathname = usePathname() ?? "";
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "hidden md:flex sticky top-0 h-screen shrink-0 flex-col border-r border-black/[0.06] bg-white transition-[width] duration-200",
        collapsed ? "w-[4.5rem]" : "w-[16.5rem]",
      )}
      aria-label="Dashboard navigation"
    >
      {/* Brand */}
      <div
        className={cn(
          "flex h-16 items-center gap-2.5 border-b border-black/[0.06]",
          collapsed ? "justify-center px-2" : "px-5",
        )}
      >
        <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/[0.06]">
          <Image
            src="/dcslogo.png"
            width={32}
            height={32}
            alt="SDGs Telkom University"
            className="h-full w-full object-contain"
          />
        </div>
        {!collapsed ? (
          <div>
            <p className="truncate text-[15px] font-semibold text-slate-900">
              <span className="text-[#b6252a]">SDGs</span>
            </p>
            <p className="text-xs text-slate-500">Telkom University</p>
          </div>
        ) : null}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-0.5">
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
                "group relative flex items-center gap-3 rounded-lg text-[13.5px] font-medium transition-colors",
                collapsed ? "h-10 w-10 justify-center mx-auto" : "px-3 py-2.5",
                active
                  ? "bg-[#b6252a]/[0.06] text-[#b6252a]"
                  : "text-slate-500 hover:bg-slate-900/[0.03] hover:text-slate-900",
              )}
            >
              {active && !collapsed ? (
                <span
                  aria-hidden
                  className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#b6252a]"
                />
              ) : null}
              <Icon className="size-[18px] shrink-0" />
              {!collapsed ? (
                <span className="truncate">{item.label}</span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-black/[0.06] px-3 py-2.5">
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg text-xs text-slate-400 transition-colors hover:bg-slate-900/[0.03] hover:text-slate-600",
            collapsed ? "h-10 justify-center" : "px-3 py-2",
          )}
        >
          {collapsed ? (
            <ChevronsRight className="size-4" />
          ) : (
            <>
              <ChevronsLeft className="size-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* User profile */}
      <div
        className={cn(
          "flex items-center gap-3 border-t border-black/[0.06]",
          collapsed ? "justify-center px-2 py-3" : "px-4 py-3.5",
        )}
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white">
          AD
        </div>
        {!collapsed ? (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">
                Admin SDGs
              </p>
              <p className="truncate text-xs text-slate-400">
                admin@telkomuniversity.ac.id
              </p>
            </div>
            <button
              type="button"
              aria-label="Logout"
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-900/[0.04] hover:text-slate-600"
            >
              <LogOut className="size-4" />
            </button>
          </>
        ) : null}
      </div>
    </aside>
  );
}
