"use client";

import type { DocumentDivision } from "@/types/document-center";
import { getDivisionById } from "@/utils/document-center";

export function useDocumentCenterDriveContext({
  divisions,
  driveDivisionId,
  driveSubdivisionId,
}: {
  divisions: DocumentDivision[];
  driveDivisionId: string;
  driveSubdivisionId: string;
}) {
  const activeDriveDivision = getDivisionById(divisions, driveDivisionId);
  const activeDriveSubdivision = activeDriveDivision?.subdivisions.find(
    (subdivision) => subdivision.id === driveSubdivisionId,
  );

  return {
    activeDriveDivision,
    activeDriveSubdivision,
  };
}
