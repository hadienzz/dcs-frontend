"use client";

import { useDeletePicMutation } from "@/hooks/document-center/use-delete-pic";
import { usePendingDeleteDialog } from "@/hooks/document-center/use-pending-delete-dialog";
import type { DocumentPic } from "@/types/document-center";

export function usePicDeleteDialog() {
  const deletePicMutation = useDeletePicMutation();
  const dialog = usePendingDeleteDialog<DocumentPic>({
    isDeleting: deletePicMutation.isPending,
    onConfirmDelete: (pic, closeDialog) => {
      deletePicMutation.mutate(pic.id, {
        onSuccess: closeDialog,
      });
    },
  });

  return {
    pendingDeletePic: dialog.pendingDeleteItem,
    requestDeletePic: dialog.requestDelete,
    isPicDeleteDialogOpen: dialog.isDeleteDialogOpen,
    isDeletingPic: deletePicMutation.isPending,
    deletingPicId: deletePicMutation.isPending
      ? deletePicMutation.variables
      : undefined,
    picDeleteDialogActions: dialog.deleteDialogActions,
  };
}
