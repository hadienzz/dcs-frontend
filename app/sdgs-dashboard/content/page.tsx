import type { Metadata } from "next";

import { ContentListView } from "@/components/sdgs-dashboard/content-list-view";

export const metadata: Metadata = {
  title: "Dokumen Pemeringkatan",
  description: "Daftar dokumen pemeringkatan keberlanjutan Telkom University.",
};

export default function Page() {
  return <ContentListView />;
}
