"use client";

import { useMemo } from "react";

import type { DocumentDivision } from "@/types/document-center";
import {
  getPicsByDivision,
  getSubdivisionsByDivision,
} from "@/utils/document-center";

export function useDocumentCenterFilterOptions({
  divisions,
  divisionId,
}: {
  divisions: DocumentDivision[];
  divisionId: string;
}) {
  const subdivisionOptions = useMemo(
    () => getSubdivisionsByDivision(divisions, divisionId),
    [divisions, divisionId],
  );
  const picOptions = useMemo(
    () => getPicsByDivision(divisions, divisionId),
    [divisions, divisionId],
  );

  return {
    filterSubdivisionOptions: subdivisionOptions,
    filterPicOptions: picOptions,
  };
}
