import type { Metadata } from "next";

import { InternalDashboardHome } from "@/components/sdg-dashboard/internal/internal-dashboard-home";

export const metadata: Metadata = {
  title: "Internal SDGs Dashboard",
  description:
    "Area internal SDGs untuk mengelola proposal, timeline, RAB, pengeluaran, dan progress per proyek.",
};

export default function SdgDashboardInternalPage() {
  return <InternalDashboardHome />;
}
