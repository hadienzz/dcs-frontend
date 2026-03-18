"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock3, Sparkles, Users } from "lucide-react";
import { ScrollSection } from "@/components/ui/scroll-section";
import { useSdgsHub, type Project } from "@/hooks/useSdgsHubData";

const STATUS_COPY: Record<
  Project["status"],
  { label: string; className: string }
> = {
  open: {
    label: "Masih Dibuka",
    className: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  },
  "in-progress": {
    label: "Sedang Berjalan",
    className: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  },
  closed: {
    label: "Ditutup",
    className: "bg-gray-100 text-gray-500 ring-1 ring-gray-200",
  },
};

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

const STATUS_PRIORITY: Record<Project["status"], number> = {
  open: 0,
  "in-progress": 1,
  closed: 2,
};

function getRemainingSlots(project: Project) {
  return Math.max(project.teamSlots - project.filledSlots, 0);
}

function getPreviewProjects(projects: Project[]) {
  return [...projects]
    .filter(
      (project) =>
        project.status !== "closed" && getRemainingSlots(project) > 0,
    )
    .sort((left, right) => {
      const byStatus =
        STATUS_PRIORITY[left.status] - STATUS_PRIORITY[right.status];
      if (byStatus !== 0) {
        return byStatus;
      }

      const byDate = Date.parse(right.createdAt) - Date.parse(left.createdAt);
      if (byDate !== 0) {
        return byDate;
      }

      return getRemainingSlots(right) - getRemainingSlots(left);
    })
    .slice(0, 3);
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

function getAccentColor(sdgCategory: string) {
  return SDG_COLORS[sdgCategory] || "#b6252a";
}

export function RisetPreviewSection() {
  const { projects } = useSdgsHub();
  const previewProjects = getPreviewProjects(projects);
  const featuredProject = previewProjects[0];
  const secondaryProjects = previewProjects.slice(1);

  if (previewProjects.length === 0) {
    return null;
  }

  return (
    <ScrollSection>
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fff8f7_0%,#ffffff_38%,#fffdf7_100%)] py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-14 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(182,37,42,0.10)_0%,transparent_72%)] blur-3xl" />
          <div className="absolute -right-16 bottom-8 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(38,189,226,0.12)_0%,transparent_72%)] blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(182,37,42,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(182,37,42,0.55) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mb-14 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#b6252a]"
              >
                Contoh Riset
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-[2.9rem]"
              >
                Lihat contoh riset yang
                <span className="font-[family-name:var(--font-instrument-serif)] italic text-[#b6252a]">
                  {" "}
                  sedang dibuka.
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.14 }}
                className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600"
              >
                Beberapa project aktif yang bisa kamu lihat, pelajari, dan
                ikuti.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="rounded-[28px] border border-[#b6252a]/10 bg-white/85 p-6 shadow-[0_20px_55px_-30px_rgba(17,24,39,0.3)] backdrop-blur-sm"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#b6252a]/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#b6252a]">
                <Sparkles className="h-3.5 w-3.5" />
                Pilihan Minggu Ini
              </div>
              <p className="text-sm leading-relaxed text-gray-600">
                Tiga riset aktif yang bisa jadi titik awal buat cari peluang
                kolaborasi.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-gray-100 bg-[#fff7f7] px-4 py-3">
                  <p className="text-2xl font-bold text-gray-900">3</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                    Preview terkurasi
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-[#f6fbff] px-4 py-3">
                  <p className="text-2xl font-bold text-gray-900">17</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                    Arah dampak SDGs
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            {featuredProject ? (
              <motion.article
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
                className="group relative overflow-hidden rounded-[30px] border border-gray-100 bg-white p-7 shadow-[0_32px_80px_-38px_rgba(17,24,39,0.38)]"
              >
                <div
                  className="absolute inset-x-0 top-0 h-1.5"
                  style={{
                    backgroundColor: getAccentColor(
                      featuredProject.sdgCategory,
                    ),
                  }}
                />
                <div
                  className="absolute -right-20 top-12 h-48 w-48 rounded-full opacity-70 blur-3xl"
                  style={{
                    backgroundColor: `${getAccentColor(featuredProject.sdgCategory)}1c`,
                  }}
                />

                <div className="relative flex h-full flex-col">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                      style={{
                        backgroundColor: getAccentColor(
                          featuredProject.sdgCategory,
                        ),
                      }}
                    >
                      {featuredProject.sdgCategory}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COPY[featuredProject.status].className}`}
                    >
                      {STATUS_COPY[featuredProject.status].label}
                    </span>
                    <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
                      Slot tersisa {getRemainingSlots(featuredProject)}
                    </span>
                  </div>

                  <div className="mt-6 max-w-2xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-400">
                      Riset Pilihan
                    </p>
                    <h3 className="mt-3 text-2xl font-bold leading-tight text-gray-900 transition-colors duration-300 group-hover:text-[#b6252a] md:text-[2rem]">
                      {featuredProject.title}
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-gray-600">
                      {featuredProject.description}
                    </p>
                  </div>

                  <div className="mt-8 grid gap-4 rounded-[26px] border border-gray-100 bg-[#fffdfb] p-5 sm:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                        Dipandu oleh
                      </p>
                      <p className="mt-2 font-semibold text-gray-900">
                        {featuredProject.dosenName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                        Timeline publish
                      </p>
                      <p className="mt-2 flex items-center gap-2 font-semibold text-gray-900">
                        <Clock3 className="h-4 w-4 text-[#b6252a]" />
                        {formatDate(featuredProject.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                        Kebutuhan tim
                      </p>
                      <p className="mt-2 flex items-center gap-2 font-semibold text-gray-900">
                        <Users className="h-4 w-4 text-[#b6252a]" />
                        {getRemainingSlots(featuredProject)} dari{" "}
                        {featuredProject.teamSlots} slot tersedia
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {featuredProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#b6252a]/10 bg-[#b6252a]/5 px-3 py-1 text-xs font-medium text-[#8f1a20]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-end sm:justify-between">
                    <p className="max-w-md text-sm leading-relaxed text-gray-500">
                      Lihat semua riset untuk menemukan project yang paling
                      cocok buat kamu.
                    </p>
                    <Link
                      href="/sdgs-hub/riset"
                      className="inline-flex w-full shrink-0 items-center justify-center gap-2 self-start whitespace-nowrap rounded-full bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_45%,#ed1e28_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_-20px_rgba(182,37,42,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 sm:w-auto"
                    >
                      Buka Riset
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ) : null}

            <div className="grid gap-6">
              {secondaryProjects.map((project, index) => (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-[28px] border border-gray-100 bg-white p-6 shadow-[0_24px_55px_-34px_rgba(17,24,39,0.35)]"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-1"
                    style={{
                      backgroundColor: getAccentColor(project.sdgCategory),
                    }}
                  />

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="rounded-full px-3 py-1 text-[11px] font-semibold text-white"
                      style={{
                        backgroundColor: getAccentColor(project.sdgCategory),
                      }}
                    >
                      {project.sdgCategory}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold ${STATUS_COPY[project.status].className}`}
                    >
                      {STATUS_COPY[project.status].label}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-bold leading-snug text-gray-900 transition-colors duration-300 group-hover:text-[#b6252a]">
                    {project.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">
                    {project.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {project.dosenName}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {getRemainingSlots(project)} slot tersisa •{" "}
                        {formatDate(project.createdAt)}
                      </p>
                    </div>
                    <Link
                      href="/sdgs-hub/riset"
                      className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-[#b6252a] transition-all duration-200 hover:gap-2"
                    >
                      Lihat
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mt-10 flex flex-col items-start justify-between gap-4 rounded-[28px] border border-[#b6252a]/10 bg-white/80 px-6 py-5 shadow-[0_18px_45px_-32px_rgba(182,37,42,0.45)] backdrop-blur-sm md:flex-row md:items-center"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                Lihat lebih banyak
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
                Buka halaman riset untuk melihat semua project yang sedang
                aktif.
              </p>
            </div>
            <Link
              href="/sdgs-hub/riset"
              className="inline-flex w-full items-center justify-center gap-2 self-start whitespace-nowrap rounded-full border border-[#8f1a20]/20 bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_42%,#ed1e28_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_42px_-18px_rgba(182,37,42,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 md:w-auto"
            >
              Buka Semua Riset
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </ScrollSection>
  );
}
