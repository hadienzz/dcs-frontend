import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SdgGoalDetail } from "@/components/sdgs-public/sdg-goal-detail";
import {
  getSdgGoalByParam,
  getSdgGoalSlugs,
} from "@/services/sdgs-public/sdgs-public-service";

interface PageProps {
  params: Promise<{ goal: string }>;
}

export function generateStaticParams() {
  return getSdgGoalSlugs().map((goal) => ({ goal }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { goal } = await params;
  const sdgGoal = getSdgGoalByParam(goal);

  if (!sdgGoal) {
    return {
      title: "SDG tidak ditemukan | SDG Telkom University",
    };
  }

  return {
    title: `SDG ${sdgGoal.id}: ${sdgGoal.name} | SDG Telkom University`,
    description: sdgGoal.summary,
  };
}

export default async function SdgDetailPage({ params }: PageProps) {
  const { goal } = await params;
  const sdgGoal = getSdgGoalByParam(goal);

  if (!sdgGoal) {
    notFound();
  }

  return <SdgGoalDetail goalNumber={goal} />;
}
