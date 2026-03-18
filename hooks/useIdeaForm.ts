"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { uploadPdfDocument } from "@/lib/document-upload";
import { useSdgsHub } from "@/hooks/useSdgsHubData";
import { getErrorMessage } from "@/utils/api-error";

export interface IdeaFormValues {
  title: string;
  author: string;
  email: string;
  description: string;
  sdgCategory: string;
  overview: string;
  potentialImpact: string;
  nextSteps: string;
  supportNote: string;
  documentFile: File | null;
}

export const IDEA_INITIAL_VALUES: IdeaFormValues = {
  title: "",
  author: "",
  email: "",
  description: "",
  sdgCategory: "",
  overview: "",
  potentialImpact: "",
  nextSteps: "",
  supportNote: "",
  documentFile: null,
};

const splitMultilineValues = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

export const IDEA_VALIDATION_SCHEMA = Yup.object().shape({
  title: Yup.string()
    .min(5, "Judul minimal 5 karakter")
    .max(80, "Judul maksimal 80 karakter")
    .required("Judul ide wajib diisi"),
  author: Yup.string()
    .min(3, "Nama minimal 3 karakter")
    .required("Nama kamu wajib diisi"),
  email: Yup.string()
    .email("Masukkan alamat email yang valid")
    .required("Email wajib diisi"),
  description: Yup.string()
    .min(15, "Deskripsi minimal 15 karakter")
    .max(300, "Deskripsi maksimal 300 karakter")
    .required("Deskripsi wajib diisi"),
  sdgCategory: Yup.string().required("Kategori SDG wajib dipilih"),
  overview: Yup.string()
    .min(20, "Gambaran ide minimal 20 karakter")
    .required("Gambaran ide wajib diisi"),
  potentialImpact: Yup.string()
    .min(20, "Potensi dampak minimal 20 karakter")
    .required("Potensi dampak wajib diisi"),
  nextSteps: Yup.string().required(
    "Arah tindak lanjut wajib diisi (pisahkan per baris)",
  ),
  supportNote: Yup.string()
    .min(20, "Makna dukungan minimal 20 karakter")
    .required("Makna dukungan wajib diisi"),
  documentFile: Yup.mixed<File>().nullable(),
});

export const SDG_OPTIONS = [
  "SDG 1",
  "SDG 2",
  "SDG 3",
  "SDG 4",
  "SDG 5",
  "SDG 6",
  "SDG 7",
  "SDG 8",
  "SDG 9",
  "SDG 10",
  "SDG 11",
  "SDG 12",
  "SDG 13",
  "SDG 14",
  "SDG 15",
  "SDG 16",
  "SDG 17",
];

export function useIdeaForm(defaults?: Partial<IdeaFormValues>) {
  const { addIdea } = useSdgsHub();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formik = useFormik<IdeaFormValues>({
    initialValues: {
      ...IDEA_INITIAL_VALUES,
      ...defaults,
      documentFile: defaults?.documentFile ?? null,
    },
    enableReinitialize: true,
    validationSchema: IDEA_VALIDATION_SCHEMA,
    onSubmit: async (values, actions) => {
      try {
        actions.setStatus(undefined);

        const uploadedDocument = values.documentFile
          ? await uploadPdfDocument(values.documentFile)
          : undefined;

        addIdea({
          title: values.title,
          author: values.author,
          email: values.email,
          description: values.description,
          sdgCategory: values.sdgCategory,
          overview: values.overview,
          potentialImpact: values.potentialImpact,
          nextSteps: splitMultilineValues(values.nextSteps),
          supportNote: values.supportNote,
          documents: uploadedDocument ? [uploadedDocument] : undefined,
        });

        setIsSubmitted(true);
        actions.resetForm();
        window.setTimeout(() => setIsSubmitted(false), 3000);
      } catch (error) {
        actions.setStatus({
          submitError: getErrorMessage(
            error,
            "Pengiriman ide gagal diproses. Coba lagi sebentar.",
          ),
        });
      } finally {
        actions.setSubmitting(false);
      }
    },
  });

  return {
    formik,
    sdgOptions: SDG_OPTIONS,
    isSubmitted,
    isPending: formik.isSubmitting,
  };
}
