"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getMutationMessage,
  notifyMutationError,
  notifyMutationSuccess,
  type DocumentCenterMutationOptions,
} from "@/hooks/document-center/mutation-feedback";
import updatePic from "@/services/document-center/update-pic";
import type { UpdatePicPayload } from "@/types/document-center";
import { DOCUMENT_CENTER_QUERY_KEY } from "@/hooks/document-center/query-key";

type UpdatePicResult = Awaited<ReturnType<typeof updatePic>>;

export function useUpdatePicMutation(
  options: DocumentCenterMutationOptions<UpdatePicResult, UpdatePicPayload> = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePicPayload) => updatePic(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_CENTER_QUERY_KEY });
      notifyMutationSuccess(
        getMutationMessage(options.successMessage, "PIC berhasil diperbarui."),
      );
      options.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      notifyMutationError(
        error,
        getMutationMessage(options.errorMessage, "PIC belum bisa diperbarui."),
      );
      options.onError?.(error, variables);
    },
  });
}

export default useUpdatePicMutation;
