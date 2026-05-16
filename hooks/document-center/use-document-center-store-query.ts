"use client";

import { useMemo } from "react";

import { useDocumentCenterData } from "@/hooks/document-center/use-get-document-center-store";
import { EMPTY_DOCUMENT_CENTER_STORE } from "@/types/document-center";
import type {
  DocumentCenterQuery,
  DocumentCenterSession,
  DocumentFilters,
  RecentDocumentRange,
  RecentDocumentSort,
} from "@/types/document-center";
import { getErrorMessage } from "@/utils/api-error";

export function useDocumentCenterStoreQuery({
  session,
  filters,
  driveDivisionId,
  driveSubdivisionId,
  recentRange,
  recentSort,
  recentPage,
  recentPageSize,
}: {
  session?: DocumentCenterSession | null;
  filters: DocumentFilters;
  driveDivisionId: string;
  driveSubdivisionId: string;
  recentRange: RecentDocumentRange;
  recentSort: RecentDocumentSort;
  recentPage: number;
  recentPageSize: number;
}) {
  const documentCenterQuery: DocumentCenterQuery = useMemo(
    () => ({
      ...filters,
      driveDivisionId,
      driveSubdivisionId,
      recentRange,
      recentSort,
      recentPage,
      recentPageSize,
    }),
    [
      driveDivisionId,
      driveSubdivisionId,
      filters,
      recentPage,
      recentPageSize,
      recentRange,
      recentSort,
    ],
  );

  const {
    data: store = EMPTY_DOCUMENT_CENTER_STORE,
    error,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useDocumentCenterData(documentCenterQuery, Boolean(session));

  return {
    store,
    divisions: store.divisions,
    isLoading,
    isRefreshing: isFetching && !isLoading,
    loadErrorMessage: isError
      ? getErrorMessage(
          error,
          "Document center belum bisa dimuat. Coba lagi sebentar.",
        )
      : undefined,
    onRetryLoad: () => {
      refetch();
    },
  };
}
