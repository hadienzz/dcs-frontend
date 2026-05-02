"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getMutationMessage,
  notifyMutationError,
  notifyMutationSuccess,
  type DocumentCenterMutationOptions,
} from "@/hooks/document-center/mutation-feedback";
import updateUser from "@/services/document-center/update-user";
import type { UpdateUserPayload } from "@/types/document-center";
import { DOCUMENT_CENTER_QUERY_KEY } from "@/hooks/document-center/query-key";

type UpdateUserResult = Awaited<ReturnType<typeof updateUser>>;

export function useUpdateUserMutation(
  options: DocumentCenterMutationOptions<UpdateUserResult, UpdateUserPayload> = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_CENTER_QUERY_KEY });
      notifyMutationSuccess(
        getMutationMessage(options.successMessage, "User berhasil diperbarui."),
      );
      options.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      notifyMutationError(
        error,
        getMutationMessage(options.errorMessage, "User belum bisa diperbarui."),
      );
      options.onError?.(error, variables);
    },
  });
}

export default useUpdateUserMutation;
