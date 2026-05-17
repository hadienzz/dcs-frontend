"use client";

import { useState } from "react";
import { useFormikContext } from "formik";
import { Plus, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { SdgsContentFormValues } from "@/types/sdgs-dashboard";

import { FileDropzone } from "../file-dropzone";
import { SectionCard } from "../section-card";
import { FieldError } from "./field-error";
import { LabeledField } from "./labeled-field";
import { ToggleRow } from "./toggle-row";

export function AvailabilitySection() {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext<SdgsContentFormValues>();

  const hasEvidence =
    !!values.evidenceDescription ||
    !!values.evidenceFileName ||
    !!values.supportingLink ||
    !!values.notes;

  const [showForm, setShowForm] = useState(hasEvidence);

  const handleClose = () => {
    setShowForm(false);
    setFieldValue("evidenceDescription", "");
    setFieldValue("evidenceFileName", "");
    setFieldValue("supportingLink", "");
    setFieldValue("notes", "");
  };

  return (
    <SectionCard
      title="Bukti & Evidence"
      description="Dokumen pendukung untuk verifikasi pemeringkatan SDGs (opsional)."
    >
      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-black/[0.08] bg-[#fafafa] px-4 py-5 text-sm font-medium text-slate-500 transition-colors hover:border-[#b6252a]/30 hover:text-[#b6252a]"
        >
          <Plus className="size-4" />
          Tambah bukti evidence
        </button>
      ) : (
        <div className="space-y-4 rounded-xl border border-black/[0.06] bg-[#fafafa] p-4">
          {/* Close button */}
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-slate-700">
              Detail Evidence
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
              title="Hapus evidence"
            >
              <X className="size-4" />
            </button>
          </div>

          <LabeledField label="Deskripsi Bukti" htmlFor="evidenceDescription">
            <Textarea
              id="evidenceDescription"
              name="evidenceDescription"
              rows={3}
              placeholder="Ringkas bukti yang Anda lampirkan: data, foto, atau laporan."
              value={values.evidenceDescription}
              onChange={handleChange}
              onBlur={handleBlur}
              className="border-black/[0.08] bg-white placeholder:text-slate-400"
            />
            <FieldError
              message={
                touched.evidenceDescription
                  ? errors.evidenceDescription
                  : undefined
              }
            />
          </LabeledField>

          <LabeledField label="Berkas Bukti">
            <FileDropzone
              value={values.evidenceFileName}
              onChange={(name) => setFieldValue("evidenceFileName", name)}
              label="Unggah bukti pelaksanaan"
              hint="PDF, DOCX, JPG, PNG · maks 20MB"
            />
          </LabeledField>

          <LabeledField label="Tautan Pendukung" htmlFor="supportingLink">
            <Input
              id="supportingLink"
              name="supportingLink"
              placeholder="https://…"
              value={values.supportingLink}
              onChange={handleChange}
              onBlur={handleBlur}
              className="border-black/[0.08] bg-white placeholder:text-slate-400"
            />
            <FieldError
              message={
                touched.supportingLink ? errors.supportingLink : undefined
              }
            />
          </LabeledField>

          <LabeledField label="Catatan" htmlFor="notes">
            <Textarea
              id="notes"
              name="notes"
              rows={2}
              placeholder="Catatan internal untuk tim review (opsional)."
              value={values.notes}
              onChange={handleChange}
              onBlur={handleBlur}
              className="border-black/[0.08] bg-white placeholder:text-slate-400"
            />
          </LabeledField>
        </div>
      )}

      <ToggleRow
        id="publicVisibility"
        label="Publikasikan di website pemeringkatan"
        description="Aktifkan agar inisiatif tampil di website publik SDGs Telkom University."
        checked={values.publicVisibility === "yes"}
        onChange={(checked) =>
          setFieldValue("publicVisibility", checked ? "yes" : "no")
        }
      />
    </SectionCard>
  );
}
