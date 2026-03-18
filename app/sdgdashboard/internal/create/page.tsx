import type { Metadata } from "next";

import { SdgDashboardCreateProject } from "@/components/sdg-dashboard/sdg-dashboard-create-project";

export const metadata: Metadata = {
  title: "Buat Project Internal SDGs",
  description:
    "Form untuk membuat project baru di area internal dashboard SDGs.",
};

export default function SdgDashboardInternalCreatePage() {
  return <SdgDashboardCreateProject />;
}
