import { Search, Lightbulb, Rocket, Users, FlaskConical, Package } from "lucide-react";

/* ── Features ──────────────────────────────────────────── */

export const FEATURES = [
  {
    title: "Pencarian Tim Riset & Project",
    description:
      "Dosen memposting topik riset, mitra memposting permasalahan nyata, dan mahasiswa mendaftar untuk bergabung. Temukan tim yang tepat untuk project SDG kamu.",
    icon: Search,
    href: "/sdgs-hub/riset",
    accentColor: "#E5243B",
  },
  {
    title: "Katalog Produk Inovasi Kampus",
    description:
      "Jelajahi produk inovasi yang dibuat oleh dosen dan mahasiswa. Request demo atau ajukan kolaborasi untuk mengembangkan produk lebih lanjut.",
    icon: Rocket,
    href: "/sdgs-hub/inovasi",
    accentColor: "#26BDE2",
  },
  {
    title: "Ruang Ide & Aspirasi Mahasiswa",
    description:
      "Sampaikan ide untuk kampus yang lebih berkelanjutan. Vote ide terbaik dan lihat aspirasi yang mendapat dukungan terbanyak dari komunitas.",
    icon: Lightbulb,
    href: "/sdgs-hub/ide",
    accentColor: "#4C9F38",
  },
];

/* ── Stats ──────────────────────────────────────────────── */

export const STATS = [
  { number: "24",   label: "Project Aktif",   desc: "Riset & kolaborasi",  icon: FlaskConical, color: "#E5243B" },
  { number: "150+", label: "Mahasiswa",        desc: "Tergabung di tim",    icon: Users,        color: "#26BDE2" },
  { number: "12",   label: "Produk Inovasi",  desc: "Telah dikembangkan",  icon: Package,      color: "#4C9F38" },
  { number: "89",   label: "Ide Masuk",        desc: "Dari mahasiswa",      icon: Lightbulb,    color: "#FCC30B" },
];

/* ── SDG Goals ──────────────────────────────────────────── */

export const SDG_GOALS = [
  { n: 1,  name: "Tanpa Kemiskinan",           color: "#E5243B" },
  { n: 2,  name: "Tanpa Kelaparan",             color: "#DDA63A" },
  { n: 3,  name: "Kesehatan & Sejahtera",       color: "#4C9F38" },
  { n: 4,  name: "Pendidikan Berkualitas",      color: "#C5192D" },
  { n: 5,  name: "Kesetaraan Gender",           color: "#FF3A21" },
  { n: 6,  name: "Air Bersih & Sanitasi",       color: "#26BDE2" },
  { n: 7,  name: "Energi Bersih",               color: "#FCC30B" },
  { n: 8,  name: "Pekerjaan Layak",             color: "#A21942" },
  { n: 9,  name: "Industri & Inovasi",          color: "#FD6925" },
  { n: 10, name: "Kurangi Kesenjangan",         color: "#DD1367" },
  { n: 11, name: "Kota Berkelanjutan",          color: "#FD9D24" },
  { n: 12, name: "Konsumsi Bertanggung Jawab",  color: "#BF8B2E" },
  { n: 13, name: "Penanganan Iklim",            color: "#3F7E44" },
  { n: 14, name: "Ekosistem Lautan",            color: "#0A97D9" },
  { n: 15, name: "Ekosistem Daratan",           color: "#56C02B" },
  { n: 16, name: "Perdamaian & Keadilan",       color: "#00689D" },
  { n: 17, name: "Kemitraan Global",            color: "#19486A" },
];

export const SDG_TILES = SDG_GOALS.map((g) => g.color);

/* ── How it works steps ─────────────────────────────────── */

export const STEPS = [
  {
    step: "01",
    title: "Temukan & Pilih",
    body: "Browse project riset, ide terpopuler, atau produk inovasi kampus yang sesuai dengan minat dan bidang studimu.",
    icon: Search,
    color: "#E5243B",
  },
  {
    step: "02",
    title: "Bergabung & Berkontribusi",
    body: "Daftarkan diri ke tim riset, kirim ide aspirasi, atau ajukan kolaborasi pengembangan produk inovasi.",
    icon: Users,
    color: "#26BDE2",
  },
  {
    step: "03",
    title: "Ciptakan Dampak Nyata",
    body: "Hasil kolaborasimu mendorong agenda SDGs Center dan memberikan dampak nyata bagi kampus dan masyarakat.",
    icon: Rocket,
    color: "#4C9F38",
  },
];

/* ── Framer Motion variants ─────────────────────────────── */

export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    },
  }),
};

export const statCard = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.8 + i * 0.12,
      duration: 0.6,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    },
  }),
};
