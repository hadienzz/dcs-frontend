"use client";

import { useFormik } from "formik";

import {
  DOCUMENT_CENTER_LOGIN_INITIAL_VALUES,
  documentCenterLoginValidationSchema,
} from "@/schemas/document-center/document-center-login-schema";
import { useDocumentCenterLoginMutation } from "@/hooks/document-center/use-document-center-session";
import type {
  DocumentCenterLoginFormValues,
  DocumentCenterLoginRole,
} from "@/types/document-center";
import { getErrorMessage } from "@/utils/api-error";

export function useDocumentCenterLoginForm() {
  const loginMutation = useDocumentCenterLoginMutation();

  const formik = useFormik<DocumentCenterLoginFormValues>({
    initialValues: DOCUMENT_CENTER_LOGIN_INITIAL_VALUES,
    validationSchema: documentCenterLoginValidationSchema,
    onSubmit: (values, actions) => {
      actions.setStatus(undefined);

      loginMutation.mutate(
        {
          role: values.role,
          password:
            values.role === "superadmin" ? values.password.trim() : undefined,
        },
        {
          onSuccess: () => {
            actions.setSubmitting(false);
            actions.setFieldValue("password", "");
          },
          onError: (error) => {
            actions.setSubmitting(false);
            actions.setStatus({
              submitError: getErrorMessage(
                error,
                "Belum bisa masuk ke Document Center. Coba lagi sebentar.",
              ),
            });
          },
        },
      );
    },
  });

  return {
    formik,
    isSubmitting: formik.isSubmitting || loginMutation.isPending,
    setRole: (role: DocumentCenterLoginRole) => {
      formik.setFieldValue("role", role);
      formik.setFieldValue("password", "");
      formik.setStatus(undefined);
    },
  };
}
