/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { client } from "@/lib/sanity";

export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const q = (searchParams.get("q") || "").trim();

    if (!q || q.length < 2) {
      return new Response(JSON.stringify({ query: q, results: [] }), {
        headers: { "content-type": "application/json" },
      });
    }

    // Build individual match terms with wildcards for each word
    const terms = q
      .replace(/["']/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => `${w}*`);

    const query = `{
      "blogs": *[_type == "blog" && (
        title match $terms || smallDescription match $terms
      )] | order(publishedAt desc)[0...10]{
        _id,
        _type,
        title,
        "currentSlug": slug.current,
        titleImage,
        smallDescription,
        publishedAt
      },
      "products": *[_type == "products" && (
        title match $terms || smallDescription match $terms || categories match $terms || count(tags[@ match $terms]) > 0
      )] | order(publishedAt desc)[0...10]{
        _id,
        _type,
        title,
        "currentSlug": slug.current,
        titleImage,
        smallDescription,
        publishedAt,
        categories,
        tags,
        sdgTags
      }
    }`;

    const data = await client.fetch(query, { terms });

    const results = [
      ...(Array.isArray(data?.blogs)
        ? data.blogs.map((b: any) => ({
            id: b._id,
            kind: "blog" as const,
            title: b.title,
            currentSlug: b.currentSlug,
            excerpt: b.smallDescription,
            image: b.titleImage,
            publishedAt: b.publishedAt,
            href: `/news/${b.currentSlug}`,
          }))
        : []),
      ...(Array.isArray(data?.products)
        ? data.products.map((p: any) => ({
            id: p._id,
            kind: "product" as const,
            title: p.title,
            currentSlug: p.currentSlug,
            excerpt: p.smallDescription,
            image: p.titleImage,
            publishedAt: p.publishedAt,
            href: `/program/${p.currentSlug}`,
            categories: p.categories,
            tags: p.tags,
            sdgTags: p.sdgTags,
          }))
        : []),
    ];

    return new Response(JSON.stringify({ query: q, results }), {
      headers: { "content-type": "application/json" },
    });
  } catch (e: any) {
    console.error("Search error:", e);
    return new Response(
      JSON.stringify({ error: e?.message || "Search failed" }),
      { status: 500 },
    );
  }
}
