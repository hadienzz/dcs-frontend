"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";

import joinProject from "@/services/external/join-project";
import {
  JOIN_PROJECT_INITIAL_VALUES,
  JoinProjectFormValues,
} from "@/types/external";
import { SDG_DASHBOARD_PROJECTS_QUERY_KEY } from "@/types/internal";
import { getErrorMessage } from "@/utils/api-error";

interface UseJoinProjectOptions {
  onSuccess?: (projectSlug: string) => void;
  onError?: (message: string) => void;
}

function normalizeInvitationCode(value: string) {
  return value.replace(/\s+/g, "").toUpperCase();
}

const useJoinProject = (options?: UseJoinProjectOptions) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (invitationCode: string) =>
      joinProject({
        invitation_code: invitationCode,
      }),
    mutationKey: ["external", "join-project"],
    onSuccess: async (project) => {
      await queryClient.invalidateQueries({
        queryKey: SDG_DASHBOARD_PROJECTS_QUERY_KEY,
      });
      options?.onSuccess?.(project.slug);
    },
  });

  const formik = useFormik<JoinProjectFormValues>({
    initialValues: {
      ...JOIN_PROJECT_INITIAL_VALUES,
    },
    onSubmit: async (values, actions) => {
      const normalizedCode = normalizeInvitationCode(values.invitationCode);

      if (!normalizedCode) {
        const message = "Masukkan invitation code terlebih dahulu.";
        actions.setStatus({
          submitError: message,
        });
        options?.onError?.(message);
        actions.setSubmitting(false);
        return;
      }

      actions.setStatus(undefined);

      try {
        await mutateAsync(normalizedCode);
      } catch (error) {
        const message = getErrorMessage(
          error,
          "Invitation code belum terdaftar. Cek lagi kode yang dibagikan tim internal.",
        );
        actions.setStatus({
          submitError: message,
        });
        options?.onError?.(message);
      } finally {
        actions.setSubmitting(false);
      }
    },
  });

  return {
    formik,
    isPending,
  };
};

export default useJoinProject;
