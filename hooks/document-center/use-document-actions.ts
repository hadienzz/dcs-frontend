"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { EnrichedDocumentRecord } from "@/types/document-center";

export function useDocumentActions({
  isSuperadmin,
  onOpenUploadTab,
  onOpenCenterTab,
  onRequestDelete,
}: {
  isSuperadmin: boolean;
  onOpenUploadTab: () => void;
  onOpenCenterTab: () => void;
  onRequestDelete: (document: EnrichedDocumentRecord) => void;
}) {
  const [editingDocument, setEditingDocument] =
    useState<EnrichedDocumentRecord | null>(null);

  useEffect(() => {
    if (!isSuperadmin) {
      setEditingDocument(null);
    }
  }, [isSuperadmin]);

  function handleViewDocument(document: EnrichedDocumentRecord) {
    window.open(document.fileUrl, "_blank", "noopener,noreferrer");
  }

  function handleDownloadDocument(document: EnrichedDocumentRecord) {
    const link = window.document.createElement("a");
    link.href = document.fileUrl;
    link.download = document.fileName;
    link.rel = "noopener noreferrer";
    link.click();
    toast.success("Download dimulai.");
  }

  function handleEditDocument(document: EnrichedDocumentRecord) {
    if (!isSuperadmin) {
      toast.error("Akun pekerja hanya bisa upload dan melihat dokumen.");
      return;
    }

    setEditingDocument(document);
    onOpenUploadTab();
  }

  function handleStartUpload() {
    setEditingDocument(null);
    onOpenUploadTab();
  }

  function handleCancelEdit() {
    setEditingDocument(null);
    onOpenCenterTab();
  }

  function handleUploadCompleted() {
    if (editingDocument) {
      setEditingDocument(null);
      onOpenCenterTab();
    }
  }

  return {
    editingDocument,
    setEditingDocument,
    onUploadCompleted: handleUploadCompleted,
    documentActions: {
      onView: handleViewDocument,
      onDownload: handleDownloadDocument,
      onEdit: handleEditDocument,
      onDelete: isSuperadmin
        ? onRequestDelete
        : () => {
            toast.error("Akun pekerja tidak bisa menghapus dokumen.");
          },
    },
    uploadActions: {
      onStartUpload: handleStartUpload,
      onCancelEdit: handleCancelEdit,
    },
  };
}
