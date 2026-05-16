import { Settings as SettingsIcon } from "lucide-react";

import { EmptyState } from "./empty-state";
import { PageHeader } from "./page-header";

export function SettingsView() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Pengaturan" }]}
        title="Pengaturan"
        description="Preferensi dashboard SDGs."
      />
      <EmptyState
        title="Pengaturan akan segera tersedia"
        icon={SettingsIcon}
      />
    </>
  );
}
