"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { STATS, SDG_TILES, fadeUp, statCard } from "./hub-data";

export function HubHeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-gray-50/80 to-white">
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(182,37,42,0.7) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Soft colour blobs */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(182,37,42,0.07)_0%,transparent_65%)] blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-32 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(38,189,226,0.06)_0%,transparent_65%)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-28 left-1/2 h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,rgba(76,159,56,0.05)_0%,transparent_65%)] blur-3xl" />

      {/* SDG tile column strip – desktop right side */}
      <div
        className="pointer-events-none absolute right-0 top-0 hidden lg:block h-full w-[216px] overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to left, rgba(255,255,255,0.85) 40%, transparent 100%)",
        }}
      >
        <div className="flex flex-wrap gap-2 p-3 pt-32 opacity-[0.22]">
          {[...SDG_TILES, ...SDG_TILES].map((color, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.08 + i * 0.025,
                duration: 0.45,
                ease: "easeOut",
              }}
              className="h-10 w-10 rounded-xl"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1100px] mx-auto px-6 pt-[130px] pb-32 flex flex-col items-center gap-8">
        {/* Badge */}
        {/* <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 rounded-full border border-[#b6252a]/20 bg-[#b6252a]/5 px-4 py-1.5 text-sm font-medium text-[#b6252a]"
        >
          <span className="h-2 w-2 rounded-full bg-[#ed1e28] animate-pulse" />
          SDGs Hub — Telkom University
        </motion.div> */}

        {/* Heading */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center font-[family-name:var(--font-geist-sans)] font-medium tracking-[-0.04em] text-5xl md:text-[76px] md:leading-[1.05] text-gray-900"
        >
          Kolaborasi nyata untuk{" "}
          <span className="font-[family-name:var(--font-instrument-serif)] italic text-6xl md:text-[96px] md:leading-[1] text-[#b6252a]">
            masa depan
          </span>
          <br />
          yang berkelanjutan
        </motion.h1>

        {/* Description */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center text-lg text-gray-500 max-w-[560px] leading-relaxed"
        >
          SDGs Hub mempertemukan mahasiswa, dosen, dan mitra eksternal untuk
          berkolaborasi dalam riset, inovasi, dan aspirasi demi agenda
          pembangunan berkelanjutan Telkom University.
        </motion.p>

        {/* CTA */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-4 pt-2 sm:flex-row"
        >
          <Link
            href="/sdgs-hub/riset"
            className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-full border border-[#8f1a20]/30 bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_42%,#ed1e28_100%)] px-8 py-4 text-base font-semibold text-white shadow-[0_20px_45px_-18px_rgba(182,37,42,0.6),inset_0_1px_0_rgba(255,255,255,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_28px_55px_-18px_rgba(182,37,42,0.75)]"
          >
            Mulai Berkolaborasi
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/sdgs-hub/ide"
            className="inline-flex min-w-[220px] items-center justify-center rounded-full border border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b6252a]/25 hover:text-[#b6252a] hover:shadow-md"
          >
            Kirim Ide Kamu
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div className="w-full pt-12" initial="hidden" animate="visible">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {STATS.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  custom={index}
                  variants={statCard}
                  className="group relative rounded-2xl border border-gray-100 bg-white p-5 md:p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-200 overflow-hidden"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl"
                    style={{ backgroundColor: stat.color }}
                  />
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${stat.color}15` }}
                    >
                      <Icon className="h-4 w-4" style={{ color: stat.color }} />
                    </div>
                    <div
                      className="h-1.5 w-1.5 rounded-full opacity-50"
                      style={{ backgroundColor: stat.color }}
                    />
                  </div>
                  <div className="text-3xl md:text-4xl lg:text-[44px] font-semibold tracking-[-0.03em] text-gray-900 leading-none font-[family-name:var(--font-geist-sans)]">
                    {stat.number}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-gray-800">
                    {stat.label}
                  </div>
                  <div className="mt-0.5 text-xs text-gray-400">
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
