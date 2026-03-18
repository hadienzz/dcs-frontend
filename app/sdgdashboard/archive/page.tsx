import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Arsip Project SDGs",
  description:
    "Arsip project SDGs yang sudah selesai untuk menelusuri histori proposal, RAB, realisasi, dan laporan bulanan.",
};

export default function SdgDashboardArchivePage() {
  redirect("/sdgdashboard/internal/archive");
}
