"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { DocumentPreviewSection } from "@/components/sdgs-hub/document-preview-section";
import { ScrollSection } from "@/components/ui/scroll-section";
import { useSdgsHub } from "@/hooks/useSdgsHubData";

const SDG_COLORS: Record<string, string> = {
  "SDG 1": "#E5243B",
  "SDG 2": "#DDA63A",
  "SDG 3": "#4C9F38",
  "SDG 4": "#C5192D",
  "SDG 5": "#FF3A21",
  "SDG 6": "#26BDE2",
  "SDG 7": "#FCC30B",
  "SDG 8": "#A21942",
  "SDG 9": "#FD6925",
  "SDG 10": "#DD1367",
  "SDG 11": "#FD9D24",
  "SDG 12": "#BF8B2E",
  "SDG 13": "#3F7E44",
  "SDG 14": "#0A97D9",
  "SDG 15": "#56C02B",
  "SDG 16": "#00689D",
  "SDG 17": "#19486A",
};

function getAccentColor(sdgCategory: string) {
  return SDG_COLORS[sdgCategory] || "#b6252a";
}

export default function InnovationDetailPage() {
  const params = useParams<{ slug: string }>();
  const { innovations } = useSdgsHub();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const innovation = useMemo(
    () => innovations.find((item) => item.slug === params.slug),
    [innovations, params.slug],
  );

  if (!innovation) {
    return (
      <main className="min-h-screen bg-white px-6 py-32">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-gray-100 bg-white p-10 text-center shadow-[0_24px_60px_-40px_rgba(15,23,42,0.35)]">
          <h1 className="text-3xl font-bold text-gray-900">
            Inovasi tidak ditemukan
          </h1>
          <p className="mt-4 text-base leading-8 text-gray-600">
            Data inovasi yang Anda cari belum tersedia.
          </p>
          <Link
            href="/sdgs-hub/inovasi"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_42%,#ed1e28_100%)] px-6 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke inovasi
          </Link>
        </div>
      </main>
    );
  }

  const accentColor = getAccentColor(innovation.sdgCategory);

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fffaf8_0%,#ffffff_60%,#ffffff_100%)] pt-28 pb-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(182,37,42,0.10)_0%,transparent_72%)] blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(38,189,226,0.10)_0%,transparent_72%)] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          <Link
            href="/sdgs-hub/inovasi"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#b6252a] transition-all duration-200 hover:gap-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke inovasi
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ backgroundColor: accentColor }}
              >
                {innovation.sdgCategory}
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-5xl md:leading-[1.08]">
                {innovation.title}
              </h1>
              <p className="mt-4 text-lg font-medium text-gray-500">
                {innovation.creator}
              </p>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
                {innovation.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {innovation.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#b6252a]/10 bg-[#b6252a]/5 px-3 py-1.5 text-xs font-medium text-[#8f1a20]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-[#b6252a]/10 bg-white/90 p-7 shadow-[0_28px_70px_-42px_rgba(15,23,42,0.35)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                Ringkasan Inovasi
              </p>
              <p className="mt-5 text-base leading-8 text-gray-600">
                {innovation.overview}
              </p>
              <div className="mt-7 rounded-2xl bg-[#fff7f7] px-5 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                  Potensi Pengembangan
                </p>
                <p className="mt-2 text-sm font-semibold leading-7 text-gray-900">
                  Inovasi ini dapat dikembangkan lebih lanjut untuk kebutuhan
                  riset, pembelajaran, maupun implementasi terbatas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ScrollSection>
        <section className="mx-auto max-w-6xl px-6 py-8 lg:py-12">
          <div className="relative overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-[0_30px_70px_-45px_rgba(15,23,42,0.4)]">
            <Image
              src={innovation.gallery[activeImageIndex]}
              alt={innovation.title}
              width={1600}
              height={1000}
              className="h-[420px] w-full object-cover md:h-[540px]"
            />
            {innovation.gallery.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIndex((current) =>
                      current === 0
                        ? innovation.gallery.length - 1
                        : current - 1,
                    )
                  }
                  className="absolute left-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-md transition hover:bg-white"
                  aria-label="Gambar sebelumnya"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIndex((current) =>
                      current === innovation.gallery.length - 1
                        ? 0
                        : current + 1,
                    )
                  }
                  className="absolute right-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-md transition hover:bg-white"
                  aria-label="Gambar berikutnya"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            ) : null}
          </div>

          {innovation.gallery.length > 1 ? (
            <div className="mt-5 grid grid-cols-3 gap-4 md:grid-cols-4">
              {innovation.gallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`overflow-hidden rounded-[22px] border transition-all duration-300 ${index === activeImageIndex ? "border-[#b6252a] shadow-[0_18px_40px_-24px_rgba(182,37,42,0.55)]" : "border-gray-100 hover:border-gray-200"}`}
                >
                  <Image
                    src={image}
                    alt={`${innovation.title} ${index + 1}`}
                    width={640}
                    height={320}
                    className="h-28 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </section>
      </ScrollSection>

      <ScrollSection>
        <section className="bg-[linear-gradient(180deg,#ffffff_0%,#fff9f7_100%)] py-10 lg:py-16">
          <div className="mx-auto grid max-w-6xl gap-6 px-6 lg:grid-cols-2">
            <div className="rounded-[30px] border border-gray-100 bg-white p-7 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.32)]">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b6252a]">
                Keunggulan Utama
              </p>
              <div className="mt-6 space-y-4">
                {innovation.highlights.map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-2xl bg-[#fffaf9] p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#b6252a]" />
                    <p className="text-sm leading-7 text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-gray-100 bg-white p-7 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.32)]">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b6252a]">
                Potensi Penerapan
              </p>
              <div className="mt-6 space-y-4">
                {innovation.useCases.map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-2xl bg-[#fafafa] p-4"
                  >
                    <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[#b6252a]" />
                    <p className="text-sm leading-7 text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollSection>

      {innovation.demo ? (
        <ScrollSection>
          <section className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
            <div className="rounded-[32px] border border-[#b6252a]/10 bg-white p-8 shadow-[0_28px_70px_-46px_rgba(15,23,42,0.35)]">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b6252a]">
                Demo Inovasi
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
                {innovation.demo.title}
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-gray-600">
                {innovation.demo.description}
              </p>

              {innovation.demo.type === "link" && innovation.demo.url ? (
                <a
                  href={innovation.demo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_42%,#ed1e28_100%)] px-6 py-3 text-sm font-semibold text-white"
                >
                  <ExternalLink className="h-4 w-4" />
                  {innovation.demo.ctaLabel || "Lihat Demo"}
                </a>
              ) : null}

              {innovation.demo.type === "gallery" &&
              innovation.demo.images?.length ? (
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {innovation.demo.images.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="overflow-hidden rounded-[24px] border border-gray-100 bg-gray-50"
                    >
                      <Image
                        src={image}
                        alt={`${innovation.title} demo ${index + 1}`}
                        width={1200}
                        height={720}
                        className="h-64 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        </ScrollSection>
      ) : null}

      <ScrollSection>
        <DocumentPreviewSection
          title="Dokumen Inovasi"
          description="Preview dokumen teknis, proposal, atau paper pendukung inovasi."
          documents={innovation.documents}
        />
      </ScrollSection>

      <ScrollSection>
        <section className="mx-auto max-w-6xl px-6 pb-16 lg:pb-20">
          <div className="rounded-[30px] border border-gray-100 bg-white p-7 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.32)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b6252a]">
              Kolaborator
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {innovation.collaborators.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#b6252a]/10 bg-[#fff7f7] px-4 py-2.5 text-sm font-medium text-gray-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>
      </ScrollSection>
    </main>
  );
}
