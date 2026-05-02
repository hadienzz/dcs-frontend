"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getMutationMessage,
  notifyMutationError,
  notifyMutationSuccess,
  type DocumentCenterMutationOptions,
} from "@/hooks/document-center/mutation-feedback";
import createUser from "@/services/document-center/create-user";
import type { UserPayload } from "@/types/document-center";
import { DOCUMENT_CENTER_QUERY_KEY } from "@/hooks/document-center/query-key";

type CreateUserResult = Awaited<ReturnType<typeof createUser>>;

export function useCreateUserMutation(
  options: DocumentCenterMutationOptions<CreateUserResult, UserPayload> = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UserPayload) => createUser(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_CENTER_QUERY_KEY });
      notifyMutationSuccess(
        getMutationMessage(options.successMessage, "User berhasil dibuat."),
      );
      options.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      notifyMutationError(
        error,
        getMutationMessage(options.errorMessage, "User belum bisa dibuat."),
      );
      options.onError?.(error, variables);
    },
  });
}

export default useCreateUserMutation;
