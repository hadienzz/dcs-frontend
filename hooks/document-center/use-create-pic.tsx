"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getMutationMessage,
  notifyMutationError,
  notifyMutationSuccess,
  type DocumentCenterMutationOptions,
} from "@/hooks/document-center/mutation-feedback";
import createPic from "@/services/document-center/create-pic";
import type { PicPayload } from "@/types/document-center";
import { DOCUMENT_CENTER_QUERY_KEY } from "@/hooks/document-center/query-key";

type CreatePicResult = Awaited<ReturnType<typeof createPic>>;

export function useCreatePicMutation(
  options: DocumentCenterMutationOptions<CreatePicResult, PicPayload> = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PicPayload) => createPic(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_CENTER_QUERY_KEY });
      notifyMutationSuccess(
        getMutationMessage(options.successMessage, "PIC berhasil ditambahkan."),
      );
      options.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      notifyMutationError(
        error,
        getMutationMessage(options.errorMessage, "PIC belum bisa ditambahkan."),
      );
      options.onError?.(error, variables);
    },
  });
}

export default useCreatePicMutation;
