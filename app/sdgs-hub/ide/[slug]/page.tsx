"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Mail,
  ThumbsUp,
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

function formatDate(date: string) {
  const parsedDate = Date.parse(date);
  if (Number.isNaN(parsedDate)) {
    return date;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

function getAccentColor(sdgCategory: string) {
  return SDG_COLORS[sdgCategory] || "#b6252a";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getIdeaStatus(votes: number) {
  if (votes >= 45) {
    return "Dukungan tinggi";
  }
  if (votes >= 35) {
    return "Banyak diminati";
  }
  return "Sedang berkembang";
}

export default function IdeaDetailPage() {
  const params = useParams<{ slug: string }>();
  const { ideas, voteIdea } = useSdgsHub();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const idea = useMemo(
    () => ideas.find((item) => item.slug === params.slug),
    [ideas, params.slug],
  );

  if (!idea) {
    return (
      <main className="min-h-screen bg-white px-6 py-32">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-gray-100 bg-white p-10 text-center shadow-[0_24px_60px_-40px_rgba(15,23,42,0.35)]">
          <h1 className="text-3xl font-bold text-gray-900">
            Ide tidak ditemukan
          </h1>
          <p className="mt-4 text-base leading-8 text-gray-600">
            Data ide yang Anda cari belum tersedia.
          </p>
          <Link
            href="/sdgs-hub/ide"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_42%,#ed1e28_100%)] px-6 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke ide mahasiswa
          </Link>
        </div>
      </main>
    );
  }

  const accentColor = getAccentColor(idea.sdgCategory);

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fffaf8_0%,#ffffff_60%,#ffffff_100%)] pt-28 pb-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(182,37,42,0.10)_0%,transparent_72%)] blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(253,157,36,0.10)_0%,transparent_72%)] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          <Link
            href="/sdgs-hub/ide"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#b6252a] transition-all duration-200 hover:gap-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke ide mahasiswa
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  {idea.sdgCategory}
                </span>
                <span className="rounded-full bg-[#fff6e8] px-3 py-1 text-xs font-semibold text-[#9a5b00]">
                  {getIdeaStatus(idea.votes)}
                </span>
              </div>
              <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-5xl md:leading-[1.08]">
                {idea.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
                {idea.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm text-gray-500">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 ring-1 ring-gray-200">
                  <CalendarDays className="h-4 w-4 text-[#b6252a]" />
                  {formatDate(idea.createdAt)}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 ring-1 ring-gray-200">
                  <ThumbsUp className="h-4 w-4 text-[#b6252a]" />
                  {idea.votes} dukungan
                </span>
              </div>
            </div>

            <div className="rounded-[32px] border border-[#b6252a]/10 bg-white/90 p-7 shadow-[0_28px_70px_-42px_rgba(15,23,42,0.35)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                Tentang Pengusul
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff3f3] text-lg font-semibold text-[#b6252a]">
                  {getInitials(idea.author)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {idea.author}
                  </h2>
                  <p className="text-sm text-gray-500">Mahasiswa pengusul</p>
                </div>
              </div>
              <div className="mt-7 rounded-2xl bg-[#fff7f7] px-5 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                  Makna dukungan
                </p>
                <p className="mt-2 text-sm leading-7 text-gray-700">
                  {idea.supportNote}
                </p>
              </div>
              <div className="mt-5 rounded-2xl border border-[#b6252a]/10 bg-white px-5 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                  Kontak email
                </p>
                <a
                  href={`mailto:${idea.email}`}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#b6252a] transition-colors hover:text-[#8f1a20]"
                >
                  <Mail className="h-4 w-4" />
                  {idea.email}
                </a>
              </div>
              <button
                type="button"
                onClick={() => voteIdea(idea.id)}
                disabled={idea.hasVoted}
                className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300 ${idea.hasVoted ? "bg-[#b6252a] text-white" : "bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_42%,#ed1e28_100%)] text-white shadow-[0_20px_40px_-20px_rgba(182,37,42,0.9)] hover:-translate-y-0.5 hover:brightness-105"}`}
              >
                <ThumbsUp className="h-4 w-4" />
                {idea.hasVoted ? "Ide sudah didukung" : "Dukung ide ini"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <ScrollSection>
        <section className="mx-auto max-w-6xl px-6 py-8 lg:py-12">
          <div className="relative overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-[0_30px_70px_-45px_rgba(15,23,42,0.4)]">
            <Image
              src={idea.gallery[activeImageIndex]}
              alt={idea.title}
              width={1600}
              height={1000}
              className="h-[420px] w-full object-cover md:h-[540px]"
            />
            {idea.gallery.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIndex((current) =>
                      current === 0 ? idea.gallery.length - 1 : current - 1,
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
                      current === idea.gallery.length - 1 ? 0 : current + 1,
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

          {idea.gallery.length > 1 ? (
            <div className="mt-5 grid grid-cols-3 gap-4 md:grid-cols-4">
              {idea.gallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`overflow-hidden rounded-[22px] border transition-all duration-300 ${index === activeImageIndex ? "border-[#b6252a] shadow-[0_18px_40px_-24px_rgba(182,37,42,0.55)]" : "border-gray-100 hover:border-gray-200"}`}
                >
                  <Image
                    src={image}
                    alt={`${idea.title} ${index + 1}`}
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
                Gambaran Ide
              </p>
              <p className="mt-5 text-base leading-8 text-gray-600">
                {idea.overview}
              </p>
              <div className="mt-6 rounded-2xl bg-[#fffaf9] p-5">
                <p className="text-sm font-semibold text-gray-900">
                  Potensi dampak
                </p>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {idea.potentialImpact}
                </p>
              </div>
            </div>

            <div className="rounded-[30px] border border-gray-100 bg-white p-7 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.32)]">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b6252a]">
                Arah Tindak Lanjut
              </p>
              <div className="mt-6 space-y-4">
                {idea.nextSteps.map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-2xl bg-[#fafafa] p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#b6252a]" />
                    <p className="text-sm leading-7 text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollSection>

      <ScrollSection>
        <DocumentPreviewSection
          title="Dokumen Pendukung Ide"
          description="Preview dokumen pendukung konsep ide, impact analysis, atau proposal implementasi."
          documents={idea.documents}
        />
      </ScrollSection>

      <ScrollSection>
        <section className="mx-auto max-w-6xl px-6 pb-16 lg:pb-20">
          <div className="rounded-[30px] border border-gray-100 bg-white p-7 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.32)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b6252a]">
              Langkah Berikutnya
            </p>
            <p className="mt-4 max-w-3xl text-base leading-8 text-gray-600">
              Jika dukungan terus bertambah, ide ini dapat masuk ke tahap
              diskusi lanjutan untuk melihat kemungkinan pengembangan menjadi
              program nyata.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/sdgs-hub/ide"
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50"
              >
                Lihat Ide Lain
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sdgs-hub/ide/buat"
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_42%,#ed1e28_100%)] px-6 py-3 text-sm font-semibold text-white"
              >
                <Lightbulb className="h-4 w-4" />
                Kirim Ide Baru
              </Link>
            </div>
          </div>
        </section>
      </ScrollSection>
    </main>
  );
}
