/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, Clock, ArrowRight, Newspaper } from "lucide-react";
import { simpleBlogCard } from "@/lib/interface";
import { urlFor } from "@/lib/sanity";

interface BlogsPageProps {
  data: simpleBlogCard[];
}

const BlogPlaceholder = () => (
  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#b6252a]/10 via-[#fff6f6] to-white">
    <div className="text-center">
      <div className="mb-2 text-4xl opacity-60">📝</div>
      <p className="text-xs font-medium text-neutral-400">Artikel</p>
    </div>
  </div>
);

type NormalizedNews = {
  id: number | string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: any;
  featured: boolean;
  slug: string;
  authorName?: string;
  authorPhoto?: any;
  editorName?: string;
};

const inferCategory = (title = "", desc = ""): string => {
  const text = `${title} ${desc}`.toLowerCase();
  if (/(riset|research|paper|journal|publikasi|nature|study)/.test(text))
    return "research";
  if (/(kolaborasi|collab|kerjasama|kemitraan|mo[u]?)/.test(text))
    return "collaboration";
  if (/(penghargaan|award|juara|pencapaian|rekor|raih)/.test(text))
    return "achievement";
  if (/(acara|event|workshop|seminar|webinar|conference)/.test(text))
    return "event";
  return "other";
};

const estimateReadTime = (text?: string | null): string => {
  const s = typeof text === "string" ? text : "";
  const words = s.trim().split(/\s+/).filter(Boolean).length || 120;
  const minutes = Math.max(2, Math.round(words / 200));
  return `${minutes} menit`;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export function NewsPage({ data }: BlogsPageProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [activeCategory] = useState("all");

  const newsData = useMemo<NormalizedNews[]>(
    () =>
      (data || []).map((item, idx) => ({
        id: idx + 1,
        title: item.title,
        excerpt: item.smallDescription,
        category: inferCategory(item.title, item.smallDescription),
        date: item.publishedAt,
        readTime: estimateReadTime(item.smallDescription),
        image: item.titleImage,
        featured: idx === 0,
        slug: item.currentSlug,
        authorName: item.author?.name,
        authorPhoto: item.author?.photo,
        editorName: item.editor?.name,
      })),
    [data],
  );

  const filteredNews =
    activeCategory === "all"
      ? newsData
      : newsData.filter((news) => news.category === activeCategory);

  const featuredNews = newsData.find((n) => n.featured);
  const regularNews = filteredNews.filter((n) => !n.featured);
  const limitedRegularNews =
    activeCategory === "all" ? regularNews.slice(0, 3) : regularNews;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-24 lg:py-32"
      id="berita"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(182,37,42,0.06),_transparent_45%)]" />
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
            <Newspaper className="size-3.5" />
            Berita & Update
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-5xl md:leading-tight">
            Berita &{" "}
            <span className="font-[family-name:var(--font-instrument-serif)] italic text-[#b6252a]">
              Update Terbaru
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-neutral-600 md:text-base">
            Ikuti perkembangan terbaru dari SDG Telkom University dalam mencapai
            tujuan pembangunan berkelanjutan
          </p>
        </motion.div>

        {/* Featured News */}
        {featuredNews && activeCategory === "all" && (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-14 max-w-6xl"
          >
            <Link
              href={`/news/${featuredNews.slug}`}
              className="group block overflow-hidden rounded-[2rem] border border-[#b6252a]/8 bg-white shadow-[0_4px_24px_-8px_rgba(182,37,42,0.08)] transition-all duration-300 hover:border-[#b6252a]/15 hover:shadow-[0_8px_36px_-12px_rgba(182,37,42,0.15)]"
            >
              <div className="md:flex">
                <div className="relative h-64 md:h-auto md:w-1/2">
                  {featuredNews.image ? (
                    <Image
                      src={
                        urlFor(featuredNews.image).url() || "/placeholder.svg"
                      }
                      alt={featuredNews.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <BlogPlaceholder />
                  )}
                </div>
                <div className="flex flex-col justify-center p-8 md:w-1/2 md:p-12">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 text-sm text-neutral-500">
                      <Calendar className="size-3.5" />
                      {formatDate(featuredNews.date)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-neutral-500">
                      <Clock className="size-3.5" />
                      {featuredNews.readTime}
                    </span>
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight text-gray-900 transition-colors group-hover:text-[#b6252a] md:text-3xl">
                    {featuredNews.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-neutral-600 md:text-base">
                    {featuredNews.excerpt}
                  </p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#b6252a] transition-all group-hover:gap-3">
                    Baca Selengkapnya
                    <ArrowRight className="size-4" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* News Grid */}
        <div className="mx-auto mt-10 grid max-w-6xl gap-7 md:grid-cols-2 lg:grid-cols-3">
          {limitedRegularNews.map((news, index) => (
            <motion.article
              key={news.id}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.25 + index * 0.1 }}
              className="group overflow-hidden rounded-[1.5rem] border border-[#b6252a]/8 bg-white shadow-[0_4px_24px_-8px_rgba(182,37,42,0.08)] transition-all duration-300 hover:border-[#b6252a]/15 hover:shadow-[0_8px_36px_-12px_rgba(182,37,42,0.15)]"
            >
              <Link href={`/news/${news.slug}`} className="block">
                <div className="relative h-48 overflow-hidden">
                  {news.image ? (
                    <Image
                      src={urlFor(news.image).url() || "/placeholder.svg"}
                      alt={news.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      fetchPriority="low"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <BlogPlaceholder />
                  )}
                </div>

                <div className="p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 text-xs text-neutral-500">
                      <Calendar className="size-3" />
                      {formatDate(news.date)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-neutral-500">
                      <Clock className="size-3" />
                      {news.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold tracking-tight text-gray-900 transition-colors group-hover:text-[#b6252a] line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 line-clamp-3">
                    {news.excerpt}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-[#b6252a]/6 pt-4">
                    {news.authorName ? (
                      <span className="inline-flex items-center gap-2 text-xs text-neutral-600">
                        <span className="relative inline-block h-5 w-5 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
                          {news.authorPhoto ? (
                            <Image
                              src={urlFor(news.authorPhoto)
                                .width(56)
                                .height(56)
                                .fit("crop")
                                .url()}
                              alt={news.authorName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <span className="grid h-full w-full place-items-center text-[9px] font-medium text-neutral-500">
                              {news.authorName.charAt(0)}
                            </span>
                          )}
                        </span>
                        <span className="max-w-[7rem] truncate">
                          {news.authorName}
                        </span>
                      </span>
                    ) : (
                      <span />
                    )}

                    <span className="flex items-center gap-1 text-sm font-medium text-[#b6252a] transition-all group-hover:gap-2">
                      Baca
                      <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Load More */}
        {regularNews.length > limitedRegularNews.length && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-14 text-center"
          >
            <Link
              href="/news"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#b6252a] px-8 py-3.5 text-sm font-semibold text-[#b6252a] transition-all duration-300 hover:bg-[#b6252a] hover:text-white hover:shadow-lg hover:shadow-[#b6252a]/20"
            >
              Lihat Berita Lainnya
              <ArrowRight className="size-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
