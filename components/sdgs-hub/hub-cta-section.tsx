"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SDG_TILES } from "./hub-data";

export function HubCtaSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Dark gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#1f1114] to-[#0f0f0f]" />

      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(182,37,42,0.6) 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Red radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(182,37,42,0.12),_transparent_60%)]" />

      {/* SDG colour bar */}
      <div className="absolute inset-x-0 top-0 flex h-1.5 overflow-hidden">
        {SDG_TILES.map((color, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: color }} />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* SDG tiles mini row */}
          <div className="flex justify-center gap-1.5 mb-8 flex-wrap max-w-xs mx-auto">
            {SDG_TILES.slice(0, 9).map((color, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="h-5 w-5 rounded-md"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <h2 className="text-3xl font-bold text-white md:text-5xl lg:text-[3rem] leading-tight tracking-tight mb-6">
            Jadilah bagian dari{" "}
            <span className="font-[family-name:var(--font-instrument-serif)] italic text-[#e04950]">
              gerakan SDGs
            </span>
            <br />
            mulai kolaborasi hari ini.
          </h2>

          <p className="text-lg text-white/55 max-w-xl mx-auto mb-10 leading-relaxed">
            Ribuan mahasiswa, dosen, dan mitra sudah bergabung. Temukan project,
            kirim ide, dan ciptakan dampak nyata bersama komunitas SDGs Hub
            Telkom University.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/sdgs-hub/riset"
              className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-full border border-[#8f1a20]/30 bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_42%,#ed1e28_100%)] px-8 py-4 text-base font-semibold text-white shadow-[0_20px_45px_-18px_rgba(182,37,42,0.9),inset_0_1px_0_rgba(255,255,255,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105"
            >
              Mulai Sekarang
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sdgs-hub/ide"
              className="inline-flex min-w-[220px] items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-8 py-4 text-base font-semibold text-white/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:text-white hover:bg-white/10"
            >
              Kirim Ide Kamu
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
