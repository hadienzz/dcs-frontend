"use client";

import { useCreateUserMutation } from "@/hooks/document-center/use-create-user";
import { useUpdateUserMutation } from "@/hooks/document-center/use-update-user";
import { useUserDeleteDialog } from "@/hooks/document-center/use-user-delete-dialog";
import type { DocumentUserRole } from "@/types/document-center";

export function useUserManagementActions() {
  const createUserMutation = useCreateUserMutation();
  const updateUserMutation = useUpdateUserMutation();
  const userDeleteDialog = useUserDeleteDialog();

  return {
    userPendingState: {
      isCreatingUser: createUserMutation.isPending,
      savingUserId: updateUserMutation.isPending
        ? updateUserMutation.variables?.id
        : undefined,
      deletingUserId: userDeleteDialog.deletingUserId,
    },
    userActions: {
      onCreateUser: (payload: {
        name: string;
        username: string;
        role: DocumentUserRole;
        assignedDivisionIds: string[];
      }) => createUserMutation.mutate(payload),
      onUpdateUser: (payload: {
        id: string;
        name: string;
        username: string;
        role: DocumentUserRole;
        assignedDivisionIds: string[];
      }) => updateUserMutation.mutate(payload),
      onDeleteUser: userDeleteDialog.requestDeleteUser,
    },
    pendingDeleteUser: userDeleteDialog.pendingDeleteUser,
    isUserDeleteDialogOpen: userDeleteDialog.isUserDeleteDialogOpen,
    isDeletingUser: userDeleteDialog.isDeletingUser,
    userDeleteDialogActions: userDeleteDialog.userDeleteDialogActions,
  };
}
