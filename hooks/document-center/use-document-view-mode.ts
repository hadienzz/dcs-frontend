"use client";

import { useState } from "react";

import type { DocumentViewMode } from "@/hooks/document-center/document-center-options";

export function useDocumentViewMode() {
  const [documentViewMode, setDocumentViewMode] =
    useState<DocumentViewMode>("cards");

  return {
    documentViewMode,
    setDocumentViewMode,
  };
}
