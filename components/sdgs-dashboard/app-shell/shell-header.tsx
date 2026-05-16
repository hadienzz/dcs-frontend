"use client";

import type { ReactNode } from "react";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";

export type ShellHeaderProps = {
  title?: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  onMobileMenuClick?: () => void;
  className?: string;
};

/**
 * Sticky page header. Displays an optional title/subtitle pair on the left,
 * an arbitrary `rightSlot`, and a hamburger button on mobile that opens the
 * sidebar drawer through `onMobileMenuClick`.
 */
export default function ShellHeader({
  title,
  subtitle,
  rightSlot,
  onMobileMenuClick,
  className,
}: ShellHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur lg:px-6",
        className,
      )}
    >
      <button
        type="button"
        onClick={onMobileMenuClick}
        className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary/15 hover:text-foreground md:hidden"
        aria-label="Buka menu navigasi"
      >
        <Menu className="size-4" aria-hidden="true" />
      </button>

      <div className="flex min-w-0 flex-1 flex-col">
        {title ? (
          <h1 className="truncate text-base font-semibold text-foreground">
            {title}
          </h1>
        ) : null}
        {subtitle ? (
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>

      {rightSlot ? (
        <div className="ml-auto flex items-center gap-2">{rightSlot}</div>
      ) : null}
    </header>
  );
}
