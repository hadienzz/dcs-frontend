"use client";

import { useState } from "react";

import {
  getRecentRangeLabel,
  RECENT_DOCUMENT_PAGE_SIZE,
} from "@/hooks/document-center/document-center-options";
import type {
  RecentDocumentRange,
  RecentDocumentSort,
} from "@/types/document-center";

export function useRecentDocumentsControls() {
  const [recentRange, setRecentRange] =
    useState<RecentDocumentRange>("all");
  const [recentSort, setRecentSort] =
    useState<RecentDocumentSort>("newest");
  const [recentPage, setRecentPage] = useState(1);

  function handleRecentRangeChange(range: RecentDocumentRange) {
    setRecentRange(range);
    setRecentPage(1);
  }

  function handleRecentSortChange(sort: RecentDocumentSort) {
    setRecentSort(sort);
    setRecentPage(1);
  }

  return {
    recentRange,
    recentSort,
    recentPage,
    recentPageSize: RECENT_DOCUMENT_PAGE_SIZE,
    recentRangeLabel: getRecentRangeLabel(recentRange),
    overviewActions: {
      onRecentRangeChange: handleRecentRangeChange,
      onRecentSortChange: handleRecentSortChange,
      onRecentPageChange: setRecentPage,
    },
  };
}
