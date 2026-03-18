import { Suspense } from "react";
import { NavbarDetail } from "@/components/home/custom/navbar-detail-page";
import { Footer } from "@/components/home/section/footer";
import { LecturerLoginPanel } from "@/components/sdgs-hub/lecturer-login-panel";

export default function LoginPage() {
  return (
    <>
      <NavbarDetail />
      <Suspense
        fallback={
          <div className="min-h-screen bg-[linear-gradient(180deg,#fff_0%,#fbfbfb_100%)] pt-32 pb-20" />
        }
      >
        <LecturerLoginPanel />
      </Suspense>
      <Footer />
    </>
  );
}
