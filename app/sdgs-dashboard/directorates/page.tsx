import type { Metadata } from "next";

import { DirectoratesView } from "@/components/sdgs-dashboard/directorates-view";

export const metadata: Metadata = {
  title: "Direktorat & Unit",
  description: "Struktur direktorat Telkom University untuk dokumen pemeringkatan SDGs.",
};

export default function Page() {
  return <DirectoratesView />;
}
