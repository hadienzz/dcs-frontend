"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Building2,
  Eye,
  FileText,
  Globe,
  Lock,
  Plus,
  Search,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSdgsContents } from "@/hooks/sdgs-dashboard/use-sdgs-content";
import {
  directorateFields,
  directorateById,
} from "@/lib/sdgs-dashboard-data";

import { ContentTable } from "./content-table";
import { PageHeader } from "./page-header";

type VisibilityFilter = "all" | "public" | "internal";

const filterTabs: {
  key: VisibilityFilter;
  label: string;
  icon: typeof Globe;
}[] = [
  { key: "all", label: "Semua", icon: Eye },
  { key: "public", label: "Publikasi", icon: Globe },
  { key: "internal", label: "Internal", icon: Lock },
];

export function ContentListView() {
  const { all, publicContents, internalContents, isLoading } =
    useSdgsContents();
  const [activeFilter, setActiveFilter] = useState<VisibilityFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDirId, setSelectedDirId] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState("");

  // Available units based on selected directorate
  const availableUnits = useMemo(() => {
    if (!selectedDirId) return [];
    const dir = directorateById.get(selectedDirId);
    return dir?.units ?? [];
  }, [selectedDirId]);

  // Reset unit when directorate changes
  const handleDirChange = (dirId: string) => {
    setSelectedDirId(dirId);
    setSelectedUnitId("");
  };

  const filteredData = useMemo(() => {
    let data =
      activeFilter === "public"
        ? publicContents
        : activeFilter === "internal"
          ? internalContents
          : all;

    // Filter by directorate
    if (selectedDirId) {
      data = data.filter((item) =>
        item.directorates.some((d) => d.directorateId === selectedDirId),
      );
    }

    // Filter by unit
    if (selectedUnitId) {
      data = data.filter((item) =>
        item.directorates.some((d) => d.units.includes(selectedUnitId)),
      );
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      data = data.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q),
      );
    }

    return data;
  }, [
    all,
    publicContents,
    internalContents,
    activeFilter,
    searchQuery,
    selectedDirId,
    selectedUnitId,
  ]);

  const stats = useMemo(
    () => ({
      total: all.length,
      public: publicContents.length,
      internal: internalContents.length,
    }),
    [all, publicContents, internalContents],
  );

  const hasActiveFilters =
    activeFilter !== "all" ||
    searchQuery.trim() !== "" ||
    selectedDirId !== "" ||
    selectedUnitId !== "";

  const resetAll = () => {
    setActiveFilter("all");
    setSearchQuery("");
    setSelectedDirId("");
    setSelectedUnitId("");
  };

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Dokumen Pemeringkatan" }]}
        title="Dokumen Pemeringkatan"
        description="Daftar seluruh dokumen pemeringkatan keberlanjutan yang sudah didokumentasikan."
        actions={
          <Button asChild>
            <Link href="/sdgs-dashboard/content/new">
              <Plus className="h-4 w-4" />
              Dokumen baru
            </Link>
          </Button>
        }
      />

      {/* Stats summary */}
      {!isLoading && (
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatMini
            icon={FileText}
            label="Total Dokumen"
            value={stats.total}
            iconClass="text-slate-600 bg-slate-50 ring-slate-200/60"
          />
          <StatMini
            icon={Globe}
            label="Publikasi"
            value={stats.public}
            iconClass="text-blue-600 bg-blue-50 ring-blue-100/60"
          />
          <StatMini
            icon={Lock}
            label="Internal"
            value={stats.internal}
            iconClass="text-amber-600 bg-amber-50 ring-amber-100/60"
          />
        </div>
      )}

      {/* Filter bar row 1: visibility + search */}
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Visibility tabs */}
        <div className="flex items-center gap-0.5 rounded-lg border border-black/[0.06] bg-[#f5f5f5] p-1">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveFilter(tab.key)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-all",
                  isActive
                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-black/[0.06]"
                    : "text-slate-500 hover:text-slate-700",
                )}
              >
                <Icon className="size-3.5" />
                {tab.label}
                <span
                  className={cn(
                    "ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none",
                    isActive
                      ? "bg-[#b6252a]/[0.08] text-[#b6252a]"
                      : "bg-slate-200/60 text-slate-500",
                  )}
                >
                  {tab.key === "all"
                    ? stats.total
                    : tab.key === "public"
                      ? stats.public
                      : stats.internal}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            placeholder="Cari dokumen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-black/[0.06] bg-white pl-9 text-sm placeholder:text-slate-400 focus-visible:ring-[#b6252a]/20"
          />
        </div>
      </div>

      {/* Filter bar row 2: directorate & unit */}
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Building2 className="size-4 shrink-0 text-slate-400" />
          <select
            value={selectedDirId}
            onChange={(e) => handleDirChange(e.target.value)}
            className="rounded-lg border border-black/[0.06] bg-white px-3 py-1.5 text-[13px] text-slate-700 outline-none transition focus:border-[#b6252a]/30 focus:ring-2 focus:ring-[#b6252a]/10"
          >
            <option value="">Semua Direktorat</option>
            {directorateFields.map((field) => (
              <optgroup key={field.id} label={field.name}>
                {field.directorates.map((dir) => (
                  <option key={dir.id} value={dir.id}>
                    {dir.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {selectedDirId && availableUnits.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-slate-300">/</span>
            <select
              value={selectedUnitId}
              onChange={(e) => setSelectedUnitId(e.target.value)}
              className="rounded-lg border border-black/[0.06] bg-white px-3 py-1.5 text-[13px] text-slate-700 outline-none transition focus:border-[#b6252a]/30 focus:ring-2 focus:ring-[#b6252a]/10"
            >
              <option value="">Semua Unit</option>
              {availableUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedDirId && (
          <button
            type="button"
            onClick={() => {
              setSelectedDirId("");
              setSelectedUnitId("");
            }}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="size-3" />
            Reset
          </button>
        )}
      </div>

      {/* Active filter indicator */}
      {hasActiveFilters && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {activeFilter !== "all" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-black/[0.04]">
              {activeFilter === "public" ? (
                <Globe className="size-3" />
              ) : (
                <Lock className="size-3" />
              )}
              {activeFilter === "public" ? "Publikasi" : "Internal"}
            </span>
          )}
          {selectedDirId && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 ring-1 ring-blue-100/80">
              <Building2 className="size-3" />
              {directorateById.get(selectedDirId)?.name ?? "Direktorat"}
            </span>
          )}
          {selectedUnitId && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-100/80">
              {availableUnits.find((u) => u.id === selectedUnitId)?.name ??
                "Unit"}
            </span>
          )}
          {searchQuery.trim() && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-black/[0.04]">
              <Search className="size-3" />
              &ldquo;{searchQuery.trim()}&rdquo;
            </span>
          )}
          <button
            type="button"
            onClick={resetAll}
            className="text-xs text-slate-400 underline-offset-2 hover:text-slate-700 hover:underline"
          >
            Reset semua
          </button>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="rounded-xl border border-dashed border-black/[0.08] bg-white p-10 text-center text-sm text-slate-400">
          Memuat dokumen…
        </div>
      ) : filteredData.length === 0 ? (
        <div className="rounded-xl border border-dashed border-black/[0.08] bg-white p-10 text-center">
          <FileText className="mx-auto mb-3 size-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-700">
            Tidak ada dokumen ditemukan
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {searchQuery.trim()
              ? `Tidak ada hasil untuk "${searchQuery.trim()}"`
              : "Belum ada dokumen dengan filter ini."}
          </p>
        </div>
      ) : (
        <ContentTable data={filteredData} />
      )}
    </>
  );
}

function StatMini({
  icon: Icon,
  label,
  value,
  iconClass,
}: {
  icon: typeof FileText;
  label: string;
  value: number;
  iconClass: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-white px-4 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div
        className={cn(
          "flex size-9 items-center justify-center rounded-lg ring-1",
          iconClass,
        )}
      >
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-xl font-semibold tracking-tight text-slate-900">
          {value}
        </p>
        <p className="text-xs text-slate-400">{label}</p>
      </div>
    </div>
  );
}
