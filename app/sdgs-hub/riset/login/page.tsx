import { Suspense } from "react";
import { LecturerLoginPanel } from "@/components/sdgs-hub/lecturer-login-panel";

export default function LecturerLoginPage() {
  return (
    <Suspense>
      <LecturerLoginPanel />
    </Suspense>
  );
}
