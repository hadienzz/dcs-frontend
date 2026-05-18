import {
  Building2,
  FileText,
  LayoutDashboard,
  Settings,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface DashboardNavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export const dashboardNav: DashboardNavItem[] = [
  { label: "Dashboard", to: "/sdgs-dashboard", icon: LayoutDashboard },
  { label: "Dokumen Pemeringkatan", to: "/sdgs-dashboard/content", icon: FileText },
  { label: "SDGs & Indikator", to: "/sdgs-dashboard/sdgs", icon: Target },
  {
    label: "Direktorat",
    to: "/sdgs-dashboard/directorates",
    icon: Building2,
  },
  { label: "Akun", to: "/sdgs-dashboard/accounts", icon: Users },
  { label: "Pengaturan", to: "/sdgs-dashboard/settings", icon: Settings },
];
