import { Loader2, Plus, Trash2 } from "lucide-react";

import { AccessSelect } from "@/components/document-center/access-select";
import { RoleSelect } from "@/components/document-center/role-select";
import { SectionCard } from "@/components/document-center/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserManagementState } from "@/hooks/document-center/use-user-management-state";
import type {
  DocumentAccount,
  DocumentDivision,
  DocumentUserRole,
} from "@/types/document-center";

interface UserManagementPanelProps {
  divisions: DocumentDivision[];
  users: DocumentAccount[];
  pendingState: {
    isCreatingUser: boolean;
    savingUserId?: string;
    deletingUserId?: string;
  };
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
  onDeleteUser: (user: DocumentAccount) => void;
}

export function UserManagementPanel({
  divisions,
  users,
  pendingState,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
}: UserManagementPanelProps) {
  const state = useUserManagementState({
    onCreateUser,
    onUpdateUser,
  });
  const canCreateUser = Boolean(
    state.newUser.name.trim() && state.newUser.username.trim(),
  );

  return (
    <SectionCard
      eyebrow="Superadmin"
      title="User Management"
      description="Create and manage superadmin or shared user accounts."
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          state.createUser();
        }}
        className="mb-6 grid gap-3 rounded-[24px] border border-border/80 bg-muted/[0.08] p-4 lg:grid-cols-[1fr_1fr_180px_220px_auto]"
      >
        <Input
          value={state.newUser.name}
          onChange={(event) =>
            state.setNewUserField("name", event.target.value)
          }
          placeholder="Name"
        />
        <Input
          value={state.newUser.username}
          onChange={(event) =>
            state.setNewUserField("username", event.target.value)
          }
          placeholder="Email / username"
        />
        <RoleSelect
          value={state.newUser.role}
          onChange={(role) => state.setNewUserField("role", role)}
        />
        <AccessSelect
          divisions={divisions}
          value={state.newUser.assignedDivisionId}
          disabled={state.newUser.role === "superadmin"}
          onChange={(assignedDivisionId) =>
            state.setNewUserField("assignedDivisionId", assignedDivisionId)
          }
        />
        <Button
          type="submit"
          disabled={pendingState.isCreatingUser || !canCreateUser}
        >
          {pendingState.isCreatingUser ? (
            <Loader2 data-icon="inline-start" className="animate-spin" />
          ) : (
            <Plus data-icon="inline-start" />
          )}
          {pendingState.isCreatingUser ? "Creating..." : "Create"}
        </Button>
      </form>

      <div className="space-y-3">
        {users.map((user) => {
          const draft = state.getUserDraft(user);
          const isSavingUser = pendingState.savingUserId === user.id;
          const isDeletingUser = pendingState.deletingUserId === user.id;

          return (
            <div
              key={user.id}
              className="grid gap-3 rounded-[24px] border border-border/80 bg-background p-4 lg:grid-cols-[1fr_1fr_180px_220px_auto]"
            >
              <Input
                value={draft.name}
                onChange={(event) =>
                  state.setUserDraftField(
                    user.id,
                    draft,
                    "name",
                    event.target.value,
                  )
                }
              />
              <Input
                value={draft.username}
                onChange={(event) =>
                  state.setUserDraftField(
                    user.id,
                    draft,
                    "username",
                    event.target.value,
                  )
                }
              />
              <RoleSelect
                value={draft.role}
                onChange={(role) =>
                  state.setUserDraftField(user.id, draft, "role", role)
                }
              />
              <AccessSelect
                divisions={divisions}
                value={draft.assignedDivisionId}
                disabled={draft.role === "superadmin"}
                onChange={(assignedDivisionId) =>
                  state.setUserDraftField(
                    user.id,
                    draft,
                    "assignedDivisionId",
                    assignedDivisionId,
                  )
                }
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => state.updateUser(user.id, draft)}
                  disabled={
                    isSavingUser ||
                    isDeletingUser ||
                    !draft.name.trim() ||
                    !draft.username.trim()
                  }
                >
                  {isSavingUser ? (
                    <Loader2 data-icon="inline-start" className="animate-spin" />
                  ) : null}
                  {isSavingUser ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => onDeleteUser(user)}
                  disabled={isDeletingUser || isSavingUser}
                  aria-label={`Delete ${user.name}`}
                >
                  {isDeletingUser ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Trash2 />
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
