"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Building2,
  ChevronDown,
  ChevronRight,
  Edit2,
  Layers,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { directorateFields as initialFields } from "@/lib/sdgs-dashboard-data";
import type { Directorate, DirectorateField, Unit } from "@/types/sdgs-dashboard";

import { PageHeader } from "./page-header";

// Generate simple unique IDs for new items
function uid() {
  return `new-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

type ModalMode =
  | { type: "add-field" }
  | { type: "edit-field"; field: DirectorateField }
  | { type: "add-directorate"; fieldId: string }
  | { type: "edit-directorate"; fieldId: string; directorate: Directorate }
  | { type: "add-unit"; fieldId: string; directorateId: string }
  | { type: "edit-unit"; fieldId: string; directorateId: string; unit: Unit }
  | null;

export function DirectoratesView() {
  const [fields, setFields] = useState<DirectorateField[]>(initialFields);
  const [modal, setModal] = useState<ModalMode>(null);
  const [expandedFields, setExpandedFields] = useState<Set<string>>(
    () => new Set(initialFields.map((f) => f.id)),
  );
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

  // --- Field CRUD ---
  const addField = useCallback((name: string) => {
    setFields((prev) => [...prev, { id: uid(), name, directorates: [] }]);
  }, []);

  const editField = useCallback((id: string, name: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, name } : f)),
    );
  }, []);

  const deleteField = useCallback((id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    setExpandedFields((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  // --- Directorate CRUD ---
  const addDirectorate = useCallback(
    (fieldId: string, name: string) => {
      setFields((prev) =>
        prev.map((f) =>
          f.id === fieldId
            ? {
                ...f,
                directorates: [
                  ...f.directorates,
                  { id: uid(), name, units: [] },
                ],
              }
            : f,
        ),
      );
    },
    [],
  );

  const editDirectorate = useCallback(
    (fieldId: string, dirId: string, name: string) => {
      setFields((prev) =>
        prev.map((f) =>
          f.id === fieldId
            ? {
                ...f,
                directorates: f.directorates.map((d) =>
                  d.id === dirId ? { ...d, name } : d,
                ),
              }
            : f,
        ),
      );
    },
    [],
  );

  const deleteDirectorate = useCallback(
    (fieldId: string, dirId: string) => {
      setFields((prev) =>
        prev.map((f) =>
          f.id === fieldId
            ? {
                ...f,
                directorates: f.directorates.filter((d) => d.id !== dirId),
              }
            : f,
        ),
      );
    },
    [],
  );

  const moveDirectorate = useCallback(
    (dirId: string, fromFieldId: string, toFieldId: string) => {
      setFields((prev) => {
        const fromField = prev.find((f) => f.id === fromFieldId);
        const dir = fromField?.directorates.find((d) => d.id === dirId);
        if (!dir) return prev;
        return prev.map((f) => {
          if (f.id === fromFieldId) {
            return {
              ...f,
              directorates: f.directorates.filter((d) => d.id !== dirId),
            };
          }
          if (f.id === toFieldId) {
            return { ...f, directorates: [...f.directorates, dir] };
          }
          return f;
        });
      });
    },
    [],
  );

  // --- Unit CRUD ---
  const addUnit = useCallback(
    (fieldId: string, dirId: string, name: string) => {
      setFields((prev) =>
        prev.map((f) =>
          f.id === fieldId
            ? {
                ...f,
                directorates: f.directorates.map((d) =>
                  d.id === dirId
                    ? { ...d, units: [...d.units, { id: uid(), name }] }
                    : d,
                ),
              }
            : f,
        ),
      );
    },
    [],
  );

  const editUnit = useCallback(
    (fieldId: string, dirId: string, unitId: string, name: string) => {
      setFields((prev) =>
        prev.map((f) =>
          f.id === fieldId
            ? {
                ...f,
                directorates: f.directorates.map((d) =>
                  d.id === dirId
                    ? {
                        ...d,
                        units: d.units.map((u) =>
                          u.id === unitId ? { ...u, name } : u,
                        ),
                      }
                    : d,
                ),
              }
            : f,
        ),
      );
    },
    [],
  );

  const deleteUnit = useCallback(
    (fieldId: string, dirId: string, unitId: string) => {
      setFields((prev) =>
        prev.map((f) =>
          f.id === fieldId
            ? {
                ...f,
                directorates: f.directorates.map((d) =>
                  d.id === dirId
                    ? { ...d, units: d.units.filter((u) => u.id !== unitId) }
                    : d,
                ),
              }
            : f,
        ),
      );
    },
    [],
  );

  const moveUnit = useCallback(
    (
      unitId: string,
      fromFieldId: string,
      fromDirId: string,
      toFieldId: string,
      toDirId: string,
    ) => {
      setFields((prev) => {
        const fromField = prev.find((f) => f.id === fromFieldId);
        const fromDir = fromField?.directorates.find(
          (d) => d.id === fromDirId,
        );
        const unit = fromDir?.units.find((u) => u.id === unitId);
        if (!unit) return prev;
        return prev.map((f) => {
          if (f.id === fromFieldId && f.id === toFieldId) {
            return {
              ...f,
              directorates: f.directorates.map((d) => {
                if (d.id === fromDirId && d.id !== toDirId) {
                  return { ...d, units: d.units.filter((u) => u.id !== unitId) };
                }
                if (d.id === toDirId && d.id !== fromDirId) {
                  return { ...d, units: [...d.units, unit] };
                }
                if (d.id === fromDirId && d.id === toDirId) return d;
                return d;
              }),
            };
          }
          if (f.id === fromFieldId) {
            return {
              ...f,
              directorates: f.directorates.map((d) =>
                d.id === fromDirId
                  ? { ...d, units: d.units.filter((u) => u.id !== unitId) }
                  : d,
              ),
            };
          }
          if (f.id === toFieldId) {
            return {
              ...f,
              directorates: f.directorates.map((d) =>
                d.id === toDirId ? { ...d, units: [...d.units, unit] } : d,
              ),
            };
          }
          return f;
        });
      });
    },
    [],
  );

  // --- Toggle helpers ---
  const toggleField = (id: string) => {
    setExpandedFields((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleDir = (id: string) => {
    setExpandedDirs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // --- Stats ---
  const stats = useMemo(() => {
    const totalDirs = fields.reduce(
      (acc, f) => acc + f.directorates.length,
      0,
    );
    const totalUnits = fields.reduce(
      (acc, f) =>
        acc + f.directorates.reduce((a, d) => a + d.units.length, 0),
      0,
    );
    return { fields: fields.length, directorates: totalDirs, units: totalUnits };
  }, [fields]);

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Direktorat" }]}
        title="Direktorat & Unit"
        description="Kelola struktur bidang, direktorat, dan unit pendukung."
        actions={
          <Button onClick={() => setModal({ type: "add-field" })}>
            <Plus className="size-4" />
            Tambah Bidang
          </Button>
        }
      />

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex size-9 items-center justify-center rounded-lg bg-violet-50 ring-1 ring-violet-100/60">
            <Layers className="size-4 text-violet-600" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">{stats.fields}</p>
            <p className="text-xs text-slate-400">Bidang</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 ring-1 ring-blue-100/60">
            <Building2 className="size-4 text-blue-600" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">{stats.directorates}</p>
            <p className="text-xs text-slate-400">Direktorat</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 ring-1 ring-emerald-100/60">
            <Building2 className="size-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">{stats.units}</p>
            <p className="text-xs text-slate-400">Unit</p>
          </div>
        </div>
      </div>

      {/* Fields list */}
      <div className="space-y-4">
        {fields.map((field) => {
          const isExpanded = expandedFields.has(field.id);
          return (
            <div
              key={field.id}
              className="rounded-xl border border-black/[0.06] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              {/* Field header */}
              <div className="flex items-center gap-3 px-5 py-4">
                <button
                  type="button"
                  onClick={() => toggleField(field.id)}
                  className="flex size-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  {isExpanded ? (
                    <ChevronDown className="size-4" />
                  ) : (
                    <ChevronRight className="size-4" />
                  )}
                </button>
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 ring-1 ring-violet-100/60">
                  <Layers className="size-4 text-violet-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {field.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {field.directorates.length} direktorat
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setModal({ type: "add-directorate", fieldId: field.id })
                    }
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
                    title="Tambah Direktorat"
                  >
                    <Plus className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal({ type: "edit-field", field })}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
                    title="Edit Bidang"
                  >
                    <Edit2 className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        field.directorates.length > 0 &&
                        !confirm(
                          `Hapus bidang "${field.name}" beserta ${field.directorates.length} direktorat di dalamnya?`,
                        )
                      )
                        return;
                      deleteField(field.id);
                    }}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    title="Hapus Bidang"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Directorates */}
              {isExpanded && field.directorates.length > 0 && (
                <div className="border-t border-black/[0.04] px-5 py-3">
                  <div className="space-y-2">
                    {field.directorates.map((dir) => {
                      const dirExpanded = expandedDirs.has(dir.id);
                      return (
                        <div
                          key={dir.id}
                          className="rounded-lg border border-black/[0.04] bg-[#fafafa]"
                        >
                          {/* Directorate header */}
                          <div className="flex items-center gap-2.5 px-4 py-3">
                            <button
                              type="button"
                              onClick={() => toggleDir(dir.id)}
                              className="flex size-6 shrink-0 items-center justify-center rounded text-slate-400 transition-colors hover:bg-white hover:text-slate-600"
                            >
                              {dirExpanded ? (
                                <ChevronDown className="size-3.5" />
                              ) : (
                                <ChevronRight className="size-3.5" />
                              )}
                            </button>
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-blue-50 ring-1 ring-blue-100/60">
                              <Building2 className="size-3.5 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[13px] font-medium text-slate-800">
                                {dir.name}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {dir.units.length} unit
                              </p>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <button
                                type="button"
                                onClick={() =>
                                  setModal({
                                    type: "add-unit",
                                    fieldId: field.id,
                                    directorateId: dir.id,
                                  })
                                }
                                className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-white hover:text-slate-700"
                                title="Tambah Unit"
                              >
                                <Plus className="size-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setModal({
                                    type: "edit-directorate",
                                    fieldId: field.id,
                                    directorate: dir,
                                  })
                                }
                                className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-white hover:text-slate-700"
                                title="Edit Direktorat"
                              >
                                <Edit2 className="size-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (
                                    dir.units.length > 0 &&
                                    !confirm(
                                      `Hapus direktorat "${dir.name}" beserta ${dir.units.length} unit?`,
                                    )
                                  )
                                    return;
                                  deleteDirectorate(field.id, dir.id);
                                }}
                                className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                title="Hapus Direktorat"
                              >
                                <Trash2 className="size-3" />
                              </button>
                            </div>
                          </div>

                          {/* Units */}
                          {dirExpanded && dir.units.length > 0 && (
                            <div className="border-t border-black/[0.04] px-4 py-2">
                              <div className="space-y-1">
                                {dir.units.map((unit) => (
                                  <div
                                    key={unit.id}
                                    className="group flex items-center gap-2.5 rounded-md px-3 py-2 transition-colors hover:bg-white"
                                  >
                                    <span className="size-1.5 shrink-0 rounded-full bg-slate-300" />
                                    <span className="min-w-0 flex-1 truncate text-[13px] text-slate-600">
                                      {unit.name}
                                    </span>
                                    <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setModal({
                                            type: "edit-unit",
                                            fieldId: field.id,
                                            directorateId: dir.id,
                                            unit,
                                          })
                                        }
                                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                        title="Edit Unit"
                                      >
                                        <Edit2 className="size-3" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          deleteUnit(field.id, dir.id, unit.id)
                                        }
                                        className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                        title="Hapus Unit"
                                      >
                                        <Trash2 className="size-3" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {dirExpanded && dir.units.length === 0 && (
                            <div className="border-t border-black/[0.04] px-4 py-3">
                              <p className="text-center text-xs text-slate-400">
                                Belum ada unit.{" "}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setModal({
                                      type: "add-unit",
                                      fieldId: field.id,
                                      directorateId: dir.id,
                                    })
                                  }
                                  className="font-medium text-[#b6252a] hover:underline"
                                >
                                  Tambah unit
                                </button>
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {isExpanded && field.directorates.length === 0 && (
                <div className="border-t border-black/[0.04] px-5 py-6 text-center">
                  <p className="text-sm text-slate-400">
                    Belum ada direktorat.{" "}
                    <button
                      type="button"
                      onClick={() =>
                        setModal({ type: "add-directorate", fieldId: field.id })
                      }
                      className="font-medium text-[#b6252a] hover:underline"
                    >
                      Tambah direktorat pertama
                    </button>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modal && (
        <FormModal
          mode={modal}
          fields={fields}
          onClose={() => setModal(null)}
          onAddField={addField}
          onEditField={editField}
          onAddDirectorate={addDirectorate}
          onEditDirectorate={editDirectorate}
          onMoveDirectorate={moveDirectorate}
          onAddUnit={addUnit}
          onEditUnit={editUnit}
          onMoveUnit={moveUnit}
        />
      )}
    </>
  );
}

// --- Form Modal ---
interface FormModalProps {
  mode: NonNullable<ModalMode>;
  fields: DirectorateField[];
  onClose: () => void;
  onAddField: (name: string) => void;
  onEditField: (id: string, name: string) => void;
  onAddDirectorate: (fieldId: string, name: string) => void;
  onEditDirectorate: (fieldId: string, dirId: string, name: string) => void;
  onMoveDirectorate: (dirId: string, fromFieldId: string, toFieldId: string) => void;
  onAddUnit: (fieldId: string, dirId: string, name: string) => void;
  onEditUnit: (fieldId: string, dirId: string, unitId: string, name: string) => void;
  onMoveUnit: (
    unitId: string,
    fromFieldId: string,
    fromDirId: string,
    toFieldId: string,
    toDirId: string,
  ) => void;
}

function FormModal({
  mode,
  fields,
  onClose,
  onAddField,
  onEditField,
  onAddDirectorate,
  onEditDirectorate,
  onMoveDirectorate,
  onAddUnit,
  onEditUnit,
  onMoveUnit,
}: FormModalProps) {
  const [name, setName] = useState(() => {
    if (mode.type === "edit-field") return mode.field.name;
    if (mode.type === "edit-directorate") return mode.directorate.name;
    if (mode.type === "edit-unit") return mode.unit.name;
    return "";
  });

  const [selectedFieldId, setSelectedFieldId] = useState(() => {
    if (mode.type === "add-directorate") return mode.fieldId;
    if (mode.type === "edit-directorate") return mode.fieldId;
    if (mode.type === "add-unit") return mode.fieldId;
    if (mode.type === "edit-unit") return mode.fieldId;
    return fields[0]?.id ?? "";
  });

  const [selectedDirId, setSelectedDirId] = useState(() => {
    if (mode.type === "add-unit") return mode.directorateId;
    if (mode.type === "edit-unit") return mode.directorateId;
    return "";
  });

  // Available directorates based on selected field
  const availableDirs = useMemo(() => {
    const field = fields.find((f) => f.id === selectedFieldId);
    return field?.directorates ?? [];
  }, [fields, selectedFieldId]);

  // Reset dir selection when field changes (for unit forms)
  const handleFieldChange = (newFieldId: string) => {
    setSelectedFieldId(newFieldId);
    const field = fields.find((f) => f.id === newFieldId);
    setSelectedDirId(field?.directorates[0]?.id ?? "");
  };

  const title = (() => {
    switch (mode.type) {
      case "add-field": return "Tambah Bidang Baru";
      case "edit-field": return "Edit Bidang";
      case "add-directorate": return "Tambah Direktorat Baru";
      case "edit-directorate": return "Edit Direktorat";
      case "add-unit": return "Tambah Unit Baru";
      case "edit-unit": return "Edit Unit";
    }
  })();

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    switch (mode.type) {
      case "add-field":
        onAddField(trimmed);
        break;
      case "edit-field":
        onEditField(mode.field.id, trimmed);
        break;
      case "add-directorate":
        onAddDirectorate(selectedFieldId, trimmed);
        break;
      case "edit-directorate":
        onEditDirectorate(mode.fieldId, mode.directorate.id, trimmed);
        // Move if field changed
        if (selectedFieldId !== mode.fieldId) {
          onMoveDirectorate(mode.directorate.id, mode.fieldId, selectedFieldId);
        }
        break;
      case "add-unit":
        onAddUnit(selectedFieldId, selectedDirId, trimmed);
        break;
      case "edit-unit":
        onEditUnit(mode.fieldId, mode.directorateId, mode.unit.id, trimmed);
        // Move if directorate or field changed
        if (
          selectedFieldId !== mode.fieldId ||
          selectedDirId !== mode.directorateId
        ) {
          onMoveUnit(
            mode.unit.id,
            mode.fieldId,
            mode.directorateId,
            selectedFieldId,
            selectedDirId,
          );
        }
        break;
    }
    onClose();
  };

  const showFieldSelect =
    mode.type === "add-directorate" ||
    mode.type === "edit-directorate" ||
    mode.type === "add-unit" ||
    mode.type === "edit-unit";

  const showDirSelect = mode.type === "add-unit" || mode.type === "edit-unit";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="relative w-full max-w-md rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_32px_80px_-32px_rgba(0,0,0,0.2)]">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="size-4" />
        </button>

        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">
          {mode.type.startsWith("add")
            ? "Isi nama untuk menambahkan item baru."
            : "Ubah nama atau pindahkan ke lokasi lain."}
        </p>

        <div className="mt-5 space-y-4">
          {/* Field selector */}
          {showFieldSelect && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                Bidang
              </label>
              <select
                value={selectedFieldId}
                onChange={(e) => handleFieldChange(e.target.value)}
                className="w-full rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#b6252a]/30 focus:ring-2 focus:ring-[#b6252a]/10"
              >
                {fields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Directorate selector */}
          {showDirSelect && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                Direktorat
              </label>
              {availableDirs.length === 0 ? (
                <p className="rounded-lg border border-dashed border-black/[0.08] px-3 py-2 text-sm text-slate-400">
                  Bidang ini belum punya direktorat.
                </p>
              ) : (
                <select
                  value={selectedDirId}
                  onChange={(e) => setSelectedDirId(e.target.value)}
                  className="w-full rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#b6252a]/30 focus:ring-2 focus:ring-[#b6252a]/10"
                >
                  {availableDirs.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Name input */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Nama
            </label>
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              placeholder={
                mode.type.includes("field")
                  ? "Nama bidang..."
                  : mode.type.includes("directorate")
                    ? "Nama direktorat..."
                    : "Nama unit..."
              }
              className="border-black/[0.08] text-sm placeholder:text-slate-400 focus-visible:ring-[#b6252a]/20"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="text-sm">
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !name.trim() ||
              (showDirSelect && !selectedDirId && availableDirs.length > 0)
            }
            className="text-sm"
          >
            {mode.type.startsWith("add") ? "Tambah" : "Simpan"}
          </Button>
        </div>
      </div>
    </div>
  );
}
