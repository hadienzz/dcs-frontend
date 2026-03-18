"use client";

import { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { InnovationFormValues } from "@/hooks/useInnovationForm";
import { motion } from "framer-motion";
import {
  CheckCircle,
  FileText,
  Rocket,
  ImagePlus,
  Upload,
  X,
} from "lucide-react";
import type { FormikHelpers } from "formik";
import type * as Yup from "yup";
import Image from "next/image";
import type { HubDocument } from "@/hooks/useSdgsHubData";
import { uploadPdfDocument } from "@/lib/document-upload";

interface SubmitInnovationFormProps {
  initialValues: InnovationFormValues;
  validationSchema: Yup.ObjectSchema<InnovationFormValues>;
  onSubmit: (
    values: InnovationFormValues,
    actions: FormikHelpers<InnovationFormValues>,
    gallery?: string[],
    document?: HubDocument,
  ) => void | Promise<void>;
  sdgOptions: string[];
  isSubmitted: boolean;
}

const fieldClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-[#b6252a]/40 focus:outline-none focus:ring-2 focus:ring-[#b6252a]/10";

const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";
const errorClass = "mt-1 text-xs text-red-500 font-medium";

export function SubmitInnovationForm({
  initialValues,
  validationSchema,
  onSubmit,
  sdgOptions,
  isSubmitted,
}: SubmitInnovationFormProps) {
  const [images, setImages] = useState<string[]>([]);
  const [document, setDocument] = useState<File | null>(null);
  const [documentError, setDocumentError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const MAX_IMAGES = 5;
  const MAX_SIZE_MB = 2;
  const MAX_DOC_SIZE_MB = 10;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remaining = MAX_IMAGES - images.length;
    const filesToProcess = Array.from(files).slice(0, remaining);

    filesToProcess.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > MAX_SIZE_MB * 1024 * 1024) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (result) {
          setImages((prev) => {
            if (prev.length >= MAX_IMAGES) return prev;
            return [...prev, result];
          });
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      setDocumentError("Hanya file PDF yang diperbolehkan.");
      if (documentInputRef.current) {
        documentInputRef.current.value = "";
      }
      return;
    }

    if (file.size > MAX_DOC_SIZE_MB * 1024 * 1024) {
      setDocumentError("Ukuran file maksimal 10MB.");
      if (documentInputRef.current) {
        documentInputRef.current.value = "";
      }
      return;
    }

    setDocumentError(null);
    setDocument(file);
  };

  return (
    <div className="relative">
      {isSubmitted && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700"
        >
          <CheckCircle className="h-5 w-5 shrink-0" />
          Inovasi kamu berhasil dikirim! Menunggu persetujuan dari Super Admin
          SDGs.
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

            await onSubmit(
              values,
              actions,
              images.length > 0 ? images : undefined,
              uploadedDocument,
            );
            setImages([]);
            setDocument(null);
            setDocumentError(null);

            if (documentInputRef.current) {
              documentInputRef.current.value = "";
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
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="title" className={labelClass}>
                  Nama Produk Inovasi
                </label>
                <Field
                  name="title"
                  id="title"
                  placeholder="cth: AquaSense - Smart Water Sensor"
                  className={fieldClass}
                />
                <ErrorMessage
                  name="title"
                  component="p"
                  className={errorClass}
                />
              </div>
              <div>
                <label htmlFor="creator" className={labelClass}>
                  Nama Pembuat / Tim
                </label>
                <Field
                  name="creator"
                  id="creator"
                  placeholder="cth: Tim Riset IoT Lab"
                  className={fieldClass}
                />
                <ErrorMessage
                  name="creator"
                  component="p"
                  className={errorClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="creatorEmail" className={labelClass}>
                Email Kontak
              </label>
              <Field
                name="creatorEmail"
                id="creatorEmail"
                type="email"
                placeholder="nama@telkomuniversity.ac.id"
                className={fieldClass}
              />
              <ErrorMessage
                name="creatorEmail"
                component="p"
                className={errorClass}
              />
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>
                Deskripsi Produk
              </label>
              <Field
                as="textarea"
                name="description"
                id="description"
                rows={4}
                placeholder="Jelaskan produk inovasi kamu secara lengkap — apa yang dikerjakan, masalah apa yang dipecahkan, dan bagaimana cara kerjanya..."
                className={`${fieldClass} resize-none`}
              />
              <ErrorMessage
                name="description"
                component="p"
                className={errorClass}
              />
            </div>

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
              <label htmlFor="tags" className={labelClass}>
                Tags
              </label>
              <Field
                name="tags"
                id="tags"
                placeholder="cth: IoT, Hardware, Mobile App (pisahkan dengan koma)"
                className={fieldClass}
              />
              <p className="mt-1 text-xs text-gray-400">
                Pisahkan setiap tag dengan koma
              </p>
              <ErrorMessage name="tags" component="p" className={errorClass} />
            </div>

            <div>
              <label htmlFor="highlights" className={labelClass}>
                Keunggulan Produk
              </label>
              <Field
                as="textarea"
                name="highlights"
                id="highlights"
                rows={3}
                placeholder="Tulis keunggulan utama produk, satu per baris:&#10;Monitoring real-time&#10;Dashboard mobile&#10;Low-cost sensor"
                className={`${fieldClass} resize-none`}
              />
              <p className="mt-1 text-xs text-gray-400">
                Satu keunggulan per baris
              </p>
              <ErrorMessage
                name="highlights"
                component="p"
                className={errorClass}
              />
            </div>

            <div>
              <label htmlFor="useCases" className={labelClass}>
                Use Cases / Penerapan
              </label>
              <Field
                as="textarea"
                name="useCases"
                id="useCases"
                rows={3}
                placeholder="Tulis skenario penerapan produk, satu per baris:&#10;Pemantauan kualitas air kampus&#10;Media pembelajaran IoT&#10;Riset lingkungan"
                className={`${fieldClass} resize-none`}
              />
              <p className="mt-1 text-xs text-gray-400">
                Satu use case per baris
              </p>
              <ErrorMessage
                name="useCases"
                component="p"
                className={errorClass}
              />
            </div>

            {/* Image Upload Gallery */}
            <div>
              <label className={labelClass}>Gambar Produk (Carousel)</label>
              <p className="mb-3 text-xs text-gray-400">
                Upload hingga {MAX_IMAGES} gambar untuk ditampilkan di galeri
                produk (maks {MAX_SIZE_MB}MB per gambar)
              </p>

              {/* Preview Grid */}
              {images.length > 0 && (
                <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
                    >
                      <Image
                        src={img}
                        alt={`Upload ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              {images.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-4 py-6 text-sm font-medium text-gray-500 transition-colors hover:border-[#b6252a]/30 hover:bg-[#fff8f8] hover:text-[#b6252a]"
                >
                  <ImagePlus className="h-5 w-5" />
                  {images.length === 0
                    ? "Tambahkan Gambar Produk"
                    : `Tambah Gambar (${images.length}/${MAX_IMAGES})`}
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div>
              <label className={labelClass}>Dokumen Inovasi (PDF)</label>
              <p className="mb-3 text-xs text-gray-400">
                Upload 1 dokumen pendukung (proposal, spesifikasi, atau paper)
                maksimal {MAX_DOC_SIZE_MB}MB.
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
                      if (documentInputRef.current) {
                        documentInputRef.current.value = "";
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
                onClick={() => documentInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-4 py-4 text-sm font-medium text-gray-500 transition-colors hover:border-[#b6252a]/30 hover:bg-[#fff8f8] hover:text-[#b6252a]"
              >
                <Upload className="h-4 w-4" />
                {document ? "Ganti Dokumen PDF" : "Upload Dokumen PDF"}
              </button>

              <input
                ref={documentInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleDocumentUpload}
                className="hidden"
              />

              {documentError ? (
                <p className={errorClass}>{documentError}</p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_45%,#ed1e28_100%)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-16px_rgba(182,37,42,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_20px_38px_-16px_rgba(182,37,42,0.95)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Rocket className="h-4 w-4" />
              {isSubmitting ? "Mengirim..." : "Kirim Inovasi"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
