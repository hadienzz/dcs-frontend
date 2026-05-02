"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getMutationMessage,
  notifyMutationError,
  notifyMutationSuccess,
  type DocumentCenterMutationOptions,
} from "@/hooks/document-center/mutation-feedback";
import uploadDocument from "@/services/document-center/upload-document";
import type { CreateDocumentPayload } from "@/types/document-center";
import { DOCUMENT_CENTER_QUERY_KEY } from "@/hooks/document-center/query-key";

type UploadDocumentResult = Awaited<ReturnType<typeof uploadDocument>>;

export function useUploadDocumentMutation(
  options: DocumentCenterMutationOptions<
    UploadDocumentResult,
    CreateDocumentPayload
  > = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDocumentPayload) => uploadDocument(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_CENTER_QUERY_KEY });
      notifyMutationSuccess(
        getMutationMessage(
          options.successMessage,
          "Dokumen berhasil diunggah.",
        ),
      );
      options.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      notifyMutationError(
        error,
        getMutationMessage(
          options.errorMessage,
          "Dokumen belum bisa diunggah. Coba lagi sebentar.",
        ),
      );
      options.onError?.(error, variables);
    },
  });
}

export default useUploadDocumentMutation;
