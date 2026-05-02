"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteEntityDialogProps {
  open: boolean;
  entityLabel: string;
  entityName?: string;
  context?: string;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteEntityDialog({
  open,
  entityLabel,
  entityName,
  context,
  isDeleting,
  onOpenChange,
  onConfirm,
}: DeleteEntityDialogProps) {
  const displayName = entityName ?? `this ${entityLabel}`;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-[16px] border border-destructive/20 bg-destructive/10 text-destructive">
            <AlertTriangle className="size-5" />
          </div>
          <AlertDialogTitle className="text-xl font-semibold leading-tight text-foreground">
            Are you sure you want to delete {entityLabel}{" "}
            <span className="font-bold">{displayName}</span>?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-6 text-muted-foreground">
            This will remove {entityLabel}{" "}
            <span className="font-semibold text-foreground">{displayName}</span>
            {context ? ` ${context}` : ""} from Document Center. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose
            render={
              <Button type="button" variant="outline" disabled={isDeleting}>
                Cancel
              </Button>
            }
          />
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting || !entityName}
          >
            {isDeleting ? (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            ) : null}
            {isDeleting ? "Deleting..." : `Delete ${entityLabel}`}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
