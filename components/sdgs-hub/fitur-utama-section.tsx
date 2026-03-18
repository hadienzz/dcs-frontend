"use client";

import { motion } from "framer-motion";
import { ScrollSection } from "@/components/ui/scroll-section";
import { FeatureCard } from "./feature-card";
import { FEATURES } from "./hub-data";

export function FiturUtamaSection() {
  return (
    <ScrollSection>
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold uppercase tracking-widest text-[#b6252a] mb-2"
          >
            Fitur Utama
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold text-gray-900 md:text-4xl"
          >
            Apa yang bisa kamu{" "}
            <span className="font-[family-name:var(--font-instrument-serif)] italic text-[#b6252a]">
              lakukan?
            </span>
          </motion.h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} index={i} />
          ))}
        </div>
      </section>
    </ScrollSection>
  );
}
