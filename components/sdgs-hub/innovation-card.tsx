"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Innovation } from "@/hooks/useSdgsHubData";
import { ArrowRight, Lightbulb } from "lucide-react";

interface InnovationCardProps {
  innovation: Innovation;
  index: number;
}

const SDG_COLORS: Record<string, string> = {
  "SDG 1": "#E5243B",
  "SDG 2": "#DDA63A",
  "SDG 3": "#4C9F38",
  "SDG 4": "#C5192D",
  "SDG 5": "#FF3A21",
  "SDG 6": "#26BDE2",
  "SDG 7": "#FCC30B",
  "SDG 8": "#A21942",
  "SDG 9": "#FD6925",
  "SDG 10": "#DD1367",
  "SDG 11": "#FD9D24",
  "SDG 12": "#BF8B2E",
  "SDG 13": "#3F7E44",
  "SDG 14": "#0A97D9",
  "SDG 15": "#56C02B",
  "SDG 16": "#00689D",
  "SDG 17": "#19486A",
};

export function InnovationCard({ innovation, index }: InnovationCardProps) {
  const sdgColor = SDG_COLORS[innovation.sdgCategory] || "#6B7280";

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-gray-200 hover:shadow-lg"
    >
      <Link
        href={`/sdgs-hub/inovasi/${innovation.slug}`}
        className="absolute inset-0 z-10 rounded-2xl"
        aria-label={`Lihat detail ${innovation.title}`}
      />

      {/* Image placeholder */}
      <div
        className="relative h-48 w-full overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${sdgColor}22, ${sdgColor}08)`,
        }}
      >
        <div className="flex h-full w-full items-center justify-center">
          <Lightbulb
            className="h-16 w-16 transition-transform duration-500 group-hover:scale-110"
            style={{ color: sdgColor, opacity: 0.3 }}
          />
        </div>
        <div className="absolute left-3 top-3">
          <span
            className="rounded-md px-2.5 py-1 text-xs font-semibold text-white shadow-sm"
            style={{ backgroundColor: sdgColor }}
          >
            {innovation.sdgCategory}
          </span>
        </div>
        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#b6252a] transition-colors">
          {innovation.title}
        </h3>
        <p className="mt-1 text-sm text-gray-500 font-medium">
          {innovation.creator}
        </p>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">
          {innovation.description}
        </p>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {innovation.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-gray-50 px-2 py-0.5 text-xs text-gray-500 border border-gray-100"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="rounded-full bg-[#fff7f7] px-3 py-1 text-[11px] font-semibold text-[#b6252a]">
            {innovation.demo
              ? "Demo tersedia di detail"
              : "Lihat detail inovasi"}
          </span>
          <span className="pointer-events-none relative z-20 inline-flex items-center gap-1.5 text-xs font-semibold text-[#b6252a]">
            Lihat detail
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
