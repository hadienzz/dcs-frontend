import { BarChart3 } from "lucide-react";

import { EmptyState } from "./empty-state";
import { PageHeader } from "./page-header";

export function AnalyticsView() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Analitik" }]}
        title="Analitik"
        description="Insight performa dokumen pemeringkatan SDGs Telkom University."
      />
      <EmptyState
        title="Analitik segera hadir"
        description="Halaman ini akan menampilkan distribusi dokumen per SDG, kontribusi tiap direktorat, dan tren publikasi."
        icon={BarChart3}
      />
    </>
  );
}
