"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PartnerLogoCloud } from "./partner-logo-cloud";

type StatItem = {
  numberText: string;
  label: string;
  description?: string;
};

interface HeroClientProps {
  stats: StatItem[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    },
  }),
};

const statCard = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.8 + i * 0.12,
      duration: 0.6,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    },
  }),
};

export function HeroClient({ stats }: HeroClientProps) {
  return (
    <section className="relative min-h-screen w-full overflow-hidden" id="home">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover [transform:scaleY(-1)]"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4"
            type="video/mp4"
          />
        </video>
        {/* White gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[26.416%] from-[rgba(255,255,255,0)] to-[66.943%] to-white" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 pt-[100px] pb-24 flex flex-col items-center gap-8">
        {/* SDG Logo Row */}
        {/* <motion.div
          className="flex flex-wrap items-center justify-center gap-2 md:gap-3"
          initial="hidden"
          animate="visible"
        >
          {sdgGoals.map((sdg) => (
            <motion.div
              key={sdg.number}
              custom={sdg.number - 1}
              variants={sdgTile}
              className="group relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg cursor-default transition-transform duration-200 hover:scale-110"
              style={{ backgroundColor: sdg.color }}
              title={`SDG ${sdg.number}: ${sdg.name}`}
            >
              <span className="text-white font-[family-name:var(--font-geist-sans)] text-sm md:text-base font-bold leading-none">
                {sdg.number}
              </span>
              <span className="pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100 z-20">
                {sdg.name}
              </span>
            </motion.div>
          ))}
        </motion.div> */}

        {/* Main Heading */}
        <motion.h1
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center font-[family-name:var(--font-geist-sans)] font-medium tracking-[-0.04em] text-5xl md:text-[80px] md:leading-[1.05] text-gray-900"
        >
          Driving{" "}
          <span className="font-[family-name:var(--font-instrument-serif)] italic text-6xl md:text-[100px] md:leading-[1]">
            {[
              { char: "s", color: "#E5243B" },
              { char: "u", color: "#DDA63A" },
              { char: "s", color: "#4C9F38" },
              { char: "t", color: "#C5192D" },
              { char: "a", color: "#FF3A21" },
              { char: "i", color: "#26BDE2" },
              { char: "n", color: "#FCC30B" },
              { char: "a", color: "#A21942" },
              { char: "b", color: "#FD6925" },
              { char: "i", color: "#DD1367" },
              { char: "l", color: "#FD9D24" },
              { char: "i", color: "#3F7E44" },
              { char: "t", color: "#0A97D9" },
              { char: "y", color: "#56C02B" },
            ].map((item, idx) => (
              <span key={idx} style={{ color: item.color }}>
                {item.char}
              </span>
            ))}
          </span>
          <br />
          for our shared future
        </motion.h1>

        {/* Description */}
        <motion.p
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center font-[family-name:var(--font-geist-sans)] text-lg text-[#373a46]/80 max-w-[554px]"
        >
          Empowering innovation and driving meaningful change through education,
          research, and community partnerships at Telkom University&apos;s SDG
          initiative.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-4 pt-2 sm:flex-row"
        >
          <Link
            href="#map"
            className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-full border border-[#8f1a20]/30 bg-[linear-gradient(135deg,#8f1a20_0%,#b6252a_42%,#ed1e28_100%)] px-8 py-4 text-base font-semibold text-white shadow-[0_20px_45px_-18px_rgba(182,37,42,0.9),inset_0_1px_0_rgba(255,255,255,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_28px_55px_-18px_rgba(182,37,42,0.95),inset_0_1px_0_rgba(255,255,255,0.38)]"
          >
            Explore Our Impact
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/program"
            className="inline-flex min-w-[220px] items-center justify-center rounded-full border border-[#b6252a]/15 bg-white/76 px-8 py-4 text-base font-semibold text-[#9f1f25] shadow-[0_18px_40px_-24px_rgba(182,37,42,0.55)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b6252a]/35 hover:bg-[#fff5f5] hover:text-[#8f1a20] hover:shadow-[0_24px_48px_-24px_rgba(182,37,42,0.6)]"
          >
            Lihat Program
          </Link>
        </motion.div>

        {/* Stats Section */}
        <motion.div className="w-full pt-16" initial="hidden" animate="visible">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={statCard}
                className="group relative rounded-2xl border border-white/60 bg-white/50 backdrop-blur-xl p-6 md:p-8 text-center transition-all duration-300 hover:bg-white/80 hover:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.08)] hover:border-white/80"
              >
                {/* Subtle top accent line */}
                <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-gray-300/60 to-transparent" />

                <div className="font-[family-name:var(--font-geist-sans)] text-4xl md:text-5xl lg:text-[56px] font-semibold tracking-[-0.03em] text-gray-900 leading-none">
                  {stat.numberText}
                </div>

                <div className="mt-3 font-[family-name:var(--font-geist-sans)] text-sm md:text-base font-medium text-gray-800 tracking-[-0.01em]">
                  {stat.label}
                </div>

                {stat.description && (
                  <div className="mt-1 font-[family-name:var(--font-geist-sans)] text-xs md:text-sm text-[#373a46]/50 font-normal">
                    {stat.description}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <PartnerLogoCloud />
      </div>
    </section>
  );
}
