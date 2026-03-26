import {
  Building2,
  FileSpreadsheet,
  HandHeart,
  Handshake,
  Leaf,
  MapPinned,
  Search,
  Target,
  Users,
} from "lucide-react";

export const FEATURES = [
  {
    title: "Peta Prioritas Program CSR",
    description:
      "Menampilkan isu utama, wilayah sasaran, dan sasaran SDGs agar setiap program punya arah yang jelas sejak awal.",
    icon: Search,
    href: "#program-csr",
    accentColor: "#E5243B",
  },
  {
    title: "Portofolio Program & Aktivitas",
    description:
      "Menyusun program CSR ke dalam pilar yang mudah dipahami mitra, internal kampus, dan komunitas penerima manfaat.",
    icon: Building2,
    href: "#program-csr",
    accentColor: "#26BDE2",
  },
  {
    title: "Pelacakan Dampak & Laporan",
    description:
      "Merekam hasil pelaksanaan, capaian indikator, dan dokumentasi yang dibutuhkan untuk evaluasi serta keberlanjutan program.",
    icon: FileSpreadsheet,
    href: "#alur-csr",
    accentColor: "#4C9F38",
  },
];

export const STATS = [
  {
    number: "12",
    label: "Program Aktif",
    desc: "Inisiatif CSR yang berjalan",
    icon: HandHeart,
    color: "#E5243B",
  },
  {
    number: "4",
    label: "Pilar Utama",
    desc: "Fokus tematik program",
    icon: Target,
    color: "#26BDE2",
  },
  {
    number: "38",
    label: "Lokasi Dampak",
    desc: "Komunitas & wilayah sasaran",
    icon: MapPinned,
    color: "#4C9F38",
  },
  {
    number: "27",
    label: "Mitra Kolaborasi",
    desc: "Institusi yang terlibat",
    icon: Handshake,
    color: "#FCC30B",
  },
];

export const SDG_GOALS = [
  { n: 1, name: "Tanpa Kemiskinan", color: "#E5243B" },
  { n: 2, name: "Tanpa Kelaparan", color: "#DDA63A" },
  { n: 3, name: "Kesehatan & Sejahtera", color: "#4C9F38" },
  { n: 4, name: "Pendidikan Berkualitas", color: "#C5192D" },
  { n: 5, name: "Kesetaraan Gender", color: "#FF3A21" },
  { n: 6, name: "Air Bersih & Sanitasi", color: "#26BDE2" },
  { n: 7, name: "Energi Bersih", color: "#FCC30B" },
  { n: 8, name: "Pekerjaan Layak", color: "#A21942" },
  { n: 9, name: "Industri & Inovasi", color: "#FD6925" },
  { n: 10, name: "Kurangi Kesenjangan", color: "#DD1367" },
  { n: 11, name: "Kota Berkelanjutan", color: "#FD9D24" },
  { n: 12, name: "Konsumsi Bertanggung Jawab", color: "#BF8B2E" },
  { n: 13, name: "Penanganan Iklim", color: "#3F7E44" },
  { n: 14, name: "Ekosistem Lautan", color: "#0A97D9" },
  { n: 15, name: "Ekosistem Daratan", color: "#56C02B" },
  { n: 16, name: "Perdamaian & Keadilan", color: "#00689D" },
  { n: 17, name: "Kemitraan Global", color: "#19486A" },
];

export const SDG_TILES = SDG_GOALS.map((goal) => goal.color);

export const STEPS = [
  {
    step: "01",
    title: "Pemetaan Isu",
    body: "Tim mengidentifikasi kebutuhan lapangan, kelompok sasaran, dan target SDGs yang paling relevan.",
    icon: Search,
    color: "#E5243B",
  },
  {
    step: "02",
    title: "Desain Intervensi",
    body: "Program disusun bersama mitra dengan target capaian, skema kolaborasi, dan indikator dampak yang terukur.",
    icon: Users,
    color: "#26BDE2",
  },
  {
    step: "03",
    title: "Pelaksanaan & Evaluasi",
    body: "Implementasi, monitoring, dan pelaporan dijalankan agar program dapat tumbuh menjadi kolaborasi jangka panjang.",
    icon: Leaf,
    color: "#4C9F38",
  },
];

export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.15,
      duration: 0.7,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    },
  }),
};

export const statCard = {
  hidden: { opacity: 0, y: 40 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.8 + index * 0.12,
      duration: 0.6,
      ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
    },
  }),
};
