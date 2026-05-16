"use client";

import { useRouter } from "next/navigation";

import { PageHeader } from "./page-header";
import { SdgsContentForm } from "./sdgs-content-form";

export function ContentCreateView() {
  const router = useRouter();

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Inisiatif SDGs", href: "/sdgs-dashboard/content" },
          { label: "Inisiatif Baru" },
        ]}
        title="Tambah Inisiatif SDGs"
        description="Lengkapi form berikut untuk mendokumentasikan inisiatif keberlanjutan baru."
      />
      <div className="max-w-4xl">
        <SdgsContentForm
          onSuccess={() => router.push("/sdgs-dashboard/content")}
          onCancel={() => router.push("/sdgs-dashboard/content")}
        />
      </div>
    </>
  );
}
