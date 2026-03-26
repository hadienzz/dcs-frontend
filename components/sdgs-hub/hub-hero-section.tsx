"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileBarChart2 } from "lucide-react";
import Link from "next/link";

import { SDG_TILES, STATS, fadeUp, statCard } from "./hub-data";

export function HubHeroSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fff7f7_0%,#fffdfd_24%,#ffffff_100%)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(182,37,42,0.72) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      <div className="pointer-events-none absolute -left-20 top-16 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(182,37,42,0.12)_0%,transparent_68%)] blur-3xl" />
      <div className="pointer-events-none absolute right-[-8rem] top-24 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(253,157,36,0.10)_0%,transparent_68%)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-16 left-1/2 h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(38,189,226,0.08)_0%,transparent_72%)] blur-3xl" />

      <div
        className="pointer-events-none absolute right-0 top-0 hidden h-full w-[220px] overflow-hidden xl:block"
        style={{
          maskImage:
            "linear-gradient(to left, rgba(255,255,255,0.9) 28%, transparent 100%)",
        }}
      >
        <div className="flex flex-wrap gap-2 px-4 pb-10 pt-28 opacity-[0.2]">
          {[...SDG_TILES, ...SDG_TILES].map((color, index) => (
            <motion.div
              key={`${color}-${index}`}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.08 + index * 0.02,
                duration: 0.45,
                ease: "easeOut",
              }}
              className="h-10 w-10 rounded-xl"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-[1160px] flex-col gap-12 px-6 pb-28 pt-[132px] lg:gap-16 lg:pb-32">
        <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div className="max-w-4xl">
            <motion.h1
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="font-[family-name:var(--font-geist-sans)] text-[clamp(2.4rem,6.5vw,4.8rem)] font-medium leading-[0.98] tracking-[-0.045em] text-gray-900"
            >
              Program CSR yang
              <span className="mt-2 block font-[family-name:var(--font-instrument-serif)] text-[clamp(2.5rem,6.9vw,5.2rem)] italic text-[#b6252a]">
                terarah, terukur,
              </span>
              <span className="block">dan mudah dipahami.</span>
            </motion.h1>

            <motion.p
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-5 max-w-2xl text-sm leading-7 text-[#6f5b5f] md:text-base"
            >
              SDGs Hub kini difokuskan sebagai wajah program CSR Telkom
              University: tempat untuk menjelaskan fokus program, menjabarkan
              alur implementasi, dan menunjukkan dampak yang ingin dibangun
              bersama mitra serta komunitas.
            </motion.p>

            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              <Link
                href="#program-csr"
                className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-full border border-[#8f1a20]/30 bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_42%,#ed1e28_100%)] px-8 py-4 text-base font-semibold text-white shadow-[0_20px_45px_-18px_rgba(182,37,42,0.62),inset_0_1px_0_rgba(255,255,255,0.26)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105"
              >
                Jelajahi Pilar CSR
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#alur-csr"
                className="inline-flex min-w-[220px] items-center justify-center rounded-full border border-[#d9c8cb] bg-white/88 px-8 py-4 text-base font-semibold text-[#7d2328] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b6252a]/25 hover:bg-white"
              >
                Lihat Alur Program
              </Link>
            </motion.div>
          </div>

          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="relative overflow-hidden rounded-[2rem] border border-[#f1d8da] bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(255,244,245,0.9)_100%)] p-6 shadow-[0_30px_70px_-42px_rgba(17,24,39,0.38)]"
          >
            <div className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,#b6252a_0%,#ed1e28_42%,#fd9d24_100%)]" />
            <div className="inline-flex items-center gap-2 rounded-full bg-[#fff1f1] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#9f1f25]">
              <FileBarChart2 className="h-3.5 w-3.5" />
              Kerangka Hub
            </div>
            <div className="mt-5 grid gap-4">
              {[
                {
                  title: "Peta Prioritas",
                  body: "Menjelaskan isu, target SDGs, dan kelompok penerima manfaat untuk setiap program.",
                },
                {
                  title: "Portofolio Pelaksanaan",
                  body: "Menampilkan pilar program CSR, bentuk kegiatan, dan model kolaborasi yang dipakai.",
                },
                {
                  title: "Jejak Dampak",
                  body: "Menyusun capaian, pembelajaran, dan potensi pengembangan program ke tahap berikutnya.",
                },
              ].map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] border border-[#f3dfe1] bg-white/92 p-4"
                >
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#b6252a]/70">
                    0{index + 1}
                  </div>
                  <h2 className="mt-2 text-lg font-semibold text-gray-900">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-[#6e5a5e]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div className="w-full" initial="hidden" animate="visible">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
            {STATS.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <motion.div
                  key={stat.label}
                  custom={index}
                  variants={statCard}
                  className="group relative overflow-hidden rounded-[1.6rem] border border-[#f1ebeb] bg-white/92 p-5 shadow-[0_24px_55px_-42px_rgba(15,23,42,0.32)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-42px_rgba(182,37,42,0.28)] md:p-6"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-[3px]"
                    style={{ backgroundColor: stat.color }}
                  />
                  <div className="flex items-center justify-between">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: `${stat.color}14` }}
                    >
                      <Icon className="h-4 w-4" style={{ color: stat.color }} />
                    </div>
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: stat.color }}
                    />
                  </div>
                  <div className="mt-6 text-[2rem] font-semibold leading-none tracking-[-0.04em] text-gray-900 md:text-[2.55rem]">
                    {stat.number}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-gray-900">
                    {stat.label}
                  </div>
                  <div className="mt-1 text-xs leading-5 text-[#8a777b]">
                    {stat.desc}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
