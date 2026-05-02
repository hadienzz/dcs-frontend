"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getMutationMessage,
  notifyMutationError,
  notifyMutationSuccess,
  type DocumentCenterMutationOptions,
} from "@/hooks/document-center/mutation-feedback";
import deleteUser from "@/services/document-center/delete-user";
import { DOCUMENT_CENTER_QUERY_KEY } from "@/hooks/document-center/query-key";

type DeleteUserResult = Awaited<ReturnType<typeof deleteUser>>;

export function useDeleteUserMutation(
  options: DocumentCenterMutationOptions<DeleteUserResult, string> = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_CENTER_QUERY_KEY });
      notifyMutationSuccess(
        getMutationMessage(options.successMessage, "User berhasil dihapus."),
      );
      options.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      notifyMutationError(
        error,
        getMutationMessage(options.errorMessage, "User belum bisa dihapus."),
      );
      options.onError?.(error, variables);
    },
  });
}

export default useDeleteUserMutation;
