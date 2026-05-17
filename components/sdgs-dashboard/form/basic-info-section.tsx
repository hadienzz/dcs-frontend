"use client";

import { useFormikContext } from "formik";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { SdgsContentFormValues } from "@/types/sdgs-dashboard";

import { FileDropzone } from "../file-dropzone";
import { SectionCard } from "../section-card";
import { FieldError } from "./field-error";
import { LabeledField } from "./labeled-field";

export function BasicInfoSection() {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext<SdgsContentFormValues>();

  return (
    <SectionCard
      title="Informasi Dasar"
      description="Identitas dan ringkasan dokumen pemeringkatan."
    >
      <LabeledField label="Nama Dokumen" htmlFor="title">
        <Input
          id="title"
          name="title"
          placeholder="Contoh: Pemasangan Solar Panel — Gedung Bangkit"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <FieldError message={touched.title ? errors.title : undefined} />
      </LabeledField>

      <LabeledField label="Deskripsi" htmlFor="description">
        <Textarea
          id="description"
          name="description"
          rows={4}
          placeholder="Jelaskan tujuan, lingkup, dan dampak dokumen ini."
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <FieldError
          message={touched.description ? errors.description : undefined}
        />
      </LabeledField>

      <div className="grid md:grid-cols-2 gap-4">
        <LabeledField label="Foto Sampul">
          <FileDropzone
            value={values.thumbnailName}
            onChange={(name) => setFieldValue("thumbnailName", name)}
            accept="image/*"
            label="Unggah foto sampul"
          />
        </LabeledField>
        <LabeledField label="Lampiran">
          <FileDropzone
            value={values.attachmentName}
            onChange={(name) => setFieldValue("attachmentName", name)}
            label="Unggah lampiran"
            hint="PDF, DOCX · maks 20MB"
          />
        </LabeledField>
      </div>
    </SectionCard>
  );
}
