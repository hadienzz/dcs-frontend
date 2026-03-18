"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";

export function QuotesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 lg:py-32"
    >
      {/* Background — dark gradient with subtle red */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#1f1114] to-[#0f0f0f]" />
      <div className="absolute inset-0 opacity-[0.06]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(182,37,42,0.6) 1px, transparent 0)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(182,37,42,0.12),_transparent_60%)]" />

      <div className="relative mx-auto max-w-5xl px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          {/* Quote icon */}
          <div className="mb-8 inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
            <Quote className="size-7 text-[#b6252a]" />
          </div>

          {/* Main Quote */}
          <blockquote>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-2xl font-semibold leading-snug tracking-tight text-white md:text-4xl lg:text-[2.75rem] lg:leading-snug"
            >
              &ldquo;Menjadi{" "}
              <span className="font-[family-name:var(--font-instrument-serif)] italic text-[#e04950]">
                SDG Hub
              </span>{" "}
              untuk mencapai Tujuan Pembangunan Berkelanjutan tahun 2030 dan
              mendukung pembangunan global berfokus pada pengembangan dan
              pemanfaatan{" "}
              <span className="font-[family-name:var(--font-instrument-serif)] italic text-[#e04950]">
                teknologi digital.
              </span>
              &rdquo;
            </motion.p>
          </blockquote>

          {/* Attribution */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 inline-flex items-center gap-4 rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 backdrop-blur-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
              <Image
                src="/dcslogo.png"
                alt="DCS"
                width={40}
                height={40}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white/90">
                Digital Collaboration for Sustainability
              </p>
              <p className="text-xs text-white/50">SDG Telkom University</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
