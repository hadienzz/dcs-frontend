/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import { geoMercator, geoPath, type GeoProjection } from "d3-geo";
import * as topojson from "topojson-client";
import {
  MapPin,
  Calendar,
  Users,
  ExternalLink,
  Plus,
  Minus,
  Globe2,
  Hand,
  MoveUpRight,
  Radar,
  ScanSearch,
  type LucideIcon,
} from "lucide-react";
import countries110m from "world-atlas/countries-110m.json" assert { type: "json" };
import { LOCATION_COORDS } from "../../../lib/locations";

const PRIMARY = "#b80032";
// Batas zoom diperbesar agar bisa melihat titik yang rapat dengan jelas
const MIN_ZOOM = 0.7;
const MAX_ZOOM = 20; // sebelumnya 8 (memungkinkan zoom jauh lebih dekat)

/** ================== DATA PROYEK / INISIATIF ==================
 * Data disusun dari daftar yang diberikan user.
 * Setiap inisiatif memiliki banyak lokasi → kita flatten menjadi marker per lokasi.
 */
export type Project = {
  id: number;
  city: string; // nama lokasi
  coords: [number, number];
  title: string; // nama inisiatif
  description: string;
  date: string; // tahun / rentang
  beneficiaries: string;
  peopleHelped?: number; // jumlah masyarakat terbantu per proyek (bukan per lokasi)
  status: "Completed" | "Ongoing"; // heuristik sederhana
  image?: string;
  slug: string; // slug unik
  sdgs?: number[];
};

// LOCATION_COORDS now imported from shared module

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface Initiative {
  name: string;
  years: number[];
  sdgs: number[];
  locations: string[];
  description: string;
}

const initiatives: Initiative[] = [
  {
    name: "Carbon (Pengukuran Emisi)",
    years: [2024, 2025],
    sdgs: [13, 14, 15],
    locations: [
      "Telkom University Bandung",
      "Cirebon",
      "Semarang",
      "Kuningan",
      "Kab. Garut",
      "Banten",
      "Bantaeng",
      "Bone",
      "Malang",
      "Karanganyar",
      "Purbalingga",
      "Kab. Bandung",
      "Kab. Cianjur",
      "Kab. Sukabumi",
      "Kab. Majalengka",
      "Yogyakarta",
      "Gunung Kidul",
      "Gowa",
      "Bali",
    ],
    description: "Kegiatan pengukuran dan pemantauan karbon lintas daerah.",
  },
  {
    name: "SAB (Monitoring Sanitasi Air Bersih)",
    years: [2025],
    sdgs: [6],
    locations: [
      "Kab. Serang",
      "Kab. Pandeglang",
      "Kab. Karawang",
      "Pati",
      "Kab. Bandung",
      "Kab. Garut",
      "Kab. Purwakarta",
      "Pekalongan",
      "Kab. Blora",
      "Kab. Magelang",
      "Kab. Bantul",
      "Kab. Klaten",
      "Purbalingga",
      "Kab. Banjarnegara",
      "Kab. Purworejo",
      "Kab. Cianjur",
      "Kab. Sukabumi",
    ],
    description:
      "Sistem monitoring sanitasi & air bersih di berbagai kabupaten.",
  },
  {
    name: "SIMONA (Monitoring Aquaponik)",
    years: [2024],
    sdgs: [2, 8],
    locations: ["Cipadung Kidul"],
    description: "Sistem monitoring aquaponik terintegrasi.",
  },
  {
    name: "REDOOCEIT (Pengelolaan Sampah Organik)",
    years: [2024, 2025],
    sdgs: [12, 13],
    locations: ["Antapani Bandung"],
    description: "Pengolahan sampah organik menjadi energi/nutrisi.",
  },
  {
    name: "SORGUMOLOGY (Produk Sorgum)",
    years: [2024, 2025],
    sdgs: [2, 8, 13],
    locations: ["Kab. Bandung"],
    description: "Inovasi produk turunan tanaman sorgum.",
  },
  {
    name: "Pelatihan Digital Marketing Nelayan",
    years: [2025],
    sdgs: [8],
    locations: ["Karawang"],
    description: "Pemberdayaan istri nelayan melalui pemasaran digital.",
  },
  {
    name: "Blue Carbon Mangrove (DKP)",
    years: [2025],
    sdgs: [13, 14],
    locations: [
      "Karawang",
      "Kab. Sukabumi",
      "Kab Indramayu",
      "Pangandaran",
      "Cirebon",
    ],
    description: "Penyediaan data spasial blue carbon mangrove.",
  },
  {
    name: "Telyurator (Waste Incinerator)",
    years: [2023, 2025],
    sdgs: [9, 13],
    locations: ["Tarumajaya", "Telyu Bandung"],
    description: "Pengelolaan limbah berbasis insinerator.",
  },
  {
    name: "PYROSIA (Pirolisis Waste Management)",
    years: [2025],
    sdgs: [9, 13],
    locations: ["Kepulauan Seribu", "Bantul"],
    description: "Manajemen limbah dengan teknologi pirolisis.",
  },
  {
    name: "IAQMS (Indoor Air Quality)",
    years: [2025],
    sdgs: [9, 13],
    locations: ["Jakarta", "Surabaya"],
    description: "Monitoring kualitas udara dalam ruang.",
  },
  {
    name: "Desa UMKM Digital",
    years: [2024],
    sdgs: [8, 13],
    locations: ["Pangalengan"],
    description: "Transformasi digital UMKM desa.",
  },
  {
    name: "Hydroponic (Teluphoenix)",
    years: [2023],
    sdgs: [8, 2],
    locations: ["Tarumajaya"],
    description: "Pengembangan hidroponik terintegrasi.",
  },
  {
    name: "Program SDN 16 Temajuk Sambas",
    years: [2024],
    sdgs: [4],
    locations: ["Pontianak (Kalimantan Barat)"],
    description: "Bantuan fasilitas dan edukasi sekolah perbatasan.",
  },
];

