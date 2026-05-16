import type { Metadata } from "next";

import { InternalView } from "@/components/sdgs-dashboard/internal-view";

export const metadata: Metadata = {
  title: "Draf Internal SDGs",
  description: "Inisiatif yang masih disiapkan tim internal.",
};

export default function Page() {
  return <InternalView />;
}
