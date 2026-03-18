"use client";

import { useCallback, useMemo, useState } from "react";
import type { FormikHelpers } from "formik";
import type { LecturerProfile } from "./useLecturerPortal";
import type { HubDocument, Project, ProjectInput } from "./useSdgsHubData";
import { useSdgsHub } from "./useSdgsHubData";
import {
  PROJECT_INITIAL_VALUES,
  PROJECT_VALIDATION_SCHEMA,
  SDG_OPTIONS,
} from "./useProjectForm";
import type { ProjectFormValues } from "./useProjectForm";

interface UseCreateResearchOptions {
  lecturer: LecturerProfile | null;
  onSuccess?: () => void;
}

export function useCreateResearch(options: UseCreateResearchOptions) {
  const { addProject } = useSdgsHub();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const lecturer = options.lecturer;

  const initialValues: ProjectFormValues = useMemo(
    () => ({
      ...PROJECT_INITIAL_VALUES,
      dosenName: lecturer?.name ?? "",
      dosenPhone: lecturer?.phone ?? "",
    }),
    [lecturer],
  );

  const onSubmit = useCallback(
    (
      values: ProjectFormValues,
      actions: FormikHelpers<ProjectFormValues>,
      document?: HubDocument,
    ) => {
      const projectData: ProjectInput = {
        lecturerId: lecturer?.id ?? "external-lecturer",
        title: values.title,
        description: values.description,
        dosenName: values.dosenName,
        dosenPhone: values.dosenPhone,
        sdgCategory: values.sdgCategory,
        teamSlots: values.teamSlots,
        tags: values.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        documents: document ? [document] : undefined,
      };

      addProject(projectData);
      setIsSubmitted(true);
      actions.resetForm();
      actions.setSubmitting(false);
      options.onSuccess?.();

      setTimeout(() => setIsSubmitted(false), 3000);
    },
    [addProject, lecturer, options],
  );

  return {
    initialValues,
    validationSchema: PROJECT_VALIDATION_SCHEMA,
    onSubmit,
    sdgOptions: SDG_OPTIONS,
    isSubmitted,
  };
}

export function useDeleteResearch() {
  const { deleteProject } = useSdgsHub();

  const deleteResearch = useCallback(
    (projectId: string) => {
      deleteProject(projectId);
    },
    [deleteProject],
  );

  return { deleteResearch };
}

interface UseUpdateResearchOptions {
  onSuccess?: () => void;
}

export function useUpdateResearch(
  project: Project | null,
  options: UseUpdateResearchOptions,
) {
  const { updateProject } = useSdgsHub();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const initialValues: ProjectFormValues = useMemo(
    () => ({
      title: project?.title ?? "",
      description: project?.description ?? "",
      dosenName: project?.dosenName ?? "",
      dosenPhone: project?.dosenPhone ?? "",
      sdgCategory: project?.sdgCategory ?? "",
      teamSlots: project?.teamSlots ?? 3,
      tags: project?.tags.join(", ") ?? "",
    }),
    [project],
  );

  const onSubmit = useCallback(
    (
      values: ProjectFormValues,
      actions: FormikHelpers<ProjectFormValues>,
      document?: HubDocument,
    ) => {
      if (!project) return;

      const projectData: ProjectInput = {
        lecturerId: project.lecturerId,
        title: values.title,
        description: values.description,
        dosenName: values.dosenName,
        dosenPhone: values.dosenPhone,
        sdgCategory: values.sdgCategory,
        teamSlots: values.teamSlots,
        tags: values.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        documents: document ? [document] : undefined,
      };

      updateProject(project.id, projectData);
      setIsSubmitted(true);
      actions.setSubmitting(false);
      options.onSuccess?.();

      setTimeout(() => setIsSubmitted(false), 3000);
    },
    [updateProject, project, options],
  );

  return {
    initialValues,
    validationSchema: PROJECT_VALIDATION_SCHEMA,
    onSubmit,
    sdgOptions: SDG_OPTIONS,
    isSubmitted,
  };
}
