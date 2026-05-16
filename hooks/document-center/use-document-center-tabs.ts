"use client";

import { useEffect, useState } from "react";

import {
  getAvailableDocumentCenterTabs,
  type DocumentCenterTab,
} from "@/hooks/document-center/document-center-options";
import type { DocumentCenterSession } from "@/types/document-center";

export function useDocumentCenterTabs(
  session?: DocumentCenterSession | null,
) {
  const [activeTab, setActiveTab] = useState<DocumentCenterTab>("overview");
  const isSuperadmin = session?.role === "superadmin";
  const availableTabs = getAvailableDocumentCenterTabs(isSuperadmin);

  useEffect(() => {
    if (!availableTabs.includes(activeTab)) {
      setActiveTab("overview");
    }
  }, [activeTab, availableTabs]);

  return {
    activeTab,
    setActiveTab,
    isSuperadmin,
    availableTabs,
    canManageDocuments: isSuperadmin,
    canManageStructure: isSuperadmin,
  };
}
