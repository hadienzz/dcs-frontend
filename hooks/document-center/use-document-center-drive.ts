"use client";

import { useState } from "react";

export function useDocumentCenterDrive() {
  const [driveDivisionId, setDriveDivisionId] = useState("");
  const [driveSubdivisionId, setDriveSubdivisionId] = useState("");

  return {
    driveDivisionId,
    driveSubdivisionId,
    driveActions: {
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
  };
}
