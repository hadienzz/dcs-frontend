import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Detail Project SDGs",
  description:
    "Halaman detail project SDGs untuk proposal, timeline, budget RAB, dan progress report.",
};

export default async function SdgDashboardProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  redirect(`/sdgdashboard/internal/${slug}`);
}
