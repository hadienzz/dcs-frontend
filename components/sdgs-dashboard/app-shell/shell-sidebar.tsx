"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

import ShellSidebarNav, { type ShellNavItem } from "./shell-sidebar-nav";

export type ShellSidebarProps = {
  items: ShellNavItem[];
  collapsed: boolean;
  onToggle: () => void;
  brandHref?: string;
  className?: string;
};

const sidebarBaseClass =
  "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300 md:flex";

/**
 * Desktop sidebar. Holds the brand block, the primary navigation list, and a
 * footer slot reserved for the collapse toggle. State is owned by the parent
 * shell so the sidebar can stay presentational.
 */
export default function ShellSidebar({
  items,
  collapsed,
  onToggle,
  brandHref = "/sdgs-dashboard",
  className,
}: ShellSidebarProps) {
  return (
    <aside
      data-sidebar
      data-collapsed={collapsed ? "true" : "false"}
      className={cn(sidebarBaseClass, collapsed ? "w-16" : "w-64", className)}
    >
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-3">
        <Link
          href={brandHref}
          className={cn(
            "flex items-center gap-2 text-foreground",
            collapsed && "justify-center",
          )}
        >
          <Image
            src="/dcslogo.png"
            alt="SDGs Dashboard"
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 rounded-md object-contain"
          />
          {!collapsed ? (
            <span className="font-display text-base font-bold whitespace-nowrap">
              SDGs Dashboard
            </span>
          ) : null}
        </Link>
        {!collapsed ? (
          <button
            type="button"
            onClick={onToggle}
            aria-label="Sembunyikan sidebar"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary/15 hover:text-foreground"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col">
        <ShellSidebarNav
          items={items}
          collapsed={collapsed}
          className="mt-3"
        />
      </div>

      <div className="border-t border-sidebar-border p-3">
        {collapsed ? (
          <button
            type="button"
            onClick={onToggle}
            aria-label="Tampilkan sidebar"
            className="mx-auto flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary/15 hover:text-foreground"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        ) : (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>SDGs Telkom University</span>
          </div>
        )}
      </div>
    </aside>
  );
}
