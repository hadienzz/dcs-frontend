"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getMutationMessage,
  notifyMutationError,
  notifyMutationSuccess,
  type DocumentCenterMutationOptions,
} from "@/hooks/document-center/mutation-feedback";
import deletePic from "@/services/document-center/delete-pic";
import { DOCUMENT_CENTER_QUERY_KEY } from "@/hooks/document-center/query-key";

type DeletePicResult = Awaited<ReturnType<typeof deletePic>>;

export function useDeletePicMutation(
  options: DocumentCenterMutationOptions<DeletePicResult, string> = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (picId: string) => deletePic(picId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_CENTER_QUERY_KEY });
      notifyMutationSuccess(
        getMutationMessage(options.successMessage, "PIC berhasil dihapus."),
      );
      options.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      notifyMutationError(
        error,
        getMutationMessage(options.errorMessage, "PIC belum bisa dihapus."),
      );
      options.onError?.(error, variables);
    },
  });
}

export default useDeletePicMutation;
