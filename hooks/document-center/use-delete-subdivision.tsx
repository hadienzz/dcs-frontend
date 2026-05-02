"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getMutationMessage,
  notifyMutationError,
  notifyMutationSuccess,
  type DocumentCenterMutationOptions,
} from "@/hooks/document-center/mutation-feedback";
import deleteSubdivision from "@/services/document-center/delete-subdivision";
import { DOCUMENT_CENTER_QUERY_KEY } from "@/hooks/document-center/query-key";

type DeleteSubdivisionPayload = { divisionId: string; subdivisionId: string };
type DeleteSubdivisionResult = Awaited<ReturnType<typeof deleteSubdivision>>;

export function useDeleteSubdivisionMutation(
  options: DocumentCenterMutationOptions<
    DeleteSubdivisionResult,
    DeleteSubdivisionPayload
  > = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeleteSubdivisionPayload) =>
      deleteSubdivision(payload.divisionId, payload.subdivisionId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_CENTER_QUERY_KEY });
      notifyMutationSuccess(
        getMutationMessage(
          options.successMessage,
          "Subdivisi berhasil dihapus.",
        ),
      );
      options.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      notifyMutationError(
        error,
        getMutationMessage(
          options.errorMessage,
          "Subdivisi belum bisa dihapus.",
        ),
      );
      options.onError?.(error, variables);
    },
  });
}

export default useDeleteSubdivisionMutation;
