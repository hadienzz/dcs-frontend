"use client";

import { useDeleteUserMutation } from "@/hooks/document-center/use-delete-user";
import { usePendingDeleteDialog } from "@/hooks/document-center/use-pending-delete-dialog";
import type { DocumentAccount } from "@/types/document-center";

export function useUserDeleteDialog() {
  const deleteUserMutation = useDeleteUserMutation();
  const dialog = usePendingDeleteDialog<DocumentAccount>({
    isDeleting: deleteUserMutation.isPending,
    onConfirmDelete: (user, closeDialog) => {
      deleteUserMutation.mutate(user.id, {
        onSuccess: closeDialog,
      });
    },
  });

  return {
    pendingDeleteUser: dialog.pendingDeleteItem,
    requestDeleteUser: dialog.requestDelete,
    isUserDeleteDialogOpen: dialog.isDeleteDialogOpen,
    isDeletingUser: deleteUserMutation.isPending,
    deletingUserId: deleteUserMutation.isPending
      ? deleteUserMutation.variables
      : undefined,
    userDeleteDialogActions: dialog.deleteDialogActions,
  };
}
