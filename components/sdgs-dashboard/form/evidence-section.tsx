"use client";

import { useFormikContext } from "formik";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { SdgsContentFormValues } from "@/types/sdgs-dashboard";

import { FileDropzone } from "../file-dropzone";
import { SectionCard } from "../section-card";
import { FieldError } from "./field-error";
import { LabeledField } from "./labeled-field";
import { ToggleRow } from "./toggle-row";

export function EvidenceSection() {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext<SdgsContentFormValues>();

  if (values.isAvailable !== "yes") return null;

  return (
    <SectionCard
      title="Bukti Pelaksanaan"
      description="Dokumen pendukung untuk verifikasi pemeringkatan SDGs."
    >
      <LabeledField label="Deskripsi Bukti" htmlFor="evidenceDescription">
        <Textarea
          id="evidenceDescription"
          name="evidenceDescription"
          rows={3}
          placeholder="Ringkas bukti yang Anda lampirkan: data, foto, atau laporan."
          value={values.evidenceDescription}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <FieldError
          message={
            touched.evidenceDescription ? errors.evidenceDescription : undefined
          }
        />
      </LabeledField>

      <LabeledField label="Berkas Bukti">
        <FileDropzone
          value={values.evidenceFileName}
          onChange={(name) => setFieldValue("evidenceFileName", name)}
          label="Unggah bukti pelaksanaan"
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
        />
        <FieldError
          message={touched.supportingLink ? errors.supportingLink : undefined}
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
        />
      </LabeledField>

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
