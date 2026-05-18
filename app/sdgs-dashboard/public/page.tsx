import type { Metadata } from "next";

import { PublicView } from "@/components/sdgs-dashboard/public-view";

export const metadata: Metadata = {
  title: "Publikasi SDGs",
  description: "Dokumen pemeringkatan yang dipublikasi pada website SDGs.",
};

export default function Page() {
  return <PublicView />;
}
