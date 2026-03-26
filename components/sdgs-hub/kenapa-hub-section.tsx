"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ScrollSection } from "@/components/ui/scroll-section";

const VALUE_PROPS = [
  {
    title: "Narasi program lebih rapi",
    body: "Mitra bisa langsung memahami kenapa program dijalankan, siapa sasarannya, dan bagaimana bentuk intervensinya.",
    color: "#E5243B",
  },
  {
    title: "Target SDGs lebih terlihat",
    body: "Setiap program dapat ditautkan ke sasaran SDGs yang relevan sehingga arahnya lebih mudah dibaca.",
    color: "#26BDE2",
  },
  {
    title: "Dampak tidak berhenti di dokumentasi",
    body: "Halaman ini membantu merangkum capaian, pembelajaran, dan peluang scale-up untuk program berikutnya.",
    color: "#4C9F38",
  },
];

export function KenapaHubSection() {
  return (
    <ScrollSection>
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fdf2f2_0%,#ffffff_42%,#fff7f8_100%)] py-24">
        <div className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(182,37,42,0.08)_0%,transparent_72%)] blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(38,189,226,0.08)_0%,transparent_72%)] blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#b6252a]">
                Kenapa SDGs Hub?
              </p>
              <h2 className="text-3xl font-bold leading-snug text-gray-900 md:text-4xl">
                CSR yang baik butuh{" "}
                <span className="font-[family-name:var(--font-instrument-serif)] italic text-[#b6252a]">
                  arah, bahasa, dan jejak dampak
                </span>
                {" "}yang sama.
              </h2>
              <p className="mb-8 mt-6 leading-relaxed text-gray-600">
                Banyak program CSR terlihat aktif, tetapi sulit dibaca sebagai
                ekosistem yang utuh. SDGs Hub membantu menyatukan fokus program,
                partner yang terlibat, dan hasil yang ingin dicapai ke dalam
                satu halaman yang lebih jelas dan lebih strategis.
              </p>
              <Link
                href="/tentangkami"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#b6252a] transition-all duration-200 hover:gap-3"
              >
                Lihat profil kolaborasi
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <div className="flex flex-col gap-4">
              {VALUE_PROPS.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12, duration: 0.5 }}
                  className="flex gap-4 rounded-[1.7rem] border border-gray-100 bg-white p-5 shadow-[0_18px_44px_-34px_rgba(15,23,42,0.2)]"
                >
                  <div
                    className="mt-1 h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <p className="mb-1 font-semibold text-gray-900">
                      {item.title}
                    </p>
                    <p className="text-sm leading-relaxed text-gray-500">
                      {item.body}
                    </p>
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
