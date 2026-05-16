import type { Metadata } from "next";

import { PublicView } from "@/components/sdgs-dashboard/public-view";

export const metadata: Metadata = {
  title: "Publikasi SDGs",
  description: "Inisiatif yang dipublikasi pada website pemeringkatan SDGs.",
};

export default function Page() {
  return <PublicView />;
}
