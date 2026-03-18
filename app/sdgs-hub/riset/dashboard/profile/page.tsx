import { Suspense } from "react";
import { LecturerProfilePage } from "@/components/sdgs-hub/lecturer-dashboard";

export default function LecturerProfileRoute() {
  return (
    <Suspense>
      <LecturerProfilePage />
    </Suspense>
  );
}
