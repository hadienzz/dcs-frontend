"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getMutationMessage,
  notifyMutationError,
  notifyMutationSuccess,
  type DocumentCenterMutationOptions,
} from "@/hooks/document-center/mutation-feedback";
import deleteDocument from "@/services/document-center/delete-document";
import { DOCUMENT_CENTER_QUERY_KEY } from "@/hooks/document-center/query-key";

type DeleteDocumentResult = Awaited<ReturnType<typeof deleteDocument>>;

export function useDeleteDocumentMutation(
  options: DocumentCenterMutationOptions<DeleteDocumentResult, string> = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => deleteDocument(documentId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_CENTER_QUERY_KEY });
      notifyMutationSuccess(
        getMutationMessage(options.successMessage, "Dokumen berhasil dihapus."),
      );
      options.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      notifyMutationError(
        error,
        getMutationMessage(options.errorMessage, "Dokumen belum bisa dihapus."),
      );
      options.onError?.(error, variables);
    },
  });
}

export default useDeleteDocumentMutation;
