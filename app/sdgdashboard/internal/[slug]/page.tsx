import type { Metadata } from "next";

import { SdgDashboardPortal } from "@/components/sdg-dashboard/sdg-dashboard-portal";

export const metadata: Metadata = {
  title: "Workspace Internal Project SDGs",
  description:
    "Workspace internal per proyek untuk mengelola proposal, timeline, RAB, pengeluaran, dan progress SDGs.",
};

export default async function SdgDashboardInternalProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <SdgDashboardPortal projectSlug={slug} />;
}
