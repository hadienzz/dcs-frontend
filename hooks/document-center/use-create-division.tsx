"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getMutationMessage,
  notifyMutationError,
  notifyMutationSuccess,
  type DocumentCenterMutationOptions,
} from "@/hooks/document-center/mutation-feedback";
import createDivision from "@/services/document-center/create-division";
import type { DivisionPayload } from "@/types/document-center";
import { DOCUMENT_CENTER_QUERY_KEY } from "@/hooks/document-center/query-key";

type CreateDivisionResult = Awaited<ReturnType<typeof createDivision>>;

export function useCreateDivisionMutation(
  options: DocumentCenterMutationOptions<
    CreateDivisionResult,
    DivisionPayload
  > = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DivisionPayload) => createDivision(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_CENTER_QUERY_KEY });
      notifyMutationSuccess(
        getMutationMessage(
          options.successMessage,
          "Divisi berhasil ditambahkan.",
        ),
      );
      options.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      notifyMutationError(
        error,
        getMutationMessage(
          options.errorMessage,
          "Divisi belum bisa ditambahkan.",
        ),
      );
      options.onError?.(error, variables);
    },
  });
}

export default useCreateDivisionMutation;
