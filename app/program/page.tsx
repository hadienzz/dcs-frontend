import Link from "next/link";
import { client, urlFor } from "@/lib/sanity";
import type { simpleProductCard } from "@/lib/interface";
import { NavbarDetail } from "../../components/home/custom/navbar-detail-page";

export const revalidate = 0; // disable ISR (adjust if needed)

// SDG color map (UN official palette)
const SDG_COLORS: Record<number, string> = {
  1: "#E5243B",
  2: "#DDA63A",
  3: "#4C9F38",
  4: "#C5192D",
  5: "#FF3A21",
  6: "#26BDE2",
  7: "#FCC30B",
  8: "#A21942",
  9: "#FD6925",
  10: "#DD1367",
  11: "#FD9D24",
  12: "#BF8B2E",
  13: "#3F7E44",
  14: "#0A97D9",
  15: "#56C02B",
  16: "#00689D",
  17: "#19486A",
};

function sdgNumber(tag: string): number | undefined {
  if (!tag) return undefined;
  const m = String(tag).match(/(\d{1,2})/);
  if (!m) return undefined;
  const n = Number(m[1]);
  return n >= 1 && n <= 17 ? n : undefined;
}

function sdgStyle(tag: string): React.CSSProperties {
  const num = sdgNumber(tag);
  const bg = (num && SDG_COLORS[num]) || "#6B7280"; // gray-500 fallback
  return { backgroundColor: bg, color: "#FFFFFF" };
}

async function getProducts(): Promise<simpleProductCard[]> {
  const query = `*[_type == "products"] | order(publishedAt desc){
    title,
    "currentSlug": slug.current,
    smallDescription,
    publishedAt,
    // arrays
    "tags": coalesce(tags, []),
    "sdgTags": coalesce(sdgTags, []),
    // image (store ref)
    titleImage
  }`;
  interface SanityImageAssetRef {
    _type: string;
    asset?: { _ref?: string; _type?: string };
    // allow additional props without using any
    [key: string]: unknown;
  }
  interface RawProduct {
    title?: string;
    currentSlug?: string;
    smallDescription?: string;
    publishedAt?: string;
    titleImage?: SanityImageAssetRef;
    tags?: unknown;
    sdgTags?: unknown;
  }
  const data = (await client.fetch(query)) as RawProduct[];
  return data.map((p) => {
    const tags = Array.isArray(p.tags)
      ? p.tags.filter((t): t is string => typeof t === "string")
      : [];
    const sdgTags = Array.isArray(p.sdgTags)
      ? p.sdgTags.filter((t): t is string => typeof t === "string")
      : [];
    // Build image URL if available
    let titleImageUrl = "";
    try {
      if (p.titleImage) {
        // reuse urlFor safely
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        titleImageUrl = urlFor(p.titleImage as any)
          .width(800)
          .height(600)
          .fit("crop")
          .url();
      }
    } catch {
      titleImageUrl = "";
    }
    return {
      title: p.title || "Untitled",
      currentSlug: p.currentSlug || "",
      smallDescription: p.smallDescription || "",
      publishedAt: p.publishedAt || "",
      titleImage: titleImageUrl,
      tags,
      sdgTags,
    } as simpleProductCard;
  });
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-white to-gray-50 pb-24 pt-28">
      <NavbarDetail />
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-center justify-start"></div>
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Produk <span className="text-[#b80032]">Inovasi</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 md:text-lg">
            Jelajahi kumpulan produk dan solusi yang dikembangkan untuk
            mendukung transformasi berkelanjutan.
          </p>
        </header>

        {products.length === 0 && (
          <div className="rounded-2xl border bg-white p-10 text-center shadow">
            <p className="text-gray-500">Belum ada produk tersedia.</p>
          </div>
        )}

        {products.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => {
              const imgUrl = p.titleImage || "/placeholder.svg";
              return (
                <Link
                  key={p.currentSlug}
                  href={`/program/${p.currentSlug}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-lg"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgUrl}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition" />
                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      {/* {p.sdgTags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full px-2 py-0.5 text-[10px] font-medium shadow backdrop-blur"
                          style={sdgStyle(tag)}
                        >
                          {tag}
                        </span>
                      ))} */}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="line-clamp-2 text-base font-semibold text-gray-900 group-hover:text-[#b80032]">
                      {p.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                      {p.smallDescription}
                    </p>
                    {/* SDG chips (all), colored */}
                    {p.sdgTags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {p.sdgTags.map((tag) => (
                          <span
                            key={`sdg-${p.currentSlug}-${tag}`}
                            className="rounded-md px-2 py-1 text-[11px] font-medium"
                            style={sdgStyle(tag)}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto pt-4 text-xs text-gray-400">
                      {p.publishedAt
                        ? new Date(p.publishedAt).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "TBA"}
                    </div>
                  </div>
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1.5 origin-left scale-x-0 bg-[#b80032] transition-all duration-300 group-hover:scale-x-100" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
