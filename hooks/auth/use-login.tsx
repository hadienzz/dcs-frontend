"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";

import login from "@/services/auth/login";
import {
  AUTH_ME_QUERY_KEY,
  LOGIN_INITIAL_VALUES,
  LoginFormValues,
  LoginPayload,
  SdgDashboardAccount,
} from "@/types/auth";
import { getErrorMessage } from "@/utils/api-error";

interface UseLoginOptions {
  onSuccess?: (user: SdgDashboardAccount) => void;
  onError?: (message: string) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const useLogin = (options?: UseLoginOptions) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: LoginPayload) => login(values),
    mutationKey: ["auth", "login"],
    onSuccess: ({ user }) => {
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, user);
      options?.onSuccess?.(user);
    },
  });

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      ...LOGIN_INITIAL_VALUES,
    },
    onSubmit: async (values, actions) => {
      const normalizedEmail = values.email.trim().toLowerCase();
      const normalizedPassword = values.password.trim();

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

      if (!normalizedPassword) {
        options?.onError?.("Password wajib diisi.");
        actions.setSubmitting(false);
        return;
      }

      try {
        await mutateAsync({
          email: normalizedEmail,
          password: normalizedPassword,
        });
      } catch (error) {
        options?.onError?.(
          getErrorMessage(
            error,
            "Login gagal. Pastikan email dan password benar.",
          ),
        );
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

export default useLogin;
