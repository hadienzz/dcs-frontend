import * as Yup from "yup";

import type { UploadDocumentFormValues } from "@/types/document-center";

export const UPLOAD_DOCUMENT_INITIAL_VALUES: UploadDocumentFormValues = {
  title: "",
  file: null,
  divisionId: "",
  subdivisionId: "",
  picId: "",
  notes: "",
};

export function getUploadDocumentValidationSchema(requireFile: boolean) {
  return Yup.object({
    title: Yup.string()
      .trim()
      .min(3, "Judul minimal 3 karakter.")
      .required("Judul wajib diisi."),
    file: requireFile
      ? Yup.mixed<File>().nullable().required("File wajib diunggah.")
      : Yup.mixed<File>().nullable(),
    divisionId: Yup.string().required("Divisi wajib dipilih."),
    subdivisionId: Yup.string().required("Subdivisi wajib dipilih."),
    picId: Yup.string().required("PIC wajib dipilih."),
    notes: Yup.string().trim().max(500, "Catatan maksimal 500 karakter."),
  });
}
