"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  AlertCircle,
  Building2,
  ChevronDown,
  ChevronRight,
  Edit2,
  Layers,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DirectorateDeleteDialog } from "@/components/sdgs-dashboard/directorate-delete-dialog";
import {
  type DirectorateModalMode,
  type DirectorateModalSubmitValues,
  useDirectoratesManagement,
} from "@/hooks/sdgs-dashboard/use-directorates-management";
import type { DirectorateField } from "@/types/sdgs-dashboard";
import { getErrorMessage } from "@/utils/api-error";

import { PageHeader } from "./page-header";

export function DirectoratesView() {
  const {
    fields,
    stats,
    modal,
    setModal,
    expandedFields,
    expandedDirs,
    isError,
    error,
    isSaving,
    isDeleting,
    pendingDeleteTarget,
    toggleField,
    toggleDir,
    submitModal,
    requestDeleteField,
    requestDeleteDirectorate,
    requestDeleteUnit,
    deleteDialogActions,
  } = useDirectoratesManagement();

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Direktorat" }]}
        title="Direktorat & Unit"
        description="Kelola struktur bidang, direktorat, dan unit pendukung."
        actions={
          <Button
            type="button"
            onClick={() => setModal({ type: "add-field" })}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            Tambah Bidang
          </Button>
        }
      />

      {isError ? (
        <div className="mb-5 flex gap-3 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p className="leading-6">
            {getErrorMessage(error, "Data direktorat belum bisa dimuat.")}
          </p>
        </div>
      ) : null}

      <div className="mb-6 grid grid-cols-3 gap-3">
        <StatTile
          icon={Layers}
          value={stats.fields}
          label="Bidang"
          tone="primary"
        />
        <StatTile
          icon={Building2}
          value={stats.directorates}
          label="Direktorat"
          tone="secondary"
        />
        <StatTile
          icon={Building2}
          value={stats.units}
          label="Unit"
          tone="muted"
        />
      </div>

      <div className="space-y-4">
        {fields.map((field) => {
          const isExpanded = expandedFields.has(field.id);

          return (
            <section
              key={field.id}
              className="rounded-xl border border-black/[0.06] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center gap-3 px-5 py-4">
                <button
                  type="button"
                  onClick={() => toggleField(field.id)}
                  className="flex size-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  aria-label={isExpanded ? "Tutup bidang" : "Buka bidang"}
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
                  <IconButton
                    label="Tambah Direktorat"
                    onClick={() =>
                      setModal({ type: "add-directorate", fieldId: field.id })
                    }
                  >
                    <Plus className="size-4" />
                  </IconButton>
                  <IconButton
                    label="Edit Bidang"
                    onClick={() => setModal({ type: "edit-field", field })}
                  >
                    <Edit2 className="size-3.5" />
                  </IconButton>
                  <IconButton
                    label="Hapus Bidang"
                    tone="danger"
                    onClick={() => requestDeleteField(field)}
                  >
                    <Trash2 className="size-3.5" />
                  </IconButton>
                </div>
              </div>

              {isExpanded && field.directorates.length > 0 ? (
                <div className="border-t border-black/[0.04] px-5 py-3">
                  <div className="space-y-2">
                    {field.directorates.map((directorate) => {
                      const directorateExpanded = expandedDirs.has(
                        directorate.id,
                      );

                      return (
                        <div
                          key={directorate.id}
                          className="rounded-lg border border-black/[0.04] bg-[#fafafa]"
                        >
                          <div className="flex items-center gap-2.5 px-4 py-3">
                            <button
                              type="button"
                              onClick={() => toggleDir(directorate.id)}
                              className="flex size-6 shrink-0 items-center justify-center rounded text-slate-400 transition-colors hover:bg-white hover:text-slate-600"
                              aria-label={
                                directorateExpanded
                                  ? "Tutup direktorat"
                                  : "Buka direktorat"
                              }
                            >
                              {directorateExpanded ? (
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
                                {directorate.name}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {directorate.units.length} unit
                              </p>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <IconButton
                                label="Tambah Unit"
                                size="sm"
                                onClick={() =>
                                  setModal({
                                    type: "add-unit",
                                    fieldId: field.id,
                                    directorateId: directorate.id,
                                  })
                                }
                              >
                                <Plus className="size-3.5" />
                              </IconButton>
                              <IconButton
                                label="Edit Direktorat"
                                size="sm"
                                onClick={() =>
                                  setModal({
                                    type: "edit-directorate",
                                    fieldId: field.id,
                                    directorate,
                                  })
                                }
                              >
                                <Edit2 className="size-3" />
                              </IconButton>
                              <IconButton
                                label="Hapus Direktorat"
                                size="sm"
                                tone="danger"
                                onClick={() =>
                                  requestDeleteDirectorate(field, directorate)
                                }
                              >
                                <Trash2 className="size-3" />
                              </IconButton>
                            </div>
                          </div>

                          {directorateExpanded && directorate.units.length > 0 ? (
                            <div className="border-t border-black/[0.04] px-4 py-2">
                              <div className="space-y-1">
                                {directorate.units.map((unit) => (
                                  <div
                                    key={unit.id}
                                    className="group flex items-center gap-2.5 rounded-md px-3 py-2 transition-colors hover:bg-white"
                                  >
                                    <span className="size-1.5 shrink-0 rounded-full bg-slate-300" />
                                    <span className="min-w-0 flex-1 truncate text-[13px] text-slate-600">
                                      {unit.name}
                                    </span>
                                    <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                                      <IconButton
                                        label="Edit Unit"
                                        size="xs"
                                        onClick={() =>
                                          setModal({
                                            type: "edit-unit",
                                            fieldId: field.id,
                                            directorateId: directorate.id,
                                            unit,
                                          })
                                        }
                                      >
                                        <Edit2 className="size-3" />
                                      </IconButton>
                                      <IconButton
                                        label="Hapus Unit"
                                        size="xs"
                                        tone="danger"
                                        onClick={() =>
                                          requestDeleteUnit(
                                            field,
                                            directorate,
                                            unit,
                                          )
                                        }
                                      >
                                        <Trash2 className="size-3" />
                                      </IconButton>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null}

                          {directorateExpanded &&
                          directorate.units.length === 0 ? (
                            <div className="border-t border-black/[0.04] px-4 py-3">
                              <p className="text-center text-xs text-slate-400">
                                Belum ada unit.{" "}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setModal({
                                      type: "add-unit",
                                      fieldId: field.id,
                                      directorateId: directorate.id,
                                    })
                                  }
                                  className="font-medium text-[#b6252a] hover:underline"
                                >
                                  Tambah unit
                                </button>
                              </p>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {isExpanded && field.directorates.length === 0 ? (
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
              ) : null}
            </section>
          );
        })}
      </div>

      {fields.length === 0 ? (
        <div className="rounded-xl border border-dashed border-black/[0.08] bg-white px-6 py-10 text-center">
          <p className="text-sm font-medium text-slate-700">
            Struktur direktorat masih kosong.
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Tambah bidang pertama untuk mulai menyusun struktur SDGs Dashboard.
          </p>
        </div>
      ) : null}

      {modal ? (
        <FormModal
          mode={modal}
          fields={fields}
          isSubmitting={isSaving}
          onClose={() => setModal(null)}
          onSubmit={submitModal}
        />
      ) : null}

      <DirectorateDeleteDialog
        target={pendingDeleteTarget}
        open={Boolean(pendingDeleteTarget)}
        isDeleting={isDeleting}
        onOpenChange={deleteDialogActions.onOpenChange}
        onConfirm={deleteDialogActions.onConfirm}
      />
    </>
  );
}

type StatTone = "primary" | "secondary" | "muted";

function StatTile({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: typeof Layers;
  value: number;
  label: string;
  tone: StatTone;
}) {
  const toneClassName =
    tone === "primary"
      ? "bg-violet-50 ring-violet-100/60 text-violet-600"
      : tone === "secondary"
        ? "bg-blue-50 ring-blue-100/60 text-blue-600"
        : "bg-emerald-50 ring-emerald-100/60 text-emerald-600";

  return (
    <div className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div
        className={`flex size-9 items-center justify-center rounded-lg ring-1 ${toneClassName}`}
      >
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-lg font-semibold text-slate-900">{value}</p>
        <p className="text-xs text-slate-400">{label}</p>
      </div>
    </div>
  );
}

function IconButton({
  label,
  tone = "default",
  size = "default",
  onClick,
  children,
}: {
  label: string;
  tone?: "default" | "danger";
  size?: "default" | "sm" | "xs";
  onClick: () => void;
  children: ReactNode;
}) {
  const sizeClassName =
    size === "xs" ? "p-1" : size === "sm" ? "p-1.5" : "p-2";
  const toneClassName =
    tone === "danger"
      ? "text-slate-400 hover:bg-red-50 hover:text-red-600"
      : "text-slate-400 hover:bg-slate-50 hover:text-slate-700";

  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`rounded-lg transition-colors ${sizeClassName} ${toneClassName}`}
    >
      {children}
    </button>
  );
}

interface FormModalProps {
  mode: NonNullable<DirectorateModalMode>;
  fields: DirectorateField[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: DirectorateModalSubmitValues) => void;
}

function FormModal({
  mode,
  fields,
  isSubmitting,
  onClose,
  onSubmit,
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
    const selectedField = fields.find((field) => field.id === selectedFieldId);
    return selectedField?.directorates[0]?.id ?? "";
  });

  const availableDirs = useMemo(() => {
    const field = fields.find((item) => item.id === selectedFieldId);
    return field?.directorates ?? [];
  }, [fields, selectedFieldId]);

  const showFieldSelect =
    mode.type === "add-directorate" ||
    mode.type === "edit-directorate" ||
    mode.type === "add-unit" ||
    mode.type === "edit-unit";
  const showDirSelect = mode.type === "add-unit" || mode.type === "edit-unit";

  const title = getModalTitle(mode);
  const canSubmit =
    Boolean(name.trim()) &&
    (!showDirSelect || (availableDirs.length > 0 && Boolean(selectedDirId))) &&
    !isSubmitting;

  function handleFieldChange(newFieldId: string) {
    setSelectedFieldId(newFieldId);
    const field = fields.find((item) => item.id === newFieldId);
    setSelectedDirId(field?.directorates[0]?.id ?? "");
  }

  function handleSubmit() {
    const trimmed = name.trim();

    if (!trimmed || !canSubmit) {
      return;
    }

    onSubmit({
      name: trimmed,
      fieldId: selectedFieldId,
      directorateId: selectedDirId,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={isSubmitting ? undefined : onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_32px_80px_-32px_rgba(0,0,0,0.2)]">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:pointer-events-none disabled:opacity-50"
          aria-label="Tutup modal"
        >
          <X className="size-4" />
        </button>

        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-400">
          {mode.type.startsWith("add")
            ? "Isi nama untuk menambahkan item ke struktur direktorat."
            : "Ubah nama atau pindahkan item ke lokasi lain."}
        </p>

        <div className="mt-5 space-y-4">
          {showFieldSelect ? (
            <div>
              <label
                htmlFor="directorate-field"
                className="mb-1.5 block text-xs font-medium text-slate-600"
              >
                Bidang
              </label>
              <select
                id="directorate-field"
                value={selectedFieldId}
                onChange={(event) => handleFieldChange(event.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#b6252a]/30 focus:ring-2 focus:ring-[#b6252a]/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {fields.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {showDirSelect ? (
            <div>
              <label
                htmlFor="directorate-parent"
                className="mb-1.5 block text-xs font-medium text-slate-600"
              >
                Direktorat
              </label>
              {availableDirs.length === 0 ? (
                <p className="rounded-lg border border-dashed border-black/[0.08] px-3 py-2 text-sm text-slate-400">
                  Bidang ini belum punya direktorat.
                </p>
              ) : (
                <select
                  id="directorate-parent"
                  value={selectedDirId}
                  onChange={(event) => setSelectedDirId(event.target.value)}
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#b6252a]/30 focus:ring-2 focus:ring-[#b6252a]/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {availableDirs.map((directorate) => (
                    <option key={directorate.id} value={directorate.id}>
                      {directorate.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ) : null}

          <div>
            <label
              htmlFor="directorate-name"
              className="mb-1.5 block text-xs font-medium text-slate-600"
            >
              Nama
            </label>
            <Input
              id="directorate-name"
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSubmit();
              }}
              disabled={isSubmitting}
              placeholder={getModalPlaceholder(mode)}
              className="border-black/[0.08] text-sm placeholder:text-slate-400 focus-visible:ring-[#b6252a]/20"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-sm"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="text-sm"
          >
            {isSubmitting ? (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            ) : null}
            {mode.type.startsWith("add") ? "Tambah" : "Simpan"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function getModalTitle(mode: NonNullable<DirectorateModalMode>) {
  if (mode.type === "add-field") return "Tambah Bidang Baru";
  if (mode.type === "edit-field") return "Edit Bidang";
  if (mode.type === "add-directorate") return "Tambah Direktorat Baru";
  if (mode.type === "edit-directorate") return "Edit Direktorat";
  if (mode.type === "add-unit") return "Tambah Unit Baru";
  return "Edit Unit";
}

function getModalPlaceholder(mode: NonNullable<DirectorateModalMode>) {
  if (mode.type.includes("field")) return "Nama bidang";
  if (mode.type.includes("directorate")) return "Nama direktorat";
  return "Nama unit";
}
