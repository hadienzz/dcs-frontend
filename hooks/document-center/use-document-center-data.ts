"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createDivision,
  createPic,
  createSubdivision,
  createUser,
  deleteDivision,
  deleteDocument,
  deletePic,
  deleteSubdivision,
  deleteUser,
  getDocumentCenterStore,
  updateDivision,
  updateDocumentMetadata,
  updatePic,
  updateSubdivision,
  updateUser,
  uploadDocument,
} from "@/services/document-center/document-center-service";
import type {
  CreateDocumentPayload,
  DocumentCenterQuery,
  DivisionPayload,
  PicPayload,
  SubdivisionPayload,
  UpdateDocumentMetadataPayload,
  UpdatePicPayload,
  UpdateUserPayload,
  UserPayload,
} from "@/types/document-center";

export const DOCUMENT_CENTER_QUERY_KEY = ["document-center"] as const;

export function useDocumentCenterData(query: DocumentCenterQuery = {}) {
  return useQuery({
    queryKey: [...DOCUMENT_CENTER_QUERY_KEY, query],
    queryFn: () => getDocumentCenterStore(query),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUploadDocumentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDocumentPayload) => uploadDocument(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_CENTER_QUERY_KEY });
    },
  });
}

export function useUpdateDocumentMetadataMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDocumentMetadataPayload) =>
      updateDocumentMetadata(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_CENTER_QUERY_KEY });
    },
  });
}

export function useDeleteDocumentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => deleteDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_CENTER_QUERY_KEY });
    },
  });
}

export function useDivisionMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: DOCUMENT_CENTER_QUERY_KEY });
  };

  return {
    createDivision: useMutation({
      mutationFn: (payload: DivisionPayload) => createDivision(payload),
      onSuccess: invalidate,
    }),
    updateDivision: useMutation({
      mutationFn: (payload: { divisionId: string; values: DivisionPayload }) =>
        updateDivision(payload.divisionId, payload.values),
      onSuccess: invalidate,
    }),
    deleteDivision: useMutation({
      mutationFn: (divisionId: string) => deleteDivision(divisionId),
      onSuccess: invalidate,
    }),
    createSubdivision: useMutation({
      mutationFn: (payload: SubdivisionPayload) => createSubdivision(payload),
      onSuccess: invalidate,
    }),
    updateSubdivision: useMutation({
      mutationFn: (payload: { subdivisionId: string; values: SubdivisionPayload }) =>
        updateSubdivision(payload.subdivisionId, payload.values),
      onSuccess: invalidate,
    }),
    deleteSubdivision: useMutation({
      mutationFn: (payload: { divisionId: string; subdivisionId: string }) =>
        deleteSubdivision(payload.divisionId, payload.subdivisionId),
      onSuccess: invalidate,
    }),
  };
}

export function usePicMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: DOCUMENT_CENTER_QUERY_KEY });
  };

  return {
    createPic: useMutation({
      mutationFn: (payload: PicPayload) => createPic(payload),
      onSuccess: invalidate,
    }),
    updatePic: useMutation({
      mutationFn: (payload: UpdatePicPayload) => updatePic(payload),
      onSuccess: invalidate,
    }),
    deletePic: useMutation({
      mutationFn: (picId: string) => deletePic(picId),
      onSuccess: invalidate,
    }),
  };
}

export function useUserMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: DOCUMENT_CENTER_QUERY_KEY });
  };

  return {
    createUser: useMutation({
      mutationFn: (payload: UserPayload) => createUser(payload),
      onSuccess: invalidate,
    }),
    updateUser: useMutation({
      mutationFn: (payload: UpdateUserPayload) => updateUser(payload),
      onSuccess: invalidate,
    }),
    deleteUser: useMutation({
      mutationFn: (userId: string) => deleteUser(userId),
      onSuccess: invalidate,
    }),
  };
}
