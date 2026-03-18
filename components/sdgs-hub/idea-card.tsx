"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Idea } from "@/hooks/useSdgsHubData";
import { ArrowRight, Calendar, ThumbsUp } from "lucide-react";

interface IdeaCardProps {
  idea: Idea;
  index: number;
  onVote: (ideaId: string) => void;
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

export function IdeaCard({ idea, index, onVote }: IdeaCardProps) {
  const sdgColor = SDG_COLORS[idea.sdgCategory] || "#6B7280";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className="group relative flex rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gray-200"
    >
      {/* Vote section */}
      <div className="mr-4 flex flex-col items-center gap-1.5 pt-1">
        <button
          onClick={() => onVote(idea.id)}
          disabled={idea.hasVoted}
          className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
            idea.hasVoted
              ? "bg-[#b6252a] text-white shadow-md"
              : "border border-gray-200 bg-gray-50 text-gray-400 hover:border-[#b6252a]/30 hover:bg-red-50 hover:text-[#b6252a]"
          }`}
        >
          <ThumbsUp className="h-4 w-4" />
        </button>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={idea.votes}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="text-sm font-bold text-gray-900"
          >
            {idea.votes}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold text-white"
            style={{ backgroundColor: sdgColor }}
          >
            {idea.sdgCategory}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="h-3 w-3" />
            {idea.createdAt}
          </span>
        </div>
        <h3 className="text-base font-semibold text-gray-900 leading-snug group-hover:text-[#b6252a] transition-colors">
          <Link
            href={`/sdgs-hub/ide/${idea.slug}`}
            className="relative z-10 hover:text-[#b6252a]"
          >
            {idea.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-gray-600 leading-relaxed line-clamp-2">
          {idea.description}
        </p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            oleh{" "}
            <span className="font-medium text-gray-600">{idea.author}</span>
          </p>
          <Link
            href={`/sdgs-hub/ide/${idea.slug}`}
            className="relative z-10 inline-flex items-center gap-1.5 text-xs font-semibold text-[#b6252a]"
          >
            Lihat detail
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
