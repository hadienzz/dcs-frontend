"use client";

import { useState } from "react";

import type { DocumentDivision } from "@/types/document-center";
import { getAllPics } from "@/utils/document-center";

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
