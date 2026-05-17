"use client";

import { useFormikContext } from "formik";
import { Check, ChevronDown, ChevronRight, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { sdgs } from "@/lib/sdgs-dashboard-data";
import type { SdgSelection, SdgsContentFormValues } from "@/types/sdgs-dashboard";

import { SectionCard } from "../section-card";
import { SdgIcon } from "../sdg-icon";
import { FieldError } from "./field-error";

export function SdgsSelectionSection() {
  const { values, errors, touched, setFieldValue, setFieldTouched } =
    useFormikContext<SdgsContentFormValues>();
  const [showPicker, setShowPicker] = useState(false);
  const [expandedSdg, setExpandedSdg] = useState<string | null>(null);

  const selectedIds = useMemo(
    () => new Set(values.sdgs.map((s) => s.sdgId)),
    [values.sdgs],
  );

  const toggleSdg = (sdgId: string) => {
    if (selectedIds.has(sdgId)) {
      const next = values.sdgs.filter((s) => s.sdgId !== sdgId);
      setFieldValue("sdgs", next);
    } else {
      const next: SdgSelection[] = [
        ...values.sdgs,
        { sdgId, indicators: [] },
      ];
      setFieldValue("sdgs", next);
    }
    setFieldTouched("sdgs", true, false);
  };

  const toggleIndicator = (sdgId: string, indicatorId: string) => {
    const next = values.sdgs.map((s) => {
      if (s.sdgId !== sdgId) return s;
      const has = s.indicators.includes(indicatorId);
      return {
        ...s,
        indicators: has
          ? s.indicators.filter((i) => i !== indicatorId)
          : [...s.indicators, indicatorId],
      };
    });
    setFieldValue("sdgs", next);
    setFieldTouched("sdgs", true, false);
  };

  const removeSdg = (sdgId: string) => {
    const next = values.sdgs.filter((s) => s.sdgId !== sdgId);
    setFieldValue("sdgs", next);
    setFieldTouched("sdgs", true, false);
  };

  return (
    <SectionCard
      title="Pemetaan SDGs & Indikator"
      description="Pilih goal SDG dan indikator spesifik yang relevan dengan dokumen ini."
    >
      {/* Selected SDGs */}
      {values.sdgs.length > 0 && (
        <div className="space-y-2">
          {values.sdgs.map((sel) => {
            const sdg = sdgs.find((s) => s.id === sel.sdgId);
            if (!sdg) return null;
            const isExpanded = expandedSdg === sel.sdgId;
            return (
              <div
                key={sel.sdgId}
                className="rounded-xl border border-black/[0.06] bg-[#fafafa]"
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedSdg(isExpanded ? null : sel.sdgId)
                    }
                    className="flex size-6 shrink-0 items-center justify-center rounded text-slate-400 hover:text-slate-600"
                  >
                    {isExpanded ? (
                      <ChevronDown className="size-3.5" />
                    ) : (
                      <ChevronRight className="size-3.5" />
                    )}
                  </button>
                  <SdgIcon id={sel.sdgId} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-slate-800">
                      SDG {sdg.number} — {sdg.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {sel.indicators.length > 0
                        ? `${sel.indicators.length} indikator dipilih`
                        : "Belum ada indikator dipilih"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSdg(sel.sdgId)}
                    className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    title="Hapus SDG"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>

                {/* Indicators */}
                {isExpanded && sdg.indicators && sdg.indicators.length > 0 && (
                  <div className="border-t border-black/[0.04] px-4 py-3">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                      Pilih indikator
                    </p>
                    <div className="space-y-1">
                      {sdg.indicators.map((ind) => {
                        const isChecked = sel.indicators.includes(ind.id);
                        return (
                          <button
                            key={ind.id}
                            type="button"
                            onClick={() =>
                              toggleIndicator(sel.sdgId, ind.id)
                            }
                            className={cn(
                              "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] transition-colors",
                              isChecked
                                ? "bg-white font-medium text-slate-800 ring-1 ring-black/[0.06]"
                                : "text-slate-600 hover:bg-white",
                            )}
                          >
                            <span
                              className={cn(
                                "flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
                                isChecked
                                  ? "border-[#b6252a] bg-[#b6252a] text-white"
                                  : "border-slate-300 bg-white",
                              )}
                            >
                              {isChecked && <Check className="size-3" />}
                            </span>
                            {ind.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {isExpanded &&
                  (!sdg.indicators || sdg.indicators.length === 0) && (
                    <div className="border-t border-black/[0.04] px-4 py-3">
                      <p className="text-xs text-slate-400">
                        Tidak ada indikator tersedia untuk SDG ini.
                      </p>
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add SDG button */}
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-black/[0.08] bg-[#fafafa] px-4 py-3 text-sm font-medium text-slate-500 transition-colors hover:border-[#b6252a]/30 hover:text-[#b6252a]"
      >
        <Plus className="size-4" />
        Tambah SDG
      </button>

      {/* SDG Picker dropdown */}
      {showPicker && (
        <div className="rounded-xl border border-black/[0.06] bg-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)]">
          <div className="border-b border-black/[0.04] px-4 py-3">
            <p className="text-xs font-semibold text-slate-600">
              Pilih SDG Goal
            </p>
          </div>
          <div className="grid grid-cols-1 gap-0.5 p-2 sm:grid-cols-2">
            {sdgs.map((sdg) => {
              const isSelected = selectedIds.has(sdg.id);
              return (
                <button
                  key={sdg.id}
                  type="button"
                  onClick={() => {
                    toggleSdg(sdg.id);
                    if (!isSelected) setShowPicker(false);
                  }}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13px] transition-colors",
                    isSelected
                      ? "bg-[#b6252a]/[0.06] font-medium text-[#b6252a]"
                      : "text-slate-700 hover:bg-slate-50",
                  )}
                >
                  <SdgIcon id={sdg.id} size="sm" />
                  <span className="min-w-0 flex-1 truncate">
                    SDG {sdg.number} — {sdg.name}
                  </span>
                  {isSelected && <Check className="size-4 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <FieldError
        message={
          touched.sdgs ? (errors.sdgs as string | undefined) : undefined
        }
      />
    </SectionCard>
  );
}
