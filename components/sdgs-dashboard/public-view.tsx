"use client";

import { useSdgsContents } from "@/hooks/sdgs-dashboard/use-sdgs-content";

import { ContentTable } from "./content-table";
import { PageHeader } from "./page-header";

export function PublicView() {
  const { publicContents, isLoading } = useSdgsContents();

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Publikasi" }]}
        title="Publikasi"
        description="Inisiatif yang dipublikasi pada website pemeringkatan SDGs."
      />
      {isLoading ? (
        <div className="rounded-xl border border-dashed border-black/[0.08] bg-white p-10 text-center text-sm text-slate-400">
          Memuat inisiatif…
        </div>
      ) : (
        <ContentTable data={publicContents} />
      )}
    </>
  );
}