// Flatten fallback initiatives → Project[] (used if Sanity API fails)
const fallbackProjects: Project[] = initiatives.flatMap((init, idx) => {
  return init.locations
    .map((loc, i) => {
      const coords = LOCATION_COORDS[loc];
      if (!coords) return null; // skip unknown
      const years =
        init.years.length === 1
          ? `${init.years[0]}`
          : `${init.years[0]}–${init.years[init.years.length - 1]}`;
      return {
        id: idx * 1000 + i,
        city: loc,
        coords,
        title: init.name,
        description: init.description,
        date: years,
        beneficiaries: "-",
        peopleHelped: 0,
        status:
          init.years[init.years.length - 1] < new Date().getFullYear()
            ? "Completed"
            : "Ongoing",
        slug: slugify(`${init.name}-${loc}`),
        sdgs: init.sdgs,
      } as Project;
    })
    .filter(Boolean) as Project[];
});

// Warna dasar sederhana per SDG (placeholder – bisa diganti palette resmi)
const SDG_COLORS: Record<number, string> = {
  1: "#e5243b",
  2: "#dda63a",
  3: "#4c9f38",
  4: "#c5192d",
  5: "#ff3a21",
  6: "#26bde2",
  7: "#fcc30b",
  8: "#a21942",
  9: "#fd6925",
  10: "#dd1367",
  11: "#fd9d24",
  12: "#bf8b2e",
  13: "#3f7e44",
  14: "#0a97d9",
  15: "#56c02b",
  16: "#00689d",
  17: "#19486a",
};

type FeatureCollection = GeoJSON.FeatureCollection<GeoJSON.Geometry>;
type Feature = GeoJSON.Feature<GeoJSON.Geometry, any>;

type PopoverState = { project: Project; x: number; y: number };

