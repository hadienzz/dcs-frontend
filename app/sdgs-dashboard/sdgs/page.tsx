import type { Metadata } from "next";

import { SdgsManagementView } from "@/components/sdgs-dashboard/sdgs-management-view";

export const metadata: Metadata = {
  title: "SDGs & Indikator",
  description: "Kelola 17 goal SDGs dan indikator-indikatornya.",
};

export default function Page() {
  return <SdgsManagementView />;
}
