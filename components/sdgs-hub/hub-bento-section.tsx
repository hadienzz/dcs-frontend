"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  FlaskConical,
  Handshake,
  Lightbulb,
  Rocket,
  Search,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const HUB_CONTENTS = [
  { label: "01", name: "Riset Dosen", color: "#C5192D" },
  { label: "02", name: "Project Mitra", color: "#A21942" },
  { label: "03", name: "Ide Mahasiswa", color: "#FD6925" },
  { label: "04", name: "Sistem Vote", color: "#FD9D24" },
];

const CONTRIBUTORS = [
  "Mahasiswa",
  "Dosen",
  "Unit Kampus",
  "Mitra Industri",
  "Komunitas",
  "Pemerintah",
];

const FLOW_SOURCES = [
  {
    icon: FlaskConical,
    title: "Topik Riset Dosen",
    body: "Topik riset yang dibuka dosen untuk kolaborasi bersama mahasiswa.",
  },
  {
    icon: Building2,
    title: "Project dari Mitra",
    body: "Tantangan nyata dari mitra eksternal yang perlu solusi bersama.",
  },
  {
    icon: Lightbulb,
    title: "Ide Mahasiswa",
    body: "Ruang untuk mengirim ide dan aspirasi kampus berkelanjutan.",
  },
];

const DELIVERY_STAGES = [
  "Dosen atau mitra memposting kebutuhan kolaborasi.",
  "Mahasiswa menelusuri riset dan project yang tersedia.",
  "Mahasiswa bergabung sesuai minat dan kompetensi.",
  "Ide kampus berkelanjutan dapat diajukan dari portal yang sama.",
  "Ide terpilih ditinjau untuk pengembangan lebih lanjut.",
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
            Portal kolaborasi untuk{" "}
            <span className="font-[family-name:var(--font-instrument-serif)] italic text-[#b6252a]">
              riset, project, dan ide SDGs
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base leading-8 text-neutral-600 md:text-lg"
          >
            SDGs Hub adalah portal kolaborasi riset dan ide keberlanjutan di
            Telkom University yang mempertemukan mahasiswa, dosen, dan mitra
            eksternal dalam satu ekosistem.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid gap-6 lg:grid-cols-5"
        >
          <Card className="relative overflow-hidden border-[#b6252a]/10 bg-[linear-gradient(180deg,#fff_0%,#fff7f7_100%)] lg:col-span-3">
            <CardContent className="p-7 lg:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#b6252a]/12 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b6252a]">
                    <Handshake className="size-3.5" />
                    Gambaran Utama
                  </div>
                  <h3 className="mt-5 max-w-3xl text-2xl font-semibold leading-tight tracking-tight text-gray-900 md:text-3xl md:leading-[1.2]">
                    Satu portal untuk mempertemukan kebutuhan riset, project,
                    dan gagasan mahasiswa.
                  </h3>
                </div>
                <div className="hidden rounded-2xl border border-[#b6252a]/10 bg-white px-4 py-3 text-right lg:block">
                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                    Fungsi
                  </div>
                  <div className="mt-1 text-2xl font-semibold tracking-tight text-[#b6252a]">
                    1 Portal
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {FLOW_SOURCES.map((item) => {
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

              <div className="mt-8 rounded-[1.75rem] border border-[#b6252a]/10 bg-[#1a0d0f] p-5 text-white md:p-6">
                <div className="grid gap-5 md:grid-cols-[1.2fr_auto_1fr] md:items-center">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
                      Fungsi Utama SDGs Hub
                    </div>
                    <div className="mt-2 max-w-xl text-lg font-semibold leading-8 text-white">
                      Menghubungkan pihak yang tepat untuk membangun kolaborasi
                      yang lebih terarah.
                    </div>
                  </div>
                  <div className="hidden h-px w-14 bg-white/15 md:block" />
                  <div className="flex flex-wrap gap-2">
                    {[
                      { icon: Search, label: "Cari Tim" },
                      { icon: Rocket, label: "Bangun Solusi" },
                      { icon: Users, label: "Kolaborasi" },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.label}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80"
                        >
                          <Icon className="size-3.5" />
                          {item.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-[#b6252a]/10 bg-white lg:col-span-2">
            <CardContent className="p-7 lg:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#b6252a]/12 bg-[#fff6f6] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b6252a]">
                <Lightbulb className="size-3.5" />
                Isi Di Dalamnya
              </div>
              <h3 className="mt-4 text-xl font-semibold leading-snug tracking-tight text-gray-900">
                Semua fitur utama tersedia dalam satu alur yang terhubung.
              </h3>
              <p className="mt-3 text-sm leading-7 text-neutral-600 md:text-[15px]">
                Pengguna dapat mencari peluang riset, mengirim ide, dan memberi
                dukungan pada aspirasi yang relevan.
              </p>

              <div className="mt-7 grid grid-cols-2 gap-3">
                {HUB_CONTENTS.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-black/6 bg-[#fcfcfc] p-5"
                  >
                    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                      <span
                        className="inline-block size-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.label}
                    </div>
                    <div className="mt-3 text-sm font-semibold leading-snug text-gray-900">
                      {item.name}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-dashed border-[#b6252a]/20 bg-[#fff9f9] px-4 py-4 text-sm leading-7 text-neutral-600">
                Seluruh proses dirancang agar tidak terpecah di banyak tempat.
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-[#b6252a]/10 bg-white lg:col-span-2">
            <CardContent className="p-7 lg:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#b6252a]/12 bg-[#fff6f6] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b6252a]">
                <Users className="size-3.5" />
                Siapa Yang Terlibat
              </div>
              <h3 className="mt-4 text-xl font-semibold leading-snug tracking-tight text-gray-900">
                SDGs Hub mempertemukan pihak-pihak yang berperan dalam ekosistem
                kampus.
              </h3>
              <div className="mt-7 flex flex-wrap gap-3">
                {CONTRIBUTORS.map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-[#b6252a]/10 bg-[#fff9f9] px-4 py-2.5 text-sm font-medium text-gray-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm leading-7 text-neutral-600 md:text-[15px]">
                Kolaborasi menjadi lebih mudah, lebih terarah, dan lebih dekat
                dengan kebutuhan nyata.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-[#b6252a]/10 bg-[linear-gradient(180deg,#ffffff_0%,#fbfbfb_100%)] lg:col-span-3">
            <CardContent className="p-7 lg:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#b6252a]/12 bg-[#fff6f6] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b6252a]">
                    <FlaskConical className="size-3.5" />
                    Cara Kerja SDGs Hub
                  </div>
                  <h3 className="mt-4 max-w-3xl text-xl font-semibold leading-snug tracking-tight text-gray-900 md:text-2xl">
                    Alur kerja yang jelas dari kebutuhan awal hingga tindak
                    lanjut.
                  </h3>
                </div>
                <ArrowRight className="mt-1 hidden size-5 text-[#b6252a] lg:block" />
              </div>

              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
                {DELIVERY_STAGES.map((stage, index) => (
                  <div
                    key={stage}
                    className="rounded-2xl border border-black/6 bg-white p-6 md:min-h-[180px] xl:min-h-[190px]"
                  >
                    <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                      Tahap {index + 1}
                    </div>
                    <div className="mt-4 text-sm font-semibold leading-7 text-gray-900 md:text-[15px]">
                      {stage}
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
