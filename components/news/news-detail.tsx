/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Clock, Share2, Bookmark } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PortableText } from "@portabletext/react";
import type { fullBlog } from "@/lib/interface";
import { urlFor } from "@/lib/sanity";
import { NavbarDetail } from "../home/custom/navbar-detail-page";
import CommentSection from "./comment-section";

// ---- Utils
const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// ekstrak teks dari portable text utk hitung read time
const plainTextFromPortableText = (blocks: any[]): string => {
  try {
    return (blocks || [])
      .map((block: any) => {
        if (block?._type !== "block" || !block.children) return "";
        return block.children.map((c: any) => c.text).join("");
      })
      .join("\n");
  } catch {
    return "";
  }
};

const estimateReadTime = (text = ""): string => {
  const words = text.trim().split(/\s+/).filter(Boolean).length || 120;
  const minutes = Math.max(2, Math.round(words / 200));
  return `${minutes} menit`;
};

// portable text components (dipakai agar tampilan tetap kalem di theme putih)
const portableTextComponents = {
  block: {
    h3: ({ children }: any) => (
      <h3 className="font-semibold text-gray-900 mt-6 mb-2 text-lg sm:text-2xl">
        {children}
      </h3>
    ),
    normal: ({ children }: any) => (
      <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 py-2 my-6 bg-gray-50 rounded-r-lg">
        <div className="text-gray-700 italic">{children}</div>
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700 ml-4">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700 ml-4">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-semibold text-gray-900">{children}</strong>
    ),
    em: ({ children }: any) => <em className="italic">{children}</em>,
    link: ({ children, value }: any) => (
      <a
        href={value.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#b6252a] underline hover:opacity-80 transition-opacity"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }: any) => (
      <div className="my-8">
        <Image
          src={urlFor(value).url() || "/placeholder.svg"}
          alt={value.alt || "Blog image"}
          width={1200}
          height={650}
          className="w-full h-auto rounded-lg object-cover"
        />
        {value.caption && (
          <p className="text-gray-500 text-sm text-center mt-2 italic">
            {value.caption}
          </p>
        )}
      </div>
    ),
    code: ({ value }: any) => (
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-6">
        <code className="text-sm font-mono">{value.code}</code>
      </pre>
    ),
  },
};

type RelatedNews = {
  id: string;
  title: string;
  image: string;
  date: string;
  category: string;
};

// ---- Component
export default function NewsDetailSection({
  data,
  slug,
}: {
  data: fullBlog;
  slug: string;
}) {
  // derive fields from Sanity
  const title = data?.title || "";
  const publishedAt = data?.publishedAt;
  const categories: string[] = Array.isArray(data?.categories)
    ? (data.categories as any[]).map((c: any) => c?.title || c).filter(Boolean)
    : typeof data?.categories === "string"
      ? [data.categories as string]
      : [];
  const categoryForBadge = categories[0] || "Artikel";
  const titleImage = data?.titleImage ? urlFor(data.titleImage).url() : "";
  const author = (data as any)?.author as
    | { name?: string; photo?: any }
    | undefined;
  const editor = (data as any)?.editor as
    | { name?: string; photo?: any }
    | undefined;
  const excerpt = useMemo(
    () =>
      (data as any)?.excerpt ||
      plainTextFromPortableText((data as any)?.content || []).slice(0, 200) +
        (plainTextFromPortableText((data as any)?.content || []).length > 200
          ? "..."
          : ""),
    [data]
  );
  const computedReadTime = useMemo(
    () =>
      estimateReadTime(plainTextFromPortableText((data as any)?.content || [])),
    [data]
  );
  const documents = Array.isArray((data as any)?.documents)
    ? ((data as any).documents as any[])
        .map((d) => ({
          url: (d as any)?.url as string,
          originalFilename: (d as any)?.originalFilename as string | undefined,
          mimeType: (d as any)?.mimeType as string | undefined,
          size: (d as any)?.size as number | undefined,
        }))
        .filter((d) => typeof d.url === "string" && d.url.length > 0)
    : [];
  const youtubeUrl: string | undefined = (data as any)?.youtubeUrl || undefined;
  const youtubeEmbed = useMemo(() => {
    if (!youtubeUrl) return undefined;
    try {
      const url = new URL(youtubeUrl);
      const host = url.hostname.replace(/^www\./, "");
      let id = "";
      if (host === "youtu.be") {
        id = url.pathname.replace("/", "");
      } else if (host === "youtube.com" || host === "m.youtube.com") {
        if (url.pathname.startsWith("/watch")) {
          id = url.searchParams.get("v") || "";
        } else if (url.pathname.startsWith("/shorts/")) {
          id = url.pathname.split("/")[2] || "";
        } else if (url.pathname.startsWith("/embed/")) {
          id = url.pathname.split("/")[2] || "";
        }
      }
      if (!id) return undefined;
      const params = new URLSearchParams({ rel: "0" }).toString();
      return `https://www.youtube.com/embed/${id}?${params}`;
    } catch {
      return undefined;
    }
  }, [youtubeUrl]);

  // feature states
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [views, setViews] = useState<number>(0);
  const [relatedNews, setRelatedNews] = useState<RelatedNews[]>([]);

  // init local states
  useEffect(() => {
    const key = "bookmarks";
    const list: string[] = JSON.parse(localStorage.getItem(key) || "[]");
    setIsBookmarked(list.includes(slug));

    const viewsKey = `views:${slug}`;
    const current = Number(localStorage.getItem(viewsKey) || "0") + 1;
    localStorage.setItem(viewsKey, String(current));
    setViews(current);
  }, [slug]);

  // fetch related (opsional, fallback kosong)
  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      try {
        const qs = new URLSearchParams({
          limit: "3",
          exclude: slug,
          category: categoryForBadge,
        }).toString();
        const res = await fetch(`/api/news?${qs}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) return;
        const items: RelatedNews[] = await res.json();
        setRelatedNews(items || []);
      } catch {
        /* ignore */
      }
    };
    run();
    return () => controller.abort();
  }, [slug, categoryForBadge]);

  const toggleBookmark = () => {
    const key = "bookmarks";
    const list: string[] = JSON.parse(localStorage.getItem(key) || "[]");
    let next = list;
    if (isBookmarked) next = list.filter((s) => s !== slug);
    else next = [...list, slug];
    localStorage.setItem(key, JSON.stringify(next));
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareData = { title, text: excerpt, url: shareUrl };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        /* user canceled */
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link artikel disalin ke clipboard");
    }
  };

  // ----- UI persis seperti layout putih yang kamu kirim -----
  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Global Navbar */}
      <NavbarDetail />
      {/* Local Header Navigation (non-sticky to avoid overlap with Navbar) */}

      {/* Article Content */}
      <article className="max-w-3xl sm:max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Article Header */}
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
            <span className="w-fit px-3 py-1 bg-[#b6252a] text-white text-xs sm:text-sm font-medium rounded-full">
              {categoryForBadge}
            </span>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-500">
              <div className="inline-flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(publishedAt) || "Tanggal tidak diketahui"}
              </div>
              <div className="inline-flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {computedReadTime}
              </div>
              <div className="inline-flex items-center gap-1">
                <User className="w-4 h-4" />
                {`Dilihat ${views}x`}
              </div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6 text-balance">
            {title}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
            {excerpt}
          </p>

          {(author?.name || editor?.name) && (
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-700">
              {author?.name && (
                <span className="inline-flex items-center gap-2">
                  <span className="relative inline-block w-7 h-7 overflow-hidden rounded-full bg-gray-200">
                    {author.photo ? (
                      <Image
                        src={urlFor(author.photo)
                          .width(80)
                          .height(80)
                          .fit("crop")
                          .url()}
                        alt={author.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="w-full h-full grid place-items-center text-[10px]">
                        {author.name.charAt(0)}
                      </span>
                    )}
                  </span>
                  Penulis: <span className="font-medium">{author.name}</span>
                </span>
              )}
              {editor?.name && (
                <span className="inline-flex items-center gap-2">
                  <span className="relative inline-block w-7 h-7 overflow-hidden rounded-full bg-gray-200">
                    {editor.photo ? (
                      <Image
                        src={urlFor(editor.photo)
                          .width(80)
                          .height(80)
                          .fit("crop")
                          .url()}
                        alt={editor.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="w-full h-full grid place-items-center text-[10px]">
                        {editor.name.charAt(0)}
                      </span>
                    )}
                  </span>
                  Editor: <span className="font-medium">{editor.name}</span>
                </span>
              )}
            </div>
          )}
        </header>

        {/* Featured Image */}
        <div className="relative w-full h-56 sm:h-72 md:h-96 mb-6 sm:mb-8 rounded-xl sm:rounded-2xl overflow-hidden">
          <Image
            src={titleImage || "/placeholder.svg"}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 768px"
            className="object-cover"
            priority
          />
        </div>

        {/* Article Body */}
        <div className="prose prose-base sm:prose-lg max-w-none mb-10 sm:mb-12 prose-p:leading-relaxed prose-h3:mt-6 prose-h3:mb-2 prose-h3:text-lg sm:prose-h3:text-2xl">
          <div className="text-gray-700 leading-relaxed">
            <PortableText
              value={(data as any).content || []}
              components={portableTextComponents as any}
            />
          </div>
        </div>

        {/* Video YouTube */}
        {youtubeEmbed && (
          <div className="mb-12">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              Video
            </h3>
            <div
              className="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-black"
              style={{ paddingTop: "56.25%" }}
            >
              <iframe
                src={youtubeEmbed}
                title={`YouTube video - ${title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                loading="lazy"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        )}

        {/* Dokumen PDF */}
        {documents.length > 0 && (
          <div className="mb-12">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              Dokumen
            </h3>
            <div className="space-y-8">
              {documents.map((doc, i) => (
                <div
                  key={`${doc.url}-${i}`}
                  className="rounded-xl border border-gray-200 overflow-hidden bg-white"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {doc.originalFilename || `Dokumen ${i + 1}`}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {doc.mimeType || "application/pdf"}
                        {typeof doc.size === "number"
                          ? ` • ${(doc.size / 1024 / 1024).toFixed(2)} MB`
                          : ""}
                      </p>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#b6252a] text-sm font-semibold hover:underline"
                    >
                      Unduh
                    </a>
                  </div>
                  <div className="w-full h-[520px] bg-gray-50">
                    {/* Try to embed the PDF; provide fallback link */}
                    <iframe
                      src={`${doc.url}#view=FitH`}
                      title={doc.originalFilename || `Dokumen ${i + 1}`}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags (pakai categories dari Sanity sebagai tag) */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((tag, i) => (
              <span
                key={`${tag}-${i}`}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded-full hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Share Buttons */}
        <div className="border-t border-gray-200 pt-6 sm:pt-8 mb-10 sm:mb-12">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            Bagikan Artikel
          </h3>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Salin Link
            </button>
            <button
              onClick={toggleBookmark}
              className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg transition-colors ${
                isBookmarked
                  ? "bg-yellow-500 text-white hover:bg-yellow-600"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
              aria-pressed={isBookmarked}
            >
              <Bookmark className="w-4 h-4" />
              {isBookmarked ? "Tersimpan" : "Simpan"}
            </button>
          </div>
        </div>
      </article>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <section className="bg-gray-50 py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              Berita Terkait
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {relatedNews.map((item) => (
                <Link key={item.id} href={`/news/${item.id}`}>
                  <article className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
                    <div className="relative h-40 sm:h-48">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width:1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                        <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[#b6252a] text-xs sm:text-sm font-medium rounded-full">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                        <Calendar className="w-4 h-4" />
                        {item.date}
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#b6252a] transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Comments & Likes Section */}
      <CommentSection slug={slug} />
    </div>
  );
}
