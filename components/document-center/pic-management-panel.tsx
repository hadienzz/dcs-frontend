import { Loader2, Plus, Trash2, UserRound } from "lucide-react";

import { EmptyState } from "@/components/document-center/empty-state";
import { SectionCard } from "@/components/document-center/section-card";
import { DivisionSelect } from "@/components/document-center/division-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePicManagementState } from "@/hooks/document-center/use-document-center-dashboard";
import type { DocumentDivision, DocumentPic } from "@/types/document-center";

interface PicManagementPanelProps {
  divisions: DocumentDivision[];
  pendingState: {
    isCreatingPic: boolean;
    savingPicId?: string;
    deletingPicId?: string;
  };
  onCreatePic: (divisionId: string, name: string) => void;
  onUpdatePic: (picId: string, divisionId: string, name: string) => void;
  onDeletePic: (pic: DocumentPic) => void;
}

export function PICManagementPanel({
  divisions,
  pendingState,
  onCreatePic,
  onUpdatePic,
  onDeletePic,
}: PicManagementPanelProps) {
  const state = usePicManagementState({
    divisions,
    onCreatePic,
    onUpdatePic,
  });
  const canCreatePic = Boolean(
    state.newPic.name.trim() && (state.newPic.divisionId || divisions[0]?.id),
  );

  return (
    <SectionCard
      eyebrow="Superadmin"
      title="PIC Management"
      description="Manage people assigned to each division."
      action={
        <form
          onSubmit={(event) => {
            event.preventDefault();
            state.createPic();
          }}
          className="grid gap-2 sm:grid-cols-[220px_220px_auto]"
        >
          <Input
            value={state.newPic.name}
            onChange={(event) => state.setNewPicName(event.target.value)}
            placeholder="PIC name"
          />
          <DivisionSelect
            id="newPicDivision"
            name="newPicDivision"
            value={state.newPic.divisionId}
            divisions={divisions}
            onChange={state.setNewPicDivisionId}
          />
          <Button
            type="submit"
            disabled={pendingState.isCreatingPic || !canCreatePic}
          >
            {pendingState.isCreatingPic ? (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            ) : (
              <Plus data-icon="inline-start" />
            )}
            {pendingState.isCreatingPic ? "Adding..." : "Add"}
          </Button>
        </form>
      }
    >
      {state.people.length > 0 ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {state.people.map((person) => {
            const draft = state.getPicDraft(person);
            const isSavingPic = pendingState.savingPicId === person.id;
            const isDeletingPic = pendingState.deletingPicId === person.id;

            return (
              <div
                key={person.id}
                className="rounded-[24px] border border-border/80 bg-muted/[0.08] p-4"
              >
                <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                  <Input
                    value={draft.name}
                    onChange={(event) =>
                      state.setPicDraftName(person, event.target.value)
                    }
                  />
                  <DivisionSelect
                    id={`division-${person.id}`}
                    name={`division-${person.id}`}
                    value={draft.divisionId}
                    divisions={divisions}
                    onChange={(divisionId) =>
                      state.setPicDraftDivisionId(person, divisionId)
                    }
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        state.updatePic(person.id, draft.divisionId, draft.name)
                      }
                      disabled={
                        isSavingPic ||
                        isDeletingPic ||
                        !draft.name.trim() ||
                        !draft.divisionId
                      }
                    >
                      {isSavingPic ? (
                        <Loader2
                          data-icon="inline-start"
                          className="animate-spin"
                        />
                      ) : null}
                      {isSavingPic ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => onDeletePic(person)}
                      disabled={isDeletingPic || isSavingPic}
                      aria-label={`Delete ${person.name}`}
                    >
                      {isDeletingPic ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Trash2 />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<UserRound />}
          title="No PIC entries"
          description="Create a PIC entry to use it in document uploads."
        />
      )}
    </SectionCard>
  );
}
