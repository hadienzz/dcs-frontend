"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  useDeleteDocumentMutation,
  useDivisionMutations,
  useDocumentCenterData,
  usePicMutations,
  useUserMutations,
} from "@/hooks/document-center/use-document-center-data";
import { useUploadDocumentForm } from "@/hooks/document-center/use-upload-document-form";
import { EMPTY_DOCUMENT_CENTER_STORE } from "@/types/document-center";
import type {
  DocumentCenterQuery,
  DocumentDivision,
  DocumentFilters,
  DocumentUserRole,
  EnrichedDocumentRecord,
  RecentDocumentRange,
  RecentDocumentSort,
} from "@/types/document-center";
import { getErrorMessage } from "@/utils/api-error";
import {
  ALL_DIVISIONS_VALUE,
  getAllPics,
  getDivisionById,
  getPicsByDivision,
  getSubdivisionsByDivision,
} from "@/utils/document-center";

export type DocumentCenterTab =
  | "overview"
  | "center"
  | "upload"
  | "divisions"
  | "pic"
  | "users";

export type DocumentViewMode = "cards" | "table";

export const RECENT_DOCUMENT_PAGE_SIZE = 6;

export const RECENT_RANGE_OPTIONS: {
  value: RecentDocumentRange;
  label: string;
}[] = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

export const RECENT_SORT_OPTIONS: {
  value: RecentDocumentSort;
  label: string;
}[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];

export const EMPTY_FILTERS: DocumentFilters = {
  search: "",
  divisionId: "",
  subdivisionId: "",
  picId: "",
};

function getRecentRangeLabel(range: RecentDocumentRange) {
  return (
    RECENT_RANGE_OPTIONS.find((option) => option.value === range)?.label ??
    "All time"
  );
}

function notifyMutationError(error: unknown, fallbackMessage: string) {
  toast.error(getErrorMessage(error, fallbackMessage));
}

