"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollSection } from "@/components/ui/scroll-section";

const VALUE_PROPS = [
  {
    title: "Satu portal, tiga layanan",
    body: "Riset, inovasi, dan aspirasi mahasiswa tersedia dalam satu platform yang mudah diakses.",
    color: "#E5243B",
  },
  {
    title: "Dampak nyata di lapangan",
    body: "Ide dan project terpilih diintegrasikan ke agenda SDGs Center Telkom University.",
    color: "#26BDE2",
  },
  {
    title: "Komunitas yang aktif",
    body: "Mahasiswa, dosen, dan mitra industri berkolaborasi langsung tanpa hambatan birokrasi.",
    color: "#4C9F38",
  },
];

export function KenapaHubSection() {
  return (
    <ScrollSection>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fdf2f2] via-white to-[#f0f9ff] py-24">
        <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(182,37,42,0.07)_0%,transparent_70%)] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(38,189,226,0.07)_0%,transparent_70%)] blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            {/* Left column */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-[#b6252a] mb-3">
                Kenapa SDGs Hub?
              </p>
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-6 leading-snug">
                Ekosistem kolaborasi yang{" "}
                <span className="font-[family-name:var(--font-instrument-serif)] italic text-[#b6252a]">
                  terintegrasi
                </span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                Banyak ide, riset, dan project kampus bisa berkembang jauh lebih
                cepat secara kolaboratif. SDGs Hub menyatukan proses pencarian
                tim, pengumpulan aspirasi, dan pengembangan solusi dalam satu
                portal — mendorong keterlibatan aktif seluruh civitas akademika
                dalam agenda SDGs.
              </p>
              <Link
                href="/tentangkami"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#b6252a] transition-all duration-200 hover:gap-3"
              >
                Pelajari lebih lanjut
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            {/* Right column */}
            <div className="flex flex-col gap-4">
              {VALUE_PROPS.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <div
                    className="mt-0.5 h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">{item.title}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </ScrollSection>
  );
}
