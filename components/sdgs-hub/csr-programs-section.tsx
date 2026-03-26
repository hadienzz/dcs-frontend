"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpenText,
  HeartPulse,
  Leaf,
  Store,
} from "lucide-react";

import { ScrollSection } from "@/components/ui/scroll-section";

const PROGRAMS = [
  {
    title: "Education Accelerator",
    kicker: "Pilar Pendidikan",
    accent: "#C5192D",
    icon: BookOpenText,
    summary:
      "Mendorong kualitas belajar melalui literasi digital, kelas intensif, beasiswa mikro, dan pendampingan bagi sekolah maupun komunitas binaan.",
    bullets: [
      "Workshop guru dan fasilitator",
      "Modul literasi digital dan AI dasar",
      "Pendampingan siswa menuju karier masa depan",
    ],
    sdgs: ["SDG 4", "SDG 8", "SDG 10"],
  },
  {
    title: "Community Enterprise Lab",
    kicker: "Pilar Ekonomi",
    accent: "#FD6925",
    icon: Store,
    summary:
      "Membantu komunitas dan UMKM tumbuh lebih kuat lewat pelatihan usaha, penguatan brand, pencatatan keuangan, dan akses pasar.",
    bullets: [
      "Inkubasi UMKM binaan",
      "Pendampingan branding dan katalog digital",
      "Skema mentoring bisnis bersama mitra",
    ],
    sdgs: ["SDG 1", "SDG 8", "SDG 17"],
  },
  {
    title: "Green Living District",
    kicker: "Pilar Lingkungan",
    accent: "#3F7E44",
    icon: Leaf,
    summary:
      "Program yang berfokus pada pengelolaan sampah, konservasi, energi bersih, dan praktik hidup rendah emisi di area sasaran.",
    bullets: [
      "Bank sampah dan edukasi sirkular",
      "Ruang hijau dan rehabilitasi area prioritas",
      "Kampanye gaya hidup berkelanjutan",
    ],
    sdgs: ["SDG 6", "SDG 11", "SDG 13"],
  },
  {
    title: "Health & Inclusion Outreach",
    kicker: "Pilar Kesehatan",
    accent: "#DD1367",
    icon: HeartPulse,
    summary:
      "Menguatkan ketahanan komunitas melalui edukasi kesehatan, layanan promotif, dan intervensi yang lebih inklusif bagi kelompok rentan.",
    bullets: [
      "Klinik edukasi dan cek kesehatan dasar",
      "Kampanye gizi, sanitasi, dan wellbeing",
      "Penguatan akses layanan untuk kelompok rentan",
    ],
    sdgs: ["SDG 3", "SDG 5", "SDG 10"],
  },
];