export function useDocumentCenterDashboard() {
  const [activeTab, setActiveTab] = useState<DocumentCenterTab>("overview");
  const [documentViewMode, setDocumentViewMode] =
    useState<DocumentViewMode>("cards");
  const [filters, setFilters] = useState<DocumentFilters>(EMPTY_FILTERS);
  const [recentRange, setRecentRange] =
    useState<RecentDocumentRange>("all");
  const [recentSort, setRecentSort] =
    useState<RecentDocumentSort>("newest");
  const [recentPage, setRecentPage] = useState(1);
  const [driveDivisionId, setDriveDivisionId] = useState("");
  const [driveSubdivisionId, setDriveSubdivisionId] = useState("");
  const [editingDocument, setEditingDocument] =
    useState<EnrichedDocumentRecord | null>(null);
  const [pendingDeleteDocument, setPendingDeleteDocument] =
    useState<EnrichedDocumentRecord | null>(null);

  const documentCenterQuery: DocumentCenterQuery = useMemo(
    () => ({
      ...filters,
      driveDivisionId,
      driveSubdivisionId,
      recentRange,
      recentSort,
      recentPage,
      recentPageSize: RECENT_DOCUMENT_PAGE_SIZE,
    }),
    [
      driveDivisionId,
      driveSubdivisionId,
      filters,
      recentPage,
      recentRange,
      recentSort,
    ],
  );
  const { data: store = EMPTY_DOCUMENT_CENTER_STORE, isLoading } =
    useDocumentCenterData(documentCenterQuery);
  const deleteDocumentMutation = useDeleteDocumentMutation();
  const divisionMutations = useDivisionMutations();
  const picMutations = usePicMutations();
  const userMutations = useUserMutations();

  const divisions = store.divisions;
  const filterSubdivisionOptions = useMemo(
    () => getSubdivisionsByDivision(divisions, filters.divisionId),
    [divisions, filters.divisionId],
  );
  const filterPicOptions = useMemo(
    () => getPicsByDivision(divisions, filters.divisionId),
    [divisions, filters.divisionId],
  );
  const activeDriveDivision = getDivisionById(divisions, driveDivisionId);
  const activeDriveSubdivision = activeDriveDivision?.subdivisions.find(
    (subdivision) => subdivision.id === driveSubdivisionId,
  );

  const uploadForm = useUploadDocumentForm({
    divisions,
    documentToEdit: editingDocument,
    onCompleted: () => {
      if (editingDocument) {
        setEditingDocument(null);
        setActiveTab("center");
      }
    },
  });

  const recentPagination = store.recentDocumentsPagination;
  const recentFirstItem = recentPagination.totalItems
    ? (recentPagination.page - 1) * recentPagination.pageSize + 1
    : 0;
  const recentLastItem = recentPagination.totalItems
    ? recentFirstItem + store.recentDocuments.length - 1
    : 0;

  function handleFilterDivisionChange(divisionId: string) {
    setFilters((current) => ({
      ...current,
      divisionId,
      subdivisionId: "",
      picId: "",
    }));
  }

  function handleRecentRangeChange(range: RecentDocumentRange) {
    setRecentRange(range);
    setRecentPage(1);
  }

  function handleRecentSortChange(sort: RecentDocumentSort) {
    setRecentSort(sort);
    setRecentPage(1);
  }

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
    setEditingDocument(document);
    setActiveTab("upload");
  }

  function handleConfirmDeleteDocument() {
    if (!pendingDeleteDocument) {
      return;
    }

    deleteDocumentMutation.mutate(pendingDeleteDocument.id, {
      onSuccess: () => {
        toast.success("Dokumen berhasil dihapus.");
        setPendingDeleteDocument(null);
      },
      onError: (error) =>
        notifyMutationError(error, "Dokumen belum bisa dihapus."),
    });
  }

  function handleDeleteDialogOpenChange(open: boolean) {
    if (!open && !deleteDocumentMutation.isPending) {
      setPendingDeleteDocument(null);
    }
  }

  return {
    activeTab,
    setActiveTab,
    isLoading,
    store,
    divisions,
    filters,
    filterSubdivisionOptions,
    filterPicOptions,
    driveDivisionId,
    driveSubdivisionId,
    activeDriveDivision,
    activeDriveSubdivision,
    documentViewMode,
    setDocumentViewMode,
    uploadForm,
    editingDocument,
    setEditingDocument,
    recentRange,
    recentSort,
    recentFirstItem,
    recentLastItem,
    recentRangeLabel: getRecentRangeLabel(recentRange),
    pendingDeleteDocument,
    isDeleteDialogOpen: Boolean(pendingDeleteDocument),
    isDeletingDocument: deleteDocumentMutation.isPending,
    documentActions: {
      onView: handleViewDocument,
      onDownload: handleDownloadDocument,
      onEdit: handleEditDocument,
      onDelete: setPendingDeleteDocument,
    },
    overviewActions: {
      onRecentRangeChange: handleRecentRangeChange,
      onRecentSortChange: handleRecentSortChange,
      onRecentPageChange: setRecentPage,
    },
    documentCenterActions: {
      onSearchChange: (search: string) =>
        setFilters((current) => ({ ...current, search })),
      onFilterDivisionChange: handleFilterDivisionChange,
      onFilterSubdivisionChange: (subdivisionId: string) =>
        setFilters((current) => ({ ...current, subdivisionId })),
      onFilterPicChange: (picId: string) =>
        setFilters((current) => ({ ...current, picId })),
      onClearFilters: () => setFilters(EMPTY_FILTERS),
      onOpenDivision: (divisionId: string) => {
        setDriveDivisionId(divisionId);
        setDriveSubdivisionId("");
      },
      onOpenSubdivision: setDriveSubdivisionId,
      onGoRoot: () => {
        setDriveDivisionId("");
        setDriveSubdivisionId("");
      },
      onGoDivision: () => setDriveSubdivisionId(""),
    },
    uploadActions: {
      onStartUpload: () => {
        setEditingDocument(null);
        setActiveTab("upload");
      },
      onCancelEdit: () => {
        setEditingDocument(null);
        setActiveTab("center");
      },
    },
    deleteDialogActions: {
      onOpenChange: handleDeleteDialogOpenChange,
      onConfirm: handleConfirmDeleteDocument,
    },
    divisionActions: {
      onCreateDivision: (name: string) =>
        divisionMutations.createDivision.mutate(
          { name },
          {
            onSuccess: () => toast.success("Divisi berhasil ditambahkan."),
            onError: (error) =>
              notifyMutationError(error, "Divisi belum bisa ditambahkan."),
          },
        ),
      onUpdateDivision: (divisionId: string, name: string) =>
        divisionMutations.updateDivision.mutate(
          { divisionId, values: { name } },
          {
            onSuccess: () => toast.success("Divisi berhasil diperbarui."),
            onError: (error) =>
              notifyMutationError(error, "Divisi belum bisa diperbarui."),
          },
        ),
      onDeleteDivision: (divisionId: string) =>
        divisionMutations.deleteDivision.mutate(divisionId, {
          onSuccess: () => toast.success("Divisi berhasil dihapus."),
          onError: (error) =>
            notifyMutationError(error, "Divisi belum bisa dihapus."),
        }),
      onCreateSubdivision: (divisionId: string, name: string) =>
        divisionMutations.createSubdivision.mutate(
          { divisionId, name },
          {
            onSuccess: () => toast.success("Subdivisi berhasil ditambahkan."),
            onError: (error) =>
              notifyMutationError(error, "Subdivisi belum bisa ditambahkan."),
          },
        ),
      onUpdateSubdivision: (
        divisionId: string,
        subdivisionId: string,
        name: string,
      ) =>
        divisionMutations.updateSubdivision.mutate(
          { subdivisionId, values: { divisionId, name } },
          {
            onSuccess: () => toast.success("Subdivisi berhasil diperbarui."),
            onError: (error) =>
              notifyMutationError(error, "Subdivisi belum bisa diperbarui."),
          },
        ),
      onDeleteSubdivision: (divisionId: string, subdivisionId: string) =>
        divisionMutations.deleteSubdivision.mutate(
          { divisionId, subdivisionId },
          {
            onSuccess: () => toast.success("Subdivisi berhasil dihapus."),
            onError: (error) =>
              notifyMutationError(error, "Subdivisi belum bisa dihapus."),
          },
        ),
    },
    picActions: {
      onCreatePic: (divisionId: string, name: string) =>
        picMutations.createPic.mutate(
          { divisionId, name },
          {
            onSuccess: () => toast.success("PIC berhasil ditambahkan."),
            onError: (error) =>
              notifyMutationError(error, "PIC belum bisa ditambahkan."),
          },
        ),
      onUpdatePic: (picId: string, divisionId: string, name: string) =>
        picMutations.updatePic.mutate(
          { id: picId, divisionId, name },
          {
            onSuccess: () => toast.success("PIC berhasil diperbarui."),
            onError: (error) =>
              notifyMutationError(error, "PIC belum bisa diperbarui."),
          },
        ),
      onDeletePic: (picId: string) =>
        picMutations.deletePic.mutate(picId, {
          onSuccess: () => toast.success("PIC berhasil dihapus."),
          onError: (error) =>
            notifyMutationError(error, "PIC belum bisa dihapus."),
        }),
    },
    userActions: {
      onCreateUser: (payload: {
        name: string;
        username: string;
        role: DocumentUserRole;
        assignedDivisionIds: string[];
      }) =>
        userMutations.createUser.mutate(payload, {
          onSuccess: () => toast.success("User berhasil dibuat."),
          onError: (error) =>
            notifyMutationError(error, "User belum bisa dibuat."),
        }),
      onUpdateUser: (payload: {
        id: string;
        name: string;
        username: string;
        role: DocumentUserRole;
        assignedDivisionIds: string[];
      }) =>
        userMutations.updateUser.mutate(payload, {
          onSuccess: () => toast.success("User berhasil diperbarui."),
          onError: (error) =>
            notifyMutationError(error, "User belum bisa diperbarui."),
        }),
      onDeleteUser: (userId: string) =>
        userMutations.deleteUser.mutate(userId, {
          onSuccess: () => toast.success("User berhasil dihapus."),
          onError: (error) =>
            notifyMutationError(error, "User belum bisa dihapus."),
        }),
    },
  };
}

