import { Suspense } from "react";
import { LecturerDashboard } from "@/components/sdgs-hub/lecturer-dashboard";

export default function LecturerDashboardPage() {
  return (
    <Suspense>
      <LecturerDashboard />
    </Suspense>
  );
}
