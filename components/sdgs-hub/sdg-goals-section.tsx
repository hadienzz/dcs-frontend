"use client";

import { motion } from "framer-motion";
import { ScrollSection } from "@/components/ui/scroll-section";
import { SDG_GOALS } from "./hub-data";

export function SdgGoalsSection() {
  return (
    <ScrollSection>
      <section className="relative overflow-hidden bg-gray-50/60 py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.028]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(17,24,39,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(17,24,39,0.55) 1px, transparent 1px)",
            backgroundSize: "38px 38px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="text-center mb-14">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-sm font-semibold uppercase tracking-widest text-[#b6252a] mb-2"
            >
              Tujuan Global
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl font-bold text-gray-900 md:text-4xl"
            >
              17 SDG Goals yang Kami{" "}
              <span className="font-[family-name:var(--font-instrument-serif)] italic text-[#b6252a]">
                Dukung
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-gray-500 max-w-xl mx-auto text-sm leading-relaxed"
            >
              Seluruh riset, inovasi, dan aspirasi di SDGs Hub berakar pada 17 Tujuan
              Pembangunan Berkelanjutan PBB yang menjadi arah gerak bersama.
            </motion.p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3">
            {SDG_GOALS.map((goal, i) => (
              <motion.div
                key={goal.n}
                initial={{ opacity: 0, scale: 0.75 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.4, ease: "easeOut" }}
                whileHover={{ scale: 1.07, y: -4 }}
                className="flex flex-col rounded-2xl overflow-hidden shadow-sm cursor-default transition-shadow duration-300 hover:shadow-lg"
              >
                <div
                  className="flex items-center justify-center py-4"
                  style={{ backgroundColor: goal.color }}
                >
                  <span className="text-2xl font-bold text-white/90 leading-none">{goal.n}</span>
                </div>
                <div className="bg-white px-1 py-2 text-center">
                  <p
                    className="text-[9px] font-semibold uppercase leading-tight tracking-wide"
                    style={{ color: goal.color }}
                  >
                    {goal.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </ScrollSection>
  );
}