export function CsrProgramsSection() {
  const featuredProgram = PROGRAMS[0];
  const supportingPrograms = PROGRAMS.slice(1);
  const FeaturedIcon = featuredProgram.icon;

  return (
    <ScrollSection>
      <section
        id="program-csr"
        className="relative overflow-hidden bg-[linear-gradient(180deg,#fffaf8_0%,#ffffff_38%,#fff8f8_100%)] py-24"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-24 h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(182,37,42,0.10)_0%,transparent_72%)] blur-3xl" />
          <div className="absolute -right-20 bottom-6 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(253,105,37,0.09)_0%,transparent_72%)] blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(182,37,42,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(182,37,42,0.5) 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mb-14 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#b6252a]"
              >
                Portofolio Program
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-[3rem]"
              >
                Pilar CSR yang diterjemahkan menjadi
                <span className="font-[family-name:var(--font-instrument-serif)] italic text-[#b6252a]">
                  {" "}
                  program yang konkret.
                </span>
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.14 }}
              className="max-w-2xl text-base leading-8 text-gray-600 md:text-lg"
            >
              Tiap program di bawah ini dirancang untuk menjawab isu yang
              spesifik, punya bentuk intervensi yang jelas, dan dapat dijelaskan
              kembali kepada mitra dengan bahasa yang lebih terstruktur.
            </motion.p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="group relative overflow-hidden rounded-[2rem] border border-[#f0d8da] bg-white p-7 shadow-[0_32px_80px_-38px_rgba(17,24,39,0.32)] md:p-8"
            >
              <div
                className="absolute inset-x-0 top-0 h-1.5"
                style={{ backgroundColor: featuredProgram.accent }}
              />
              <div
                className="absolute -right-16 top-16 h-56 w-56 rounded-full blur-3xl"
                style={{ backgroundColor: `${featuredProgram.accent}18` }}
              />

              <div className="relative flex h-full flex-col">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                    style={{ backgroundColor: featuredProgram.accent }}
                  >
                    {featuredProgram.kicker}
                  </span>
                  <span className="rounded-full bg-[#fff4f4] px-3 py-1 text-xs font-semibold text-[#9d2026]">
                    Featured Program
                  </span>
                </div>

                <div className="mt-7 max-w-2xl">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${featuredProgram.accent}14` }}
                  >
                    <FeaturedIcon
                      className="h-6 w-6"
                      style={{ color: featuredProgram.accent }}
                    />
                  </div>
                  <h3 className="mt-5 text-2xl font-bold leading-tight text-gray-900 transition-colors duration-300 group-hover:text-[#b6252a] md:text-[2.2rem]">
                    {featuredProgram.title}
                  </h3>
                  <p className="mt-4 text-base leading-8 text-gray-600">
                    {featuredProgram.summary}
                  </p>
                </div>

                <div className="mt-8 grid gap-4 rounded-[1.8rem] border border-[#f3e7e8] bg-[#fffdfd] p-5 md:grid-cols-[1fr_0.9fr]">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                      Bentuk Aktivitas
                    </p>
                    <div className="mt-4 space-y-3">
                      {featuredProgram.bullets.map((bullet) => (
                        <div
                          key={bullet}
                          className="rounded-2xl border border-[#f1dfe1] bg-white px-4 py-3 text-sm font-medium leading-6 text-gray-800"
                        >
                          {bullet}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-[#f3dfe1] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                      Sasaran SDGs
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {featuredProgram.sdgs.map((goal) => (
                        <span
                          key={goal}
                          className="rounded-full border border-[#b6252a]/10 bg-[#fff5f5] px-3 py-1.5 text-xs font-semibold text-[#9d2026]"
                        >
                          {goal}
                        </span>
                      ))}
                    </div>
                    <p className="mt-5 text-sm leading-7 text-gray-600">
                      Cocok untuk program yang ingin menunjukkan dampak langsung
                      pada akses belajar, kesiapan kerja, dan kesetaraan
                      peluang.
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>

            <div className="grid gap-6">
              {supportingPrograms.map((program, index) => {
                const Icon = program.icon;

                return (
                  <motion.article
                    key={program.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative overflow-hidden rounded-[1.85rem] border border-[#f0e6e7] bg-white p-6 shadow-[0_22px_60px_-40px_rgba(17,24,39,0.32)]"
                  >
                    <div
                      className="absolute inset-x-0 top-0 h-1"
                      style={{ backgroundColor: program.accent }}
                    />
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-2xl"
                        style={{ backgroundColor: `${program.accent}14` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: program.accent }} />
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-gray-400 transition group-hover:text-[#b6252a]" />
                    </div>

                    <span
                      className="mt-5 inline-flex rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white"
                      style={{ backgroundColor: program.accent }}
                    >
                      {program.kicker}
                    </span>
                    <h3 className="mt-4 text-xl font-semibold leading-snug text-gray-900">
                      {program.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-gray-600">
                      {program.summary}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {program.sdgs.map((goal) => (
                        <span
                          key={goal}
                          className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-600"
                        >
                          {goal}
                        </span>
                      ))}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </ScrollSection>
  );
}
