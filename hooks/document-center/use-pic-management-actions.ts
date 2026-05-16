"use client";

import { useCreatePicMutation } from "@/hooks/document-center/use-create-pic";
import { usePicDeleteDialog } from "@/hooks/document-center/use-pic-delete-dialog";
import { useUpdatePicMutation } from "@/hooks/document-center/use-update-pic";

export function usePicManagementActions() {
  const createPicMutation = useCreatePicMutation();
  const updatePicMutation = useUpdatePicMutation();
  const picDeleteDialog = usePicDeleteDialog();

  return {
    picPendingState: {
      isCreatingPic: createPicMutation.isPending,
      savingPicId: updatePicMutation.isPending
        ? updatePicMutation.variables?.id
        : undefined,
      deletingPicId: picDeleteDialog.deletingPicId,
    },
    picActions: {
      onCreatePic: (divisionId: string, name: string) =>
        createPicMutation.mutate({ divisionId, name }),
      onUpdatePic: (picId: string, divisionId: string, name: string) =>
        updatePicMutation.mutate({ id: picId, divisionId, name }),
      onDeletePic: picDeleteDialog.requestDeletePic,
    },
    pendingDeletePic: picDeleteDialog.pendingDeletePic,
    isPicDeleteDialogOpen: picDeleteDialog.isPicDeleteDialogOpen,
    isDeletingPic: picDeleteDialog.isDeletingPic,
    picDeleteDialogActions: picDeleteDialog.picDeleteDialogActions,
  };
}
