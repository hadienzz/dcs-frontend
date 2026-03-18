import type { Metadata } from "next";

import { ProjectDirectoryPage } from "@/components/sdg-dashboard/project-directory-page";

export const metadata: Metadata = {
  title: "Project Ongoing Internal SDGs",
  description:
    "Daftar project internal SDGs yang sedang berjalan lengkap dengan status approval mitra dan progress masing-masing proyek.",
};

export default function SdgDashboardInternalOngoingPage() {
  return (
    <ProjectDirectoryPage
      status="ongoing"
      eyebrow="Project Ongoing"
      title="Semua proyek internal yang masih berjalan"
      description="Setiap proyek punya dashboard sendiri. Buka salah satu workspace untuk mengelola proposal, timeline, RAB, pengeluaran, dan progress proyek itu saja."
    />
  );
}
