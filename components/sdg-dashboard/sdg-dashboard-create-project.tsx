"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getInternalDashboardPath } from "@/components/sdg-dashboard/dashboard-data";
import { InternalCreateProjectFormSection } from "@/components/sdg-dashboard/internal/internal-create-project-form-section";
import { InternalCreateProjectHeroSection } from "@/components/sdg-dashboard/internal/internal-create-project-hero-section";
import { Button } from "@/components/ui/button";

const setupItems = [
  "Workspace internal untuk menyusun proposal, timeline, RAB, dan laporan.",
  "Portal mitra terpisah lengkap dengan invitation code dan approval proposal.",
  "Tracking progress 3 bulan dengan data yang bisa dibagikan atau internal saja.",
];

export function SdgDashboardCreateProject() {
  return (
    <main className="min-h-screen bg-[#f7f4f1]">
      <div className="mx-auto flex w-full max-w-[960px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex items-center">
          <Button asChild variant="outline">
            <Link href={getInternalDashboardPath()}>
              <ArrowLeft data-icon="inline-start" />
              Kembali ke dashboard
            </Link>
          </Button>
        </div>

        <InternalCreateProjectHeroSection setupItems={setupItems} />

        <InternalCreateProjectFormSection />
      </div>
    </main>
  );
}
