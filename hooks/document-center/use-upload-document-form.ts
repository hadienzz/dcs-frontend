"use client";

import { useMemo } from "react";
import { useFormik } from "formik";

import {
  getUploadDocumentValidationSchema,
  UPLOAD_DOCUMENT_INITIAL_VALUES,
} from "@/schemas/document-center/upload-document-schema";
import { useUpdateDocumentMetadataMutation } from "@/hooks/document-center/use-update-document-metadata";
import { useUploadDocumentMutation } from "@/hooks/document-center/use-upload-document";
import type {
  DocumentDivision,
  EnrichedDocumentRecord,
  UploadDocumentFormValues,
} from "@/types/document-center";
import { getErrorMessage } from "@/utils/api-error";
import {
  getPicsByDivision,
  getSubdivisionsByDivision,
} from "@/utils/document-center";

interface UseUploadDocumentFormOptions {
  divisions: DocumentDivision[];
  documentToEdit?: EnrichedDocumentRecord | null;
  accountUsername?: string;
  onCompleted?: () => void;
}

function getInitialValues(
  documentToEdit?: EnrichedDocumentRecord | null,
): UploadDocumentFormValues {
  if (!documentToEdit) {
    return UPLOAD_DOCUMENT_INITIAL_VALUES;
  }

  return {
    title: documentToEdit.title,
    file: null,
    divisionId: documentToEdit.divisionId,
    subdivisionId: documentToEdit.subdivisionId,
    picId: documentToEdit.picId,
    notes: documentToEdit.notes ?? "",
  };
}

export function useUploadDocumentForm({
  divisions,
  documentToEdit,
  accountUsername = "",
  onCompleted,
}: UseUploadDocumentFormOptions) {
  const uploadDocumentMutation = useUploadDocumentMutation({
    successMessage: null,
    errorMessage: null,
  });
  const updateDocumentMetadataMutation = useUpdateDocumentMetadataMutation({
    successMessage: null,
    errorMessage: null,
  });
  const isEditMode = Boolean(documentToEdit);

  const validationSchema = useMemo(
    () => getUploadDocumentValidationSchema(!isEditMode),
    [isEditMode],
  );

  const formik = useFormik<UploadDocumentFormValues>({
    initialValues: getInitialValues(documentToEdit),
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values, actions) => {
      actions.setStatus(undefined);

      if (isEditMode && documentToEdit) {
        updateDocumentMetadataMutation.mutate(
          {
            id: documentToEdit.id,
            title: values.title,
            file: values.file,
            divisionId: values.divisionId,
            subdivisionId: values.subdivisionId,
            picId: values.picId,
            notes: values.notes,
            updatedByAccount: accountUsername,
          },
          {
            onSuccess: () => {
              actions.setSubmitting(false);
              actions.setStatus({
                successMessage: "Metadata dokumen berhasil diperbarui.",
              });
              onCompleted?.();
            },
            onError: (error) => {
              actions.setSubmitting(false);
              actions.setStatus({
                submitError: getErrorMessage(
                  error,
                  "Metadata belum bisa diperbarui. Coba lagi sebentar.",
                ),
              });
            },
          },
        );

        return;
      }

      uploadDocumentMutation.mutate(
        {
          title: values.title,
          file: values.file as File,
          divisionId: values.divisionId,
          subdivisionId: values.subdivisionId,
          picId: values.picId,
          notes: values.notes,
          uploadedByAccount: accountUsername,
        },
        {
          onSuccess: () => {
            actions.resetForm();
            actions.setSubmitting(false);
            actions.setStatus({
              successMessage: "Dokumen berhasil diunggah.",
            });
            onCompleted?.();
          },
          onError: (error) => {
            actions.setSubmitting(false);
            actions.setStatus({
              submitError: getErrorMessage(
                error,
                "Dokumen belum bisa diunggah. Coba lagi sebentar.",
              ),
            });
          },
        },
      );
    },
  });

  const subdivisionOptions = useMemo(
    () => getSubdivisionsByDivision(divisions, formik.values.divisionId),
    [divisions, formik.values.divisionId],
  );

  const picOptions = useMemo(
    () => getPicsByDivision(divisions, formik.values.divisionId),
    [divisions, formik.values.divisionId],
  );

  const handleDivisionChange = (divisionId: string) => {
    formik.setFieldValue("divisionId", divisionId);
    formik.setFieldValue("subdivisionId", "");
    formik.setFieldValue("picId", "");
  };

  return {
    formik,
    isEditMode,
    isSubmitting:
      formik.isSubmitting ||
      uploadDocumentMutation.isPending ||
      updateDocumentMetadataMutation.isPending,
    subdivisionOptions,
    picOptions,
    handleDivisionChange,
  };
}
