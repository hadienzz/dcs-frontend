"use client";

import { useQuery } from "@tanstack/react-query";

import getDocumentCenterStore from "@/services/document-center/get-document-center-store";
import type { DocumentCenterQuery } from "@/types/document-center";
import { DOCUMENT_CENTER_QUERY_KEY } from "@/hooks/document-center/query-key";

export function useDocumentCenterData(query: DocumentCenterQuery = {}) {
  return useQuery({
    queryKey: [...DOCUMENT_CENTER_QUERY_KEY, query],
    queryFn: () => getDocumentCenterStore(query),
    staleTime: 1000 * 60 * 5,
  });
}

export default useDocumentCenterData;
