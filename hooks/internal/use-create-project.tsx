"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  getInternalProjectPath,
} from "@/components/sdg-dashboard/dashboard-data";
import createProject from "@/services/internal/create-project";
import {
  CreateProjectFormValues,
  CREATE_PROJECT_INITIAL_VALUES,
  CreateProjectPayload,
} from "@/types/internal";
import { getErrorMessage } from "@/utils/api-error";
import generateSlug from "@/utils/generate-slug";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .min(3, "Nama project minimal 3 karakter.")
    .required("Nama project wajib diisi."),
  partner_organization_name: Yup.string()
    .trim()
    .min(3, "Nama mitra minimal 3 karakter.")
    .required("Nama mitra wajib diisi."),
});

const useCreateProject = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (payload: CreateProjectPayload) => createProject(payload),
    mutationKey: ["project", "create"],
  });

  const formik = useFormik<CreateProjectFormValues>({
    initialValues: {
      ...CREATE_PROJECT_INITIAL_VALUES,
    },
    validationSchema,
    onSubmit: async (values, actions) => {
      actions.setStatus(undefined);

      try {
        const payload: CreateProjectPayload = {
          ...values,
          slug: generateSlug(values.title),
        };
        const createdProject = await mutateAsync(payload);
        await queryClient.invalidateQueries({
          queryKey: ["sdg-dashboard", "projects"],
        });

        router.push(getInternalProjectPath(createdProject.slug));
      } catch (error) {
        actions.setStatus({
          submitError: getErrorMessage(
            error,
            "Project belum bisa dibuat. Coba lagi sebentar.",
          ),
        });
      } finally {
        actions.setSubmitting(false);
      }
    },
  });

  return {
    isPending,
    formik,
  };
};

export default useCreateProject;
