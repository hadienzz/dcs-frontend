"use client";

import useGetMe from "@/hooks/auth/use-get-me";
import useLogout from "@/hooks/auth/use-logout";
import type {
  SdgDashboardAccount,
  SdgDashboardAccountRole,
} from "@/types/auth";

export type { SdgDashboardAccount, SdgDashboardAccountRole } from "@/types/auth";

export function getSdgDashboardRouteByRole(role: SdgDashboardAccountRole) {
  return role === "internal" ? "/sdgdashboard/internal" : "/sdgdashboard/external";
}

export function useSdgDashboardAuth(): {
  currentAccount: SdgDashboardAccount | null;
  isHydrated: boolean;
  isPending: boolean;
  logout: () => void;
} {
  const { data, isPending, isFetched } = useGetMe();
  const { logout } = useLogout();

  return {
    currentAccount: data ?? null,
    isHydrated: isFetched || !isPending,
    isPending,
    logout,
  };
}
