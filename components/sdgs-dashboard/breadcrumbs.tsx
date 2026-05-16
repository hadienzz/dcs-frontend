import Link from "next/link";
import { Fragment } from "react";
import { Home } from "lucide-react";

import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-2 text-sm", className)}
    >
      <Link
        href="/sdgs-dashboard"
        className="text-slate-400 transition-colors hover:text-slate-700"
        aria-label="Dashboard"
      >
        <Home className="size-4" />
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <Fragment key={`${item.label}-${index}`}>
            <span className="text-slate-300" aria-hidden>
              /
            </span>
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-slate-400 transition-colors hover:text-slate-700"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  isLast
                    ? "font-medium text-slate-700"
                    : "text-slate-400",
                )}
              >
                {item.label}
              </span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
