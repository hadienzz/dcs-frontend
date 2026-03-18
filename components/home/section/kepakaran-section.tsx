"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users } from "lucide-react";
import { urlFor } from "../../../lib/sanity";

const localExperts = [
  {
    name: "Prof. Dr. Adiwijaya",
    expertise: [
      "Data Science/Data and information science",
      "Combinatorial optimization",
    ],
    sdgNumbers: [4, 9, 17],
    image: "/pakar/adiwijaya.jpg",
  },
  {
    name: "Prof. Dr. Jangkung Raharjo",
    expertise: ["Smart Grid dan Energi"],
    sdgNumbers: [7, 11, 13],
    image: "/pakar/jangkung.jpg",
  },
  {
    name: "Prof. Dr. Aloysius Adya Pramudita",
    expertise: ["Radar and Electromagnetic Application"],
    sdgNumbers: [9, 11, 16],
    image: "/pakar/aloysius.jpeg",
  },
];

const sdgColors: Record<number, string> = {
  1: "#E5243B",
  2: "#DDA63A",
  3: "#4C9F38",
  4: "#C5192D",
  5: "#FF3AA8",
  6: "#FFC700",
  7: "#FCC30B",
  9: "#FD6925",
  11: "#FD9D24",
  13: "#3F7E44",
  16: "#00689D",
  17: "#19486A",
};

type SanityImage = {
  asset?: { _ref?: string; _type?: string };
  [key: string]: unknown;
};

type ExpertDoc = {
  _id: string;
  name: string;
  slug?: { current: string };
  image?: SanityImage | string;
  expertise?: string[];
  sdgNumbers?: number[];
  position?: string;
  bio?: string;
};

export function KepakaranSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [experts, setExperts] = useState<ExpertDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchExperts() {
      try {
        const res = await fetch("/api/experts", { cache: "no-store" });
        const { experts: data } = await res.json();
        if (!cancelled) {
          if (data && data.length) setExperts(data);
          else setExperts(localExperts as unknown as ExpertDoc[]);
        }
      } catch {
        if (!cancelled) setExperts(localExperts as unknown as ExpertDoc[]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchExperts();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayExperts = loading
    ? (localExperts as unknown as ExpertDoc[])
    : experts;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-24 lg:py-32"
      id="kepakaran"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(182,37,42,0.06),_transparent_50%)]" />
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(182,37,42,0.7) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#b6252a]/15 bg-[#fff6f6] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#b6252a]">
            <Users className="size-3.5" />
            Kepakaran
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-5xl md:leading-tight">
            Berdedikasi untuk{" "}
            <span className="font-[family-name:var(--font-instrument-serif)] italic text-[#b6252a]">
              Mencapai SDGs
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-neutral-600 md:text-base">
            Kami memiliki kepakaran yang berdedikasi untuk mencapai SDGs yang
            mencakup berbagai bidang pengetahuan dan keterampilan serta
            mengintegrasikan berbagai keahlian ini.
          </p>
        </motion.div>

        {/* Expert Cards */}
        <div className="mx-auto mt-14 grid max-w-6xl gap-7 md:grid-cols-2 lg:grid-cols-3">
          {displayExperts.map((expert, index) => (
            <motion.div
              key={expert._id || expert.name}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + index * 0.12 }}
              className="group relative rounded-[1.5rem] border border-[#b6252a]/8 bg-white p-7 shadow-[0_4px_24px_-8px_rgba(182,37,42,0.08)] transition-all duration-300 hover:border-[#b6252a]/15 hover:shadow-[0_8px_36px_-12px_rgba(182,37,42,0.15)]"
            >
              {/* Photo & Name */}
              <div className="mb-6 flex items-center gap-4">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-[#b6252a]/10 bg-gray-100">
                  {expert.image ? (
                    <Image
                      src={
                        typeof expert.image === "string"
                          ? expert.image
                          : urlFor(expert.image)
                              .width(256)
                              .height(256)
                              .fit("crop")
                              .url()
                      }
                      alt={expert.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="64px"
                    />
                  ) : (
                    <Image
                      src="/placeholder.svg"
                      alt={expert.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-gray-900 group-hover:text-[#b6252a] transition-colors duration-300">
                    {expert.name}
                  </h3>
                  {expert.position && (
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {expert.position}
                    </p>
                  )}
                </div>
              </div>

              {/* Expertise */}
              <div className="mb-5">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                  Expertise
                </p>
                <div className="flex flex-wrap gap-2">
                  {(expert.expertise || []).map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="rounded-lg border border-[#b6252a]/8 bg-[#fff6f6] px-3 py-1.5 text-xs font-medium text-neutral-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* SDG Badges */}
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                  SDG Focus
                </p>
                <div className="flex flex-wrap gap-2">
                  {(expert.sdgNumbers || []).map((sdgNum) => (
                    <div
                      key={sdgNum}
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold text-white shadow-sm transition-transform duration-200 hover:scale-110"
                      style={{
                        backgroundColor: sdgColors[sdgNum] ?? "#b6252a",
                      }}
                    >
                      {sdgNum}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
