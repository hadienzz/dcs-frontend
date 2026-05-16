"use client";

import { useState } from "react";

import { EMPTY_FILTERS } from "@/hooks/document-center/document-center-options";
import type { DocumentFilters } from "@/types/document-center";

export function useDocumentCenterFilters() {
  const [filters, setFilters] = useState<DocumentFilters>(EMPTY_FILTERS);

  function handleFilterDivisionChange(divisionId: string) {
    setFilters((current) => ({
      ...current,
      divisionId,
      subdivisionId: "",
      picId: "",
    }));
  }

  return {
    filters,
    filterActions: {
      onSearchChange: (search: string) =>
        setFilters((current) => ({ ...current, search })),
      onFilterDivisionChange: handleFilterDivisionChange,
      onFilterSubdivisionChange: (subdivisionId: string) =>
        setFilters((current) => ({ ...current, subdivisionId })),
      onFilterPicChange: (picId: string) =>
        setFilters((current) => ({ ...current, picId })),
      onClearFilters: () => setFilters(EMPTY_FILTERS),
    },
  };
}
