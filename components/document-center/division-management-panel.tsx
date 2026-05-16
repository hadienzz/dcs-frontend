import {
  Building2,
  ChevronRight,
  FolderOpen,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";

import { DivisionStat } from "@/components/document-center/division-stat";
import { EmptyState } from "@/components/document-center/empty-state";
import { SectionCard } from "@/components/document-center/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDivisionManagementState } from "@/hooks/document-center/use-division-management-state";
import type { DocumentDivision, DocumentSubdivision } from "@/types/document-center";
import { cn } from "@/lib/utils";

interface DivisionManagementPanelProps {
  divisions: DocumentDivision[];
  pendingState: {
    isCreatingDivision: boolean;
    savingDivisionId?: string;
    deletingDivisionId?: string;
    creatingSubdivisionDivisionId?: string;
    savingSubdivisionId?: string;
    deletingSubdivisionId?: string;
  };
  onCreateDivision: (name: string) => void;
  onUpdateDivision: (divisionId: string, name: string) => void;
  onDeleteDivision: (division: DocumentDivision) => void;
  onCreateSubdivision: (divisionId: string, name: string) => void;
  onUpdateSubdivision: (
    divisionId: string,
    subdivisionId: string,
    name: string,
  ) => void;
  onDeleteSubdivision: (
    division: DocumentDivision,
    subdivision: DocumentSubdivision,
  ) => void;
}

export function DivisionManagementPanel({
  divisions,
  pendingState,
  onCreateDivision,
  onUpdateDivision,
  onDeleteDivision,
  onCreateSubdivision,
  onUpdateSubdivision,
  onDeleteSubdivision,
}: DivisionManagementPanelProps) {
  const state = useDivisionManagementState({
    onCreateDivision,
    onUpdateDivision,
    onCreateSubdivision,
  });
  const canCreateDivision = Boolean(state.newDivisionName.trim());
  const selectedDivision =
    divisions.find((division) => division.id === state.selectedDivisionId) ??
    divisions[0];
  const selectedDivisionDraft = selectedDivision
    ? state.getDivisionDraft(selectedDivision)
    : "";
  const isSavingDivision = selectedDivision
    ? pendingState.savingDivisionId === selectedDivision.id
    : false;
  const isDeletingDivision = selectedDivision
    ? pendingState.deletingDivisionId === selectedDivision.id
    : false;
  const newSubdivisionName = selectedDivision
    ? state.getNewSubdivisionName(selectedDivision.id)
    : "";
  const isCreatingSubdivision = selectedDivision
    ? pendingState.creatingSubdivisionDivisionId === selectedDivision.id
    : false;

  return (
    <SectionCard
      eyebrow="Superadmin"
      title="Division Management"
      description="Manage one division at a time, then add subdivisions from the division detail."
      action={
        <form
          onSubmit={(event) => {
            event.preventDefault();
            state.createDivision();
          }}
          className="flex gap-2"
        >
          <Input
            value={state.newDivisionName}
            onChange={(event) => state.setNewDivisionName(event.target.value)}
            placeholder="New division name"
            className="min-w-[220px]"
          />
          <Button
            type="submit"
            disabled={pendingState.isCreatingDivision || !canCreateDivision}
          >
            {pendingState.isCreatingDivision ? (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            ) : (
              <Plus data-icon="inline-start" />
            )}
            {pendingState.isCreatingDivision ? "Creating..." : "Create"}
          </Button>
        </form>
      }
    >
      {divisions.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(260px,360px)_1fr]">
          <aside className="rounded-[24px] border border-border/80 bg-muted/[0.08] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Divisions
                </p>
                <p className="text-xs text-muted-foreground">
                  Open one detail at a time
                </p>
              </div>
              <Badge variant="neutral">{divisions.length}</Badge>
            </div>

            <div className="mt-4 max-h-[560px] space-y-2 overflow-y-auto pr-1">
              {divisions.map((division) => {
                const isActive = selectedDivision?.id === division.id;

                return (
                  <button
                    key={division.id}
                    type="button"
                    onClick={() => state.selectDivision(division.id)}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition hover:border-primary/25 hover:bg-background",
                      isActive
                        ? "border-primary/30 bg-background shadow-[0_16px_28px_-28px_rgba(182,37,42,0.55)]"
                        : "border-transparent bg-transparent",
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-[14px] border",
                        isActive
                          ? "border-primary/20 bg-primary/[0.08] text-primary"
                          : "border-border/70 bg-background text-muted-foreground",
                      )}
                    >
                      <Building2 className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {division.name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {division.subdivisions.length} subdivisions -{" "}
                        {division.documentCount ?? 0} documents
                      </p>
                    </div>
                    <ChevronRight
                      className={cn(
                        "size-4 shrink-0 text-muted-foreground transition group-hover:text-primary",
                        isActive ? "text-primary" : "",
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </aside>

          {selectedDivision ? (
            <div className="overflow-hidden rounded-[24px] border border-border/80 bg-background shadow-[0_18px_36px_-32px_rgba(15,23,42,0.34)]">
              <div className="border-b border-border/70 bg-[linear-gradient(180deg,rgba(182,37,42,0.055),rgba(182,37,42,0.012)_72%,rgba(182,37,42,0)_100%)] p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-[16px] border border-primary/15 bg-primary/[0.08] text-primary">
                      <FolderOpen className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                        Division detail
                      </p>
                      <h3 className="truncate text-xl font-semibold text-foreground">
                        {selectedDivision.name}
                      </h3>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="neutral">
                      {selectedDivision.subdivisions.length} subdivisions
                    </Badge>
                    <Badge variant="outline">
                      {selectedDivision.documentCount ?? 0} documents
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 p-5 xl:grid-cols-[0.92fr_1.08fr]">
                <div className="space-y-4">
                  <div className="rounded-2xl border border-border/80 bg-muted/[0.06] p-4">
                    <label
                      htmlFor="divisionDetailName"
                      className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground"
                    >
                      Division name
                    </label>
                    <Input
                      id="divisionDetailName"
                      value={selectedDivisionDraft}
                      onChange={(event) =>
                        state.setDivisionDraft(
                          selectedDivision.id,
                          event.target.value,
                        )
                      }
                      className="mt-3"
                    />
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          state.saveDivision(
                            selectedDivision.id,
                            selectedDivisionDraft,
                          )
                        }
                        disabled={
                          isSavingDivision ||
                          isDeletingDivision ||
                          !selectedDivisionDraft.trim()
                        }
                      >
                        {isSavingDivision ? (
                          <Loader2
                            data-icon="inline-start"
                            className="animate-spin"
                          />
                        ) : null}
                        {isSavingDivision ? "Saving..." : "Save division"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => onDeleteDivision(selectedDivision)}
                        disabled={isDeletingDivision || isSavingDivision}
                      >
                        {isDeletingDivision ? (
                          <Loader2
                            data-icon="inline-start"
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 data-icon="inline-start" />
                        )}
                        {isDeletingDivision ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <DivisionStat
                      label="Subdivisions"
                      value={selectedDivision.subdivisions.length}
                    />
                    <DivisionStat
                      label="Documents"
                      value={selectedDivision.documentCount ?? 0}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Subdivisions
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Add only when this division needs one
                      </p>
                    </div>
                    <Badge variant="neutral">
                      {selectedDivision.subdivisions.length}
                    </Badge>
                  </div>

                  {selectedDivision.subdivisions.length > 0 ? (
                    <div className="space-y-2">
                      {selectedDivision.subdivisions.map((subdivision) => {
                        const draft = state.getSubdivisionDraft(subdivision);
                        const isSavingSubdivision =
                          pendingState.savingSubdivisionId === subdivision.id;
                        const isDeletingSubdivision =
                          pendingState.deletingSubdivisionId === subdivision.id;

                        return (
                          <div
                            key={subdivision.id}
                            className="grid gap-2 rounded-2xl border border-border/70 bg-muted/[0.05] p-3 md:grid-cols-[1fr_auto]"
                          >
                            <Input
                              value={draft}
                              onChange={(event) =>
                                state.setSubdivisionDraft(
                                  subdivision.id,
                                  event.target.value,
                                )
                              }
                            />
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                  onUpdateSubdivision(
                                    selectedDivision.id,
                                    subdivision.id,
                                    draft,
                                  )
                                }
                                disabled={
                                  isSavingSubdivision ||
                                  isDeletingSubdivision ||
                                  !draft.trim()
                                }
                              >
                                {isSavingSubdivision ? (
                                  <Loader2
                                    data-icon="inline-start"
                                    className="animate-spin"
                                  />
                                ) : null}
                                {isSavingSubdivision ? "Saving..." : "Save"}
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={() =>
                                  onDeleteSubdivision(
                                    selectedDivision,
                                    subdivision,
                                  )
                                }
                                disabled={
                                  isDeletingSubdivision || isSavingSubdivision
                                }
                                aria-label={`Delete ${subdivision.name}`}
                              >
                                {isDeletingSubdivision ? (
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
                  ) : (
                    <EmptyState
                      icon={<FolderOpen />}
                      title="No subdivisions yet"
                      description="New divisions start empty. Add the first subdivision below when it is needed."
                    />
                  )}

                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      state.createSubdivision(selectedDivision.id);
                    }}
                    className="grid gap-2 rounded-2xl border border-border/80 bg-background p-3 sm:grid-cols-[1fr_auto]"
                  >
                    <Input
                      value={newSubdivisionName}
                      onChange={(event) =>
                        state.setNewSubdivisionName(
                          selectedDivision.id,
                          event.target.value,
                        )
                      }
                      placeholder={`New subdivision for ${selectedDivision.name}`}
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      disabled={
                        isCreatingSubdivision || !newSubdivisionName.trim()
                      }
                    >
                      {isCreatingSubdivision ? (
                        <Loader2
                          data-icon="inline-start"
                          className="animate-spin"
                        />
                      ) : (
                        <Plus data-icon="inline-start" />
                      )}
                      {isCreatingSubdivision ? "Adding..." : "Add Subdivision"}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <EmptyState
          icon={<Building2 />}
          title="No divisions yet"
          description="Create a division first. Subdivisions stay empty until you add them from its detail."
        />
      )}
    </SectionCard>
  );
}
