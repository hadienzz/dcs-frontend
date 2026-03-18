"use client";

import type { ReactNode } from "react";
import { SdgsHubProvider } from "@/hooks/useSdgsHubData";
import { LecturerPortalProvider } from "@/hooks/useLecturerPortal";
import TanstackProvider from "@/components/tanstack/provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TanstackProvider>
      <LecturerPortalProvider>
        <SdgsHubProvider>{children}</SdgsHubProvider>
      </LecturerPortalProvider>
    </TanstackProvider>
  );
}
