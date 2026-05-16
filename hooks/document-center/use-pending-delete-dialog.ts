"use client";

import { useState } from "react";

export function usePendingDeleteDialog<TItem>({
  isDeleting,
  onConfirmDelete,
}: {
  isDeleting: boolean;
  onConfirmDelete: (item: TItem, closeDialog: () => void) => void;
}) {
  const [pendingDeleteItem, setPendingDeleteItem] =
    useState<TItem | null>(null);

  function handleConfirmDelete() {
    if (!pendingDeleteItem) {
      return;
    }

    onConfirmDelete(pendingDeleteItem, () => {
      setPendingDeleteItem(null);
    });
  }

  function handleOpenChange(open: boolean) {
    if (!open && !isDeleting) {
      setPendingDeleteItem(null);
    }
  }

  return {
    pendingDeleteItem,
    requestDelete: setPendingDeleteItem,
    isDeleteDialogOpen: Boolean(pendingDeleteItem),
    deleteDialogActions: {
      onOpenChange: handleOpenChange,
      onConfirm: handleConfirmDelete,
    },
  };
}