export function useDivisionManagementState({
  onCreateDivision,
  onUpdateDivision,
  onCreateSubdivision,
}: {
  onCreateDivision: (name: string) => void;
  onUpdateDivision: (divisionId: string, name: string) => void;
  onCreateSubdivision: (divisionId: string, name: string) => void;
}) {
  const [newDivisionName, setNewDivisionName] = useState("");
  const [divisionDrafts, setDivisionDrafts] = useState<Record<string, string>>(
    {},
  );
  const [subdivisionDrafts, setSubdivisionDrafts] = useState<
    Record<string, string>
  >({});
  const [newSubdivisionNames, setNewSubdivisionNames] = useState<
    Record<string, string>
  >({});

  return {
    newDivisionName,
    setNewDivisionName,
    getDivisionDraft: (division: DocumentDivision) =>
      divisionDrafts[division.id] ?? division.name,
    setDivisionDraft: (divisionId: string, name: string) =>
      setDivisionDrafts((current) => ({ ...current, [divisionId]: name })),
    saveDivision: onUpdateDivision,
    createDivision: () => {
      if (!newDivisionName.trim()) {
        return;
      }

      onCreateDivision(newDivisionName.trim());
      setNewDivisionName("");
    },
    getSubdivisionDraft: (subdivision: { id: string; name: string }) =>
      subdivisionDrafts[subdivision.id] ?? subdivision.name,
    setSubdivisionDraft: (subdivisionId: string, name: string) =>
      setSubdivisionDrafts((current) => ({ ...current, [subdivisionId]: name })),
    getNewSubdivisionName: (divisionId: string) =>
      newSubdivisionNames[divisionId] ?? "",
    setNewSubdivisionName: (divisionId: string, name: string) =>
      setNewSubdivisionNames((current) => ({ ...current, [divisionId]: name })),
    createSubdivision: (divisionId: string) => {
      const name = newSubdivisionNames[divisionId]?.trim() ?? "";

      if (!name) {
        return;
      }

      onCreateSubdivision(divisionId, name);
      setNewSubdivisionNames((current) => ({ ...current, [divisionId]: "" }));
    },
  };
}

