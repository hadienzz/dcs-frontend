"use client";

import { SdgsHubHero } from "@/components/sdgs-hub/sdgs-hub-hero";
import { InnovationCard } from "@/components/sdgs-hub/innovation-card";
import { ScrollSection } from "@/components/ui/scroll-section";
import { useSdgsHub } from "@/hooks/useSdgsHubData";
import Link from "next/link";
import { Rocket } from "lucide-react";

export default function InovasiPage() {
  const { innovations } = useSdgsHub();

  return (
    <main className="min-h-screen bg-white">
      <SdgsHubHero
        title="Katalog Produk"
        accentWord="Inovasi Kampus"
        subtitle="Jelajahi produk inovasi yang dibuat oleh dosen dan mahasiswa Telkom University. Pelajari detail produk, potensi penerapan, dan demo jika tersedia."
      />

      <ScrollSection>
        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-8 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Menampilkan{" "}
              <span className="font-semibold text-gray-700">
                {innovations.length}
              </span>{" "}
              produk inovasi
            </p>
            <Link
              href="/sdgs-hub/inovasi/buat"
              className="inline-flex items-center gap-2 rounded-xl bg-[#b6252a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#9a1e22] hover:shadow-md"
            >
              <Rocket className="h-4 w-4" />
              Kirim Inovasimu
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {innovations.map((innovation, i) => (
              <InnovationCard
                key={innovation.id}
                innovation={innovation}
                index={i}
              />
            ))}
          </div>
        </section>
      </ScrollSection>
    </main>
  );
}
