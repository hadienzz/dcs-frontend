/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { useMemo } from "react";
import { Calendar, Tag as TagIcon, Share2 } from "lucide-react";
import type { fullProduct } from "@/lib/interface";
import { urlFor } from "@/lib/sanity";
import { NavbarDetail } from "./navbar-detail-page";

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

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
          alt={value.alt || "Product image"}
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
  },
};

export default function ProductDetailSection({
  data,
}: {
  data: fullProduct;
  slug: string;
}) {
  const titleImage = data?.titleImage ? urlFor(data.titleImage).url() : "";
  const publishedDate = formatDate(data?.publishedAt);

  const shareUrl = useMemo(
    () => (typeof window !== "undefined" ? window.location.href : ""),
    []
  );

  const handleShare = async () => {
    const payload = {
      title: data.title,
      text: data.smallDescription,
      url: shareUrl,
    };
    if (navigator.share) {
      try {
        await navigator.share(payload);
      } catch {
        /* user canceled */
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link produk disalin ke clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <NavbarDetail />

      {/* Main */}
      <article className="mx-auto max-w-3xl px-4 py-28 sm:max-w-4xl sm:px-6 sm:py-32">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 text-xs sm:text-sm text-gray-500">
            {publishedDate && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {publishedDate}
              </span>
            )}
            {(data.tags?.length || 0) > 0 && (
              <span className="inline-flex items-center gap-1">
                <TagIcon className="w-4 h-4" />
                {data.tags.slice(0, 3).join(", ")}
                {data.tags.length > 3 ? "…" : ""}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6 text-balance">
            {data.title}
          </h1>

          {data.smallDescription && (
            <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
              {data.smallDescription}
            </p>
          )}
        </header>

        {/* Featured Image */}
        <div className="relative w-full h-56 sm:h-72 md:h-96 mb-6 sm:mb-8 rounded-xl sm:rounded-2xl overflow-hidden">
          <Image
            src={titleImage || "/placeholder.svg"}
            alt={data.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 768px"
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="prose prose-base sm:prose-lg max-w-none mb-10 sm:mb-12 prose-p:leading-relaxed prose-h3:mt-6 prose-h3:mb-2 prose-h3:text-lg sm:prose-h3:text-2xl">
          <div className="text-gray-700 leading-relaxed">
            <PortableText
              value={data.content as any}
              components={portableTextComponents as any}
            />
          </div>
        </div>

        {/* Tags */}
        {data.tags?.length || data.sdgTags?.length ? (
          <div className="flex flex-wrap gap-2 mb-8">
            {[...(data.tags || []), ...(data.sdgTags || [])].map((tag, i) => (
              <span
                key={`${tag}-${i}`}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded-full hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        {/* Share */}
        <div className="border-t border-gray-200 pt-6 sm:pt-8 mb-10 sm:mb-12">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            Bagikan Produk
          </h3>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Salin Link
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
