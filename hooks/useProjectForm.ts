"use client";

import { useCallback, useState } from "react";
import * as Yup from "yup";
import type { HubDocument, ProjectInput } from "./useSdgsHubData";
import { useSdgsHub } from "./useSdgsHubData";
import type { LecturerProfile } from "./useLecturerPortal";

/* ─── Types ─── */

export interface ProjectFormValues {
  title: string;
  description: string;
  dosenName: string;
  dosenPhone: string;
  sdgCategory: string;
  teamSlots: number;
  tags: string;
}

interface UseProjectFormOptions {
  lecturer?: LecturerProfile | null;
}

/* ─── Constants ─── */

export const PROJECT_INITIAL_VALUES: ProjectFormValues = {
  title: "",
  description: "",
  dosenName: "",
  dosenPhone: "",
  sdgCategory: "",
  teamSlots: 3,
  tags: "",
};

export const PROJECT_VALIDATION_SCHEMA = Yup.object().shape({
  title: Yup.string()
    .min(5, "Judul minimal 5 karakter")
    .max(100, "Judul maksimal 100 karakter")
    .required("Judul wajib diisi"),
  description: Yup.string()
    .min(20, "Deskripsi minimal 20 karakter")
    .max(500, "Deskripsi maksimal 500 karakter")
    .required("Deskripsi wajib diisi"),
  dosenName: Yup.string()
    .min(3, "Nama minimal 3 karakter")
    .required("Nama dosen wajib diisi"),
  dosenPhone: Yup.string()
    .matches(/^[0-9+\-\s]+$/, "Nomor telepon tidak valid")
    .min(10, "Nomor telepon minimal 10 digit")
    .required("Nomor WhatsApp wajib diisi"),
  sdgCategory: Yup.string().required("Kategori SDG wajib dipilih"),
  teamSlots: Yup.number()
    .min(1, "Minimal 1 slot")
    .max(20, "Maksimal 20 slot")
    .required("Jumlah slot tim wajib diisi"),
  tags: Yup.string().required("Tags wajib diisi (pisahkan dengan koma)"),
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

/* ─── Hook ─── */

export function useProjectForm(options?: UseProjectFormOptions) {
  const { addProject } = useSdgsHub();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const lecturer = options?.lecturer ?? null;

  const initialValues: ProjectFormValues = {
    ...PROJECT_INITIAL_VALUES,
    dosenName: lecturer?.name ?? PROJECT_INITIAL_VALUES.dosenName,
    dosenPhone: lecturer?.phone ?? PROJECT_INITIAL_VALUES.dosenPhone,
  };

  const handleSubmit = useCallback(
    (
      values: ProjectFormValues,
      actions: { resetForm: () => void; setSubmitting: (v: boolean) => void },
      document?: HubDocument,
    ) => {
      const projectData: ProjectInput = {
        lecturerId: lecturer?.id ?? "external-lecturer",
        title: values.title,
        description: values.description,
        dosenName: values.dosenName,
        dosenPhone: values.dosenPhone,
        sdgCategory: values.sdgCategory,
        teamSlots: values.teamSlots,
        tags: values.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        documents: document ? [document] : undefined,
      };

      addProject(projectData);
      setIsSubmitted(true);
      actions.resetForm();
      actions.setSubmitting(false);

      // Reset success message after 3s
      setTimeout(() => setIsSubmitted(false), 3000);
    },
    [addProject, lecturer],
  );

  return {
    initialValues,
    validationSchema: PROJECT_VALIDATION_SCHEMA,
    handleSubmit,
    sdgOptions: SDG_OPTIONS,
    isSubmitted,
  };
}
