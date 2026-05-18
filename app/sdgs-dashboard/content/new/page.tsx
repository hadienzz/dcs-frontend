import type { Metadata } from "next";

import { ContentCreateView } from "@/components/sdgs-dashboard/content-create-view";

export const metadata: Metadata = {
  title: "Tambah Dokumen Pemeringkatan",
  description: "Form input dokumen baru untuk pemeringkatan SDGs.",
};

export default function Page() {
  return <ContentCreateView />;
}
