import * as yup from "yup";

import type { DocumentCenterLoginFormValues } from "@/types/document-center";

export const DOCUMENT_CENTER_LOGIN_INITIAL_VALUES: DocumentCenterLoginFormValues =
  {
    role: "shared-user",
    password: "",
  };

export const documentCenterLoginValidationSchema = yup.object({
  role: yup
    .mixed<DocumentCenterLoginFormValues["role"]>()
    .oneOf(["superadmin", "shared-user"])
    .required("Pilih tipe akun."),
  password: yup.string().when("role", {
    is: "superadmin",
    then: (schema) => schema.trim().required("Password wajib diisi."),
    otherwise: (schema) => schema.optional(),
  }),
});
