import type { Metadata } from "next";

import { SettingsView } from "@/components/sdgs-dashboard/settings-view";

export const metadata: Metadata = {
  title: "Settings",
  description: "Preferensi dashboard SDGs.",
};

export default function Page() {
  return <SettingsView />;
}
