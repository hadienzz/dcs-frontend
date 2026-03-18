"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/hooks/useSdgsHubData";
import { ArrowRight, Clock, Users } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  index: number;
}

const STATUS_LABELS: Record<
  Project["status"],
  { label: string; color: string }
> = {
  open: { label: "Terbuka", color: "bg-emerald-100 text-emerald-700" },
  "in-progress": { label: "Berjalan", color: "bg-amber-100 text-amber-700" },
  closed: { label: "Ditutup", color: "bg-gray-100 text-gray-500" },
};

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

export function ProjectCard({ project, index }: ProjectCardProps) {
  const statusInfo = STATUS_LABELS[project.status];
  const remainingSlots = project.teamSlots - project.filledSlots;
  const sdgColor = SDG_COLORS[project.sdgCategory] || "#6B7280";

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className="group relative flex cursor-pointer flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-lg"
    >
      <Link
        href={`/sdgs-hub/riset/${project.slug}`}
        className="absolute inset-0 z-10 cursor-pointer rounded-2xl"
        aria-label={`Lihat detail ${project.title}`}
      />

      {/* SDG color accent */}
      <div
        className="absolute inset-x-0 top-0 h-1 rounded-t-2xl"
        style={{ backgroundColor: sdgColor }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <span
          className="shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold text-white"
          style={{ backgroundColor: sdgColor }}
        >
          {project.sdgCategory}
        </span>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusInfo.color}`}
        >
          {statusInfo.label}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#b6252a] transition-colors">
        {project.title}
      </h3>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">
        {project.description}
      </p>

      {/* Dosen info */}
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
          {project.dosenName.charAt(0)}
        </div>
        <span className="font-medium text-gray-700">{project.dosenName}</span>
      </div>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-gray-50 px-2 py-0.5 text-xs text-gray-500 border border-gray-100"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {remainingSlots} slot tersisa
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {project.createdAt}
          </span>
        </div>
        <span className="pointer-events-none relative z-20 inline-flex items-center gap-1.5 text-xs font-semibold text-[#b6252a]">
          Lihat detail
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </motion.article>
  );
}
