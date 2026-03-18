import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Project Ongoing SDGs",
  description:
    "Daftar project SDGs yang sedang berjalan lengkap dengan status approval mitra, RAB, dan progress bulanan.",
};

export default function SdgDashboardOngoingPage() {
  redirect("/sdgdashboard/internal/ongoing");
}
