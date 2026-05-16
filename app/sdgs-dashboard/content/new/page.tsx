import type { Metadata } from "next";

import { ContentCreateView } from "@/components/sdgs-dashboard/content-create-view";

export const metadata: Metadata = {
  title: "Tambah Inisiatif SDGs",
  description: "Form input inisiatif baru untuk pemeringkatan SDGs.",
};

export default function Page() {
  return <ContentCreateView />;
}
