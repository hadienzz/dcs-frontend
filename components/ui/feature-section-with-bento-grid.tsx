"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import createGlobe from "cobe";
import { motion } from "framer-motion";
import { IconBrandYoutubeFilled } from "@tabler/icons-react";
import { ArrowRight, Globe2, Users2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { urlFor } from "@/lib/sanity";

const features = [
  {
    title: "SDGs Unggulan",
    description:
      "Fokus inisiatif Telkom University dalam mendorong tujuan pembangunan berkelanjutan lewat riset, edukasi, dan dampak terukur.",
    skeleton: <SkeletonOne />,
    className:
      "col-span-1 border-b border-[#b6252a]/10 md:col-span-4 lg:col-span-4 md:border-r",
  },
  {
    title: "Kepakaran Multidisiplin",
    description:
      "Jaringan kepakaran lintas bidang yang mendukung solusi digital berkelanjutan, mulai dari data, energi, hingga applied research.",
    skeleton: <SkeletonTwo />,
    className:
      "col-span-1 border-b border-[#b6252a]/10 md:col-span-2 lg:col-span-2",
  },
  {
    title: "Video Unggulan & Edukasi",
    description:
      "Masuk ke cerita inti DCS Telkom University lewat video unggulan yang merangkum visi, aksi, dan kolaborasi nyata di lapangan.",
    skeleton: <SkeletonThree />,
    className:
      "col-span-1 border-b border-[#b6252a]/10 md:col-span-3 lg:col-span-3 md:border-r md:border-b-0",
  },
  {
    title: "Kolaborasi Global Penta Helix",
    description:
      "DCS dibangun lewat kolaborasi akademik, industri, pemerintah, komunitas, dan mitra global untuk menghasilkan dampak yang berkelanjutan.",
    skeleton: <SkeletonFour />,
    className: "col-span-1 md:col-span-3 lg:col-span-3",
  },
];

export function FeaturesSectionWithBentoGrid() {
  return (
    <div className="relative z-20 mx-auto max-w-7xl py-20 lg:py-28">
      <div className="px-6 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* <div className="inline-flex items-center gap-2 rounded-full border border-[#b6252a]/15 bg-[#fff6f6] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#b6252a]">
            <Sparkles className="size-3.5" />
            Keunggulan Telkom University
          </div> */}
          <h4 className="mt-6 text-3xl font-semibold tracking-tight text-gray-900 md:text-5xl md:leading-tight">
            Keunggulan{" "}
            <span className="font-[family-name:var(--font-instrument-serif)] italic text-[#b6252a]">
              SDG&apos;s
            </span>
          </h4>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-normal text-neutral-600 md:text-base">
            Dari fokus SDGs unggulan hingga jejaring global, seluruh inisiatif
            dirancang untuk memperkuat transformasi digital yang berdampak bagi
            masyarakat.
          </p>
        </div>
      </div>

      <div className="relative mt-12 px-6 md:px-8">
        <div className="absolute inset-x-8 -top-6 h-32 rounded-full bg-[radial-gradient(circle,_rgba(15,23,42,0.08)_0%,_transparent_68%)] blur-3xl" />
        <div className="grid grid-cols-1 overflow-hidden rounded-[2rem] border border-black/8 bg-white/90 shadow-[0_22px_70px_-42px_rgba(15,23,42,0.18)] backdrop-blur-sm md:grid-cols-6 lg:grid-cols-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className="min-h-0 flex-1">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden p-4 sm:p-7",
        className,
      )}
    >
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="max-w-5xl text-left text-xl tracking-tight text-gray-900 md:text-2xl md:leading-snug">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      className={cn(
        "my-2 max-w-sm text-left text-sm font-normal leading-relaxed text-neutral-600 md:text-sm",
      )}
    >
      {children}
    </p>
  );
};

