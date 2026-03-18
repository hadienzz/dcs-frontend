"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { simpleBlogCard, PersonRef } from "@/lib/interface";
import { urlFor } from "@/lib/sanity";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";
import { NavbarDetail } from "../home/custom/navbar-detail-page";

interface NewsIndexProps {
  blogs: simpleBlogCard[];
  limitFeatured?: number; // how many top items to feature (default 1)
}

// util: format date
const formatDate = (date: string) => {
  if (!date) return "TBA";
  try {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return date;
  }
};

// util: estimate read time based on description length
const estimateReadTime = (text: string) => {
  const words = (text || "").trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 180));
  return `${minutes} menit baca`;
};

interface RawBlog extends simpleBlogCard {
  // categories can be an array of category refs or legacy strings
  categories?:
    | Array<{ title: string; slug?: { current?: string } }>
    | string
    | string[];
  author?: PersonRef | null;
}

type NormalizedItem = {
  id: string | number;
  imageUrl: string;
  title: string;
  excerpt: string;
  date: string;
  category: string; // primary category (first)
  categories: string[]; // all category titles for filtering
  slug: string;
  readTime: string;
  authorName?: string;
  authorPhoto?: unknown;
};

export function NewsIndex({ blogs, limitFeatured = 1 }: NewsIndexProps) {
  const [activeCategory, setActiveCategory] = useState("Semua");

  // Normalize with derived fields
  const normalized = useMemo<NormalizedItem[]>(() => {
    return ((blogs as RawBlog[] | undefined) || []).map((b, idx) => {
      const cats: string[] = Array.isArray(b.categories)
        ? (b.categories as Array<{ title?: string } | string>)
            .map((c) => (typeof c === "string" ? c : c?.title))
            .filter((v): v is string => Boolean(v))
        : typeof b.categories === "string"
          ? [b.categories]
          : [];
      const primary = cats[0] || "General";
      // Use Sanity image when present; otherwise, use a safe local fallback to avoid domain issues
      const imageUrl =
        b.titleImage && typeof b.titleImage !== "string"
          ? urlFor(b.titleImage).width(1200).height(800).fit("crop").url()
          : "/bg.jpg";
      return {
        id: b.currentSlug || idx,
        imageUrl,
        title: b.title,
        excerpt: b.smallDescription,
        date: b.publishedAt,
        category: primary,
        categories: cats,
        slug: b.currentSlug,
        readTime: estimateReadTime(b.smallDescription),
        authorName: b.author?.name,
        authorPhoto: b.author?.photo,
      };
    });
  }, [blogs]);

  // Derive tab categories dynamically from Sanity categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    normalized.forEach((n) => n.categories.forEach((c) => set.add(c)));
    return ["Semua", ...Array.from(set)];
  }, [normalized]);

  const filtered = useMemo(() => {
    if (activeCategory === "Semua") return normalized;
    return normalized.filter((n) => n.categories.includes(activeCategory));
  }, [activeCategory, normalized]);

  const featured = filtered.slice(0, limitFeatured);
  const rest = filtered.slice(limitFeatured);
  const singleFeatured = featured.length === 1;

  return (
    <section className="relative pb-20">
      {/* Navbar on this page */}
      <NavbarDetail />
      {/* subtle background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-32 left-10 h-40 w-40 rounded-full bg-[#b6252a]/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-56 w-56 rounded-full bg-[#ED1E28]/10 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Berita <span className="text-[#b6252a]">Terbaru</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kumpulan update dan informasi terkini.
          </p>
        </div>

        {/* Category Tabs (QS vs Impact) */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                activeCategory === c
                  ? "bg-[#b6252a] border-[#b6252a] text-white shadow-lg shadow-[#b6252a]/30"
                  : "bg-white border-gray-200 text-gray-600 hover:border-[#b6252a]/40 hover:text-[#b6252a]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Featured Section */}
        {featured.length > 0 &&
          (singleFeatured ? (
            <div className="mb-16">
              {featured.map((f) => (
                <Link
                  key={f.id}
                  href={`/news/${f.slug}`}
                  className="block bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="md:flex">
                    <div className="relative w-full h-64 md:h-80 lg:h-96 md:w-1/2">
                      <Image
                        src={f.imageUrl}
                        alt={f.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition" />
                      {/* Category badge (red) */}
                      <div className="absolute left-3 top-3 flex flex-wrap gap-2 text-[11px] font-medium">
                        <span className="px-2 py-0.5 rounded-full bg-[#b6252a] text-white shadow">
                          {f.category}
                        </span>
                      </div>
                    </div>
                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
                      <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-4 h-4" /> {formatDate(f.date)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {f.readTime}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:text-[#b6252a] transition-colors line-clamp-2">
                        {f.title}
                      </h2>
                      <p className="text-gray-600 text-base leading-relaxed line-clamp-3 mb-4">
                        {f.excerpt}
                      </p>
                      {f.authorName && (
                        <div className="mb-4 flex items-center gap-2 text-gray-700 min-w-0">
                          <span className="relative inline-block w-7 h-7 overflow-hidden rounded-full bg-gray-200 flex-shrink-0">
                            {f.authorPhoto ? (
                              <Image
                                src={urlFor(f.authorPhoto)
                                  .width(80)
                                  .height(80)
                                  .fit("crop")
                                  .url()}
                                alt={f.authorName}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <span className="w-full h-full grid place-items-center text-[11px]">
                                {f.authorName.charAt(0)}
                              </span>
                            )}
                          </span>
                          <span className="inline-flex items-center gap-1 min-w-0">
                            <User className="w-4 h-4" />
                            <span className="font-medium truncate max-w-[12rem] sm:max-w-[16rem]">
                              {f.authorName}
                            </span>
                          </span>
                        </div>
                      )}
                      <div className="mt-auto">
                        <span className="inline-flex items-center gap-2 text-[#b6252a] font-semibold group-hover:gap-3 transition-all">
                          Baca Selengkapnya <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mb-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((f) => (
                <Link
                  key={f.id}
                  href={`/news/${f.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl"
                >
                  <div className="relative h-52 w-full overflow-hidden">
                    <Image
                      src={f.imageUrl}
                      alt={f.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition" />
                    {/* Category badge (red) */}
                    <div className="absolute left-3 top-3 flex flex-wrap gap-2 text-[10px] font-medium">
                      <span className="px-2 py-0.5 rounded-full bg-[#b6252a] text-white shadow">
                        {f.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col p-6">
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />{" "}
                        {formatDate(f.date)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {f.readTime}
                      </span>
                    </div>
                    <h2 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-[#b6252a] transition-colors line-clamp-2">
                      {f.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {f.excerpt}
                    </p>
                    {f.authorName && (
                      <div className="mb-4 flex items-center gap-2 text-gray-700 min-w-0">
                        <span className="relative inline-block w-6 h-6 overflow-hidden rounded-full bg-gray-200 flex-shrink-0">
                          {f.authorPhoto ? (
                            <Image
                              src={urlFor(f.authorPhoto)
                                .width(72)
                                .height(72)
                                .fit("crop")
                                .url()}
                              alt={f.authorName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <span className="w-full h-full grid place-items-center text-[10px]">
                              {f.authorName.charAt(0)}
                            </span>
                          )}
                        </span>
                        <span className="inline-flex items-center gap-1 min-w-0">
                          <User className="w-4 h-4" />
                          <span className="font-medium truncate">
                            {f.authorName}
                          </span>
                        </span>
                      </div>
                    )}
                    <span className="mt-auto inline-flex items-center gap-1 text-[#b6252a] text-sm font-semibold group-hover:gap-2 transition-all">
                      Baca Selengkapnya <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ))}

        {/* Regular Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {rest.map((n: NormalizedItem, idx) => (
            <Link
              key={n.id}
              href={`/news/${n.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-lg hover:-translate-y-1"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src={n.imageUrl}
                  alt={n.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-50 group-hover:opacity-40 transition" />
                <div className="absolute left-3 top-3 flex flex-wrap gap-2 text-[10px] font-medium">
                  <span className="px-2 py-0.5 rounded-full bg-[#b6252a] text-white shadow">
                    {n.category}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#b6252a] transition-colors">
                  {n.title}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-3 mb-3">
                  {n.excerpt}
                </p>
                <div className="mt-auto flex items-center justify-between gap-3 text-[11px] text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {formatDate(n.date)}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {n.readTime}
                    </span>
                    {n.authorName && (
                      <span className="inline-flex items-center gap-1.5 text-gray-700 min-w-0">
                        <span className="relative inline-block w-5 h-5 overflow-hidden rounded-full bg-gray-200 flex-shrink-0">
                          {n.authorPhoto ? (
                            <Image
                              src={urlFor(n.authorPhoto)
                                .width(56)
                                .height(56)
                                .fit("crop")
                                .url()}
                              alt={n.authorName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <span className="w-full h-full grid place-items-center text-[9px]">
                              {n.authorName.charAt(0)}
                            </span>
                          )}
                        </span>
                        <span className="truncate max-w-[6rem]">
                          {n.authorName}
                        </span>
                      </span>
                    )}
                  </span>
                </div>
              </div>
              <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[#b6252a] transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
          {!rest.length && !featured.length && (
            <div className="col-span-full text-center text-gray-500 py-20 border rounded-xl bg-white">
              Belum ada berita.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
