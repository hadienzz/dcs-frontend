import type { Metadata } from "next";

import { SdgsDashboardPage } from "@/components/sdgs-dashboard/sdgs-dashboard-page";

export const metadata: Metadata = {
  title: "SDGs Dashboard",
  description:
    "Dashboard pengelolaan konten publik dan internal untuk website pemeringkatan SDGs Telkom University.",
};

export default function Page() {
  return <SdgsDashboardPage />;
}
