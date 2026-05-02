"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getMutationMessage,
  notifyMutationError,
  notifyMutationSuccess,
  type DocumentCenterMutationOptions,
} from "@/hooks/document-center/mutation-feedback";
import updateSubdivision from "@/services/document-center/update-subdivision";
import type { SubdivisionPayload } from "@/types/document-center";
import { DOCUMENT_CENTER_QUERY_KEY } from "@/hooks/document-center/query-key";

type UpdateSubdivisionPayload = {
  subdivisionId: string;
  values: SubdivisionPayload;
};
type UpdateSubdivisionResult = Awaited<ReturnType<typeof updateSubdivision>>;

export function useUpdateSubdivisionMutation(
  options: DocumentCenterMutationOptions<
    UpdateSubdivisionResult,
    UpdateSubdivisionPayload
  > = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSubdivisionPayload) =>
      updateSubdivision(payload.subdivisionId, payload.values),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_CENTER_QUERY_KEY });
      notifyMutationSuccess(
        getMutationMessage(
          options.successMessage,
          "Subdivisi berhasil diperbarui.",
        ),
      );
      options.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      notifyMutationError(
        error,
        getMutationMessage(
          options.errorMessage,
          "Subdivisi belum bisa diperbarui.",
        ),
      );
      options.onError?.(error, variables);
    },
  });
}

export default useUpdateSubdivisionMutation;
