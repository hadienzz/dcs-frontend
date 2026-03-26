"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  ClipboardCheck,
  FileSpreadsheet,
  Handshake,
  HeartPulse,
  Leaf,
  School,
  WalletCards,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const CSR_PILLARS = [
  {
    label: "01",
    name: "Pendidikan & Literasi",
    detail: "Program beasiswa, literasi digital, dan penguatan kapasitas belajar.",
    color: "#C5192D",
    icon: School,
  },
  {
    label: "02",
    name: "Ekonomi Komunitas",
    detail: "Pendampingan UMKM, inkubasi usaha, dan penguatan rantai nilai lokal.",
    color: "#FD6925",
    icon: WalletCards,
  },
  {
    label: "03",
    name: "Lingkungan Berkelanjutan",
    detail: "Pengelolaan sampah, konservasi, energi bersih, dan adaptasi iklim.",
    color: "#3F7E44",
    icon: Leaf,
  },
  {
    label: "04",
    name: "Kesehatan & Inklusi",
    detail: "Layanan promotif, edukasi kesehatan, dan penguatan akses kelompok rentan.",
    color: "#DD1367",
    icon: HeartPulse,
  },
];

const STAKEHOLDERS = [
  "SDGs Center",
  "Fakultas & Prodi",
  "Mitra Industri",
  "Pemerintah Daerah",
  "Komunitas Lokal",
  "Alumni & Volunteer",
];

const CORE_BLOCKS = [
  {
    icon: ClipboardCheck,
    title: "Perencanaan Program",
    body: "Setiap inisiatif dimulai dari isu prioritas, target manfaat, dan indikator yang bisa diukur.",
  },
  {
    icon: Handshake,
    title: "Kolaborasi Lapangan",
    body: "Pelaksanaan disusun bersama mitra agar program tidak berhenti sebagai kegiatan seremonial.",
  },
  {
    icon: FileSpreadsheet,
    title: "Monitoring Dampak",
    body: "Capaian, pembelajaran, dan rekomendasi dikumpulkan untuk bahan evaluasi berikutnya.",
  },
];

const PROGRAM_FORMATS = [
  "Portofolio program CSR",
  "Peta isu & wilayah sasaran",
  "Ringkasan target SDGs",
  "Skema kolaborasi mitra",
];

