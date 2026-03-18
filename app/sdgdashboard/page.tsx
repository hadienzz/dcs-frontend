import type { Metadata } from "next";

import { SdgDashboardAuthPage } from "@/components/sdg-dashboard/sdg-dashboard-auth-page";

export const metadata: Metadata = {
  title: "Akses SDGs Dashboard",
  description:
    "Halaman akses akun SDGs Dashboard untuk login internal dan pembuatan akun eksternal.",
};

export default function SdgDashboardPage() {
  return <SdgDashboardAuthPage />;
}