export default function IndonesiaMap() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [selected, setSelected] = useState<Project | null>(null); // opsional modal besar
  const [popover, setPopover] = useState<PopoverState | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [mounted, setMounted] = useState(false);
  // Simpan proyeksi terbaru dalam ref agar gesture effect tidak perlu depend on projection
  const projectionRef = useRef<GeoProjection | null>(null);

  // Geo features (Indonesia)
  const [fc, setFc] = useState<FeatureCollection | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // zoom/pan
  // Mulai dengan zoom lebih besar supaya user langsung lihat detail dan bisa drag.
  const [zoom, setZoom] = useState(1.6);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // ukur responsif —> tinggi lebih besar di HP, proporsional di desktop
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      const isSmall = r.width < 768;
      // Tinggi = clamp(360px, rasio 0.85 * width (HP) / 0.62 (desktop), 80vh)
      const ideal = isSmall ? r.width * 0.85 : r.width * 0.62;
      const h = Math.min(
        Math.max(ideal, 360),
        Math.floor(window.innerHeight * 0.8)
      );
      setSize({ w: r.width, h });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Ensure portal only renders on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch projects from Sanity API and fallback to local if it fails
  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const res = await fetch("/api/projects", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load projects");
        const json = (await res.json()) as { projects?: Project[] };
        if (!aborted && Array.isArray(json.projects) && json.projects.length) {
          setProjects(json.projects);
        }
      } catch {
        if (!aborted) {
          setProjects(fallbackProjects);
        }
      }
    })();
    return () => {
      aborted = true;
    };
  }, []);

  // Ambil Indonesia dari world-atlas (tahan-banting)
  useEffect(() => {
    try {
      const topo: any = countries110m;
      const objects = topo.objects || {};
      const countriesObj =
        objects.countries ||
        objects.ne_110m_admin_0_countries ||
        objects.admin0 ||
        objects.world ||
        Object.values(objects)[0];
      if (!countriesObj)
        throw new Error("Objek countries tidak ditemukan di world-atlas.");

      const all = topojson.feature(
        topo,
        countriesObj
      ) as unknown as FeatureCollection;
      const idnFeature =
        (all.features.find((f: any) => f.id === 360 || f.id === "360") as
          | Feature
          | undefined) ||
        (all.features.find((f: any) => f.properties?.name === "Indonesia") as
          | Feature
          | undefined);

      if (!idnFeature) {
        setFc(all);
        setLoadError(
          "Indonesia tidak ditemukan, menampilkan seluruh dunia (sementara)."
        );
        return;
      }
      setFc({ type: "FeatureCollection", features: [idnFeature] });
      setLoadError(null);
    } catch (e: any) {
      setLoadError(e?.message || "Gagal memuat peta dari world-atlas.");
    }
  }, []);

  // proyeksi Mercator fokus Indonesia → dibesarkan
  const projection: GeoProjection | null = useMemo(() => {
    if (!size.w || !size.h) return null;
    // Scale lebih besar: 1.6 + booster HP
    const smallBoost = size.w < 768 ? 1.15 : 1;
    return geoMercator()
      .center([120, -2])
      .translate([size.w / 2 + offset.x, size.h / 2 + offset.y])
      .scale(Math.min(size.w, size.h) * 1.8 * smallBoost * zoom);
  }, [size, zoom, offset]);

  const path = useMemo(
    () => (projection ? geoPath(projection) : null),
    [projection]
  );

  useEffect(() => {
    projectionRef.current = projection;
  }, [projection]);

  // drag / pinch pan & zoom + double-tap
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    // Single pointer drag
    let dragging = false;
    let lx = 0,
      ly = 0;

    // Multi-touch pinch state
    interface TouchState {
      id: number;
      x: number;
      y: number;
    }
    const active: Map<number, TouchState> = new Map();
    let initialDist = 0;
    let initialZoom = 1;
    let pinchMid = { x: 0, y: 0 };
    let initialOffset = { x: 0, y: 0 };

    function distance(a: TouchState, b: TouchState) {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      return Math.hypot(dx, dy);
    }

    function midpoint(a: TouchState, b: TouchState) {
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    }

    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("button,a,[role='button']")) return;
      // register pointer
      active.set(e.pointerId, { id: e.pointerId, x: e.clientX, y: e.clientY });

      if (active.size === 1) {
        // Single finger drag init
        dragging = true;
        lx = e.clientX;
        ly = e.clientY;
        (e.currentTarget as Element)?.setPointerCapture?.(e.pointerId);
      } else if (active.size === 2) {
        // Pinch start
        dragging = false; // disable single drag when multi-touch
        const pts = Array.from(active.values());
        initialDist = distance(pts[0], pts[1]);
        initialZoom = zoom;
        pinchMid = midpoint(pts[0], pts[1]);
        initialOffset = { ...offset };
      }
    };
    const onMove = (e: PointerEvent) => {
      if (!active.has(e.pointerId)) return;
      const state = active.get(e.pointerId)!;
      state.x = e.clientX;
      state.y = e.clientY;

      if (active.size === 1 && dragging) {
        setOffset((o) => ({
          x: o.x + (e.clientX - lx),
          y: o.y + (e.clientY - ly),
        }));
        lx = e.clientX;
        ly = e.clientY;
      } else if (active.size === 2) {
        const pts = Array.from(active.values());
        const dist = distance(pts[0], pts[1]);
        if (initialDist > 0) {
          // Hitung zoom baru (pakai batas baru MIN_ZOOM - MAX_ZOOM)
          const scaleFactor = dist / initialDist;
          let newZoom = initialZoom * scaleFactor;
          newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));

          // Midpoint for panning relative to initial pinch midpoint
          const mid = midpoint(pts[0], pts[1]);
          const dx = mid.x - pinchMid.x;
          const dy = mid.y - pinchMid.y;

          setZoom(newZoom);
          // Adjust offset so content appears to zoom around midpoint
          setOffset({
            x: initialOffset.x + dx,
            y: initialOffset.y + dy,
          });
        }
      }
    };
    const onUp = (e: PointerEvent) => {
      active.delete(e.pointerId);
      if (active.size < 2) {
        initialDist = 0;
      }
      if (active.size === 0) {
        dragging = false;
      }
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("pointerleave", onUp);

    // Double tap detection (touch / pointer) for zoom in
    let lastTap = 0;
    const doubleTapThreshold = 300; // ms
    const onClickLike = (e: PointerEvent) => {
      const now = Date.now();
      if (now - lastTap < doubleTapThreshold) {
        // Double tap -> zoom in focusing around tap position
        setZoom((prev) => {
          // Double tap scaling: lebih besar saat masih kecil, mengecil bertahap
          const factor = prev < 2 ? 2 : prev < 4 ? 1.6 : 1.35;
          const newZ = Math.min(
            MAX_ZOOM,
            Math.round(prev * factor * 100) / 100
          );
          const proj = projectionRef.current;
          if (!proj || newZ === prev) return prev;
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const tapX = e.clientX;
          const tapY = e.clientY;
          const dx = tapX - cx;
          const dy = tapY - cy;
          const zoomDeltaFactor = newZ / prev - 1;
          setOffset((o) => ({
            x: o.x - dx * zoomDeltaFactor,
            y: o.y - dy * zoomDeltaFactor,
          }));
          return newZ;
        });
      }
      lastTap = now;
    };
    el.addEventListener("pointerup", onClickLike);

    // Wheel / Trackpad: pinch zoom (ctrlKey) atau pan (tanpa ctrl)
    const onWheel = (e: WheelEvent) => {
      if (!el) return;
      e.preventDefault();
      // pinch zoom (Mac trackpad) biasanya ctrlKey = true atau deltaZ tersedia
      const isZoomGesture = e.ctrlKey || e.metaKey;
      if (isZoomGesture) {
        setZoom((prev) => {
          const factor = 1 - e.deltaY * 0.002; // smoothing
          let newZ = prev * factor;
          newZ = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZ));
          // Fokus di posisi pointer
          if (newZ !== prev) {
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const zoomFactor = newZ / prev - 1;
            setOffset((o) => ({
              x: o.x - dx * zoomFactor,
              y: o.y - dy * zoomFactor,
            }));
          }
          return newZ;
        });
      } else {
        // Pan dengan scroll (dua jari) – skala agar tidak terlalu cepat
        setOffset((o) => ({
          x: o.x - e.deltaX * 0.7,
          y: o.y - e.deltaY * 0.7,
        }));
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("pointerleave", onUp);
      el.removeEventListener("pointerup", onClickLike);
      el.removeEventListener("wheel", onWheel as any);
    };
    // Tidak memasukkan projection agar panjang deps stabil; gunakan projectionRef
  }, [zoom, offset]);

  // Tutup popover dengan ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPopover(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const summary = useMemo(() => {
    const initiativesSet = new Set<string>();
    const citySet = new Set<string>();
    const sdgSet = new Set<number>();
    const peopleByProject = new Map<string, number>();

    for (const project of projects) {
      const initiativeKey = project.slug || `${project.title}-${project.city}`;
      initiativesSet.add(initiativeKey);

      const city = project.city?.trim();
      if (city) citySet.add(city);

      for (const sdg of project.sdgs || []) {
        if (Number.isFinite(sdg)) sdgSet.add(sdg);
      }

      if (!peopleByProject.has(initiativeKey)) {
        peopleByProject.set(
          initiativeKey,
          typeof project.peopleHelped === "number" ? project.peopleHelped : 0
        );
      }
    }

    let peopleHelped = 0;
    for (const value of peopleByProject.values()) {
      peopleHelped += value;
    }

    return {
      initiatives: initiativesSet.size,
      locations: projects.length,
      cities: citySet.size,
      sdgs: sdgSet.size,
      peopleHelped,
      peopleHelpedFormatted: new Intl.NumberFormat("id-ID").format(
        peopleHelped
      ),
    };
  }, [projects]);

  const legendSdgs = useMemo(
    () =>
      Array.from(new Set(projects.flatMap((project) => project.sdgs || [])))
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value))
        .sort((a, b) => a - b),
    [projects]
  );

  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-24" id="map">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(148,163,184,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.16)_1px,transparent_1px)] [background-size:46px_46px]" />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-14 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(184,0,50,0.09),transparent_62%)] blur-3xl" />
      <div className="pointer-events-none absolute -left-16 top-1/3 h-72 w-72 rounded-full bg-slate-200/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-zinc-100 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto mb-12 max-w-5xl text-center md:mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#b80032] shadow-[0_14px_30px_rgba(15,23,42,0.06)]">
            <Globe2 className="h-3.5 w-3.5" />
            Jangkauan Nasional
          </span>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-zinc-950 md:text-5xl">
            Proyek <span className="text-[#b80032]">DCS</span> di Seluruh
            Indonesia
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-pretty text-base leading-7 text-zinc-600 md:text-lg">
            Jelajahi persebaran inisiatif Digital Collaboration for Sustainability
            di berbagai wilayah. Geser peta, perbesar area tertentu, lalu buka
            setiap marker untuk melihat proyek dan dampaknya.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white/90 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm">
              {summary.initiatives}+ inisiatif terpetakan
            </span>
            <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white/90 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm">
              {summary.cities}+ kota dan kabupaten
            </span>
            <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white/90 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm">
              {summary.sdgs} fokus SDGs aktif
            </span>
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div
            ref={wrapRef}
            className="relative overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white/90 p-4 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur-sm md:p-6 lg:p-8"
            onClick={() => setPopover(null)}
          >
            <div className="mb-6 flex flex-col gap-5 border-b border-zinc-100 pb-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                  <Radar className="h-3.5 w-3.5" />
                  Peta Interaktif
                </span>
                <p className="mt-3 text-sm leading-6 text-zinc-600 md:text-[15px]">
                  Warna marker mengikuti fokus SDG utama dari tiap inisiatif.
                  Klik pada desktop atau tap di mobile untuk membuka ringkasan
                  proyek dan halaman detailnya.
                </p>
              </div>
              <div className="grid gap-2 md:grid-cols-3">
                <MapMiniHint
                  icon={Hand}
                  title="Geser peta"
                  description="Pan menggunakan drag, swipe, atau tombol arah."
                />
                <MapMiniHint
                  icon={ScanSearch}
                  title="Perbesar area"
                  description="Pinch, double tap, atau tombol zoom untuk detail."
                />
                <MapMiniHint
                  icon={Globe2}
                  title="Buka konteks"
                  description="Setiap marker menampilkan ringkasan proyek di wilayah itu."
                />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[1.75rem] border border-zinc-100 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(241,245,249,0.92))] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] md:p-3">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(184,0,50,0.06),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.05),transparent_36%)]" />

              <div className="absolute right-4 top-4 z-10 flex flex-col gap-2 md:right-6 md:top-6">
                <button
                  onClick={() =>
                    setZoom((z) =>
                      Math.min(MAX_ZOOM, Math.round((z + 0.35) * 100) / 100)
                    )
                  }
                  title="Zoom in"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white/95 text-zinc-700 shadow-[0_18px_30px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5 hover:border-[#b80032]/30 hover:text-[#b80032] md:h-10 md:w-10"
                >
                  <Plus size={18} />
                </button>
                <button
                  onClick={() =>
                    setZoom((z) =>
                      Math.max(MIN_ZOOM, Math.round((z - 0.35) * 100) / 100)
                    )
                  }
                  title="Zoom out"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white/95 text-zinc-700 shadow-[0_18px_30px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5 hover:border-[#b80032]/30 hover:text-[#b80032] md:h-10 md:w-10"
                >
                  <Minus size={18} />
                </button>
                <button
                  onClick={() => {
                    setZoom(1);
                    setOffset({ x: 0, y: 0 });
                  }}
                  title="Reset view"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white/95 text-[11px] font-semibold tracking-[0.16em] text-zinc-700 shadow-[0_18px_30px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5 hover:border-[#b80032]/30 hover:text-[#b80032] md:h-10 md:w-10"
                >
                  R
                </button>
              </div>

              <div className="pointer-events-none absolute left-4 top-4 z-10 md:left-6 md:top-6">
                <div className="grid grid-cols-3 gap-1.5 pointer-events-auto">
                  <div />
                  <button
                    aria-label="Geser atas"
                    onClick={() => setOffset((o) => ({ ...o, y: o.y + 60 }))}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/80 bg-white/95 text-xs font-medium text-zinc-700 shadow-[0_14px_24px_rgba(15,23,42,0.1)] transition hover:-translate-y-0.5 hover:border-[#b80032]/30 hover:text-[#b80032]"
                  >
                    ^
                  </button>
                  <div />
                  <button
                    aria-label="Geser kiri"
                    onClick={() => setOffset((o) => ({ ...o, x: o.x + 60 }))}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/80 bg-white/95 text-xs font-medium text-zinc-700 shadow-[0_14px_24px_rgba(15,23,42,0.1)] transition hover:-translate-y-0.5 hover:border-[#b80032]/30 hover:text-[#b80032]"
                  >
                    {"<"}
                  </button>
                  <button
                    aria-label="Geser tengah"
                    onClick={() => setOffset({ x: 0, y: 0 })}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/80 bg-white/95 text-[10px] font-semibold text-zinc-700 shadow-[0_14px_24px_rgba(15,23,42,0.1)] transition hover:-translate-y-0.5 hover:border-[#b80032]/30 hover:text-[#b80032]"
                  >
                    +
                  </button>
                  <button
                    aria-label="Geser kanan"
                    onClick={() => setOffset((o) => ({ ...o, x: o.x - 60 }))}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/80 bg-white/95 text-xs font-medium text-zinc-700 shadow-[0_14px_24px_rgba(15,23,42,0.1)] transition hover:-translate-y-0.5 hover:border-[#b80032]/30 hover:text-[#b80032]"
                  >
                    {">"}
                  </button>
                  <div />
                  <button
                    aria-label="Geser bawah"
                    onClick={() => setOffset((o) => ({ ...o, y: o.y - 60 }))}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/80 bg-white/95 text-xs font-medium text-zinc-700 shadow-[0_14px_24px_rgba(15,23,42,0.1)] transition hover:-translate-y-0.5 hover:border-[#b80032]/30 hover:text-[#b80032]"
                  >
                    v
                  </button>
                  <div />
                </div>
              </div>

              <div className="relative w-full overflow-hidden rounded-[1.4rem]">
                <svg
                  width={size.w}
                  height={size.h}
                  className="h-full w-full"
                  role="img"
                  aria-label="Peta Indonesia"
                >
                  {fc && path ? (
                    <g>
                      {fc.features.map((feat, i) => (
                        <path
                          key={i}
                          d={path(feat) || ""}
                          fill="#eef2f7"
                          stroke="#cbd5e1"
                          strokeWidth={0.8}
                          className="transition-colors hover:fill-[#e2e8f0]"
                        />
                      ))}
                    </g>
                  ) : loadError ? (
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      className="fill-gray-500 text-sm"
                    >
                      {loadError}
                    </text>
                  ) : (
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      className="fill-gray-400 text-sm"
                    >
                      Memuat peta...
                    </text>
                  )}

                  {projection &&
                    projects.map((p: Project) => {
                      const pt = projection(p.coords);
                      if (!pt) return null;
                      const [x, y] = pt;
                      const mainSDG = p.sdgs?.[0];
                      const markerColor = mainSDG
                        ? SDG_COLORS[mainSDG] || PRIMARY
                        : PRIMARY;
                      return (
                        <g
                          key={p.id}
                          transform={`translate(${x},${y})`}
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (size.w < 768) {
                              setSelected(p);
                            } else {
                              setPopover({ project: p, x, y });
                            }
                          }}
                          aria-label={p.title}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              if (size.w < 768) {
                                setSelected(p);
                              } else {
                                setPopover({ project: p, x, y });
                              }
                            }
                          }}
                        >
                          <circle r={12} fill={markerColor} opacity={0.12} />
                          <circle
                            r={7.5}
                            fill="#ffffff"
                            stroke={markerColor}
                            strokeWidth={2}
                          />
                          <circle r={3.4} fill={markerColor} />
                        </g>
                      );
                    })}
                </svg>

                {popover && (
                  <PopoverCard
                    containerW={size.w}
                    containerH={size.h}
                    x={popover.x}
                    y={popover.y}
                    project={popover.project}
                    onClose={() => setPopover(null)}
                    primary={PRIMARY}
                  />
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-4 border-t border-zinc-100 pt-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-600">
                  Marker mengikuti SDG utama proyek
                </span>
                <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-600">
                  Desktop: klik marker untuk ringkasan cepat
                </span>
                <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-600">
                  Mobile: tap marker untuk modal detail
                </span>
              </div>
              <Link
                href="/program"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 shadow-[0_16px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-[#b80032]/30 hover:text-[#b80032]"
              >
                Lihat seluruh program
                <MoveUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {mounted &&
            selected &&
            createPortal(
              <div
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                onClick={() => setSelected(null)}
                role="dialog"
                aria-modal="true"
              >
                <div
                  className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-zinc-200/80 bg-white shadow-[0_40px_120px_rgba(15,23,42,0.35)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative h-56 overflow-hidden border-b border-zinc-100 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(244,244,245,0.94))] md:h-72">
                    <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] [background-size:28px_28px]" />
                    <Image
                      src={selected.image || "/placeholder.svg"}
                      alt={selected.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 768px"
                      className="object-cover"
                      priority={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
                    <span
                      className={`absolute left-5 top-5 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-white ${
                        selected.status === "Completed"
                          ? "bg-green-600"
                          : "bg-blue-600"
                      }`}
                    >
                      {selected.status}
                    </span>
                    <button
                      onClick={() => setSelected(null)}
                      className="absolute right-5 top-5 rounded-full bg-white/92 p-2 text-zinc-900 shadow-lg transition hover:bg-white"
                      aria-label="Tutup"
                      type="button"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="p-6 md:p-8">
                    <div className="mb-3 flex items-center gap-2 md:mb-4">
                      <MapPin className="h-5 w-5 text-[#b80032]" />
                      <span className="font-semibold text-[#b80032]">
                        {selected.city}
                      </span>
                    </div>
                    {selected.sdgs?.length && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {selected.sdgs.map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-white shadow"
                            style={{ backgroundColor: SDG_COLORS[s] || "#555" }}
                          >
                            SDG {s}
                          </span>
                        ))}
                      </div>
                    )}
                    <h3 className="mb-3 text-xl font-semibold tracking-tight text-zinc-950 md:text-3xl">
                      {selected.title}
                    </h3>
                    <p className="mb-6 leading-7 text-zinc-600">
                      {selected.description}
                    </p>

                    <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
                      <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4">
                        <Calendar className="h-5 w-5 text-[#b80032]" />
                        <div>
                          <p className="text-sm text-zinc-500">Tahun</p>
                          <p className="font-semibold text-zinc-900">
                            {selected.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4">
                        <Users className="h-5 w-5 text-[#b80032]" />
                        <div>
                          <p className="text-sm text-zinc-500">Beneficiaries</p>
                          <p className="font-semibold text-zinc-900">
                            {selected.beneficiaries}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/program/${selected.slug}`}
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#b80032,#d31a4c)] px-4 py-3.5 text-base font-semibold text-white shadow-[0_18px_38px_rgba(184,0,50,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(184,0,50,0.34)]"
                    >
                      Lihat Detail Proyek
                      <ExternalLink className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>,
              document.body
            )}
        </div>

        <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MapMetricCard
            value={`${summary.initiatives}+`}
            label="Inisiatif Terpetakan"
            description="Jumlah program unik yang sudah divisualkan di peta nasional."
            highlight
          />
          <MapMetricCard
            value={`${summary.locations}+`}
            label="Titik Lokasi"
            description="Sebaran titik implementasi yang dapat dijelajahi langsung."
          />
          <MapMetricCard
            value={`${summary.cities}+`}
            label="Kota dan Kabupaten"
            description="Wilayah kolaborasi DCS yang sudah tersambung lintas daerah."
          />
          <MapMetricCard
            value={summary.peopleHelpedFormatted}
            label="Masyarakat Terbantu"
            description="Akumulasi penerima dampak berdasarkan data proyek yang tersedia."
          />
        </div>

        <div className="mx-auto mt-5 max-w-7xl rounded-[1.75rem] border border-zinc-200/80 bg-white/90 p-5 shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#b80032]">
                Legend SDG
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Tiap warna mewakili fokus SDG utama dari proyek yang muncul pada
                marker. Ini membantu melihat distribusi tema keberlanjutan secara
                cepat di seluruh peta.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {legendSdgs.map((num) => (
                <span
                  key={num}
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
                  style={{ backgroundColor: SDG_COLORS[num] || "#555" }}
                >
                  SDG {num}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MapMiniHint({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-w-[180px] items-start gap-3 rounded-2xl border border-zinc-200/70 bg-white px-3 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
      <div className="rounded-xl bg-[#b80032]/8 p-2 text-[#b80032]">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-semibold text-zinc-900">{title}</p>
        <p className="mt-1 text-xs leading-5 text-zinc-500">{description}</p>
      </div>
    </div>
  );
}

function MapMetricCard({
  value,
  label,
  description,
  highlight = false,
}: {
  value: string;
  label: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-[1.75rem] border p-6 shadow-[0_20px_48px_rgba(15,23,42,0.08)] ${
        highlight
          ? "border-[#b80032]/15 bg-[linear-gradient(180deg,rgba(184,0,50,0.05),rgba(255,255,255,0.96))]"
          : "border-zinc-200/80 bg-white/90"
      }`}
    >
      <div className="text-3xl font-semibold tracking-tight text-zinc-950">
        {value}
      </div>
      <p className="mt-3 text-sm font-semibold text-zinc-900">{label}</p>
      <p className="mt-1 text-sm leading-6 text-zinc-500">{description}</p>
    </div>
  );
}

/** ================== POPOVER KARTU RINGKAS ================== */
function PopoverCard({
  containerW,
  containerH,
  x,
  y,
  project,
  onClose,
  primary,
}: {
  containerW: number;
  containerH: number;
  x: number;
  y: number;
  project: Project;
  onClose: () => void;
  primary: string;
}) {
  // auto placement: kalau dekat kanan → geser kiri; dekat bawah → tampil di atas
  const side = x > containerW * 0.65 ? "left" : "right";
  const vertical = y > containerH * 0.75 ? "top" : "bottom";

  const gap = 12;
  const style: React.CSSProperties = {
    left: side === "right" ? x + gap : undefined,
    right: side === "left" ? Math.max(containerW - x + gap, 0) : undefined,
    top: vertical === "bottom" ? y + gap : undefined,
    bottom: vertical === "top" ? Math.max(containerH - y + gap, 0) : undefined,
    maxWidth: 320,
    width: "calc(100% - 24px)",
  };

  const arrowBase =
    "absolute h-3 w-3 rotate-45 bg-white border border-gray-200 shadow-sm";
  const arrowPos =
    side === "right"
      ? vertical === "bottom"
        ? "left-[-6px] top-3 border-r-0 border-t-0"
        : "left-[-6px] bottom-3 border-r-0 border-b-0"
      : vertical === "bottom"
        ? "right-[-6px] top-3 border-l-0 border-t-0"
        : "right-[-6px] bottom-3 border-l-0 border-b-0";

  return (
    <div
      className="pointer-events-auto absolute z-20"
      style={style}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="false"
      aria-label={`Info proyek ${project.title}`}
    >
      <div className="relative rounded-xl border border-gray-200 bg-white shadow-2xl">
        {/* Arrow */}
        <div className={`${arrowBase} ${arrowPos}`} />

        {/* Header mini */}
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" style={{ color: primary }} />
            <span className="text-sm font-semibold" style={{ color: primary }}>
              {project.city}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
            aria-label="Tutup"
            type="button"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body ringkas */}
        <div className="p-3">
          <h4 className="line-clamp-2 text-sm font-bold text-gray-900">
            {project.title}
          </h4>
          <p className="mt-1 line-clamp-2 text-xs text-gray-600">
            {project.description}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white ${
                project.status === "Completed" ? "bg-green-600" : "bg-blue-600"
              }`}
            >
              {project.status}
            </span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-700">{project.date}</span>
          </div>
          {project.sdgs?.length && (
            <div className="mt-3 flex flex-wrap gap-1">
              {project.sdgs.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold text-white"
                  style={{ backgroundColor: SDG_COLORS[s] || "#555" }}
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          <Link
            href={`/program/${project.slug}`}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white shadow"
            style={{ backgroundColor: primary }}
          >
            Lihat Detail
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
