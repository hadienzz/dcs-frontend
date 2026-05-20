"use client";

import { useCallback, useMemo, useState } from "react";

import type { Directorate, DirectorateField, Unit } from "@/types/sdgs-dashboard";
import {
  useCreateSdgsDirectorate,
  useCreateSdgsDirectorateField,
  useCreateSdgsUnit,
  useDeleteSdgsDirectorate,
  useDeleteSdgsDirectorateField,
  useDeleteSdgsUnit,
  useSdgsDirectorateFields,
  useUpdateSdgsDirectorate,
  useUpdateSdgsDirectorateField,
  useUpdateSdgsUnit,
} from "./use-sdgs-directorates";

export type DirectorateModalMode =
  | { type: "add-field" }
  | { type: "edit-field"; field: DirectorateField }
  | { type: "add-directorate"; fieldId: string }
  | { type: "edit-directorate"; fieldId: string; directorate: Directorate }
  | { type: "add-unit"; fieldId: string; directorateId: string }
  | { type: "edit-unit"; fieldId: string; directorateId: string; unit: Unit }
  | null;

export type DirectorateModalSubmitValues = {
  name: string;
  fieldId: string;
  directorateId: string;
};

export type DirectorateDeleteTarget =
  | { type: "field"; field: DirectorateField }
  | { type: "directorate"; field: DirectorateField; directorate: Directorate }
  | {
      type: "unit";
      field: DirectorateField;
      directorate: Directorate;
      unit: Unit;
    };

