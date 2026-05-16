import {
  BarChart3,
  Building2,
  FileText,
  Globe2,
  LayoutDashboard,
  Lock,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface DashboardNavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export const dashboardNav: DashboardNavItem[] = [
  { label: "Dashboard", to: "/sdgs-dashboard", icon: LayoutDashboard },
  { label: "Inisiatif SDGs", to: "/sdgs-dashboard/content", icon: FileText },
  { label: "Publikasi", to: "/sdgs-dashboard/public", icon: Globe2 },
  { label: "Draft Internal", to: "/sdgs-dashboard/internal", icon: Lock },
  {
    label: "Direktorat",
    to: "/sdgs-dashboard/directorates",
    icon: Building2,
  },
  { label: "Analitik", to: "/sdgs-dashboard/analytics", icon: BarChart3 },
  { label: "Pengaturan", to: "/sdgs-dashboard/settings", icon: Settings },
];
