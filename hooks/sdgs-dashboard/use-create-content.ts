"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import createContent, {
  type CreateContentResponse,
} from "@/services/sdgs-dashboard/create-content";
import type { SdgsDashboardFormValues } from "@/types/sdgs-dashboard";
import { getErrorMessage } from "@/utils/api-error";

export type UseCreateContentOptions = {
  onSuccess?: (response: CreateContentResponse) => void;
};

export type UseCreateContentResult = {
  mutate: (values: SdgsDashboardFormValues) => void;
  isPending: boolean;
};

/**
 * Mutation hook for submitting the Content_Form. Wraps `useMutation` so the
 * Content_Form component stays free of network or async-state concerns.
 *
 * - `onSuccess` toasts a success message and forwards the response to the
 *   optional `onSuccess` from the caller (typically used to reset the form).
 * - `onError` shows a friendly toast built from `getErrorMessage`.
 */
const useCreateContent = (
  options?: UseCreateContentOptions,
): UseCreateContentResult => {
  const mutation = useMutation({
    mutationKey: ["sdgs-dashboard", "content", "create"],
    mutationFn: (values: SdgsDashboardFormValues) => createContent(values),
    onSuccess: (response) => {
      toast.success("Konten berhasil disimpan.");
      options?.onSuccess?.(response);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Gagal menyimpan konten."));
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useCreateContent;
