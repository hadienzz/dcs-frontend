"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { useCreateDivisionMutation } from "@/hooks/document-center/use-create-division";
import { useCreatePicMutation } from "@/hooks/document-center/use-create-pic";
import { useCreateSubdivisionMutation } from "@/hooks/document-center/use-create-subdivision";
import { useCreateUserMutation } from "@/hooks/document-center/use-create-user";
import { useDeleteDivisionMutation } from "@/hooks/document-center/use-delete-division";
import { useDeleteDocumentMutation } from "@/hooks/document-center/use-delete-document";
import { useDeletePicMutation } from "@/hooks/document-center/use-delete-pic";
import { useDeleteSubdivisionMutation } from "@/hooks/document-center/use-delete-subdivision";
import { useDeleteUserMutation } from "@/hooks/document-center/use-delete-user";
import { useDocumentCenterData } from "@/hooks/document-center/use-get-document-center-store";
import { useUpdateDivisionMutation } from "@/hooks/document-center/use-update-division";
import { useUpdatePicMutation } from "@/hooks/document-center/use-update-pic";
import { useUpdateSubdivisionMutation } from "@/hooks/document-center/use-update-subdivision";
import { useUpdateUserMutation } from "@/hooks/document-center/use-update-user";
import { useUploadDocumentForm } from "@/hooks/document-center/use-upload-document-form";
import { EMPTY_DOCUMENT_CENTER_STORE } from "@/types/document-center";
import type {
  DocumentAccount,
  DocumentCenterQuery,
  DocumentDivision,
  DocumentFilters,
  DocumentPic,
  DocumentSubdivision,
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

type PendingDeleteSubdivision = {
  divisionId: string;
  divisionName: string;
  subdivision: DocumentSubdivision;
};

function getRecentRangeLabel(range: RecentDocumentRange) {
  return (
    RECENT_RANGE_OPTIONS.find((option) => option.value === range)?.label ??
    "All time"
  );
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
  const [pendingDeleteDivision, setPendingDeleteDivision] =
    useState<DocumentDivision | null>(null);
  const [pendingDeleteSubdivision, setPendingDeleteSubdivision] =
    useState<PendingDeleteSubdivision | null>(null);
  const [pendingDeletePic, setPendingDeletePic] =
    useState<DocumentPic | null>(null);
  const [pendingDeleteUser, setPendingDeleteUser] =
    useState<DocumentAccount | null>(null);

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
  const {
    data: store = EMPTY_DOCUMENT_CENTER_STORE,
    error: loadError,
    isError: isLoadError,
    isFetching,
    isLoading,
    refetch,
  } = useDocumentCenterData(documentCenterQuery);
  const deleteDocumentMutation = useDeleteDocumentMutation();
  const createDivisionMutation = useCreateDivisionMutation();
  const updateDivisionMutation = useUpdateDivisionMutation();
  const deleteDivisionMutation = useDeleteDivisionMutation();
  const createSubdivisionMutation = useCreateSubdivisionMutation();
  const updateSubdivisionMutation = useUpdateSubdivisionMutation();
  const deleteSubdivisionMutation = useDeleteSubdivisionMutation();
  const createPicMutation = useCreatePicMutation();
  const updatePicMutation = useUpdatePicMutation();
  const deletePicMutation = useDeletePicMutation();
  const createUserMutation = useCreateUserMutation();
  const updateUserMutation = useUpdateUserMutation();
  const deleteUserMutation = useDeleteUserMutation();

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
        setPendingDeleteDocument(null);
      },
    });
  }

  function handleDeleteDialogOpenChange(open: boolean) {
    if (!open && !deleteDocumentMutation.isPending) {
      setPendingDeleteDocument(null);
    }
  }

  function handleConfirmDeleteDivision() {
    if (!pendingDeleteDivision) {
      return;
    }

    deleteDivisionMutation.mutate(pendingDeleteDivision.id, {
      onSuccess: () => {
        setPendingDeleteDivision(null);
      },
    });
  }

  function handleDivisionDeleteDialogOpenChange(open: boolean) {
    if (!open && !deleteDivisionMutation.isPending) {
      setPendingDeleteDivision(null);
    }
  }

  function handleConfirmDeleteSubdivision() {
    if (!pendingDeleteSubdivision) {
      return;
    }

    deleteSubdivisionMutation.mutate(
      {
        divisionId: pendingDeleteSubdivision.divisionId,
        subdivisionId: pendingDeleteSubdivision.subdivision.id,
      },
      {
        onSuccess: () => {
          setPendingDeleteSubdivision(null);
        },
      },
    );
  }

  function handleSubdivisionDeleteDialogOpenChange(open: boolean) {
    if (!open && !deleteSubdivisionMutation.isPending) {
      setPendingDeleteSubdivision(null);
    }
  }

  function handleConfirmDeletePic() {
    if (!pendingDeletePic) {
      return;
    }

    deletePicMutation.mutate(pendingDeletePic.id, {
      onSuccess: () => {
        setPendingDeletePic(null);
      },
    });
  }

  function handlePicDeleteDialogOpenChange(open: boolean) {
    if (!open && !deletePicMutation.isPending) {
      setPendingDeletePic(null);
    }
  }

  function handleConfirmDeleteUser() {
    if (!pendingDeleteUser) {
      return;
    }

    deleteUserMutation.mutate(pendingDeleteUser.id, {
      onSuccess: () => {
        setPendingDeleteUser(null);
      },
    });
  }

  function handleUserDeleteDialogOpenChange(open: boolean) {
    if (!open && !deleteUserMutation.isPending) {
      setPendingDeleteUser(null);
    }
  }

  return {
    activeTab,
    setActiveTab,
    isLoading,
    isRefreshing: isFetching && !isLoading,
    loadErrorMessage: isLoadError
      ? getErrorMessage(
          loadError,
          "Document center belum bisa dimuat. Coba lagi sebentar.",
        )
      : undefined,
    onRetryLoad: () => {
      refetch();
    },
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
    pendingDeleteDivision,
    pendingDeleteSubdivision,
    pendingDeletePic,
    pendingDeleteUser,
    isDeleteDialogOpen: Boolean(pendingDeleteDocument),
    isDeletingDocument: deleteDocumentMutation.isPending,
    isDivisionDeleteDialogOpen: Boolean(pendingDeleteDivision),
    isSubdivisionDeleteDialogOpen: Boolean(pendingDeleteSubdivision),
    isPicDeleteDialogOpen: Boolean(pendingDeletePic),
    isUserDeleteDialogOpen: Boolean(pendingDeleteUser),
    isDeletingDivision: deleteDivisionMutation.isPending,
    isDeletingSubdivision: deleteSubdivisionMutation.isPending,
    isDeletingPic: deletePicMutation.isPending,
    isDeletingUser: deleteUserMutation.isPending,
    divisionPendingState: {
      isCreatingDivision: createDivisionMutation.isPending,
      savingDivisionId: updateDivisionMutation.isPending
        ? updateDivisionMutation.variables?.divisionId
        : undefined,
      deletingDivisionId: deleteDivisionMutation.isPending
        ? deleteDivisionMutation.variables
        : undefined,
      creatingSubdivisionDivisionId: createSubdivisionMutation.isPending
        ? createSubdivisionMutation.variables?.divisionId
        : undefined,
      savingSubdivisionId: updateSubdivisionMutation.isPending
        ? updateSubdivisionMutation.variables?.subdivisionId
        : undefined,
      deletingSubdivisionId: deleteSubdivisionMutation.isPending
        ? deleteSubdivisionMutation.variables?.subdivisionId
        : undefined,
    },
    picPendingState: {
      isCreatingPic: createPicMutation.isPending,
      savingPicId: updatePicMutation.isPending
        ? updatePicMutation.variables?.id
        : undefined,
      deletingPicId: deletePicMutation.isPending
        ? deletePicMutation.variables
        : undefined,
    },
    userPendingState: {
      isCreatingUser: createUserMutation.isPending,
      savingUserId: updateUserMutation.isPending
        ? updateUserMutation.variables?.id
        : undefined,
      deletingUserId: deleteUserMutation.isPending
        ? deleteUserMutation.variables
        : undefined,
    },
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
    divisionDeleteDialogActions: {
      onOpenChange: handleDivisionDeleteDialogOpenChange,
      onConfirm: handleConfirmDeleteDivision,
    },
    subdivisionDeleteDialogActions: {
      onOpenChange: handleSubdivisionDeleteDialogOpenChange,
      onConfirm: handleConfirmDeleteSubdivision,
    },
    picDeleteDialogActions: {
      onOpenChange: handlePicDeleteDialogOpenChange,
      onConfirm: handleConfirmDeletePic,
    },
    userDeleteDialogActions: {
      onOpenChange: handleUserDeleteDialogOpenChange,
      onConfirm: handleConfirmDeleteUser,
    },
    divisionActions: {
      onCreateDivision: (name: string) =>
        createDivisionMutation.mutate({ name }),
      onUpdateDivision: (divisionId: string, name: string) =>
        updateDivisionMutation.mutate({ divisionId, values: { name } }),
      onDeleteDivision: setPendingDeleteDivision,
      onCreateSubdivision: (divisionId: string, name: string) =>
        createSubdivisionMutation.mutate({ divisionId, name }),
      onUpdateSubdivision: (
        divisionId: string,
        subdivisionId: string,
        name: string,
      ) =>
        updateSubdivisionMutation.mutate({
          subdivisionId,
          values: { divisionId, name },
        }),
      onDeleteSubdivision: (
        division: DocumentDivision,
        subdivision: DocumentSubdivision,
      ) =>
        setPendingDeleteSubdivision({
          divisionId: division.id,
          divisionName: division.name,
          subdivision,
        }),
    },
    picActions: {
      onCreatePic: (divisionId: string, name: string) =>
        createPicMutation.mutate({ divisionId, name }),
      onUpdatePic: (picId: string, divisionId: string, name: string) =>
        updatePicMutation.mutate({ id: picId, divisionId, name }),
      onDeletePic: setPendingDeletePic,
    },
    userActions: {
      onCreateUser: (payload: {
        name: string;
        username: string;
        role: DocumentUserRole;
        assignedDivisionIds: string[];
      }) =>
        createUserMutation.mutate(payload),
      onUpdateUser: (payload: {
        id: string;
        name: string;
        username: string;
        role: DocumentUserRole;
        assignedDivisionIds: string[];
      }) =>
        updateUserMutation.mutate(payload),
      onDeleteUser: setPendingDeleteUser,
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
  const [selectedDivisionId, setSelectedDivisionId] = useState<string | null>(
    null,
  );
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
    selectedDivisionId,
    selectDivision: setSelectedDivisionId,
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
