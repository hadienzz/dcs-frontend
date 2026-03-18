"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Lightbulb,
  Sparkles,
  ThumbsUp,
} from "lucide-react";
import { ScrollSection } from "@/components/ui/scroll-section";
import { useSdgsHub, type Idea } from "@/hooks/useSdgsHubData";

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

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatDate(createdAt: string) {
  const parsedDate = Date.parse(createdAt);
  if (Number.isNaN(parsedDate)) {
    return createdAt;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function splitIdeasIntoColumns(ideas: Idea[]) {
  const columns: Idea[][] = [[], []];

  ideas.forEach((idea, index) => {
    columns[index % columns.length].push(idea);
  });

  return columns.filter((column) => column.length > 0);
}

function getIdeaLabel(votes: number) {
  if (votes >= 45) {
    return "Dukungan Tinggi";
  }

  if (votes >= 35) {
    return "Banyak Diminati";
  }

  return "Layak Dipertimbangkan";
}

function IdeaColumn({
  ideas,
  duration,
  className,
}: {
  ideas: Idea[];
  duration: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <motion.div
        animate={{ y: "-50%" }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {Array.from({ length: 2 }).map((_, duplicateIndex) => (
          <div key={duplicateIndex} className="flex flex-col gap-6">
            {ideas.map((idea) => {
              const accentColor = getAccentColor(idea.sdgCategory);

              return (
                <article
                  key={`${duplicateIndex}-${idea.id}`}
                  className="relative overflow-hidden rounded-[30px] border border-gray-100 bg-white p-7 shadow-[0_28px_65px_-42px_rgba(15,23,42,0.34)]"
                >
                  <Link
                    href={`/sdgs-hub/ide/${idea.slug}`}
                    className="absolute inset-0 z-10 rounded-[30px]"
                    aria-label={`Lihat detail ${idea.title}`}
                  />

                  <div
                    className="absolute inset-x-0 top-0 h-1.5"
                    style={{ backgroundColor: accentColor }}
                  />

                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <span
                      className="rounded-full px-3 py-1 text-[11px] font-semibold text-white"
                      style={{ backgroundColor: accentColor }}
                    >
                      {idea.sdgCategory}
                    </span>
                    <span className="rounded-full bg-[#fff6e8] px-3 py-1 text-[11px] font-semibold text-[#9a5b00]">
                      {getIdeaLabel(idea.votes)}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-semibold leading-snug text-gray-900">
                    {idea.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-8 text-gray-600">
                    {idea.description}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f8f8f8] px-3 py-1.5 font-medium text-gray-700">
                      <ThumbsUp className="h-3.5 w-3.5 text-[#b6252a]" />
                      {idea.votes} dukungan
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f8f8f8] px-3 py-1.5 font-medium text-gray-700">
                      <CalendarDays className="h-3.5 w-3.5 text-[#b6252a]" />
                      {formatDate(idea.createdAt)}
                    </span>
                  </div>

                  <div className="mt-7 flex items-center justify-between gap-3 border-t border-gray-100 pt-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff3f3] text-sm font-semibold text-[#b6252a]">
                        {getInitials(idea.author)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {idea.author}
                        </p>
                        <p className="text-xs text-gray-500">
                          Mahasiswa pengusul
                        </p>
                      </div>
                    </div>
                    <span className="pointer-events-none relative z-20 inline-flex items-center gap-1.5 text-xs font-semibold text-[#b6252a]">
                      Lihat detail
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function IdeaPreviewSection() {
  const { ideas } = useSdgsHub();
  const sortedIdeas = [...ideas].sort(
    (left, right) => right.votes - left.votes,
  );
  const featuredIdeas = sortedIdeas.slice(0, 4);
  const columns = splitIdeasIntoColumns(featuredIdeas);

  if (featuredIdeas.length === 0) {
    return null;
  }

  return (
    <ScrollSection>
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fff8f4_48%,#ffffff_100%)] py-24 lg:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(253,157,36,0.12)_0%,transparent_70%)] blur-3xl" />
          <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(182,37,42,0.08)_0%,transparent_70%)] blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(182,37,42,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(182,37,42,0.5) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start xl:gap-14">
            <div className="lg:sticky lg:top-24">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#b6252a]"
              >
                Contoh Ide Mahasiswa
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-[2.85rem]"
              >
                Lihat ide yang
                <span className="font-[family-name:var(--font-instrument-serif)] italic text-[#b6252a]">
                  {" "}
                  pernah diajukan mahasiswa.
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.14 }}
                className="mt-5 max-w-xl text-lg leading-8 text-gray-600"
              >
                Section ini menampilkan contoh ide yang sudah masuk ke SDGs Hub,
                lengkap dengan tema SDGs, jumlah dukungan, dan pengusulnya.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="mt-8 rounded-[28px] border border-[#b6252a]/10 bg-white/90 p-7 shadow-[0_25px_60px_-35px_rgba(15,23,42,0.3)]"
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-[#b6252a]/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#b6252a]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Aspirasi Pilihan
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#fff7f7] px-4 py-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {featuredIdeas.length}
                    </p>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      Ide ditampilkan
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#fff8ec] px-4 py-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {sortedIdeas[0]?.votes ?? 0}
                    </p>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      Dukungan tertinggi
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-7 text-gray-600">
                  Ide yang mendapat banyak dukungan bisa menjadi bahan tinjauan
                  lebih lanjut untuk program kampus berkelanjutan.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/sdgs-hub/ide"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_42%,#ed1e28_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_42px_-20px_rgba(182,37,42,0.92)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105"
                  >
                    Lihat Semua Ide
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/sdgs-hub/ide/buat"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#b6252a]/15 bg-white px-6 py-3 text-sm font-semibold text-[#b6252a] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b6252a]/30 hover:bg-[#fff7f7]"
                  >
                    <Lightbulb className="h-4 w-4" />
                    Kirim Ide
                  </Link>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="flex gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[860px] overflow-hidden"
            >
              {columns[0] ? (
                <IdeaColumn
                  ideas={columns[0]}
                  duration={22}
                  className="min-w-0 flex-1"
                />
              ) : null}
              {columns[1] ? (
                <IdeaColumn
                  ideas={columns[1]}
                  duration={26}
                  className="hidden lg:block min-w-0 flex-1"
                />
              ) : null}
            </motion.div>
          </div>
        </div>
      </section>
    </ScrollSection>
  );
}
