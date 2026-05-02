"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getMutationMessage,
  notifyMutationError,
  notifyMutationSuccess,
  type DocumentCenterMutationOptions,
} from "@/hooks/document-center/mutation-feedback";
import updateDocumentMetadata from "@/services/document-center/update-document-metadata";
import type { UpdateDocumentMetadataPayload } from "@/types/document-center";
import { DOCUMENT_CENTER_QUERY_KEY } from "@/hooks/document-center/query-key";

type UpdateDocumentMetadataResult = Awaited<
  ReturnType<typeof updateDocumentMetadata>
>;

export function useUpdateDocumentMetadataMutation(
  options: DocumentCenterMutationOptions<
    UpdateDocumentMetadataResult,
    UpdateDocumentMetadataPayload
  > = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDocumentMetadataPayload) =>
      updateDocumentMetadata(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_CENTER_QUERY_KEY });
      notifyMutationSuccess(
        getMutationMessage(
          options.successMessage,
          "Metadata dokumen berhasil diperbarui.",
        ),
      );
      options.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      notifyMutationError(
        error,
        getMutationMessage(
          options.errorMessage,
          "Metadata belum bisa diperbarui. Coba lagi sebentar.",
        ),
      );
      options.onError?.(error, variables);
    },
  });
}

export default useUpdateDocumentMetadataMutation;
