/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ChevronRight, Layers, Play, Github } from "lucide-react";
import { urlFor } from "@/lib/sanity";

export type SimpleProductCard = {
  title: string;
  smallDescription: string;
  currentSlug: string;
  titleImage: any;
  publishedAt: string;
  category?: string;
  tags?: string[];
  sdgGoals?: string[];
  status?: "Live" | "Beta" | "Development";
  links?: { demo?: string; github?: string };
};

type NormalizedProduct = {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  tags: string[];
  sdgGoalNums: number[];
  slug: string;
  links?: { demo?: string; github?: string };
};

function extractSdgNumbers(labels: string[] = []): number[] {
  return labels
    .map((t) => {
      const m = String(t).match(/\d+/);
      return m ? parseInt(m[0], 10) : NaN;
    })
    .filter((n) => Number.isFinite(n)) as number[];
}

export function ProductList({
  products,
  limit = 3,
  isLoading = false,
}: {
  products: SimpleProductCard[];
  limit?: number;
  isLoading?: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const normalized: NormalizedProduct[] = useMemo(() => {
    return (products || [])
      .map((p) => ({
        id: p.currentSlug || p.title,
        title: p.title,
        description: p.smallDescription,
        category: p.category || "Uncategorized",
        imageUrl: p.titleImage
          ? urlFor(p.titleImage).url()
          : "/placeholder.svg",
        tags: p.tags || [],
        sdgGoalNums: extractSdgNumbers(p.sdgGoals || []),
        slug: p.currentSlug,
        links: p.links,
        _date: p.publishedAt ? new Date(p.publishedAt).getTime() : 0,
      }))
      .sort((a, b) => b._date - a._date);
  }, [products]);

  const categories = useMemo(() => {
    if (isLoading) return ["All"];
    const set = new Set(normalized.map((n) => n.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [normalized, isLoading]);

  const filtered =
    selectedCategory === "All"
      ? normalized
      : normalized.filter((n) => n.category === selectedCategory);

  const limited =
    typeof limit === "number" && limit > 0
      ? filtered.slice(0, limit)
      : filtered;
  const isTruncated = !isLoading && limited.length < filtered.length;
  const skeletonCount = limit && limit > 0 ? limit : 3;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-24 lg:py-32"
      aria-busy={isLoading}
      aria-live="polite"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(182,37,42,0.06),_transparent_50%)]" />
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
            <Layers className="size-3.5" />
            Innovation Portfolio
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-5xl md:leading-tight">
            Produk & Solusi{" "}
            <span className="font-[family-name:var(--font-instrument-serif)] italic text-[#b6252a]">
              Inovatif
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-neutral-600 md:text-base">
            Koleksi produk dan teknologi yang dikembangkan untuk mendukung SDGs
            melalui inovasi digital.
          </p>
        </motion.div>

        {/* Category Filter (show when not limited) */}
        {!isLoading &&
          filtered.length > 0 &&
          normalized.length > 0 &&
          (limit === undefined || limit > 6) && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-10 flex flex-wrap justify-center gap-3"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-[#b6252a] text-white shadow-lg shadow-[#b6252a]/25"
                      : "border border-[#b6252a]/10 bg-white text-neutral-600 hover:border-[#b6252a]/25 hover:text-[#b6252a]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          )}

        {/* Products Grid */}
        <div className="mx-auto mt-14 grid max-w-6xl gap-7 md:grid-cols-2 lg:grid-cols-3">
          {/* Skeletons */}
          {isLoading &&
            Array.from({ length: skeletonCount }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-[1.5rem] border border-[#b6252a]/8 bg-white shadow-[0_4px_24px_-8px_rgba(182,37,42,0.06)]"
              >
                <div className="h-48 bg-gray-100" />
                <div className="space-y-3 p-6">
                  <div className="h-3 w-20 rounded bg-gray-100" />
                  <div className="h-5 w-3/4 rounded bg-gray-100" />
                  <div className="h-3 w-full rounded bg-gray-100" />
                  <div className="h-3 w-5/6 rounded bg-gray-100" />
                  <div className="flex gap-2 pt-2">
                    <div className="h-7 w-7 rounded-lg bg-gray-100" />
                    <div className="h-7 w-7 rounded-lg bg-gray-100" />
                    <div className="h-7 w-7 rounded-lg bg-gray-100" />
                  </div>
                </div>
              </div>
            ))}

          {/* Product cards */}
          {!isLoading &&
            limited.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + index * 0.1 }}
                className="group overflow-hidden rounded-[1.5rem] border border-[#b6252a]/8 bg-white shadow-[0_4px_24px_-8px_rgba(182,37,42,0.08)] transition-all duration-300 hover:border-[#b6252a]/15 hover:shadow-[0_8px_36px_-12px_rgba(182,37,42,0.15)]"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Quick Actions */}
                  <div
                    className={`absolute left-4 top-4 flex gap-2 transition-all duration-300 ${
                      hoveredProduct === product.id
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-2 opacity-0"
                    }`}
                  >
                    {product.links?.demo ? (
                      <Link
                        href={product.links.demo}
                        target="_blank"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 backdrop-blur-sm transition-colors hover:bg-white"
                        aria-label="Demo"
                      >
                        <Play className="h-4 w-4" />
                      </Link>
                    ) : (
                      <span className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-full bg-white/60 text-gray-400 backdrop-blur-sm">
                        <Play className="h-4 w-4" />
                      </span>
                    )}
                    {product.links?.github ? (
                      <Link
                        href={product.links.github}
                        target="_blank"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 backdrop-blur-sm transition-colors hover:bg-white"
                        aria-label="GitHub"
                      >
                        <Github className="h-4 w-4" />
                      </Link>
                    ) : (
                      <span className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-full bg-white/60 text-gray-400 backdrop-blur-sm">
                        <Github className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b6252a]">
                    {product.category}
                  </p>
                  <h3 className="text-lg font-semibold tracking-tight text-gray-900 transition-colors group-hover:text-[#b6252a]">
                    {product.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 line-clamp-3">
                    {product.description}
                  </p>

                  {!!product.tags?.length && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-[#b6252a]/6 bg-[#fff6f6] px-2 py-0.5 text-[11px] font-medium text-neutral-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-5 flex items-center justify-between border-t border-[#b6252a]/6 pt-4">
                    <div className="flex items-center gap-1.5">
                      {product.sdgGoalNums.length ? (
                        product.sdgGoalNums.map((goal) => (
                          <div
                            key={goal}
                            className="flex h-6 w-6 items-center justify-center rounded-md bg-[#b6252a] text-[10px] font-bold text-white"
                          >
                            {goal}
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-neutral-400">—</span>
                      )}
                    </div>
                    <Link
                      href={`/program/${product.slug}`}
                      className="flex items-center gap-1 text-sm font-medium text-[#b6252a] transition-all hover:gap-2"
                    >
                      Learn More
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>

        {/* Truncation CTA */}
        {!isLoading && isTruncated && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-14 text-center"
          >
            <Link
              href="/program"
              className="inline-flex items-center gap-2 rounded-full bg-[#b6252a] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#b6252a]/20 transition-colors hover:bg-[#9e1f23]"
            >
              Produk Lainnya
              <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
