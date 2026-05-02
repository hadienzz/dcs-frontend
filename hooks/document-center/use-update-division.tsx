"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getMutationMessage,
  notifyMutationError,
  notifyMutationSuccess,
  type DocumentCenterMutationOptions,
} from "@/hooks/document-center/mutation-feedback";
import updateDivision from "@/services/document-center/update-division";
import type { DivisionPayload } from "@/types/document-center";
import { DOCUMENT_CENTER_QUERY_KEY } from "@/hooks/document-center/query-key";

type UpdateDivisionPayload = { divisionId: string; values: DivisionPayload };
type UpdateDivisionResult = Awaited<ReturnType<typeof updateDivision>>;

export function useUpdateDivisionMutation(
  options: DocumentCenterMutationOptions<
    UpdateDivisionResult,
    UpdateDivisionPayload
  > = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDivisionPayload) =>
      updateDivision(payload.divisionId, payload.values),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_CENTER_QUERY_KEY });
      notifyMutationSuccess(
        getMutationMessage(
          options.successMessage,
          "Divisi berhasil diperbarui.",
        ),
      );
      options.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      notifyMutationError(
        error,
        getMutationMessage(
          options.errorMessage,
          "Divisi belum bisa diperbarui.",
        ),
      );
      options.onError?.(error, variables);
    },
  });
}

export default useUpdateDivisionMutation;
