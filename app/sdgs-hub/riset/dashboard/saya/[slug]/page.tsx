import { Suspense } from "react";
import { LecturerResearchDetailPage } from "@/components/sdgs-hub/lecturer-dashboard";

export default async function LecturerResearchDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <Suspense>
      <LecturerResearchDetailPage slug={slug} />
    </Suspense>
  );
}
