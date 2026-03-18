import type { Metadata } from "next";

import { ProjectDirectoryPage } from "@/components/sdg-dashboard/project-directory-page";

export const metadata: Metadata = {
  title: "Arsip Internal SDGs",
  description:
    "Arsip project internal SDGs yang sudah selesai untuk menelusuri kembali histori tiap proyek secara terpisah.",
};

export default function SdgDashboardInternalArchivePage() {
  return (
    <ProjectDirectoryPage
      status="completed"
      eyebrow="Arsip Project"
      title="Project yang sudah selesai dan masuk arsip"
      description="Arsip tetap dipisah per proyek agar histori proposal, RAB, pengeluaran, dan laporan setiap kerja sama mudah ditelusuri kembali."
    />
  );
}
