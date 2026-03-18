import type { ComponentProps } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Globe2,
  Handshake,
  Play,
  Shield,
  Target,
  Users,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type FeaturesProps = ComponentProps<"section">;

export function Features({ className, ...props }: FeaturesProps) {
  return (
    <section
      className={cn("bg-transparent py-16 md:py-24", className)}
      {...props}
    >
      <div className="mx-auto max-w-3xl px-6 lg:max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          {/* <div className="inline-flex items-center gap-2 rounded-full border border-[#b6252a]/15 bg-[#fff6f6] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#b6252a]">
            <Play className="size-3.5" />
            Video Unggulan
          </div> */}
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-gray-900 md:text-5xl md:leading-tight">
            Sorotan{" "}
            <span className="font-[family-name:var(--font-instrument-serif)] italic text-[#b6252a]">
              Video & Dampak
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-neutral-600 md:text-base">
            Ringkasan visual tentang bagaimana Telkom University membangun
            kolaborasi digital untuk keberlanjutan melalui riset, inovasi, dan
            kerja sama strategis.
          </p>
        </div>

        <div className="relative mt-12">
          <div className="absolute inset-x-20 -top-8 h-24 rounded-full bg-[radial-gradient(circle,_rgba(15,23,42,0.07)_0%,_transparent_70%)] blur-3xl" />
          <div className="relative z-10 space-y-4">
            <Card className="relative overflow-hidden border-black/8 bg-[linear-gradient(180deg,#ffffff_0%,#fbfbfb_100%)] shadow-[0_22px_60px_-36px_rgba(15,23,42,0.18)]">
              <CardContent className="grid gap-6 p-4 pt-4 lg:grid-cols-[0.92fr_1.38fr] lg:p-6 lg:pt-6">
                <div className="relative flex flex-col justify-between rounded-[1.75rem] border border-black/8 bg-white/90 p-6 shadow-[0_16px_40px_-34px_rgba(15,23,42,0.14)] backdrop-blur-sm lg:p-8">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#b6252a]/12 bg-[#fff4f4] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b6252a]">
                      <Play className="size-3.5 fill-current" />
                      Video Unggulan
                    </div>
                    <h3 className="mt-5 text-2xl font-semibold tracking-tight text-gray-900 md:text-4xl md:leading-tight">
                      Cerita utama{" "}
                      <span className="font-[family-name:var(--font-instrument-serif)] italic text-[#b6252a]">
                        dampak berkelanjutan
                      </span>
                    </h3>
                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-600 md:text-base">
                      Video ini merangkum arah gerak SDGs Center Telkom
                      University, mulai dari komitmen global, implementasi
                      penta helix, hingga kolaborasi digital yang membangun
                      dampak nyata.
                    </p>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "17", label: "SDG Goals" },
                        { value: "2030", label: "Target Bersama" },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-2xl border border-black/7 bg-[#fcfcfc] p-4"
                        >
                          <div className="text-2xl font-semibold tracking-tight text-[#b6252a] md:text-3xl">
                            {item.value}
                          </div>
                          <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-gray-500">
                            {item.label}
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link
                      href="#footer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#b6252a] transition hover:text-[#8f1a20]"
                    >
                      Hubungi tim DCS
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[1.75rem] border border-[#b6252a]/10 bg-[#15090a] shadow-[0_24px_50px_-30px_rgba(182,37,42,0.45)]">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/33Sxz0nS4t0?si=WkAUy3SD3IhJY52A"
                    title="SDG Unggulan Telkom University"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="aspect-video h-full min-h-[280px] w-full lg:min-h-[420px]"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-6 gap-4">
              <Card className="relative col-span-full overflow-hidden border-[#b6252a]/10 bg-[linear-gradient(180deg,#fff_0%,#fff4f4_100%)] md:col-span-3 xl:col-span-2">
              <CardContent className="relative flex min-h-[320px] flex-col justify-center pt-6">
                <div className="relative mx-auto flex h-28 w-64 items-center justify-center">
                  <svg
                    className="text-[#f0caca] absolute inset-0 size-full"
                    viewBox="0 0 254 104"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="mx-auto block w-fit text-5xl font-semibold tracking-tight text-[#b6252a]">
                    2030
                  </span>
                </div>
                <div className="relative z-10 mt-6 space-y-2 text-center">
                  <h3 className="text-3xl font-semibold text-gray-900">
                    Target Bersama
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-600">
                    Seluruh inisiatif video dan aksi lapangan diarahkan untuk
                    mempercepat kontribusi Telkom University menuju capaian SDGs
                    2030.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="relative col-span-full overflow-hidden border-[#b6252a]/10 bg-white md:col-span-3 xl:col-span-2">
              <CardContent className="pt-6">
                <div className="pt-4 lg:px-4">
                  <div className="relative mx-auto flex aspect-square size-32 items-center justify-center rounded-full border border-[#b6252a]/15 before:absolute before:-inset-3 before:rounded-full before:border before:border-[#b6252a]/8">
                    <div className="text-center">
                      <div className="text-4xl font-semibold tracking-tight text-[#b6252a]">
                        17
                      </div>
                      <div className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
                        Goals
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative z-10 mt-10 space-y-2 text-center">
                  <h3 className="text-lg font-medium transition">
                    Komitmen Global
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-600">
                    Telkom University berkomitmen memberi kontribusi nyata untuk
                    tantangan dunia dengan inovasi berbasis keberlanjutan.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="relative col-span-full overflow-hidden border-[#b6252a]/10 bg-white md:col-span-6 xl:col-span-2">
              <CardContent className="pt-6">
                <div className="pt-2 lg:px-2">
                  <div className="rounded-[1.25rem] border border-[#b6252a]/10 bg-[#fff7f7] p-4">
                    <div className="space-y-3">
                      {[
                        { label: "Pemerintah", width: "w-[72%]" },
                        { label: "Industri", width: "w-[88%]" },
                        { label: "Komunitas", width: "w-[64%]" },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="mb-1 flex items-center justify-between text-xs font-medium text-gray-500">
                            <span>{item.label}</span>
                            <span>Aktif</span>
                          </div>
                          <div className="h-2 rounded-full bg-[#f7dede]">
                            <div
                              className={cn(
                                "h-2 rounded-full bg-[linear-gradient(90deg,#b6252a_0%,#ed1e28_100%)]",
                                item.width,
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="relative z-10 mt-8 space-y-2 text-center">
                  <h3 className="text-lg font-medium transition">
                    Kolaborasi Strategis
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-600">
                    Kerja sama lintas stakeholders menjadi fondasi penting dalam
                    mendorong aksi SDGs yang relevan dan berkelanjutan.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="relative col-span-full overflow-hidden border-[#b6252a]/10 bg-white lg:col-span-3">
              <CardContent className="grid h-full pt-6 sm:grid-cols-2">
                <div className="relative z-10 flex flex-col justify-between space-y-8 lg:space-y-6">
                  <div className="relative flex aspect-square size-12 rounded-full border border-[#b6252a]/15 before:absolute before:-inset-2 before:rounded-full before:border before:border-[#b6252a]/8">
                    <Shield
                      className="m-auto size-5 text-[#b6252a]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-zinc-800 transition">
                      Digital Collaboration for Sustainability
                    </h3>
                    <p className="text-sm leading-relaxed text-neutral-600">
                      DCS adalah SDGs Center Telkom University yang menekankan
                      kolaborasi digital antar-stakeholder untuk menciptakan
                      solusi yang berdampak dan terukur.
                    </p>
                  </div>
                </div>
                <div className="relative mt-6 rounded-tl-[var(--radius)] border-l border-t border-[#b6252a]/10 bg-[#fff9f9] p-6 py-6 sm:-my-6 sm:-mr-6 sm:ml-6">
                  <div className="absolute left-3 top-2 flex gap-1">
                    <span className="block size-2 rounded-full border border-[#b6252a]/15 bg-white" />
                    <span className="block size-2 rounded-full border border-[#b6252a]/15 bg-white" />
                    <span className="block size-2 rounded-full border border-[#b6252a]/15 bg-white" />
                  </div>
                  <div className="relative flex h-full flex-col justify-center space-y-4 py-5">
                    {[
                      { icon: Globe2, label: "Academic Network" },
                      { icon: Handshake, label: "Industry Link" },
                      { icon: Target, label: "Impact Monitoring" },
                    ].map((item, idx) => (
                      <div
                        key={item.label}
                        className={cn(
                          "relative flex items-center gap-3 rounded-full border border-[#b6252a]/10 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm",
                          idx % 2 === 0 ? "mr-8" : "ml-8",
                        )}
                      >
                        <item.icon className="size-4 text-[#b6252a]" />
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

              <Card className="relative col-span-full overflow-hidden border-[#b6252a]/10 bg-white lg:col-span-3">
                <CardContent className="grid h-full pt-6 sm:grid-cols-[0.9fr_1.1fr]">
                  <div className="relative z-10 flex flex-col justify-between space-y-8 lg:space-y-6">
                    <div className="relative flex aspect-square size-12 rounded-full border border-[#b6252a]/15 before:absolute before:-inset-2 before:rounded-full before:border before:border-[#b6252a]/8">
                      <Users
                        className="m-auto size-6 text-[#b6252a]"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium transition">
                        Ekosistem Kolaborasi
                      </h3>
                      <p className="text-sm leading-relaxed text-neutral-600">
                        Keterlibatan sivitas akademika dan mitra eksternal
                        memastikan pesan keberlanjutan bergerak dari narasi ke
                        implementasi.
                      </p>
                    </div>
                  </div>
                  <div className="relative mt-6 rounded-tl-[var(--radius)] border-l border-t border-[#b6252a]/10 bg-[#fff9f9] p-6 py-6 sm:-my-6 sm:-mr-6 sm:ml-6">
                    <div className="relative flex h-full flex-col justify-center space-y-4 py-3">
                      {[
                        "Sivitas Akademika",
                        "Pemerintah & Industri",
                        "Komunitas & Media",
                      ].map((item, idx) => (
                        <div
                          key={item}
                          className={cn(
                            "rounded-full border border-[#b6252a]/10 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm",
                            idx === 1 ? "ml-8" : "mr-8",
                          )}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
