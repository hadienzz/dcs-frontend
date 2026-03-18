"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity";

export type SearchResult = {
  id: string;
  kind: "blog" | "product";
  title: string;
  currentSlug: string;
  excerpt?: string;
  image?: any;
  href: string;
  publishedAt?: string;
  categories?: string;
  tags?: string[];
  sdgTags?: string[];
};

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function SearchBar({
  onExpandChange,
}: {
  onExpandChange?: (expanded: boolean) => void;
}) {
  const [expanded, setExpanded] = useState(false); // desktop expand
  const [mobileOpen, setMobileOpen] = useState(false); // mobile overlay
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debounced = useDebouncedValue(query, 300);
  const qValid = debounced.trim().length >= 2;

  const fetchSearch = useCallback(async (q: string) => {
    if (!q || q.trim().length < 2) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to search");
      const json = (await res.json()) as { results?: SearchResult[] };
      setResults(Array.isArray(json.results) ? json.results : []);
    } catch (e: any) {
      setError(e?.message || "Gagal memuat hasil");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSearch(debounced);
  }, [debounced, fetchSearch]);

  const grouped = useMemo(() => {
    const blogs = results.filter((r) => r.kind === "blog");
    const products = results.filter((r) => r.kind === "product");
    return { blogs, products };
  }, [results]);

  // Notify parent of expand state changes
  useEffect(() => {
    onExpandChange?.(expanded);
  }, [expanded, onExpandChange]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExpanded(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close desktop on click outside
  useEffect(() => {
    if (!expanded) return;
    const onClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [expanded]);

  // Focus input when expanding
  useEffect(() => {
    if (expanded) setTimeout(() => inputRef.current?.focus(), 100);
  }, [expanded]);

  useEffect(() => {
    if (mobileOpen) setTimeout(() => mobileInputRef.current?.focus(), 50);
  }, [mobileOpen]);

  // Clear query on close
  useEffect(() => {
    if (!expanded && !mobileOpen) {
      setQuery("");
      setResults([]);
    }
  }, [expanded, mobileOpen]);

  const ResultItem = ({ r }: { r: SearchResult }) => (
    <Link
      href={r.href}
      onClick={() => {
        setExpanded(false);
        setMobileOpen(false);
      }}
      className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50"
    >
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-gray-100">
        {r.image ? (
          <Image
            src={urlFor(r.image).width(120).height(120).fit("crop").url()}
            alt={r.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-xs text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-gray-900">
          {r.title}
        </div>
        {r.excerpt && (
          <div className="line-clamp-1 text-xs text-gray-600">{r.excerpt}</div>
        )}
        <div className="mt-1 text-[10px] uppercase tracking-wide text-gray-400">
          {r.kind === "blog" ? "Berita" : "Produk"}
        </div>
      </div>
    </Link>
  );

  const ResultsDropdown = () => {
    if (!qValid && !loading && !error) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.15 }}
        className="absolute right-0 z-50 mt-2 w-[28rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg"
      >
        <div className="max-h-96 overflow-auto">
          {loading && (
            <div className="flex items-center gap-2 p-4 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Mencari...
            </div>
          )}
          {error && !loading && (
            <div className="p-4 text-sm text-red-600">{error}</div>
          )}
          {!loading && !error && results.length === 0 && qValid && (
            <div className="p-4 text-sm text-gray-500">Tidak ada hasil</div>
          )}
          {!loading && grouped.blogs.length > 0 && (
            <div>
              <div className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Berita
              </div>
              <div className="space-y-1 p-2">
                {grouped.blogs.map((r) => (
                  <ResultItem key={r.id} r={r} />
                ))}
              </div>
            </div>
          )}
          {!loading && grouped.products.length > 0 && (
            <div>
              <div className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Produk
              </div>
              <div className="space-y-1 p-2">
                {grouped.products.map((r) => (
                  <ResultItem key={r.id} r={r} />
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {/* Desktop: icon that expands */}
      <div ref={containerRef} className="relative hidden md:block">
        <AnimatePresence mode="wait">
          {!expanded ? (
            <motion.button
              key="search-icon"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              onClick={() => setExpanded(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
              aria-label="Cari"
            >
              <Search className="h-[18px] w-[18px]" />
            </motion.button>
          ) : (
            <motion.div
              key="search-input"
              initial={{ width: 36, opacity: 0.5 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 36, opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
              }}
              className="relative"
            >
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-foreground/40" />
              </div>
              <input
                ref={inputRef}
                type="search"
                placeholder="Cari berita & produk..."
                className="block h-9 w-full rounded-full border border-foreground/10 bg-foreground/[0.04] py-2 pl-9 pr-9 text-sm text-foreground placeholder:text-foreground/40 outline-none focus:border-foreground/20 focus:bg-white focus:ring-1 focus:ring-foreground/10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                onClick={() => setExpanded(false)}
                className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-foreground/40 hover:text-foreground/70"
                aria-label="Tutup pencarian"
              >
                <X className="h-4 w-4" />
              </button>
              <AnimatePresence>
                {(qValid || loading || error) && <ResultsDropdown />}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile: icon trigger + full overlay */}
      <button
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-foreground/[0.06] hover:text-foreground md:hidden"
        aria-label="Cari"
        onClick={() => setMobileOpen(true)}
      >
        <Search className="h-[18px] w-[18px]" />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[1000] bg-white"
          >
            <div className="flex items-center gap-2 border-b p-4">
              <button
                aria-label="Tutup"
                className="rounded-lg p-2 hover:bg-gray-100"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  ref={mobileInputRef}
                  type="search"
                  placeholder="Cari berita & produk..."
                  className="block w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm placeholder:text-gray-400 outline-none focus:border-[#b6252a] focus:ring-2 focus:ring-[#b6252a]/20"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="p-3">
              {loading && (
                <div className="flex items-center gap-2 p-4 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" /> Mencari...
                </div>
              )}
              {error && !loading && (
                <div className="p-4 text-sm text-red-600">{error}</div>
              )}
              {!loading && !error && results.length === 0 && qValid && (
                <div className="p-4 text-sm text-gray-500">Tidak ada hasil</div>
              )}
              {!loading && grouped.blogs.length > 0 && (
                <div className="mb-4">
                  <div className="px-1 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Berita
                  </div>
                  <div className="divide-y rounded-xl border border-gray-100 bg-white">
                    {grouped.blogs.map((r) => (
                      <div key={r.id} className="p-2">
                        <ResultItem r={r} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!loading && grouped.products.length > 0 && (
                <div className="mb-4">
                  <div className="px-1 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Produk
                  </div>
                  <div className="divide-y rounded-xl border border-gray-100 bg-white">
                    {grouped.products.map((r) => (
                      <div key={r.id} className="p-2">
                        <ResultItem r={r} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default SearchBar;