export function useDirectoratesManagement() {
  const directorateFieldsQuery = useSdgsDirectorateFields();
  const fields = directorateFieldsQuery.fields;
  const createFieldMutation = useCreateSdgsDirectorateField();
  const updateFieldMutation = useUpdateSdgsDirectorateField();
  const deleteFieldMutation = useDeleteSdgsDirectorateField();
  const createDirectorateMutation = useCreateSdgsDirectorate();
  const updateDirectorateMutation = useUpdateSdgsDirectorate();
  const deleteDirectorateMutation = useDeleteSdgsDirectorate();
  const createUnitMutation = useCreateSdgsUnit();
  const updateUnitMutation = useUpdateSdgsUnit();
  const deleteUnitMutation = useDeleteSdgsUnit();
  const [modal, setModal] = useState<DirectorateModalMode>(null);
  const [pendingDeleteTarget, setPendingDeleteTarget] =
    useState<DirectorateDeleteTarget | null>(null);
  const [expandedFields, setExpandedFields] = useState<Set<string>>(
    () => new Set(fields.map((field) => field.id)),
  );
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

  const stats = useMemo(() => {
    const directorates = fields.reduce(
      (total, field) => total + field.directorates.length,
      0,
    );
    const units = fields.reduce(
      (total, field) =>
        total +
        field.directorates.reduce(
          (directorateTotal, directorate) =>
            directorateTotal + directorate.units.length,
          0,
        ),
      0,
    );

    return { fields: fields.length, directorates, units };
  }, [fields]);

  const isSaving =
    createFieldMutation.isPending ||
    updateFieldMutation.isPending ||
    createDirectorateMutation.isPending ||
    updateDirectorateMutation.isPending ||
    createUnitMutation.isPending ||
    updateUnitMutation.isPending;

  const isDeleting =
    deleteFieldMutation.isPending ||
    deleteDirectorateMutation.isPending ||
    deleteUnitMutation.isPending;

  const toggleField = useCallback((id: string) => {
    setExpandedFields((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleDir = useCallback((id: string) => {
    setExpandedDirs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSubmitModal = useCallback(
    (values: DirectorateModalSubmitValues) => {
      if (!modal) {
        return;
      }

      if (modal.type === "add-field") {
        createFieldMutation.mutate(
          { name: values.name },
          {
            onSuccess: (nextFields) => {
              setExpandedFields(new Set(nextFields.map((field) => field.id)));
            },
          },
        );
      }

      if (modal.type === "edit-field") {
        updateFieldMutation.mutate({
          fieldId: modal.field.id,
          name: values.name,
        });
      }

      if (modal.type === "add-directorate") {
        createDirectorateMutation.mutate({
          fieldId: values.fieldId,
          name: values.name,
        });
        setExpandedFields((prev) => new Set(prev).add(values.fieldId));
      }

      if (modal.type === "edit-directorate") {
        updateDirectorateMutation.mutate({
          fieldId: modal.fieldId,
          directorateId: modal.directorate.id,
          name: values.name,
          targetFieldId: values.fieldId,
        });
        setExpandedFields((prev) => new Set(prev).add(values.fieldId));
      }

      if (modal.type === "add-unit") {
        createUnitMutation.mutate({
          fieldId: values.fieldId,
          directorateId: values.directorateId,
          name: values.name,
        });
        setExpandedDirs((prev) => new Set(prev).add(values.directorateId));
      }

      if (modal.type === "edit-unit") {
        updateUnitMutation.mutate({
          fieldId: modal.fieldId,
          directorateId: modal.directorateId,
          unitId: modal.unit.id,
          name: values.name,
          targetFieldId: values.fieldId,
          targetDirectorateId: values.directorateId,
        });
        setExpandedDirs((prev) => new Set(prev).add(values.directorateId));
      }

      setModal(null);
    },
    [
      createDirectorateMutation,
      createFieldMutation,
      createUnitMutation,
      modal,
      updateDirectorateMutation,
      updateFieldMutation,
      updateUnitMutation,
    ],
  );

  const handleDeleteDialogOpenChange = useCallback(
    (open: boolean) => {
      if (!open && !isDeleting) {
        setPendingDeleteTarget(null);
      }
    },
    [isDeleting],
  );

  const handleConfirmDelete = useCallback(() => {
    if (!pendingDeleteTarget) {
      return;
    }

    if (pendingDeleteTarget.type === "field") {
      deleteFieldMutation.mutate(pendingDeleteTarget.field.id, {
        onSuccess: () => {
          setExpandedFields((prev) => {
            const next = new Set(prev);
            next.delete(pendingDeleteTarget.field.id);
            return next;
          });
          setPendingDeleteTarget(null);
        },
      });
    }

    if (pendingDeleteTarget.type === "directorate") {
      deleteDirectorateMutation.mutate(
        {
          fieldId: pendingDeleteTarget.field.id,
          directorateId: pendingDeleteTarget.directorate.id,
        },
        {
          onSuccess: () => {
            setExpandedDirs((prev) => {
              const next = new Set(prev);
              next.delete(pendingDeleteTarget.directorate.id);
              return next;
            });
            setPendingDeleteTarget(null);
          },
        },
      );
    }

    if (pendingDeleteTarget.type === "unit") {
      deleteUnitMutation.mutate(
        {
          fieldId: pendingDeleteTarget.field.id,
          directorateId: pendingDeleteTarget.directorate.id,
          unitId: pendingDeleteTarget.unit.id,
        },
        {
          onSuccess: () => {
            setPendingDeleteTarget(null);
          },
        },
      );
    }
  }, [
    deleteDirectorateMutation,
    deleteFieldMutation,
    deleteUnitMutation,
    pendingDeleteTarget,
  ]);

  return {
    fields,
    stats,
    modal,
    setModal,
    expandedFields,
    expandedDirs,
    isFetching: directorateFieldsQuery.isFetching,
    isError: directorateFieldsQuery.isError,
    error: directorateFieldsQuery.error,
    isSaving,
    isDeleting,
    pendingDeleteTarget,
    toggleField,
    toggleDir,
    submitModal: handleSubmitModal,
    requestDeleteField: (field: DirectorateField) =>
      setPendingDeleteTarget({ type: "field", field }),
    requestDeleteDirectorate: (
      field: DirectorateField,
      directorate: Directorate,
    ) =>
      setPendingDeleteTarget({
        type: "directorate",
        field,
        directorate,
      }),
    requestDeleteUnit: (
      field: DirectorateField,
      directorate: Directorate,
      unit: Unit,
    ) =>
      setPendingDeleteTarget({
        type: "unit",
        field,
        directorate,
        unit,
      }),
    deleteDialogActions: {
      onOpenChange: handleDeleteDialogOpenChange,
      onConfirm: handleConfirmDelete,
    },
  };
}
