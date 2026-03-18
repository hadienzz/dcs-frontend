"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";

import register from "@/services/auth/register";
import {
  AUTH_ME_QUERY_KEY,
  REGISTER_INITIAL_VALUES,
  RegisterFormValues,
  RegisterPayload,
  SdgDashboardAccount,
} from "@/types/auth";
import { getErrorMessage } from "@/utils/api-error";

interface UseRegisterOptions {
  onSuccess?: (user: SdgDashboardAccount) => void;
  onError?: (message: string) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const useRegister = (options?: UseRegisterOptions) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    mutationKey: ["auth", "register"],
    onSuccess: ({ user }) => {
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, user);
      options?.onSuccess?.(user);
    },
  });

  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      ...REGISTER_INITIAL_VALUES,
    },
    onSubmit: async (values, actions) => {
      const normalizedName = values.name.trim();
      const normalizedOrganization = values.organization.trim();
      const normalizedEmail = values.email.trim().toLowerCase();
      const normalizedPassword = values.password.trim();
      const normalizedConfirmPassword = values.confirmPassword.trim();

      if (!normalizedName) {
        options?.onError?.("Nama wajib diisi.");
        actions.setSubmitting(false);
        return;
      }

      if (!normalizedOrganization) {
        options?.onError?.("Instansi wajib diisi.");
        actions.setSubmitting(false);
        return;
      }

      if (!normalizedEmail) {
        options?.onError?.("Email wajib diisi.");
        actions.setSubmitting(false);
        return;
      }

      if (!EMAIL_REGEX.test(normalizedEmail)) {
        options?.onError?.("Format email belum valid.");
        actions.setSubmitting(false);
        return;
      }

      if (normalizedPassword.length < 8) {
        options?.onError?.("Password minimal 8 karakter.");
        actions.setSubmitting(false);
        return;
      }

      if (normalizedPassword !== normalizedConfirmPassword) {
        options?.onError?.("Konfirmasi password belum sama.");
        actions.setSubmitting(false);
        return;
      }

      try {
        await mutateAsync({
          name: normalizedName,
          organization: normalizedOrganization,
          email: normalizedEmail,
          password: normalizedPassword,
        });
      } catch (error) {
        options?.onError?.(getErrorMessage(error, "Akun belum bisa dibuat."));
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

export default useRegister;
