"use client";

import { motion } from "framer-motion";

import { LogoCloud } from "@/components/ui/logo-cloud-3";

const logos = [
  {
    src: "/partners/telkom-university.svg",
    alt: "Telkom University",
    width: 260,
    height: 56,
  },
  {
    src: "/partners/sdg-center.svg",
    alt: "SDG Center",
    width: 220,
    height: 56,
  },
  {
    src: "/partners/innovation-hub.svg",
    alt: "Innovation Hub",
    width: 220,
    height: 56,
  },
  {
    src: "/partners/research-network.svg",
    alt: "Research Network",
    width: 240,
    height: 56,
  },
  {
    src: "/partners/community-impact.svg",
    alt: "Community Impact",
    width: 240,
    height: 56,
  },
  {
    src: "/partners/industry-collab.svg",
    alt: "Industry Collaboration",
    width: 250,
    height: 56,
  },
  {
    src: "/partners/government-link.svg",
    alt: "Government Link",
    width: 240,
    height: 56,
  },
  {
    src: "/partners/global-goals.svg",
    alt: "Global Goals",
    width: 220,
    height: 56,
  },
];

export function PartnerLogoCloud() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
      className="w-full pt-10"
    >
      <section className="relative mx-auto max-w-6xl rounded-[30px] border border-black/6 bg-white/65 px-4 py-6 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.18)] backdrop-blur-xl md:px-6">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[30px]">
          <div className="absolute -left-14 top-6 h-28 w-28 rounded-full bg-[radial-gradient(circle,_rgba(15,23,42,0.06)_0%,_transparent_72%)] blur-2xl" />
          <div className="absolute -right-12 bottom-0 h-24 w-24 rounded-full bg-[radial-gradient(circle,_rgba(182,37,42,0.08)_0%,_transparent_70%)] blur-2xl" />
          <div className="absolute inset-0 opacity-[0.035]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(15,23,42,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.45) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
          </div>
        </div>

        <div className="relative mb-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b6252a]">
            Ekosistem Kolaborasi
          </p>
          <h2 className="mt-2 text-lg font-semibold tracking-tight text-gray-900 md:text-2xl">
            Mitra dan jejaring yang menggerakkan dampak berkelanjutan
          </h2>
        </div>

        <div className="relative rounded-[24px] border border-black/6 bg-white/88 px-2 py-2 shadow-[0_14px_30px_-28px_rgba(15,23,42,0.18)] backdrop-blur-sm md:px-4">
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-black/8 to-transparent" />
          <LogoCloud logos={logos} className="py-3" />
        </div>
      </section>
    </motion.div>
  );
}
