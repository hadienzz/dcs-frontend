import type { Metadata } from "next";

import { AccountsManagementView } from "@/components/sdgs-dashboard/accounts-management-view";

export const metadata: Metadata = {
  title: "Manajemen Akun",
  description: "Kelola akun direktorat dan unit untuk akses dokumen pemeringkatan SDGs.",
};

export default function Page() {
  return <AccountsManagementView />;
}
