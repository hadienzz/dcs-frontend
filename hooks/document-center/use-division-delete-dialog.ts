"use client";

import { useDeleteDivisionMutation } from "@/hooks/document-center/use-delete-division";
import { usePendingDeleteDialog } from "@/hooks/document-center/use-pending-delete-dialog";
import type { DocumentDivision } from "@/types/document-center";

export function useDivisionDeleteDialog() {
  const deleteDivisionMutation = useDeleteDivisionMutation();
  const dialog = usePendingDeleteDialog<DocumentDivision>({
    isDeleting: deleteDivisionMutation.isPending,
    onConfirmDelete: (division, closeDialog) => {
      deleteDivisionMutation.mutate(division.id, {
        onSuccess: closeDialog,
      });
    },
  });

  return {
    pendingDeleteDivision: dialog.pendingDeleteItem,
    requestDeleteDivision: dialog.requestDelete,
    isDivisionDeleteDialogOpen: dialog.isDeleteDialogOpen,
    isDeletingDivision: deleteDivisionMutation.isPending,
    deletingDivisionId: deleteDivisionMutation.isPending
      ? deleteDivisionMutation.variables
      : undefined,
    divisionDeleteDialogActions: dialog.deleteDialogActions,
  };
}
