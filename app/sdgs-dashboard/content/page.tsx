import type { Metadata } from "next";

import { ContentListView } from "@/components/sdgs-dashboard/content-list-view";

export const metadata: Metadata = {
  title: "Inisiatif SDGs",
  description: "Daftar inisiatif keberlanjutan Telkom University.",
};

export default function Page() {
  return <ContentListView />;
}
