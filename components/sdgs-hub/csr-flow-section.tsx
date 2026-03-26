"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  ClipboardList,
  Compass,
  FileCheck2,
  Handshake,
  Map,
} from "lucide-react";

import { ScrollSection } from "@/components/ui/scroll-section";

const FLOW_STEPS = [
  {
    title: "Pemetaan kebutuhan lapangan",
    body: "Program dimulai dari pembacaan isu, pemetaan wilayah sasaran, dan identifikasi kelompok penerima manfaat.",
    icon: Compass,
    color: "#b6252a",
  },
  {
    title: "Perumusan target dan pilar intervensi",
    body: "Tim menentukan fokus CSR, target SDGs, dan hasil yang ingin dicapai agar program tidak kehilangan arah.",
    icon: Map,
    color: "#fd6925",
  },
  {
    title: "Pelaksanaan bersama mitra",
    body: "Aktivitas dijalankan dengan pembagian peran yang jelas antara kampus, mitra industri, pemerintah, dan komunitas.",
    icon: Handshake,
    color: "#26bde2",
  },
  {
    title: "Monitoring berkala",
    body: "Setiap program dipantau melalui dokumentasi kegiatan, indikator manfaat, dan catatan tantangan lapangan.",
    icon: ClipboardList,
    color: "#4c9f38",
  },
  {
    title: "Laporan dampak dan tindak lanjut",
    body: "Hasil dievaluasi untuk menyusun rekomendasi, penguatan model, atau perluasan kemitraan pada fase berikutnya.",
    icon: FileCheck2,
    color: "#dd1367",
  },
];

const IMPACT_OUTPUTS = [
  "Jumlah penerima manfaat",
  "Kualitas kemitraan yang terbangun",
  "Ketercapaian target SDGs",
  "Perubahan perilaku atau kapasitas",
  "Dokumentasi cerita dampak",
  "Rencana keberlanjutan program",
];

export function CsrFlowSection() {
  return (
    <ScrollSection>
      <section
        id="alur-csr"
        className="relative overflow-hidden bg-[linear-gradient(180deg,#fffefe_0%,#fff5f6_52%,#ffffff_100%)] py-24 lg:py-28"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-[-6rem] top-12 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(182,37,42,0.10)_0%,transparent_70%)] blur-3xl" />
          <div className="absolute left-[-4rem] bottom-0 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(38,189,226,0.10)_0%,transparent_70%)] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-start xl:gap-16">
            <div className="lg:sticky lg:top-24">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#b6252a]"
              >
                Alur Implementasi
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-[2.9rem]"
              >
                Dari isu lapangan menjadi
                <span className="font-[family-name:var(--font-instrument-serif)] italic text-[#b6252a]">
                  {" "}
                  program yang bisa dievaluasi.
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.14 }}
                className="mt-5 max-w-xl text-lg leading-8 text-gray-600"
              >
                Halaman SDGs Hub perlu menjelaskan bahwa program CSR tidak
                berhenti di pelaksanaan acara, tetapi bergerak dari pemetaan,
                implementasi, hingga pembacaan dampak.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="mt-8 rounded-[1.9rem] border border-[#f0d9db] bg-white/90 p-7 shadow-[0_25px_60px_-38px_rgba(15,23,42,0.3)]"
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-[#b6252a]/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#b6252a]">
                  <BarChart3 className="h-3.5 w-3.5" />
                  Dampak yang Dicatat
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {IMPACT_OUTPUTS.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-[#f2e6e7] bg-[#fffdfd] px-4 py-3 text-sm font-medium leading-6 text-gray-800"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="relative">
              <div className="absolute left-[1.05rem] top-3 hidden h-[calc(100%-2rem)] w-px bg-[linear-gradient(180deg,rgba(182,37,42,0.35)_0%,rgba(182,37,42,0.08)_100%)] md:block" />
              <div className="space-y-5">
                {FLOW_STEPS.map((step, index) => {
                  const Icon = step.icon;

                  return (
                    <motion.article
                      key={step.title}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      className="relative overflow-hidden rounded-[1.9rem] border border-[#eee4e5] bg-white p-6 shadow-[0_20px_55px_-40px_rgba(17,24,39,0.3)] md:ml-10"
                    >
                      <div
                        className="absolute inset-x-0 top-0 h-1"
                        style={{ backgroundColor: step.color }}
                      />
                      <div
                        className="absolute left-[-3.4rem] top-8 hidden h-9 w-9 items-center justify-center rounded-full border-4 border-[#fff5f6] bg-white shadow-sm md:flex"
                      >
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: step.color }}
                        />
                      </div>
                      <div className="flex items-start gap-4">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                          style={{ backgroundColor: `${step.color}14` }}
                        >
                          <Icon className="h-5 w-5" style={{ color: step.color }} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#b6252a]/70">
                            Tahap 0{index + 1}
                          </div>
                          <h3 className="mt-2 text-xl font-semibold leading-snug text-gray-900">
                            {step.title}
                          </h3>
                          <p className="mt-3 text-sm leading-7 text-gray-600 md:text-[15px]">
                            {step.body}
                          </p>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </ScrollSection>
  );
}
