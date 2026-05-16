"use client";

import { useDeleteSubdivisionMutation } from "@/hooks/document-center/use-delete-subdivision";
import { usePendingDeleteDialog } from "@/hooks/document-center/use-pending-delete-dialog";
import type { DocumentSubdivision } from "@/types/document-center";

export type PendingDeleteSubdivision = {
  divisionId: string;
  divisionName: string;
  subdivision: DocumentSubdivision;
};

export function useSubdivisionDeleteDialog() {
  const deleteSubdivisionMutation = useDeleteSubdivisionMutation();
  const dialog = usePendingDeleteDialog<PendingDeleteSubdivision>({
    isDeleting: deleteSubdivisionMutation.isPending,
    onConfirmDelete: (pendingDeleteSubdivision, closeDialog) => {
      deleteSubdivisionMutation.mutate(
        {
          divisionId: pendingDeleteSubdivision.divisionId,
          subdivisionId: pendingDeleteSubdivision.subdivision.id,
        },
        {
          onSuccess: closeDialog,
        },
      );
    },
  });

  return {
    pendingDeleteSubdivision: dialog.pendingDeleteItem,
    requestDeleteSubdivision: dialog.requestDelete,
    isSubdivisionDeleteDialogOpen: dialog.isDeleteDialogOpen,
    isDeletingSubdivision: deleteSubdivisionMutation.isPending,
    deletingSubdivisionId: deleteSubdivisionMutation.isPending
      ? deleteSubdivisionMutation.variables?.subdivisionId
      : undefined,
    subdivisionDeleteDialogActions: dialog.deleteDialogActions,
  };
}
