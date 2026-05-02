import { toast } from "sonner";

import { getErrorMessage } from "@/utils/api-error";

export interface DocumentCenterMutationOptions<TData, TVariables> {
  successMessage?: string | null;
  errorMessage?: string | null;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: unknown, variables: TVariables) => void;
}

export function notifyMutationSuccess(message?: string | null) {
  if (message) {
    toast.success(message);
  }
}

export function notifyMutationError(
  error: unknown,
  fallbackMessage?: string | null,
) {
  if (fallbackMessage) {
    toast.error(getErrorMessage(error, fallbackMessage));
  }
}

export function getMutationMessage(
  message: string | null | undefined,
  fallbackMessage: string,
) {
  return message === null ? null : message ?? fallbackMessage;
}
