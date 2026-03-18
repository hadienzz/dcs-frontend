"use client";

import { useRef, useState } from "react";
import type { FormikProps } from "formik";
import { motion } from "framer-motion";
import { CheckCircle, FileText, Lightbulb, Upload, X } from "lucide-react";
import type { IdeaFormValues } from "@/hooks/useIdeaForm";

interface SubmitIdeaFormProps {
  formik: FormikProps<IdeaFormValues>;
  sdgOptions: string[];
  isSubmitted: boolean;
}

const fieldClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-[#b6252a]/40 focus:outline-none focus:ring-2 focus:ring-[#b6252a]/10";

const labelClass = "mb-1.5 block text-sm font-semibold text-gray-700";
const errorClass = "mt-1 text-xs font-medium text-red-500";

export function SubmitIdeaForm({
  formik,
  sdgOptions,
  isSubmitted,
}: SubmitIdeaFormProps) {
  const [documentError, setDocumentError] = useState<string | null>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const maxDocSizeMb = 10;
  const submitError =
    typeof formik.status === "object" &&
    formik.status &&
    "submitError" in formik.status
      ? String(formik.status.submitError)
      : null;

  const getFieldError = (field: keyof IdeaFormValues) => {
    if (!formik.touched[field] || !formik.errors[field]) {
      return null;
    }

    return String(formik.errors[field]);
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      setDocumentError("Hanya file PDF yang diperbolehkan.");
      formik.setFieldValue("documentFile", null);
      if (documentInputRef.current) {
        documentInputRef.current.value = "";
      }
      return;
    }

    if (file.size > maxDocSizeMb * 1024 * 1024) {
      setDocumentError("Ukuran file maksimal 10MB.");
      formik.setFieldValue("documentFile", null);
      if (documentInputRef.current) {
        documentInputRef.current.value = "";
      }
      return;
    }

    setDocumentError(null);
    void formik.setFieldValue("documentFile", file);
    void formik.setStatus(undefined);
  };

  const handleRemoveDocument = () => {
    setDocumentError(null);
    void formik.setFieldValue("documentFile", null);
    void formik.setStatus(undefined);

    if (documentInputRef.current) {
      documentInputRef.current.value = "";
    }
  };

  return (
    <div className="relative">
      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700"
        >
          <CheckCircle className="h-5 w-5 shrink-0" />
          Ide kamu berhasil dikirim! Terima kasih atas kontribusimu.
        </motion.div>
      ) : null}

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className={labelClass}>
              Judul Ide
            </label>
            <input
              id="title"
              name="title"
              placeholder="cth: Kantin Zero Waste"
              className={fieldClass}
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {getFieldError("title") ? (
              <p className={errorClass}>{getFieldError("title")}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="author" className={labelClass}>
              Nama Kamu
            </label>
            <input
              id="author"
              name="author"
              placeholder="Nama lengkap"
              className={fieldClass}
              value={formik.values.author}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {getFieldError("author") ? (
              <p className={errorClass}>{getFieldError("author")}</p>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email Kontak
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="nama@telkomuniversity.ac.id"
            className={fieldClass}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {getFieldError("email") ? (
            <p className={errorClass}>{getFieldError("email")}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>
            Deskripsi Ide
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Jelaskan idemu untuk membuat kampus lebih berkelanjutan..."
            className={`${fieldClass} resize-none`}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {getFieldError("description") ? (
            <p className={errorClass}>{getFieldError("description")}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="sdgCategory" className={labelClass}>
            Kategori SDG
          </label>
          <select
            id="sdgCategory"
            name="sdgCategory"
            className={fieldClass}
            value={formik.values.sdgCategory}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Pilih Kategori SDG</option>
            {sdgOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {getFieldError("sdgCategory") ? (
            <p className={errorClass}>{getFieldError("sdgCategory")}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="overview" className={labelClass}>
            Gambaran Ide
          </label>
          <textarea
            id="overview"
            name="overview"
            rows={3}
            placeholder="Ringkasan ide yang akan tampil di detail ide..."
            className={`${fieldClass} resize-none`}
            value={formik.values.overview}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {getFieldError("overview") ? (
            <p className={errorClass}>{getFieldError("overview")}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="potentialImpact" className={labelClass}>
            Potensi Dampak
          </label>
          <textarea
            id="potentialImpact"
            name="potentialImpact"
            rows={3}
            placeholder="Dampak utama jika ide ini diterapkan..."
            className={`${fieldClass} resize-none`}
            value={formik.values.potentialImpact}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {getFieldError("potentialImpact") ? (
            <p className={errorClass}>{getFieldError("potentialImpact")}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="nextSteps" className={labelClass}>
            Arah Tindak Lanjut
          </label>
          <textarea
            id="nextSteps"
            name="nextSteps"
            rows={4}
            placeholder="Pisahkan tiap langkah dengan baris baru"
            className={`${fieldClass} resize-none`}
            value={formik.values.nextSteps}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {getFieldError("nextSteps") ? (
            <p className={errorClass}>{getFieldError("nextSteps")}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="supportNote" className={labelClass}>
            Makna Dukungan
          </label>
          <textarea
            id="supportNote"
            name="supportNote"
            rows={3}
            placeholder="Teks yang menjelaskan makna dukungan pada ide ini..."
            className={`${fieldClass} resize-none`}
            value={formik.values.supportNote}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {getFieldError("supportNote") ? (
            <p className={errorClass}>{getFieldError("supportNote")}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass}>Dokumen Pendukung (PDF)</label>
          <p className="mb-3 text-xs text-gray-400">
            Opsional. Upload 1 dokumen pendukung ide (maks {maxDocSizeMb} MB).
          </p>

          {formik.values.documentFile ? (
            <div className="mb-3 flex items-center justify-between rounded-xl border border-gray-200 bg-[#fcfcfc] px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <FileText className="h-4 w-4 shrink-0 text-[#b6252a]" />
                <p className="truncate text-sm font-medium text-gray-800">
                  {formik.values.documentFile.name}
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemoveDocument}
                className="rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-[#b6252a]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => documentInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-4 py-4 text-sm font-medium text-gray-500 transition-colors hover:border-[#b6252a]/30 hover:bg-[#fff8f8] hover:text-[#b6252a]"
          >
            <Upload className="h-4 w-4" />
            {formik.values.documentFile
              ? "Ganti Dokumen PDF"
              : "Upload Dokumen PDF"}
          </button>

          <input
            ref={documentInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleDocumentUpload}
            className="hidden"
          />

          {documentError ? <p className={errorClass}>{documentError}</p> : null}
        </div>

        {submitError ? <p className={errorClass}>{submitError}</p> : null}

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_45%,#ed1e28_100%)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-16px_rgba(182,37,42,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_20px_38px_-16px_rgba(182,37,42,0.95)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Lightbulb className="h-4 w-4" />
          {formik.isSubmitting ? "Mengirim..." : "Kirim Ide"}
        </button>
      </form>
    </div>
  );
}
