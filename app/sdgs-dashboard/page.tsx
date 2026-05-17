import type { Metadata } from "next";

import { OverviewView } from "@/components/sdgs-dashboard/overview-view";

export const metadata: Metadata = {
  title: "SDGs Dashboard",
  description:
    "Pantau dan kelola dokumen pemeringkatan keberlanjutan Telkom University.",
};

export default function Page() {
  return <OverviewView />;
}
