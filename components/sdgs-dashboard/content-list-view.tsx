"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSdgsContents } from "@/hooks/sdgs-dashboard/use-sdgs-content";

import { ContentTable } from "./content-table";
import { PageHeader } from "./page-header";

export function ContentListView() {
  const { all, isLoading } = useSdgsContents();

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Inisiatif SDGs" }]}
        title="Inisiatif SDGs"
        description="Daftar seluruh inisiatif keberlanjutan yang sudah didokumentasikan."
        actions={
          <Button asChild>
            <Link href="/sdgs-dashboard/content/new">
              <Plus className="h-4 w-4" />
              Inisiatif baru
            </Link>
          </Button>
        }
      />
      {isLoading ? (
        <div className="rounded-lg border border-dashed border-border/70 p-10 text-center text-sm text-muted-foreground">
          Memuat inisiatif…
        </div>
      ) : (
        <ContentTable data={all} />
      )}
    </>
  );
}
