"use client";

import Image from "next/image";
import Link from "next/link";
import { Dialog } from "@base-ui/react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

import ShellSidebarNav, { type ShellNavItem } from "./shell-sidebar-nav";

export type ShellMobileDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: ShellNavItem[];
  brandHref?: string;
  className?: string;
};

const backdropClass =
  "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 transition-opacity";

const popupClass =
  "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sidebar-border bg-sidebar shadow-xl outline-none transition-transform data-[ending-style]:-translate-x-full data-[starting-style]:-translate-x-full";

/**
 * Mobile sidebar replacement. Reuses `ShellSidebarNav` so the navigation is
 * defined once and rendered identically across desktop and mobile.
 *
 * Closes on backdrop click (Base UI Dialog default), Escape, or any internal
 * navigation Link tap.
 */
export default function ShellMobileDrawer({
  open,
  onOpenChange,
  items,
  brandHref = "/sdgs-dashboard",
  className,
}: ShellMobileDrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className={backdropClass} />
        <Dialog.Popup
          className={cn(popupClass, className)}
          aria-label="Navigasi utama"
        >
          <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-3">
            <Link
              href={brandHref}
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-2 text-foreground"
            >
              <Image
                src="/dcslogo.png"
                alt="SDGs Dashboard"
                width={32}
                height={32}
                className="h-8 w-8 shrink-0 rounded-md object-contain"
              />
              <span className="font-display text-base font-bold">
                SDGs Dashboard
              </span>
            </Link>
            <Dialog.Close
              aria-label="Tutup menu"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary/15 hover:text-foreground"
            >
              <X className="size-4" aria-hidden="true" />
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto py-3">
            <div onClick={() => onOpenChange(false)}>
              <ShellSidebarNav items={items} />
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
