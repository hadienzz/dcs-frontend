"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  accentColor: string;
  index: number;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  href,
  accentColor,
  index,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.12, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <Link
        href={href}
        className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:-translate-y-1 h-full"
      >
        {/* icon */}
        <div
          className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${accentColor}12` }}
        >
          <Icon className="h-7 w-7" style={{ color: accentColor }} />
        </div>

        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#b6252a] transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed flex-1">
          {description}
        </p>

        {/* CTA */}
        <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-[#b6252a] opacity-0 translate-x-[-4px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          Jelajahi
          <ArrowRight className="h-4 w-4" />
        </div>

        {/* Bottom accent */}
        <span
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 rounded-b-2xl transition-transform duration-300 group-hover:scale-x-100"
          style={{ backgroundColor: accentColor }}
        />
      </Link>
    </motion.div>
  );
}
