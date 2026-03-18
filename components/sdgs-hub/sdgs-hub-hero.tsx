"use client";

import { motion } from "framer-motion";

interface SdgsHubHeroProps {
  title: string;
  accentWord: string;
  subtitle: string;
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

export function SdgsHubHero({ title, accentWord, subtitle }: SdgsHubHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-red-50/30 to-white pt-32 pb-20">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(182,37,42,0.06)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(237,30,40,0.05)_0%,transparent_70%)] blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(182,37,42,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(182,37,42,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Badge */}
        {/* <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#b6252a]/15 bg-white/80 px-4 py-1.5 text-sm font-medium text-[#b6252a] shadow-sm backdrop-blur-sm"
        >
          <span className="h-2 w-2 rounded-full bg-[#ed1e28] animate-pulse" />
          SDGs Hub
        </motion.div> */}

        {/* Title */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="font-[family-name:var(--font-geist-sans)] text-4xl font-bold tracking-tight text-gray-900 md:text-6xl md:leading-[1.1]"
        >
          {title}{" "}
          <span className="font-[family-name:var(--font-instrument-serif)] italic text-[#b6252a]">
            {accentWord}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 leading-relaxed"
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  );
}
