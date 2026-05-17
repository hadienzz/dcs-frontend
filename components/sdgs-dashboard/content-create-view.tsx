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
          { label: "Dokumen Pemeringkatan", href: "/sdgs-dashboard/content" },
          { label: "Dokumen Baru" },
        ]}
        title="Tambah Dokumen Pemeringkatan"
        description="Lengkapi form berikut untuk mendokumentasikan dokumen pemeringkatan baru."
      />
      <SdgsContentForm
        onSuccess={() => router.push("/sdgs-dashboard/content")}
        onCancel={() => router.push("/sdgs-dashboard/content")}
      />
    </>
  );
}
