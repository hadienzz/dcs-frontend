"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getMutationMessage,
  notifyMutationError,
  notifyMutationSuccess,
  type DocumentCenterMutationOptions,
} from "@/hooks/document-center/mutation-feedback";
import createSubdivision from "@/services/document-center/create-subdivision";
import type { SubdivisionPayload } from "@/types/document-center";
import { DOCUMENT_CENTER_QUERY_KEY } from "@/hooks/document-center/query-key";

type CreateSubdivisionResult = Awaited<ReturnType<typeof createSubdivision>>;

export function useCreateSubdivisionMutation(
  options: DocumentCenterMutationOptions<
    CreateSubdivisionResult,
    SubdivisionPayload
  > = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubdivisionPayload) => createSubdivision(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_CENTER_QUERY_KEY });
      notifyMutationSuccess(
        getMutationMessage(
          options.successMessage,
          "Subdivisi berhasil ditambahkan.",
        ),
      );
      options.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      notifyMutationError(
        error,
        getMutationMessage(
          options.errorMessage,
          "Subdivisi belum bisa ditambahkan.",
        ),
      );
      options.onError?.(error, variables);
    },
  });
}

export default useCreateSubdivisionMutation;
