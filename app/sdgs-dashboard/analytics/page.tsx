import type { Metadata } from "next";

import { AnalyticsView } from "@/components/sdgs-dashboard/analytics-view";

export const metadata: Metadata = {
  title: "Analitik SDGs",
  description: "Insight performa dokumen pemeringkatan SDGs Telkom University.",
};

export default function Page() {
  return <AnalyticsView />;
}
