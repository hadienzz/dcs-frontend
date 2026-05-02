"use client";

import { AlertTriangle } from "lucide-react";

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
import type { EnrichedDocumentRecord } from "@/types/document-center";

interface DeleteDocumentDialogProps {
  document: EnrichedDocumentRecord | null;
  open: boolean;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteDocumentDialog({
  document,
  open,
  isDeleting,
  onOpenChange,
  onConfirm,
}: DeleteDocumentDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-[16px] border border-destructive/20 bg-destructive/10 text-destructive">
            <AlertTriangle className="size-5" />
          </div>
          <AlertDialogTitle className="text-xl font-semibold leading-tight text-foreground">
            Delete document?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-6 text-muted-foreground">
            This will remove{" "}
            <span className="font-semibold text-foreground">
              {document?.title ?? "this document"}
            </span>{" "}
            from Document Center. This action cannot be undone.
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
            disabled={isDeleting || !document}
          >
            {isDeleting ? "Deleting..." : "Delete document"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
