"use client";

import { SdgsHubHero } from "@/components/sdgs-hub/sdgs-hub-hero";
import { SubmitInnovationForm } from "@/components/sdgs-hub/submit-innovation-form";
import { ScrollSection } from "@/components/ui/scroll-section";
import { useInnovationForm } from "@/hooks/useInnovationForm";
import { useLecturerPortal } from "@/hooks/useLecturerPortal";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BuatInovasiPage() {
  const { currentStudent } = useLecturerPortal();
  const {
    initialValues,
    validationSchema,
    handleSubmit,
    sdgOptions,
    isSubmitted,
  } = useInnovationForm({
    creator: currentStudent?.name,
    creatorEmail: currentStudent?.email,
  });

  return (
    <main className="min-h-screen bg-white">
      <SdgsHubHero
        title="Kirim Produk"
        accentWord="Inovasi Kamu"
        subtitle="Sampaikan produk inovasi yang kamu atau tim kamu kembangkan. Setelah disubmit, produk akan ditinjau oleh Super Admin SDGs sebelum dipublikasikan."
      />

      <ScrollSection>
        <section className="mx-auto max-w-2xl px-6 py-12">
          <Link
            href="/sdgs-hub/inovasi"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-[#b6252a]"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Katalog Inovasi
          </Link>

          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="mb-1 text-xl font-bold text-gray-900">
              Detail Inovasi 🚀
            </h2>
            <p className="mb-8 text-sm text-gray-500">
              Isi form berikut untuk mengirimkan produk inovasimu. Produk yang
              telah disetujui akan tampil di katalog inovasi kampus.
            </p>

            <SubmitInnovationForm
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              sdgOptions={sdgOptions}
              isSubmitted={isSubmitted}
            />
          </div>
        </section>
      </ScrollSection>
    </main>
  );
}
