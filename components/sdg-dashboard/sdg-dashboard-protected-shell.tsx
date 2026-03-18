"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  getSdgDashboardRouteByRole,
  useSdgDashboardAuth,
  type SdgDashboardAccountRole,
} from "@/hooks/use-sdg-dashboard-auth";

interface SdgDashboardProtectedShellProps {
  children: ReactNode;
  requiredRole: SdgDashboardAccountRole;
  workspaceLabel: string;
}

export function SdgDashboardProtectedShell({
  children,
  requiredRole,
  workspaceLabel,
}: SdgDashboardProtectedShellProps) {
  const router = useRouter();
  const { currentAccount, isHydrated, logout } = useSdgDashboardAuth();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!currentAccount) {
      router.replace("/sdgdashboard");
      return;
    }

    if (currentAccount.role !== requiredRole) {
      router.replace(getSdgDashboardRouteByRole(currentAccount.role));
    }
  }, [currentAccount, isHydrated, requiredRole, router]);

  if (!isHydrated || !currentAccount || currentAccount.role !== requiredRole) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f7f1ea_0%,#fbf8f3_48%,#f1e7dd_100%)] px-4">
        <div className="rounded-[28px] border border-[#d8ccbf] bg-white/85 px-6 py-5 text-sm text-[#5f5044] shadow-[0_32px_90px_-52px_rgba(44,36,31,0.42)] backdrop-blur-sm">
          Memeriksa akses...
        </div>
      </main>
    );
  }

  function handleLogout() {
    logout();
    router.replace("/sdgdashboard");
  }

  const primaryNavigationHref =
    requiredRole === "internal"
      ? "/sdgs-hub"
      : getSdgDashboardRouteByRole(currentAccount.role);

  const primaryNavigationLabel =
    requiredRole === "internal" ? "Kembali ke SDGs Hub" : workspaceLabel;

  const primaryNavigationCaption =
    requiredRole === "internal" ? "Halaman utama" : "SDGs Dashboard";

  return (
    <div>
      <header className="sticky top-0 z-30 border-b border-[#dbd0c3]/85 bg-[#faf6f0]/88 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1360px] flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href={primaryNavigationHref} className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#2c241f] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f8eee2]">
              {requiredRole === "internal" ? (
                <ArrowLeft className="h-3.5 w-3.5" />
              ) : null}
              {primaryNavigationLabel}
            </span>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8e7766]">
                {primaryNavigationCaption}
              </p>
              <p className="text-sm font-semibold text-[#2c241f]">
                {currentAccount.name}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#2c241f]">
                {currentAccount.organization}
              </p>
              <p className="text-xs text-[#7b6657]">{currentAccount.email}</p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleLogout}
              className="rounded-full border-[#d7cabd] bg-white/80 px-4 text-[#3f332c] hover:bg-[#f4ebe2]"
            >
              <LogOut data-icon="inline-start" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
