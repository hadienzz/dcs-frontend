"use client";

import { SdgsHubHero } from "@/components/sdgs-hub/sdgs-hub-hero";
import { SubmitIdeaForm } from "@/components/sdgs-hub/submit-idea-form";
import { ScrollSection } from "@/components/ui/scroll-section";
import { useIdeaForm } from "@/hooks/useIdeaForm";
import { useLecturerPortal } from "@/hooks/useLecturerPortal";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BuatIdePage() {
  const { currentStudent } = useLecturerPortal();
  const { formik, sdgOptions, isSubmitted } = useIdeaForm({
    author: currentStudent?.name,
    email: currentStudent?.email,
  });

  return (
    <main className="min-h-screen bg-white">
      <SdgsHubHero
        title="Kirim Ide"
        accentWord="Aspirasi Kamu"
        subtitle="Sampaikan ide sederhana untuk membuat kampus lebih berkelanjutan. Idea dengan dukungan tertinggi akan ditinjau oleh tim SDGs Center."
      />

      <ScrollSection>
        <section className="mx-auto max-w-2xl px-6 py-12">
          {/* Back link */}
          <Link
            href="/sdgs-hub/ide"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-[#b6252a]"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Ide
          </Link>

          {/* Form Card */}
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Detail Ide 💡
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              Isi form berikut untuk menyampaikan idemu. Ide yang mendapat
              dukungan terbanyak akan ditinjau oleh tim SDGs Center.
            </p>

            <SubmitIdeaForm
              formik={formik}
              sdgOptions={sdgOptions}
              isSubmitted={isSubmitted}
            />
          </div>
        </section>
      </ScrollSection>
    </main>
  );
}
