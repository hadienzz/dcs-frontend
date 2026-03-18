"use client";

import { NavbarDetail } from "@/components/home/custom/navbar-detail-page";
import { Footer } from "@/components/home/section/footer";

export default function SdgsHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarDetail />
      {children}
      <Footer />
    </>
  );
}
