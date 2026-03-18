import type { Metadata } from "next";

import { ExternalWorkspaceHome } from "@/components/sdg-dashboard/external-workspace-home";

export const metadata: Metadata = {
  title: "Portal Eksternal SDGs",
  description:
    "Portal eksternal untuk mitra yang masuk ke workspace lewat invitation code, melihat progress proyek, dan memberi keputusan approval proposal.",
};

export default function SdgDashboardExternalPage() {
  return <ExternalWorkspaceHome />;
}
