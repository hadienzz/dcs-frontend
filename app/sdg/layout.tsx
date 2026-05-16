import type React from "react";

import { NavbarDetail } from "@/components/home/custom/navbar-detail-page";
import { Footer } from "@/components/home/section/footer";

export default function SdgLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavbarDetail />
      {children}
      <Footer />
    </>
  );
}
