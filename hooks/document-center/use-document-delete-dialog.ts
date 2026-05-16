"use client";

import { useDeleteDocumentMutation } from "@/hooks/document-center/use-delete-document";
import { usePendingDeleteDialog } from "@/hooks/document-center/use-pending-delete-dialog";
import type { EnrichedDocumentRecord } from "@/types/document-center";

export function useDocumentDeleteDialog() {
  const deleteDocumentMutation = useDeleteDocumentMutation();
  const dialog = usePendingDeleteDialog<EnrichedDocumentRecord>({
    isDeleting: deleteDocumentMutation.isPending,
    onConfirmDelete: (document, closeDialog) => {
      deleteDocumentMutation.mutate(document.id, {
        onSuccess: closeDialog,
      });
    },
  });

  return {
    pendingDeleteDocument: dialog.pendingDeleteItem,
    requestDeleteDocument: dialog.requestDelete,
    isDeleteDialogOpen: dialog.isDeleteDialogOpen,
    isDeletingDocument: deleteDocumentMutation.isPending,
    deleteDialogActions: dialog.deleteDialogActions,
  };
}
