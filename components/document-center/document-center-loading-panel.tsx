import { Loader2 } from "lucide-react";

import { SectionCard } from "@/components/document-center/section-card";
import { Skeleton } from "@/components/ui/skeleton";

interface DocumentCenterLoadingPanelProps {
  variant: "overview" | "center" | "form" | "management";
}

export function DocumentCenterLoadingPanel({
  variant,
}: DocumentCenterLoadingPanelProps) {
  const skeletonCards = variant === "form" ? 4 : variant === "management" ? 3 : 6;

  return (
    <SectionCard
      eyebrow="Loading"
      title="Preparing document workspace"
      description="Fetching the latest document center data."
      action={
        <div className="flex items-center gap-2 rounded-xl border border-border/80 bg-background px-3 py-2 text-xs font-medium text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          Syncing
        </div>
      }
    >
      <div className="space-y-5" aria-busy="true" aria-live="polite">
        {variant !== "management" ? (
          <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <Skeleton className="h-11 rounded-xl" />
            <Skeleton className="h-11 rounded-xl" />
            <Skeleton className="h-11 rounded-xl" />
          </div>
        ) : null}

        <div
          className={
            variant === "form"
              ? "grid gap-5 lg:grid-cols-2"
              : "grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          }
        >
          {Array.from({ length: skeletonCards }).map((_, index) => (
            <div
              key={index}
              className="rounded-[24px] border border-border/70 bg-background p-5"
            >
              <div className="flex gap-3">
                <Skeleton className="size-11 rounded-[14px]" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <div className="mt-5 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-2/3" />
              </div>
              <div className="mt-5 flex gap-2">
                <Skeleton className="h-9 w-24 rounded-md" />
                <Skeleton className="h-9 w-20 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