export function HubBentoSection() {
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#b6252a]"
          >
            Apa Itu SDGs Hub
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-semibold tracking-tight text-gray-900 md:text-5xl md:leading-[1.12]"
          >
            Ruang yang menyusun program CSR menjadi{" "}
            <span className="font-[family-name:var(--font-instrument-serif)] italic text-[#b6252a]">
              narasi, pilar, dan dampak
            </span>
            {" "}yang mudah dibaca.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base leading-8 text-neutral-600 md:text-lg"
          >
            SDGs Hub bukan lagi ruang submission ide atau riset, melainkan
            landing page yang menjelaskan bagaimana program CSR Telkom
            University dirancang, dijalankan, dan ditumbuhkan bersama mitra.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid gap-6 lg:grid-cols-5"
        >
          <Card className="relative overflow-hidden border-[#b6252a]/10 bg-[linear-gradient(180deg,#fff_0%,#fff8f8_100%)] lg:col-span-3">
            <CardContent className="p-7 lg:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#b6252a]/12 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b6252a]">
                    <Building2 className="size-3.5" />
                    Struktur Hub
                  </div>
                  <h3 className="mt-5 max-w-3xl text-2xl font-semibold leading-tight tracking-tight text-gray-900 md:text-3xl md:leading-[1.2]">
                    SDGs Hub merangkum bagaimana satu program CSR dibangun dari
                    konteks isu sampai laporan dampak.
                  </h3>
                </div>
                <div className="hidden rounded-2xl border border-[#b6252a]/10 bg-white px-4 py-3 text-right lg:block">
                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                    Fungsi
                  </div>
                  <div className="mt-1 text-2xl font-semibold tracking-tight text-[#b6252a]">
                    1 Halaman Utama
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {CORE_BLOCKS.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-[#b6252a]/10 bg-white p-5 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.18)]"
                    >
                      <div className="flex size-10 items-center justify-center rounded-2xl bg-[#fff1f1] text-[#b6252a]">
                        <Icon className="size-5" />
                      </div>
                      <h4 className="mt-4 text-lg font-semibold leading-snug text-gray-900">
                        {item.title}
                      </h4>
                      <p className="mt-2 text-sm leading-7 text-neutral-600">
                        {item.body}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 rounded-[1.75rem] border border-[#b6252a]/10 bg-[#180d0f] p-5 text-white md:p-6">
                <div className="grid gap-5 md:grid-cols-[1.15fr_auto_1fr] md:items-center">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
                      Prinsip Utama
                    </div>
                    <div className="mt-2 max-w-xl text-lg font-semibold leading-8 text-white">
                      Program CSR perlu punya arah yang jelas, partner yang
                      tepat, dan cara membaca dampak yang konsisten.
                    </div>
                  </div>
                  <div className="hidden h-px w-14 bg-white/15 md:block" />
                  <div className="flex flex-wrap gap-2">
                    {PROGRAM_FORMATS.map((item) => (
                      <div
                        key={item}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80"
                      >
                        <ArrowRight className="size-3.5" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-[#b6252a]/10 bg-white lg:col-span-2">
            <CardContent className="p-7 lg:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#b6252a]/12 bg-[#fff6f6] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b6252a]">
                <Leaf className="size-3.5" />
                Pilar Program
              </div>
              <h3 className="mt-4 text-xl font-semibold leading-snug tracking-tight text-gray-900">
                Empat fokus utama untuk menyusun portofolio CSR secara lebih
                jelas.
              </h3>
              <p className="mt-3 text-sm leading-7 text-neutral-600 md:text-[15px]">
                Setiap pilar membawa karakter program yang berbeda, namun tetap
                terhubung dengan agenda SDGs dan kebutuhan lapangan.
              </p>

              <div className="mt-7 grid grid-cols-1 gap-3">
                {CSR_PILLARS.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-black/6 bg-[#fcfcfc] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
                          style={{ backgroundColor: `${item.color}15` }}
                        >
                          <Icon className="h-4 w-4" style={{ color: item.color }} />
                        </div>
                        <div>
                          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                            <span
                              className="inline-block size-2 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            {item.label}
                          </div>
                          <div className="mt-2 text-sm font-semibold leading-snug text-gray-900">
                            {item.name}
                          </div>
                          <p className="mt-1 text-sm leading-6 text-neutral-600">
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-[#b6252a]/10 bg-white lg:col-span-2">
            <CardContent className="p-7 lg:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#b6252a]/12 bg-[#fff6f6] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b6252a]">
                <Handshake className="size-3.5" />
                Kolaborator
              </div>
              <h3 className="mt-4 text-xl font-semibold leading-snug tracking-tight text-gray-900">
                Program CSR hanya berjalan baik jika semua peran terlihat dan
                terhubung.
              </h3>
              <div className="mt-7 flex flex-wrap gap-3">
                {STAKEHOLDERS.map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-[#b6252a]/10 bg-[#fff9f9] px-4 py-2.5 text-sm font-medium text-gray-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm leading-7 text-neutral-600 md:text-[15px]">
                Halaman ini membantu mitra memahami siapa yang terlibat, apa
                fokus intervensinya, dan bagaimana program dibawa hingga
                memberi manfaat.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-[#b6252a]/10 bg-[linear-gradient(180deg,#ffffff_0%,#fbfbfb_100%)] lg:col-span-3">
            <CardContent className="p-7 lg:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#b6252a]/12 bg-[#fff6f6] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b6252a]">
                    <ClipboardCheck className="size-3.5" />
                    Komitmen Konten
                  </div>
                  <h3 className="mt-4 max-w-3xl text-xl font-semibold leading-snug tracking-tight text-gray-900 md:text-2xl">
                    SDGs Hub dirancang untuk menjelaskan program CSR dengan cara
                    yang lebih tertib, bukan sekadar menampilkan aktivitas.
                  </h3>
                </div>
                <ArrowRight className="mt-1 hidden size-5 text-[#b6252a] lg:block" />
              </div>

              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {[
                  "Latar isu yang direspon program",
                  "Pilar dan bentuk intervensi utama",
                  "Mitra pelaksana dan wilayah sasaran",
                  "Indikator dampak yang ingin dicapai",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-black/6 bg-white p-6 md:min-h-[180px]"
                  >
                    <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                      Fokus 0{index + 1}
                    </div>
                    <div className="mt-4 text-sm font-semibold leading-7 text-gray-900 md:text-[15px]">
                      {item}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
