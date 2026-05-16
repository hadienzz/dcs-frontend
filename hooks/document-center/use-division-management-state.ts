"use client";

import { useState } from "react";

import type { DocumentDivision } from "@/types/document-center";

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
