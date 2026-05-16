"use client";

import { useCreateDivisionMutation } from "@/hooks/document-center/use-create-division";
import { useCreateSubdivisionMutation } from "@/hooks/document-center/use-create-subdivision";
import { useDivisionDeleteDialog } from "@/hooks/document-center/use-division-delete-dialog";
import { useSubdivisionDeleteDialog } from "@/hooks/document-center/use-subdivision-delete-dialog";
import { useUpdateDivisionMutation } from "@/hooks/document-center/use-update-division";
import { useUpdateSubdivisionMutation } from "@/hooks/document-center/use-update-subdivision";
import type { DocumentDivision, DocumentSubdivision } from "@/types/document-center";

export function useDivisionManagementActions() {
  const createDivisionMutation = useCreateDivisionMutation();
  const updateDivisionMutation = useUpdateDivisionMutation();
  const createSubdivisionMutation = useCreateSubdivisionMutation();
  const updateSubdivisionMutation = useUpdateSubdivisionMutation();
  const divisionDeleteDialog = useDivisionDeleteDialog();
  const subdivisionDeleteDialog = useSubdivisionDeleteDialog();

  return {
    divisionPendingState: {
      isCreatingDivision: createDivisionMutation.isPending,
      savingDivisionId: updateDivisionMutation.isPending
        ? updateDivisionMutation.variables?.divisionId
        : undefined,
      deletingDivisionId: divisionDeleteDialog.deletingDivisionId,
      creatingSubdivisionDivisionId: createSubdivisionMutation.isPending
        ? createSubdivisionMutation.variables?.divisionId
        : undefined,
      savingSubdivisionId: updateSubdivisionMutation.isPending
        ? updateSubdivisionMutation.variables?.subdivisionId
        : undefined,
      deletingSubdivisionId: subdivisionDeleteDialog.deletingSubdivisionId,
    },
    divisionActions: {
      onCreateDivision: (name: string) =>
        createDivisionMutation.mutate({ name }),
      onUpdateDivision: (divisionId: string, name: string) =>
        updateDivisionMutation.mutate({ divisionId, values: { name } }),
      onDeleteDivision: divisionDeleteDialog.requestDeleteDivision,
      onCreateSubdivision: (divisionId: string, name: string) =>
        createSubdivisionMutation.mutate({ divisionId, name }),
      onUpdateSubdivision: (
        divisionId: string,
        subdivisionId: string,
        name: string,
      ) =>
        updateSubdivisionMutation.mutate({
          subdivisionId,
          values: { divisionId, name },
        }),
      onDeleteSubdivision: (
        division: DocumentDivision,
        subdivision: DocumentSubdivision,
      ) =>
        subdivisionDeleteDialog.requestDeleteSubdivision({
          divisionId: division.id,
          divisionName: division.name,
          subdivision,
        }),
    },
    pendingDeleteDivision: divisionDeleteDialog.pendingDeleteDivision,
    isDivisionDeleteDialogOpen:
      divisionDeleteDialog.isDivisionDeleteDialogOpen,
    isDeletingDivision: divisionDeleteDialog.isDeletingDivision,
    divisionDeleteDialogActions:
      divisionDeleteDialog.divisionDeleteDialogActions,
    pendingDeleteSubdivision:
      subdivisionDeleteDialog.pendingDeleteSubdivision,
    isSubdivisionDeleteDialogOpen:
      subdivisionDeleteDialog.isSubdivisionDeleteDialogOpen,
    isDeletingSubdivision: subdivisionDeleteDialog.isDeletingSubdivision,
    subdivisionDeleteDialogActions:
      subdivisionDeleteDialog.subdivisionDeleteDialogActions,
  };
}
