"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import getCurrentDocumentCenterAccount from "@/services/document-center/get-current-account";
import loginDocumentCenter from "@/services/document-center/login";
import logoutDocumentCenter from "@/services/document-center/logout";
import type {
  DocumentCenterLoginPayload,
  DocumentCenterSession,
} from "@/types/document-center";
import {
  DOCUMENT_CENTER_QUERY_KEY,
  DOCUMENT_CENTER_SESSION_QUERY_KEY,
} from "@/hooks/document-center/query-key";

export function useDocumentCenterSessionQuery() {
  return useQuery({
    queryKey: DOCUMENT_CENTER_SESSION_QUERY_KEY,
    queryFn: getCurrentDocumentCenterAccount,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}

export function useDocumentCenterLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DocumentCenterLoginPayload) =>
      loginDocumentCenter(payload),
    onSuccess: (account: DocumentCenterSession) => {
      queryClient.setQueryData(DOCUMENT_CENTER_SESSION_QUERY_KEY, account);
      queryClient.invalidateQueries({ queryKey: DOCUMENT_CENTER_QUERY_KEY });
    },
  });
}

export function useDocumentCenterLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutDocumentCenter,
    onSuccess: () => {
      queryClient.setQueryData(DOCUMENT_CENTER_SESSION_QUERY_KEY, null);
      queryClient.removeQueries({ queryKey: DOCUMENT_CENTER_QUERY_KEY });
    },
  });
}
