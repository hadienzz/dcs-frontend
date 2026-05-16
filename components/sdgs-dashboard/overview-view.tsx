"use client";

import Link from "next/link";
import { FileText, Globe2, Layers, Lock, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSdgsContents } from "@/hooks/sdgs-dashboard/use-sdgs-content";

import { ContentSummaryList } from "./content-summary-list";
import { PageHeader } from "./page-header";
import { StatCard } from "./stat-card";

export function OverviewView() {
  const { all, publicContents, internalContents, isLoading } = useSdgsContents();

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Dashboard" }]}
        title="Selamat datang di Dashboard SDGs"
        description="Pantau dan kelola inisiatif keberlanjutan Telkom University untuk pemeringkatan SDGs."
        actions={
          <Button asChild>
            <Link href="/sdgs-dashboard/content/new">
              <Plus className="h-4 w-4" />
              Inisiatif baru
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          tone="blue"
          icon={Layers}
          label="Total Inisiatif"
          value={all.length}
          hint={`${publicContents.length} dipublikasi · ${internalContents.length} draf`}
        />
        <StatCard
          tone="emerald"
          icon={Globe2}
          label="Dipublikasi"
          value={publicContents.length}
          hint="Tampil di website pemeringkatan SDGs"
        />
        <StatCard
          tone="amber"
          icon={Lock}
          label="Draf Internal"
          value={internalContents.length}
          hint="Belum dipublikasi ke publik"
        />
        <StatCard
          tone="violet"
          icon={FileText}
          label="SDGs Dipantau"
          value={17}
          hint="Sustainable Development Goals"
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <ContentSummaryList
          title="Inisiatif Terbaru"
          emptyText={
            isLoading
              ? "Memuat inisiatif…"
              : "Belum ada inisiatif. Mulai dengan menambah inisiatif baru."
          }
          items={all}
          viewAllHref="/sdgs-dashboard/content"
        />
        <ContentSummaryList
          title="Inisiatif Dipublikasi"
          emptyText={
            isLoading
              ? "Memuat inisiatif…"
              : "Belum ada inisiatif yang dipublikasi."
          }
          items={publicContents}
          viewAllHref="/sdgs-dashboard/public"
          numbered
        />
      </div>
    </>
  );
}
