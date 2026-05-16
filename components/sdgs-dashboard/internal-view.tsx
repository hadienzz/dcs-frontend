"use client";

import { useSdgsContents } from "@/hooks/sdgs-dashboard/use-sdgs-content";

import { ContentTable } from "./content-table";
import { PageHeader } from "./page-header";

export function InternalView() {
  const { internalContents, isLoading } = useSdgsContents();

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Draf Internal" }]}
        title="Draf Internal"
        description="Inisiatif yang masih disiapkan tim internal sebelum dipublikasi."
      />
      {isLoading ? (
        <div className="rounded-lg border border-dashed border-border/70 p-10 text-center text-sm text-muted-foreground">
          Memuat inisiatif…
        </div>
      ) : (
        <ContentTable data={internalContents} />
      )}
    </>
  );
}
