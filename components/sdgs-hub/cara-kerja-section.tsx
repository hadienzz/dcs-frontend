"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { ScrollSection } from "@/components/ui/scroll-section";
import { STEPS } from "./hub-data";

export function CaraKerjaSection() {
  return (
    <ScrollSection>
      <section className="relative overflow-hidden bg-white py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(17,24,39,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(17,24,39,0.6) 1px, transparent 1px)",
            backgroundSize: "38px 38px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-sm font-semibold uppercase tracking-widest text-[#b6252a] mb-2"
            >
              Cara Kerja
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl font-bold text-gray-900 md:text-4xl"
            >
              3 Langkah{" "}
              <span className="font-[family-name:var(--font-instrument-serif)] italic text-[#b6252a]">
                sederhana
              </span>
            </motion.h2>
          </div>

          <div className="relative grid gap-6 md:grid-cols-3">
            {/* Connecting line – desktop only */}
            <div className="pointer-events-none absolute top-[52px] left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] h-px bg-gradient-to-r from-[#E5243B]/20 via-[#26BDE2]/20 to-[#4C9F38]/20 hidden md:block" />

            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.55 }}
                  className="relative flex flex-col items-center text-center p-8 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className="relative flex h-16 w-16 items-center justify-center rounded-2xl mb-5"
                    style={{ backgroundColor: `${step.color}12`, border: `1.5px solid ${step.color}25` }}
                  >
                    <Icon className="h-7 w-7" style={{ color: step.color }} />
                    <span
                      className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-sm"
                      style={{ backgroundColor: step.color }}
                    >
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.body}</p>

                  {i < STEPS.length - 1 && (
                    <ChevronRight className="absolute -right-4 top-[52px] h-6 w-6 text-gray-300 hidden md:block z-10" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </ScrollSection>
  );
}
