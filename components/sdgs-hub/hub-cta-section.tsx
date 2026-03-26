"use client";

import { motion } from "framer-motion";
import { ArrowRight, Handshake } from "lucide-react";
import Link from "next/link";

import { SDG_TILES } from "./hub-data";

export function HubCtaSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#180f11_0%,#251214_42%,#120d0e_100%)]" />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(182,37,42,0.6) 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(182,37,42,0.14),_transparent_60%)]" />

      <div className="absolute inset-x-0 top-0 flex h-1.5 overflow-hidden">
        {SDG_TILES.map((color, index) => (
          <div
            key={`${color}-${index}`}
            className="flex-1"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="mx-auto mb-8 flex max-w-sm flex-wrap justify-center gap-1.5">
            {SDG_TILES.slice(0, 9).map((color, index) => (
              <motion.div
                key={`${color}-${index}`}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="h-5 w-5 rounded-md"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/70">
            <Handshake className="h-3.5 w-3.5" />
            Kolaborasi Program CSR
          </div>

          <h2 className="mb-6 mt-6 text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-[3rem]">
            Bangun program CSR yang
            <span className="font-[family-name:var(--font-instrument-serif)] italic text-[#e5676d]">
              {" "}lebih terarah
            </span>
            <br />
            bersama SDGs Hub.
          </h2>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/60">
            Gunakan halaman ini untuk memperjelas pilar program, memperlihatkan
            struktur kolaborasi, dan menunjukkan dampak yang benar-benar ingin
            dibangun bersama komunitas.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/tentangkami"
              className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-full border border-[#8f1a20]/30 bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_42%,#ed1e28_100%)] px-8 py-4 text-base font-semibold text-white shadow-[0_20px_45px_-18px_rgba(182,37,42,0.9),inset_0_1px_0_rgba(255,255,255,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105"
            >
              Diskusikan Kolaborasi
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#program-csr"
              className="inline-flex min-w-[220px] items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-8 py-4 text-base font-semibold text-white/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 hover:text-white"
            >
              Lihat Pilar Program
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
