import { Suspense } from "react";
import { LecturerOwnResearchPage } from "@/components/sdgs-hub/lecturer-dashboard";

export default function LecturerOwnResearchRoute() {
  return (
    <Suspense>
      <LecturerOwnResearchPage />
    </Suspense>
  );
}
