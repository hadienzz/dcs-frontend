import type { Metadata } from "next";

import { ExternalProjectPortal } from "@/components/sdg-dashboard/external-project-portal";

export const metadata: Metadata = {
  title: "Dashboard Mitra SDGs",
  description:
    "Dashboard mitra eksternal untuk melihat progress proyek SDGs dan memberi keputusan approval proposal.",
};

export default async function SdgDashboardExternalProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <ExternalProjectPortal projectSlug={slug} />;
}
