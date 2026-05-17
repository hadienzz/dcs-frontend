"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Edit2,
  Hash,
  Plus,
  Target,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { sdgs as initialSdgs } from "@/lib/sdgs-dashboard-data";
import type { Sdg, SdgIndicator } from "@/types/sdgs-dashboard";

import { PageHeader } from "./page-header";

function uid() {
  return `ind-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

type ModalMode =
  | { type: "edit-sdg"; sdg: Sdg }
  | { type: "add-indicator"; sdgId: string }
  | { type: "edit-indicator"; sdgId: string; indicator: SdgIndicator }
  | null;

export function SdgsManagementView() {
  const [sdgsList, setSdgsList] = useState<Sdg[]>(initialSdgs);
  const [modal, setModal] = useState<ModalMode>(null);
  const [expandedSdg, setExpandedSdg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // --- Stats ---
  const stats = useMemo(() => {
    const totalIndicators = sdgsList.reduce(
      (acc, s) => acc + (s.indicators?.length ?? 0),
      0,
    );
    return { goals: sdgsList.length, indicators: totalIndicators };
  }, [sdgsList]);

  // --- SDG CRUD ---
  const editSdg = useCallback((id: string, name: string, color: string) => {
    setSdgsList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name, color } : s)),
    );
  }, []);

  // --- Indicator CRUD ---
  const addIndicator = useCallback((sdgId: string, label: string) => {
    setSdgsList((prev) =>
      prev.map((s) =>
        s.id === sdgId
          ? {
              ...s,
              indicators: [
                ...(s.indicators ?? []),
                { id: uid(), label },
              ],
            }
          : s,
      ),
    );
  }, []);

  const editIndicator = useCallback(
    (sdgId: string, indicatorId: string, label: string) => {
      setSdgsList((prev) =>
        prev.map((s) =>
          s.id === sdgId
            ? {
                ...s,
                indicators: (s.indicators ?? []).map((ind) =>
                  ind.id === indicatorId ? { ...ind, label } : ind,
                ),
              }
            : s,
        ),
      );
    },
    [],
  );

  const deleteIndicator = useCallback(
    (sdgId: string, indicatorId: string) => {
      setSdgsList((prev) =>
        prev.map((s) =>
          s.id === sdgId
            ? {
                ...s,
                indicators: (s.indicators ?? []).filter(
                  (ind) => ind.id !== indicatorId,
                ),
              }
            : s,
        ),
      );
    },
    [],
  );

  // --- Filter ---
  const filteredSdgs = useMemo(() => {
    if (!searchQuery.trim()) return sdgsList;
    const q = searchQuery.toLowerCase().trim();
    return sdgsList.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        String(s.number).includes(q) ||
        (s.indicators ?? []).some((ind) =>
          ind.label.toLowerCase().includes(q),
        ),
    );
  }, [sdgsList, searchQuery]);

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "SDGs & Indikator" }]}
        title="SDGs & Indikator"
        description="Kelola 17 goal SDGs beserta indikator-indikatornya."
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex size-9 items-center justify-center rounded-lg bg-[#b6252a]/[0.06] ring-1 ring-[#b6252a]/10">
            <Target className="size-4 text-[#b6252a]" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">{stats.goals}</p>
            <p className="text-xs text-slate-400">Goals</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 ring-1 ring-blue-100/60">
            <Hash className="size-4 text-blue-600" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">
              {stats.indicators}
            </p>
            <p className="text-xs text-slate-400">Indikator</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5">
        <div className="relative w-full sm:max-w-xs">
          <Input
            type="search"
            placeholder="Cari SDG atau indikator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-black/[0.06] bg-white pl-3 text-sm placeholder:text-slate-400 focus-visible:ring-[#b6252a]/20"
          />
        </div>
      </div>

      {/* SDG List */}
      <div className="space-y-3">
        {filteredSdgs.map((sdg) => {
          const isExpanded = expandedSdg === sdg.id;
          const indicatorCount = sdg.indicators?.length ?? 0;

          return (
            <div
              key={sdg.id}
              className="rounded-xl border border-black/[0.06] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              {/* SDG Header */}
              <div className="flex items-center gap-3 px-5 py-4">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedSdg(isExpanded ? null : sdg.id)
                  }
                  className="flex size-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  {isExpanded ? (
                    <ChevronDown className="size-4" />
                  ) : (
                    <ChevronRight className="size-4" />
                  )}
                </button>

                {/* Color badge */}
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
                  style={{ backgroundColor: sdg.color }}
                >
                  {sdg.number}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    SDG {sdg.number} — {sdg.name}
                  </p>
                  <div className="mt-0.5 flex items-center gap-3">
                    <span className="text-xs text-slate-400">
                      {indicatorCount} indikator
                    </span>
                    <span
                      className="inline-block size-2.5 rounded-full ring-2 ring-white"
                      style={{ backgroundColor: sdg.color }}
                      title={`Warna: ${sdg.color}`}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setModal({ type: "add-indicator", sdgId: sdg.id })
                    }
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
                    title="Tambah Indikator"
                  >
                    <Plus className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal({ type: "edit-sdg", sdg })}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
                    title="Edit SDG"
                  >
                    <Edit2 className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Indicators */}
              {isExpanded && (
                <div className="border-t border-black/[0.04] px-5 py-3">
                  {indicatorCount === 0 ? (
                    <div className="py-4 text-center">
                      <p className="text-sm text-slate-400">
                        Belum ada indikator.{" "}
                        <button
                          type="button"
                          onClick={() =>
                            setModal({
                              type: "add-indicator",
                              sdgId: sdg.id,
                            })
                          }
                          className="font-medium text-[#b6252a] hover:underline"
                        >
                          Tambah indikator pertama
                        </button>
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {(sdg.indicators ?? []).map((ind, idx) => (
                        <div
                          key={ind.id}
                          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-[#fafafa]"
                        >
                          <span
                            className="flex size-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white"
                            style={{ backgroundColor: sdg.color }}
                          >
                            {idx + 1}
                          </span>
                          <span className="min-w-0 flex-1 text-[13px] text-slate-700">
                            {ind.label}
                          </span>
                          <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() =>
                                setModal({
                                  type: "edit-indicator",
                                  sdgId: sdg.id,
                                  indicator: ind,
                                })
                              }
                              className="rounded-md p-1.5 text-slate-400 hover:bg-white hover:text-slate-700"
                              title="Edit Indikator"
                            >
                              <Edit2 className="size-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                deleteIndicator(sdg.id, ind.id)
                              }
                              className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                              title="Hapus Indikator"
                            >
                              <Trash2 className="size-3" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Add more button inline */}
                      <button
                        type="button"
                        onClick={() =>
                          setModal({
                            type: "add-indicator",
                            sdgId: sdg.id,
                          })
                        }
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-400 transition-colors hover:bg-[#fafafa] hover:text-[#b6252a]"
                      >
                        <Plus className="size-3.5" />
                        Tambah indikator
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modal && (
        <SdgFormModal
          mode={modal}
          onClose={() => setModal(null)}
          onEditSdg={editSdg}
          onAddIndicator={addIndicator}
          onEditIndicator={editIndicator}
        />
      )}
    </>
  );
}

// --- Modal ---
interface SdgFormModalProps {
  mode: NonNullable<ModalMode>;
  onClose: () => void;
  onEditSdg: (id: string, name: string, color: string) => void;
  onAddIndicator: (sdgId: string, label: string) => void;
  onEditIndicator: (sdgId: string, indicatorId: string, label: string) => void;
}

function SdgFormModal({
  mode,
  onClose,
  onEditSdg,
  onAddIndicator,
  onEditIndicator,
}: SdgFormModalProps) {
  const [name, setName] = useState(() => {
    if (mode.type === "edit-sdg") return mode.sdg.name;
    if (mode.type === "edit-indicator") return mode.indicator.label;
    return "";
  });

  const [color, setColor] = useState(() => {
    if (mode.type === "edit-sdg") return mode.sdg.color;
    return "#E5243B";
  });

  const title = (() => {
    switch (mode.type) {
      case "edit-sdg":
        return `Edit SDG ${mode.sdg.number}`;
      case "add-indicator":
        return "Tambah Indikator";
      case "edit-indicator":
        return "Edit Indikator";
    }
  })();

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    switch (mode.type) {
      case "edit-sdg":
        onEditSdg(mode.sdg.id, trimmed, color);
        break;
      case "add-indicator":
        onAddIndicator(mode.sdgId, trimmed);
        break;
      case "edit-indicator":
        onEditIndicator(mode.sdgId, mode.indicator.id, trimmed);
        break;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_32px_80px_-32px_rgba(0,0,0,0.2)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="size-4" />
        </button>

        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">
          {mode.type === "edit-sdg"
            ? "Ubah nama atau warna goal SDG."
            : mode.type === "add-indicator"
              ? "Tambahkan indikator baru untuk goal ini."
              : "Ubah label indikator."}
        </p>

        <div className="mt-5 space-y-4">
          {/* Name / Label */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              {mode.type === "edit-sdg" ? "Nama Goal" : "Label Indikator"}
            </label>
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              placeholder={
                mode.type === "edit-sdg"
                  ? "Nama goal SDG..."
                  : "Contoh: 4.3 Pendidikan tinggi & vokasi"
              }
              className="border-black/[0.08] text-sm placeholder:text-slate-400 focus-visible:ring-[#b6252a]/20"
            />
            {mode.type !== "edit-sdg" && (
              <p className="mt-1.5 text-[11px] text-slate-400">
                Format: nomor.sub — deskripsi singkat (misal: 1.2 Kemiskinan
                nasional)
              </p>
            )}
          </div>

          {/* Color picker for SDG edit */}
          {mode.type === "edit-sdg" && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                Warna
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="size-10 cursor-pointer rounded-lg border border-black/[0.08] p-1"
                />
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#E5243B"
                  className="flex-1 border-black/[0.08] font-mono text-sm placeholder:text-slate-400 focus-visible:ring-[#b6252a]/20"
                />
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: color }}
                >
                  {mode.sdg.number}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="text-sm">
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="text-sm"
          >
            {mode.type === "add-indicator" ? "Tambah" : "Simpan"}
          </Button>
        </div>
      </div>
    </div>
  );
}
