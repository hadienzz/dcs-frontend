"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export type ShellNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /**
   * When true, only an exact pathname match marks the entry as active.
   * Defaults to `true` so root-level entries don't bleed into nested routes.
   */
  exact?: boolean;
};

export type ShellSidebarNavProps = {
  items: ShellNavItem[];
  collapsed?: boolean;
  className?: string;
};

const itemBaseClass =
  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-secondary/15 hover:text-foreground";
const itemCollapsedClass = "justify-center px-0";
const itemActiveClass =
  "bg-primary/10 text-primary border-l-2 border-primary";

const isActive = (pathname: string, item: ShellNavItem) => {
  if (item.exact ?? true) {
    return pathname === item.href;
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
};

/**
 * Sidebar navigation list. Renders nav entries with active highlighting via
 * `usePathname`. The active accent uses the `--primary` token so the dashboard
 * stays aligned with the dcs-redesign palette.
 */
export default function ShellSidebarNav({
  items,
  collapsed = false,
  className,
}: ShellSidebarNavProps) {
  const pathname = usePathname() ?? "";

  return (
    <nav
      aria-label="Navigasi utama"
      className={cn("flex flex-col gap-0.5 px-2", className)}
    >
      {items.map((item) => {
        const active = isActive(pathname, item);
        return (
          <Link
            key={item.href}
            href={item.href}
            title={collapsed ? item.label : undefined}
            aria-current={active ? "page" : undefined}
            className={cn(
              itemBaseClass,
              collapsed && itemCollapsedClass,
              active && itemActiveClass,
            )}
          >
            <item.icon className="size-4 shrink-0" aria-hidden="true" />
            {!collapsed ? <span className="truncate">{item.label}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}
