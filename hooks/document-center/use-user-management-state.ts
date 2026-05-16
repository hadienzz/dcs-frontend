"use client";

import { useState } from "react";

import type { DocumentUserRole } from "@/types/document-center";
import { ALL_DIVISIONS_VALUE } from "@/utils/document-center";

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
