"use client";

import { useState, useMemo, useCallback } from "react";
import * as Yup from "yup";
import { useSdgsHub } from "@/hooks/useSdgsHubData";
import type { HubDocument } from "@/hooks/useSdgsHubData";
import { SDG_GOALS } from "@/components/sdgs-hub/hub-data";

export interface InnovationFormValues {
  title: string;
  creator: string;
  creatorEmail: string;
  description: string;
  sdgCategory: string;
  tags: string;
  highlights: string;
  useCases: string;
}

interface UseInnovationFormOptions {
  creator?: string;
  creatorEmail?: string;
}

export function useInnovationForm(opts?: UseInnovationFormOptions) {
  const { addInnovation } = useSdgsHub();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const sdgOptions = useMemo(() => SDG_GOALS.map((g) => `SDG ${g.n}`), []);

  const initialValues: InnovationFormValues = {
    title: "",
    creator: opts?.creator || "",
    creatorEmail: opts?.creatorEmail || "",
    description: "",
    sdgCategory: "",
    tags: "",
    highlights: "",
    useCases: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .min(5, "Minimal 5 karakter")
      .required("Judul wajib diisi"),
    creator: Yup.string().required("Nama pembuat wajib diisi"),
    creatorEmail: Yup.string()
      .email("Format email tidak valid")
      .required("Email wajib diisi"),
    description: Yup.string()
      .min(20, "Minimal 20 karakter")
      .required("Deskripsi wajib diisi"),
    sdgCategory: Yup.string().required("Pilih kategori SDG"),
    tags: Yup.string().required("Tags wajib diisi (pisahkan dengan koma)"),
    highlights: Yup.string().required(
      "Keunggulan wajib diisi (pisahkan dengan baris baru)",
    ),
    useCases: Yup.string().required(
      "Use case wajib diisi (pisahkan dengan baris baru)",
    ),
  });

  const handleSubmit = useCallback(
    (
      values: InnovationFormValues,
      actions: { setSubmitting: (v: boolean) => void; resetForm: () => void },
      gallery?: string[],
      document?: HubDocument,
    ) => {
      addInnovation({
        title: values.title,
        creator: values.creator,
        creatorEmail: values.creatorEmail,
        description: values.description,
        sdgCategory: values.sdgCategory,
        tags: values.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        highlights: values.highlights
          .split("\n")
          .map((h) => h.trim())
          .filter(Boolean),
        useCases: values.useCases
          .split("\n")
          .map((u) => u.trim())
          .filter(Boolean),
        gallery,
        documents: document ? [document] : undefined,
      });
      setIsSubmitted(true);
      actions.setSubmitting(false);
      actions.resetForm();
    },
    [addInnovation],
  );

  return {
    initialValues,
    validationSchema,
    handleSubmit,
    sdgOptions,
    isSubmitted,
  };
}