function SkeletonOne() {
  return (
    <div className="relative flex min-h-[380px] gap-6 px-1 py-8">
      <div className="relative mx-auto w-full overflow-hidden rounded-[1.5rem] border border-black/8 bg-white shadow-[0_20px_40px_-32px_rgba(15,23,42,0.16)]">
        <Image
          src="/sdg-backgrounds.png"
          alt="Visual SDGs unggulan"
          width={1200}
          height={800}
          className="h-[320px] w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/55 to-white/10" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Goals Prioritas", value: "17" },
              { label: "Program Aktif", value: "52+" },
              { label: "Mitra Kolaborasi", value: "281" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-black/6 bg-white/82 p-4 backdrop-blur-md"
              >
                <div className="text-2xl font-semibold tracking-tight text-[#b6252a]">
                  {item.value}
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonTwo() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [experts, setExperts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/experts")
      .then((res) => res.json())
      .then((data) => {
        if (data.experts) {
          setExperts(data.experts.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  const rotations = [-8, 6, -5];

  const imageVariants = {
    whileHover: {
      scale: 1.04,
      rotate: 0,
      y: -8,
      zIndex: 100,
    },
  };

  const allTags = [...new Set(experts.flatMap((e) => e.expertise || []))].slice(
    0,
    4,
  );

  return (
    <div className="relative flex min-h-[380px] flex-col overflow-hidden px-2 py-8">
      <div className="flex flex-row justify-center gap-1 md:-ml-6">
        {experts.map((expert, idx) => (
          <motion.div
            key={expert._id}
            variants={imageVariants}
            initial={false}
            whileHover="whileHover"
            style={{ rotate: rotations[idx] || 0 }}
            className={cn(
              "rounded-[1.25rem] border border-black/8 bg-white p-1.5 shadow-[0_18px_38px_-30px_rgba(15,23,42,0.16)]",
              idx === 1 ? "translate-y-6" : "",
            )}
          >
            <Image
              src={
                expert.image
                  ? urlFor(expert.image).width(240).height(280).url()
                  : "/pakar/placeholder.jpg"
              }
              alt={expert.name}
              width={240}
              height={280}
              className="h-32 w-24 rounded-[1rem] object-cover md:h-44 md:w-32"
            />
          </motion.div>
        ))}
      </div>

      <div className="mt-6 rounded-[1.25rem] border border-black/8 bg-[#fcfcfc] p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#b6252a]">
          <Users2 className="size-4" />
          Expertise Highlights
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {(allTags.length > 0
            ? allTags
            : ["Data Science", "Smart Grid", "Electromagnetic", "Innovation"]
          ).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-black/8 bg-white px-3 py-1 text-xs font-medium text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SkeletonThree() {
  return (
    <Link
      href="#video"
      className="group/image relative flex h-full min-h-[270px] gap-10 overflow-hidden rounded-[1.5rem] border border-[#b6252a]/10 bg-[#15090a]"
    >
      <div className="absolute inset-0">
        <Image
          src="/bg.jpg"
          alt="Video unggulan DCS"
          width={1200}
          height={800}
          className="h-full w-full object-cover object-center transition-all duration-300 group-hover/image:scale-105 group-hover/image:blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#210a0d] via-[#5f1015]/45 to-[#210a0d]/20" />
      </div>

      <div className="relative z-10 flex h-full w-full flex-col justify-between p-6">
        <div className="flex items-center justify-between">
          <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm">
            Featured Story
          </div>
          <IconBrandYoutubeFilled className="size-12 text-[#ff3a3a]" />
        </div>

        <div>
          <p className="max-w-md text-lg font-semibold leading-tight text-white md:text-2xl">
            Kenali arah gerak Digital Collaboration for Sustainability dari
            Telkom University lewat video unggulan kami.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors group-hover/image:text-white">
            Tonton sekarang
            <ArrowRight className="size-4 transition-transform group-hover/image:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function SkeletonFour() {
  return (
    <div className="relative mt-6 flex h-[290px] items-center justify-center overflow-hidden rounded-[1.5rem] border border-black/8 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.08),_transparent_48%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
      <div className="absolute inset-x-6 top-5 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b6252a]">
            Global Footprint
          </div>
          <div className="mt-1 text-sm text-gray-600">Bandung to the world</div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-black/8 bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
          <Globe2 className="size-3.5 text-[#b6252a]" />
          Penta Helix
        </div>
      </div>
      <Globe className="absolute -bottom-44 right-[-5.5rem] md:-bottom-36 md:right-[-4rem]" />
    </div>
  );
}

function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: Math.min(window.devicePixelRatio, 2),
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0.2,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 4,
      baseColor: [0.96, 0.96, 0.96],
      markerColor: [0.71, 0.15, 0.16],
      glowColor: [1, 0.94, 0.94],
      markers: [
        { location: [-6.973, 107.63], size: 0.09 },
        { location: [1.3521, 103.8198], size: 0.06 },
        { location: [35.6762, 139.6503], size: 0.05 },
        { location: [51.5072, -0.1276], size: 0.05 },
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.012;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 520, height: 520, maxWidth: "100%", aspectRatio: 1 }}
      className={className}
    />
  );
}
