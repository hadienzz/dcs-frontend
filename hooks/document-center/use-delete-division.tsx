"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getMutationMessage,
  notifyMutationError,
  notifyMutationSuccess,
  type DocumentCenterMutationOptions,
} from "@/hooks/document-center/mutation-feedback";
import deleteDivision from "@/services/document-center/delete-division";
import { DOCUMENT_CENTER_QUERY_KEY } from "@/hooks/document-center/query-key";

type DeleteDivisionResult = Awaited<ReturnType<typeof deleteDivision>>;

export function useDeleteDivisionMutation(
  options: DocumentCenterMutationOptions<DeleteDivisionResult, string> = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (divisionId: string) => deleteDivision(divisionId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_CENTER_QUERY_KEY });
      notifyMutationSuccess(
        getMutationMessage(
          options.successMessage,
          "Divisi berhasil dihapus.",
        ),
      );
      options.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      notifyMutationError(
        error,
        getMutationMessage(
          options.errorMessage,
          "Divisi belum bisa dihapus.",
        ),
      );
      options.onError?.(error, variables);
    },
  });
}

export default useDeleteDivisionMutation;