export function usePicManagementState({
  divisions,
  onCreatePic,
  onUpdatePic,
}: {
  divisions: DocumentDivision[];
  onCreatePic: (divisionId: string, name: string) => void;
  onUpdatePic: (picId: string, divisionId: string, name: string) => void;
}) {
  const [newPic, setNewPic] = useState({ name: "", divisionId: "" });
  const [picDrafts, setPicDrafts] = useState<
    Record<string, { name: string; divisionId: string }>
  >({});

  return {
    people: getAllPics(divisions),
    newPic,
    setNewPicName: (name: string) =>
      setNewPic((current) => ({ ...current, name })),
    setNewPicDivisionId: (divisionId: string) =>
      setNewPic((current) => ({ ...current, divisionId })),
    getPicDraft: (person: { id: string; name: string; divisionId: string }) =>
      picDrafts[person.id] ?? {
        name: person.name,
        divisionId: person.divisionId,
      },
    setPicDraftName: (
      person: { id: string; name: string; divisionId: string },
      name: string,
    ) =>
      setPicDrafts((current) => ({
        ...current,
        [person.id]: {
          ...(current[person.id] ?? {
            name: person.name,
            divisionId: person.divisionId,
          }),
          name,
        },
      })),
    setPicDraftDivisionId: (
      person: { id: string; name: string; divisionId: string },
      divisionId: string,
    ) =>
      setPicDrafts((current) => ({
        ...current,
        [person.id]: {
          ...(current[person.id] ?? {
            name: person.name,
            divisionId: person.divisionId,
          }),
          divisionId,
        },
      })),
    createPic: () => {
      const divisionId = newPic.divisionId || divisions[0]?.id;

      if (!divisionId || !newPic.name.trim()) {
        return;
      }

      onCreatePic(divisionId, newPic.name.trim());
      setNewPic({ name: "", divisionId: "" });
    },
    updatePic: (picId: string, divisionId: string, name: string) =>
      onUpdatePic(picId, divisionId, name),
  };
}

