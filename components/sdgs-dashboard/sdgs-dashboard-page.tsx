"use client";

import SdgsDashboardShell from "./app-shell/sdgs-dashboard-shell";
import ContentForm from "./content-form/content-form";

/**
 * Page-level composition for `/sdgs-dashboard`. Wraps the Content_Form in the
 * dashboard shell with an Indonesian title and subtitle so the page reads
 * naturally for the PIC users that will use it.
 */
export function SdgsDashboardPage() {
  return (
    <SdgsDashboardShell
      title="Manajemen Konten SDGs"
      subtitle="Kelola pelaporan metric dan indicator yang akan tampil di pemeringkatan SDGs Telkom University."
    >
      <div className="mx-auto w-full max-w-4xl">
        <ContentForm />
      </div>
    </SdgsDashboardShell>
  );
}

export default SdgsDashboardPage;
