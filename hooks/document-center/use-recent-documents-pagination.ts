"use client";

import type { RecentDocumentsPagination } from "@/types/document-center";

export function useRecentDocumentsPagination({
  pagination,
  itemCount,
}: {
  pagination: RecentDocumentsPagination;
  itemCount: number;
}) {
  const firstItem = pagination.totalItems
    ? (pagination.page - 1) * pagination.pageSize + 1
    : 0;
  const lastItem = pagination.totalItems ? firstItem + itemCount - 1 : 0;

  return {
    recentFirstItem: firstItem,
    recentLastItem: lastItem,
  };
}