function toAssignedDivisionIds(
  role: DocumentUserRole,
  assignedDivisionId: string,
) {
  if (role === "superadmin") {
    return [ALL_DIVISIONS_VALUE];
  }

  return assignedDivisionId ? [assignedDivisionId] : [];
}

export function useUserManagementState({
  onCreateUser,
  onUpdateUser,
}: {
  onCreateUser: (payload: {
    name: string;
    username: string;
    role: DocumentUserRole;
    assignedDivisionIds: string[];
  }) => void;
  onUpdateUser: (payload: {
    id: string;
    name: string;
    username: string;
    role: DocumentUserRole;
    assignedDivisionIds: string[];
  }) => void;
}) {
  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    role: "shared-user" as DocumentUserRole,
    assignedDivisionId: "",
  });
  const [userDrafts, setUserDrafts] = useState<
    Record<
      string,
      {
        name: string;
        username: string;
        role: DocumentUserRole;
        assignedDivisionId: string;
      }
    >
  >({});

  return {
    newUser,
    setNewUserField: (
      field: keyof typeof newUser,
      value: string | DocumentUserRole,
    ) => setNewUser((current) => ({ ...current, [field]: value })),
    getAssignedDivisionValue: (user: { assignedDivisionIds: string[] }) => {
      if (user.assignedDivisionIds.includes(ALL_DIVISIONS_VALUE)) {
        return ALL_DIVISIONS_VALUE;
      }

      return user.assignedDivisionIds[0] ?? "";
    },
    getUserDraft: (user: {
      id: string;
      name: string;
      username: string;
      role: DocumentUserRole;
      assignedDivisionIds: string[];
    }) =>
      userDrafts[user.id] ?? {
        name: user.name,
        username: user.username,
        role: user.role,
        assignedDivisionId: user.assignedDivisionIds.includes(
          ALL_DIVISIONS_VALUE,
        )
          ? ALL_DIVISIONS_VALUE
          : user.assignedDivisionIds[0] ?? "",
      },
    setUserDraftField: (
      userId: string,
      draft: {
        name: string;
        username: string;
        role: DocumentUserRole;
        assignedDivisionId: string;
      },
      field: keyof typeof draft,
      value: string | DocumentUserRole,
    ) =>
      setUserDrafts((current) => ({
        ...current,
        [userId]: { ...draft, [field]: value },
      })),
    createUser: () => {
      if (!newUser.name.trim() || !newUser.username.trim()) {
        return;
      }

      onCreateUser({
        name: newUser.name.trim(),
        username: newUser.username.trim(),
        role: newUser.role,
        assignedDivisionIds: toAssignedDivisionIds(
          newUser.role,
          newUser.assignedDivisionId,
        ),
      });
      setNewUser({
        name: "",
        username: "",
        role: "shared-user",
        assignedDivisionId: "",
      });
    },
    updateUser: (
      userId: string,
      draft: {
        name: string;
        username: string;
        role: DocumentUserRole;
        assignedDivisionId: string;
      },
    ) =>
      onUpdateUser({
        id: userId,
        name: draft.name,
        username: draft.username,
        role: draft.role,
        assignedDivisionIds: toAssignedDivisionIds(
          draft.role,
          draft.assignedDivisionId,
        ),
      }),
  };
}
