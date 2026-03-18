"use client";

import { useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { ProjectFormValues } from "@/hooks/useProjectForm";
import { motion } from "framer-motion";
import { CheckCircle, FileText, Send, Upload, X } from "lucide-react";
import type { FormikHelpers } from "formik";
import type * as Yup from "yup";
import type { HubDocument } from "@/hooks/useSdgsHubData";
import { uploadPdfDocument } from "@/lib/document-upload";

interface CreateProjectFormProps {
  initialValues: ProjectFormValues;
  validationSchema: Yup.ObjectSchema<ProjectFormValues>;
  onSubmit: (
    values: ProjectFormValues,
    actions: FormikHelpers<ProjectFormValues>,
    document?: HubDocument,
  ) => void | Promise<void>;
  sdgOptions: string[];
  isSubmitted: boolean;
  lockLecturerIdentity?: boolean;
  submitLabel?: string;
  successMessage?: string;
}

const fieldClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-[#b6252a]/40 focus:outline-none focus:ring-2 focus:ring-[#b6252a]/10";

const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";
const errorClass = "mt-1 text-xs text-red-500 font-medium";

export function CreateProjectForm({
  initialValues,
  validationSchema,
  onSubmit,
  sdgOptions,
  isSubmitted,
  lockLecturerIdentity = false,
  submitLabel = "Buat Campaign",
  successMessage = "Campaign berhasil dibuat! Proyek Anda sudah tampil di halaman Research & Project.",
}: CreateProjectFormProps) {
  const [document, setDocument] = useState<File | null>(null);
  const [documentError, setDocumentError] = useState<string | null>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const MAX_SIZE_MB = 10;

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;

    if (!selected) {
      return;
    }

    if (selected.type !== "application/pdf") {
      setDocumentError("Hanya file PDF yang diperbolehkan.");
      if (docInputRef.current) {
        docInputRef.current.value = "";
      }
      return;
    }

    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      setDocumentError("Ukuran file maksimal 10MB.");
      if (docInputRef.current) {
        docInputRef.current.value = "";
      }
      return;
    }

    setDocumentError(null);
    setDocument(selected);
  };

  return (
    <div className="relative">
      {/* Success message */}
      {isSubmitted && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700"
        >
          <CheckCircle className="h-5 w-5 shrink-0" />
          {successMessage}
        </motion.div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, actions) => {
          try {
            let uploadedDocument: HubDocument | undefined;

            if (document) {
              uploadedDocument = await uploadPdfDocument(document);
            }

            await onSubmit(values, actions, uploadedDocument);
            setDocument(null);
            setDocumentError(null);

            if (docInputRef.current) {
              docInputRef.current.value = "";
            }
          } catch (error) {
            setDocumentError(
              error instanceof Error
                ? error.message
                : "Upload dokumen gagal diproses.",
            );
            actions.setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-5">
            {/* Title */}
            <div>
              <label htmlFor="title" className={labelClass}>
                Judul Project / Riset
              </label>
              <Field
                name="title"
                id="title"
                placeholder="cth: Analisis Dampak Perubahan Iklim"
                className={fieldClass}
              />
              <ErrorMessage name="title" component="p" className={errorClass} />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className={labelClass}>
                Deskripsi
              </label>
              <Field
                as="textarea"
                name="description"
                id="description"
                rows={4}
                placeholder="Jelaskan proyek riset Anda dan apa yang dicari dari mahasiswa..."
                className={`${fieldClass} resize-none`}
              />
              <ErrorMessage
                name="description"
                component="p"
                className={errorClass}
              />
            </div>

            {/* 2-col: Name & Phone */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="dosenName" className={labelClass}>
                  Nama Dosen
                </label>
                <Field
                  name="dosenName"
                  id="dosenName"
                  placeholder="Dr. Ahmad Fauzi, M.T."
                  className={fieldClass}
                  disabled={lockLecturerIdentity}
                />
                {lockLecturerIdentity && (
                  <p className="mt-1 text-xs text-gray-400">
                    Diisi otomatis dari profil dosen.
                  </p>
                )}
                <ErrorMessage
                  name="dosenName"
                  component="p"
                  className={errorClass}
                />
              </div>
              <div>
                <label htmlFor="dosenPhone" className={labelClass}>
                  Nomor WhatsApp
                </label>
                <Field
                  name="dosenPhone"
                  id="dosenPhone"
                  placeholder="081234567890"
                  className={fieldClass}
                  disabled={lockLecturerIdentity}
                />
                {lockLecturerIdentity && (
                  <p className="mt-1 text-xs text-gray-400">
                    Nomor kontak mengikuti akun dosen yang sedang login.
                  </p>
                )}
                <ErrorMessage
                  name="dosenPhone"
                  component="p"
                  className={errorClass}
                />
              </div>
            </div>

            {/* 2-col: SDG & Team Slots */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="sdgCategory" className={labelClass}>
                  Kategori SDG
                </label>
                <Field
                  as="select"
                  name="sdgCategory"
                  id="sdgCategory"
                  className={fieldClass}
                >
                  <option value="">Pilih Kategori SDG</option>
                  {sdgOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="sdgCategory"
                  component="p"
                  className={errorClass}
                />
              </div>
              <div>
                <label htmlFor="teamSlots" className={labelClass}>
                  Jumlah Slot Tim
                </label>
                <Field
                  name="teamSlots"
                  id="teamSlots"
                  type="number"
                  min={1}
                  max={20}
                  className={fieldClass}
                />
                <ErrorMessage
                  name="teamSlots"
                  component="p"
                  className={errorClass}
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className={labelClass}>
                Tags
              </label>
              <Field
                name="tags"
                id="tags"
                placeholder="Machine Learning, IoT, Data Science"
                className={fieldClass}
              />
              <p className="mt-1 text-xs text-gray-400">Pisahkan dengan koma</p>
              <ErrorMessage name="tags" component="p" className={errorClass} />
            </div>

            <div>
              <label className={labelClass}>Dokumen (PDF) *opsional</label>
              <p className="mb-3 text-xs text-gray-400">
                Upload 1 dokumen PDF (maks {MAX_SIZE_MB}MB).
              </p>

              {document ? (
                <div className="mb-3 flex items-center justify-between rounded-xl border border-gray-200 bg-[#fcfcfc] px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <FileText className="h-4 w-4 shrink-0 text-[#b6252a]" />
                    <p className="truncate text-sm font-medium text-gray-800">
                      {document.name}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDocument(null);
                      setDocumentError(null);
                      if (docInputRef.current) {
                        docInputRef.current.value = "";
                      }
                    }}
                    className="rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-[#b6252a]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => docInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-4 py-4 text-sm font-medium text-gray-500 transition-colors hover:border-[#b6252a]/30 hover:bg-[#fff8f8] hover:text-[#b6252a]"
              >
                <Upload className="h-4 w-4" />
                {document ? "Ganti Dokumen PDF" : "Upload Dokumen PDF"}
              </button>

              <input
                ref={docInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleDocumentChange}
                className="hidden"
              />

              {documentError ? (
                <p className={errorClass}>{documentError}</p>
              ) : null}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_45%,#ed1e28_100%)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-16px_rgba(182,37,42,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_20px_38px_-16px_rgba(182,37,42,0.95)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? "Memproses..." : submitLabel}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
