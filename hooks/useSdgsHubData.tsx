"use client";

import {
  useState,
  useCallback,
  createContext,
  useContext,
  useEffect,
} from "react";
import type { ReactNode } from "react";

/* ─── Type Definitions ─── */

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  role: string;
  focus: string;
}

export interface TeamMutationResult {
  ok: boolean;
  message: string;
}

export interface HubDocument {
  name: string;
  url: string;
  mimeType?: string;
  size?: number;
  uploadedAt?: string;
}

export interface Project {
  id: string;
  slug: string;
  lecturerId: string;
  title: string;
  description: string;
  dosenName: string;
  dosenPhone: string;
  sdgCategory: string;
  teamSlots: number;
  filledSlots: number;
  status: "open" | "in-progress" | "closed";
  createdAt: string;
  tags: string[];
  heroImages: string[];
  overview: string;
  challenge: string;
  deliverables: string[];
  requirements: string[];
  commitment: string;
  timeline: string;
  location: string;
  teamMembers: ProjectMember[];
  documents?: HubDocument[];
}

export interface ProjectInput {
  lecturerId: string;
  title: string;
  description: string;
  dosenName: string;
  dosenPhone: string;
  sdgCategory: string;
  teamSlots: number;
  tags: string[];
  documents?: HubDocument[];
}

export interface InnovationDemo {
  type: "link" | "gallery";
  title: string;
  description: string;
  url?: string;
  ctaLabel?: string;
  images?: string[];
}

export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface AdminMessage {
  id: string;
  from: "admin";
  message: string;
  createdAt: string;
}

export interface Innovation {
  id: string;
  slug: string;
  title: string;
  creator: string;
  creatorEmail?: string;
  description: string;
  imageUrl: string;
  tags: string[];
  sdgCategory: string;
  createdAt?: string;
  likes?: number;
  gallery: string[];
  overview: string;
  highlights: string[];
  useCases: string[];
  collaborators: string[];
  demo?: InnovationDemo | null;
  submissionStatus?: SubmissionStatus;
  adminMessages?: AdminMessage[];
  documents?: HubDocument[];
}

export interface InnovationInput {
  title: string;
  creator: string;
  creatorEmail: string;
  description: string;
  sdgCategory: string;
  tags: string[];
  highlights: string[];
  useCases: string[];
  gallery?: string[];
  documents?: HubDocument[];
}

export interface Idea {
  id: string;
  slug: string;
  title: string;
  author: string;
  email: string;
  description: string;
  votes: number;
  sdgCategory: string;
  createdAt: string;
  hasVoted: boolean;
  gallery: string[];
  overview: string;
  potentialImpact: string;
  nextSteps: string[];
  supportNote: string;
  submissionStatus?: SubmissionStatus;
  adminMessages?: AdminMessage[];
  documents?: HubDocument[];
}

export interface IdeaInput {
  title: string;
  author: string;
  email: string;
  description: string;
  sdgCategory: string;
  overview?: string;
  potentialImpact?: string;
  nextSteps?: string[];
  supportNote?: string;
  documents?: HubDocument[];
}

/* ─── Dummy Data ─── */

const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    slug: "analisis-dampak-perubahan-iklim-pertanian-lokal",
    lecturerId: "DSN-24001",
    title: "Analisis Dampak Perubahan Iklim terhadap Pertanian Lokal",
    description:
      "Riset kolaboratif untuk menganalisis dampak perubahan iklim terhadap hasil pertanian di Jawa Barat dan mengembangkan solusi adaptasi berkelanjutan.",
    dosenName: "Dr. Ahmad Fauzi, M.T.",
    dosenPhone: "081234567890",
    sdgCategory: "SDG 13",
    teamSlots: 5,
    filledSlots: 2,
    status: "open",
    createdAt: "2026-03-01",
    tags: ["Lingkungan", "Pertanian", "Data Science"],
    heroImages: [],
    overview: "",
    challenge: "",
    deliverables: [],
    requirements: [],
    commitment: "",
    timeline: "",
    location: "",
    teamMembers: [],
  },
  {
    id: "proj-2",
    slug: "smart-water-management-system-kampus-hijau",
    lecturerId: "DSN-24002",
    title: "Smart Water Management System untuk Kampus Hijau",
    description:
      "Pengembangan sistem manajemen air pintar berbasis IoT untuk monitoring dan optimasi penggunaan air di lingkungan kampus Telkom University.",
    dosenName: "Prof. Siti Nurhaliza, Ph.D.",
    dosenPhone: "082198765432",
    sdgCategory: "SDG 6",
    teamSlots: 4,
    filledSlots: 1,
    status: "open",
    createdAt: "2026-02-20",
    tags: ["IoT", "Sustainability", "Engineering"],
    heroImages: [],
    overview: "",
    challenge: "",
    deliverables: [],
    requirements: [],
    commitment: "",
    timeline: "",
    location: "",
    teamMembers: [],
  },
  {
    id: "proj-3",
    slug: "platform-edukasi-digital-anak-pedesaan",
    lecturerId: "DSN-24003",
    title: "Platform Edukasi Digital untuk Anak Pedesaan",
    description:
      "Membangun platform edukasi berbasis mobile yang dapat diakses offline untuk mendukung pendidikan berkualitas di daerah terpencil.",
    dosenName: "Dr. Budi Santoso, M.Kom.",
    dosenPhone: "085312345678",
    sdgCategory: "SDG 4",
    teamSlots: 6,
    filledSlots: 3,
    status: "in-progress",
    createdAt: "2026-01-15",
    tags: ["Mobile Dev", "Education", "UI/UX"],
    heroImages: [],
    overview: "",
    challenge: "",
    deliverables: [],
    requirements: [],
    commitment: "",
    timeline: "",
    location: "",
    teamMembers: [],
  },
  {
    id: "proj-4",
    slug: "renewable-energy-monitoring-dashboard",
    lecturerId: "DSN-24004",
    title: "Renewable Energy Monitoring Dashboard",
    description:
      "Dashboard real-time untuk monitoring panel surya dan turbin angin mini di kampus, lengkap dengan analitik konsumsi energi.",
    dosenName: "Dr. Rina Wijaya, M.Eng.",
    dosenPhone: "087654321098",
    sdgCategory: "SDG 7",
    teamSlots: 3,
    filledSlots: 0,
    status: "open",
    createdAt: "2026-03-05",
    tags: ["Dashboard", "Energy", "Data Analytics"],
    heroImages: [],
    overview: "",
    challenge: "",
    deliverables: [],
    requirements: [],
    commitment: "",
    timeline: "",
    location: "",
    teamMembers: [],
  },
  {
    id: "proj-5",
    slug: "sistem-deteksi-kualitas-udara-machine-learning",
    lecturerId: "DSN-24005",
    title: "Sistem Deteksi Kualitas Udara Berbasis Machine Learning",
    description:
      "Pengembangan sensor dan model ML untuk mendeteksi dan memprediksi kualitas udara di sekitar kampus dan area industri Bandung.",
    dosenName: "Dr. Hendra Gunawan, M.Si.",
    dosenPhone: "081345678901",
    sdgCategory: "SDG 11",
    teamSlots: 4,
    filledSlots: 2,
    status: "open",
    createdAt: "2026-02-28",
    tags: ["Machine Learning", "IoT", "Lingkungan"],
    heroImages: [],
    overview: "",
    challenge: "",
    deliverables: [],
    requirements: [],
    commitment: "",
    timeline: "",
    location: "",
    teamMembers: [],
  },
];

const DEFAULT_PROJECT_IMAGES = [
  "https://images.unsplash.com/photo-1497436072909-60f360e1d4b?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
];

const PROJECT_DETAIL_OVERRIDES: Record<string, Partial<Project>> = {
  "proj-1": {
    heroImages: [
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80",
    ],
    overview:
      "Riset ini berfokus pada dampak perubahan iklim terhadap pola tanam, produktivitas lahan, dan strategi adaptasi pertanian lokal di Jawa Barat.",
    challenge:
      "Tim membutuhkan mahasiswa yang dapat membantu pengolahan data lapangan, analisis tren iklim, dan penyusunan rekomendasi berbasis bukti.",
    deliverables: [
      "Peta dampak iklim pada wilayah studi",
      "Analisis data hasil panen dan pola cuaca",
      "Rekomendasi adaptasi untuk petani lokal",
    ],
    requirements: [
      "Memahami dasar analisis data atau statistika",
      "Tertarik pada isu lingkungan dan pertanian",
      "Siap berkolaborasi dalam riset lapangan maupun desk study",
    ],
    commitment: "6-8 jam per minggu selama satu semester.",
    timeline: "Maret 2026 - Juli 2026",
    location: "Hybrid, dominan di Bandung dan Jawa Barat",
    teamMembers: [
      {
        id: "proj-1-m1",
        name: "Nadia Aulia",
        email: "nadia.aulia@student.telkomuniversity.ac.id",
        role: "Mahasiswa Data Analyst",
        focus: "Data iklim",
      },
      {
        id: "proj-1-m2",
        name: "Rafli Pratama",
        email: "rafli.pratama@student.telkomuniversity.ac.id",
        role: "Mahasiswa Riset Lapangan",
        focus: "Observasi pertanian",
      },
    ],
  },
  "proj-2": {
    heroImages: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
    ],
    overview:
      "Project ini mengembangkan sistem monitoring air berbasis IoT untuk membantu kampus mengelola konsumsi air secara lebih efisien dan berkelanjutan.",
    challenge:
      "Tim membutuhkan dukungan pada integrasi sensor, dashboard monitoring, serta validasi data penggunaan air di beberapa titik kampus.",
    deliverables: [
      "Prototype sensor pemantauan air",
      "Dashboard monitoring real-time",
      "Laporan efisiensi konsumsi air kampus",
    ],
    requirements: [
      "Memiliki minat pada IoT atau embedded system",
      "Terbiasa bekerja dengan data monitoring",
      "Mampu bekerja dalam tim multidisiplin",
    ],
    commitment: "5-7 jam per minggu dengan sesi koordinasi rutin.",
    timeline: "Februari 2026 - Juni 2026",
    location: "Laboratorium kampus dan hybrid meeting",
    teamMembers: [
      {
        id: "proj-2-m1",
        name: "Farel Maulana",
        email: "farel.maulana@student.telkomuniversity.ac.id",
        role: "Mahasiswa IoT Engineer",
        focus: "Sensor dan integrasi",
      },
    ],
  },
  "proj-3": {
    heroImages: [
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
    ],
    overview:
      "Project ini merancang platform edukasi digital yang tetap dapat diakses pada kondisi internet terbatas untuk mendukung pemerataan akses belajar.",
    challenge:
      "Tim sedang mengembangkan pengalaman belajar yang sederhana, ringan, dan tetap relevan bagi siswa di daerah dengan keterbatasan infrastruktur.",
    deliverables: [
      "Prototype aplikasi mobile berbasis offline-first",
      "Alur pembelajaran yang inklusif",
      "Dokumentasi uji coba pengguna awal",
    ],
    requirements: [
      "Memiliki minat pada UI/UX atau mobile development",
      "Tertarik pada isu pendidikan dan inklusi digital",
      "Mampu bekerja iteratif dengan feedback pengguna",
    ],
    commitment: "8 jam per minggu selama fase pengembangan aktif.",
    timeline: "Januari 2026 - Agustus 2026",
    location: "Hybrid dengan koordinasi mingguan",
    teamMembers: [
      {
        id: "proj-3-m1",
        name: "Ayu Maharani",
        email: "ayu.maharani@student.telkomuniversity.ac.id",
        role: "Product Designer",
        focus: "User flow",
      },
      {
        id: "proj-3-m2",
        name: "Gilang Permana",
        email: "gilang.permana@student.telkomuniversity.ac.id",
        role: "Mobile Developer",
        focus: "Frontend aplikasi",
      },
      {
        id: "proj-3-m3",
        name: "Salma Khairunnisa",
        email: "salma.khairunnisa@student.telkomuniversity.ac.id",
        role: "Content Researcher",
        focus: "Materi pembelajaran",
      },
    ],
  },
  "proj-4": {
    heroImages: [
      "https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&q=80",
    ],
    overview:
      "Project ini menyiapkan dashboard monitoring energi terbarukan untuk memantau performa panel surya dan perangkat pembangkit skala kecil di kampus.",
    challenge:
      "Tim baru dibuka dan membutuhkan mahasiswa yang siap membantu merancang visualisasi data, struktur dashboard, dan integrasi sumber energi.",
    deliverables: [
      "Dashboard monitoring energi",
      "Skema data dari perangkat pembangkit",
      "Laporan performa awal sistem",
    ],
    requirements: [
      "Tertarik pada dashboard, data analytics, atau energi",
      "Mampu memahami data time-series dasar",
      "Siap mengikuti koordinasi teknis secara berkala",
    ],
    commitment: "4-6 jam per minggu dengan pembagian task yang fleksibel.",
    timeline: "Maret 2026 - Juli 2026",
    location: "On-site kampus untuk observasi awal, lalu hybrid",
    teamMembers: [],
  },
  "proj-5": {
    heroImages: [
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?auto=format&fit=crop&w=1600&q=80",
    ],
    overview:
      "Riset ini menggabungkan sensor kualitas udara dan model machine learning untuk mendeteksi serta memprediksi kondisi udara di area kampus dan sekitarnya.",
    challenge:
      "Tim membutuhkan mahasiswa yang dapat membantu preprocessing data sensor, eksperimen model, serta penyajian hasil secara visual.",
    deliverables: [
      "Dataset kualitas udara terstruktur",
      "Model prediksi awal berbasis machine learning",
      "Visualisasi tren kualitas udara",
    ],
    requirements: [
      "Memiliki dasar machine learning atau pemrograman data",
      "Tertarik pada isu kota berkelanjutan",
      "Mampu membaca dan merapikan data dari berbagai sumber",
    ],
    commitment: "6-8 jam per minggu selama masa eksperimen model.",
    timeline: "Februari 2026 - Juli 2026",
    location: "Hybrid, dengan sesi kerja data dan kunjungan lokasi tertentu",
    teamMembers: [
      {
        id: "proj-5-m1",
        name: "Dimas Saputra",
        email: "dimas.saputra@student.telkomuniversity.ac.id",
        role: "ML Engineer",
        focus: "Eksperimen model",
      },
      {
        id: "proj-5-m2",
        name: "Putri Lestari",
        email: "putri.lestari@student.telkomuniversity.ac.id",
        role: "Data Researcher",
        focus: "Pembersihan data sensor",
      },
    ],
  },
};

export function createProjectSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function titleCaseFromEmail(email: string) {
  const localPart = email.split("@")[0] ?? "mahasiswa";

  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function fallbackEmailFromName(name: string, id: string) {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
      .replace(/\s+/g, ".") || id;

  return `${base}@student.telkomuniversity.ac.id`;
}

function normalizeDocuments(documents?: HubDocument[]) {
  if (documents && documents.length > 0) {
    return documents;
  }

  return [SAMPLE_DOCUMENT];
}

function normalizeProject(
  project: ProjectInput &
    Partial<Project> & {
      id: string;
      createdAt: string;
      filledSlots: number;
      status: Project["status"];
    },
) {
  const mergedProject = {
    ...PROJECT_DETAIL_OVERRIDES[project.id],
    ...project,
  } as Partial<Project> &
    ProjectInput & {
      id: string;
      createdAt: string;
      filledSlots: number;
      status: Project["status"];
    };

  const normalizedTeamMembers = (mergedProject.teamMembers || []).map(
    (member) => ({
      ...member,
      email: normalizeEmail(
        member.email || fallbackEmailFromName(member.name, member.id),
      ),
    }),
  );

  return {
    ...mergedProject,
    slug: mergedProject.slug || createProjectSlug(mergedProject.title),
    heroImages:
      mergedProject.heroImages && mergedProject.heroImages.length > 0
        ? mergedProject.heroImages
        : DEFAULT_PROJECT_IMAGES,
    overview: mergedProject.overview || mergedProject.description,
    challenge:
      mergedProject.challenge ||
      "Project ini membuka ruang kolaborasi bagi mahasiswa yang ingin berkontribusi pada isu nyata melalui pendekatan riset dan implementasi.",
    deliverables:
      mergedProject.deliverables && mergedProject.deliverables.length > 0
        ? mergedProject.deliverables
        : [
            "Rangkuman kebutuhan project",
            "Kontribusi mahasiswa pada proses pengembangan",
            "Luaran awal yang dapat ditindaklanjuti",
          ],
    requirements:
      mergedProject.requirements && mergedProject.requirements.length > 0
        ? mergedProject.requirements
        : [
            "Memiliki minat pada topik yang dibahas",
            "Siap bekerja kolaboratif dalam tim",
            "Mampu mengikuti target kerja yang disepakati",
          ],
    commitment:
      mergedProject.commitment ||
      "Fleksibel sesuai kebutuhan tim dan fase project.",
    timeline:
      mergedProject.timeline ||
      "Menyesuaikan timeline project yang sedang berjalan.",
    location: mergedProject.location || "Hybrid",
    teamMembers: normalizedTeamMembers,
    documents: normalizeDocuments(mergedProject.documents),
    filledSlots: Math.min(
      mergedProject.teamSlots,
      normalizedTeamMembers.length,
    ),
  } satisfies Project;
}

function normalizeInnovation(innovation: Innovation) {
  return {
    ...innovation,
    slug: innovation.slug || createProjectSlug(innovation.title),
    gallery:
      innovation.gallery && innovation.gallery.length > 0
        ? innovation.gallery
        : innovation.imageUrl
          ? [innovation.imageUrl]
          : DEFAULT_INNOVATION_IMAGES,
    imageUrl:
      innovation.imageUrl ||
      innovation.gallery?.[0] ||
      DEFAULT_INNOVATION_IMAGES[0],
    createdAt: innovation.createdAt || new Date().toISOString().split("T")[0],
    likes: innovation.likes ?? 0,
    overview: innovation.overview || innovation.description,
    highlights:
      innovation.highlights && innovation.highlights.length > 0
        ? innovation.highlights
        : [
            "Produk inovasi siap dikenalkan lebih lanjut",
            "Dapat menjadi dasar kolaborasi lanjutan",
          ],
    useCases:
      innovation.useCases && innovation.useCases.length > 0
        ? innovation.useCases
        : [
            "Eksplorasi riset lanjutan",
            "Penerapan terbatas pada lingkungan kampus",
          ],
    collaborators:
      innovation.collaborators && innovation.collaborators.length > 0
        ? innovation.collaborators
        : [innovation.creator],
    demo: innovation.demo ?? null,
    documents: normalizeDocuments(innovation.documents),
  } satisfies Innovation;
}

function normalizeIdea(
  idea: IdeaInput &
    Partial<Idea> & {
      id: string;
      votes: number;
      createdAt: string;
      hasVoted: boolean;
    },
) {
  return {
    ...idea,
    slug: idea.slug || createProjectSlug(idea.title),
    email: idea.email || "mahasiswa@telkomuniversity.ac.id",
    gallery:
      idea.gallery && idea.gallery.length > 0
        ? idea.gallery
        : DEFAULT_IDEA_IMAGES,
    overview: idea.overview || idea.description,
    potentialImpact:
      idea.potentialImpact ||
      "Ide ini memiliki potensi untuk mendorong perbaikan nyata pada ekosistem kampus yang lebih berkelanjutan.",
    nextSteps:
      idea.nextSteps && idea.nextSteps.length > 0
        ? idea.nextSteps
        : [
            "Meninjau kelayakan ide secara awal",
            "Menyusun skenario implementasi sederhana",
            "Membuka peluang kolaborasi untuk tindak lanjut",
          ],
    supportNote:
      idea.supportNote ||
      "Dukungan mahasiswa dapat menjadi indikator awal bahwa ide ini relevan untuk dibahas lebih lanjut.",
    documents: normalizeDocuments(idea.documents),
  } satisfies Idea;
}

const INITIAL_INNOVATIONS: Innovation[] = [
  {
    id: "inno-1",
    slug: "aquasense-smart-water-quality-sensor",
    title: "AquaSense - Smart Water Quality Sensor",
    creator: "Tim Riset IoT Lab",
    creatorEmail: "rizki.fajar@student.telkomuniversity.ac.id",
    description:
      "Sensor kualitas air portabel berbasis IoT yang dapat memantau pH, kekeruhan, dan kadar mineral secara real-time melalui aplikasi mobile.",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    tags: ["IoT", "Hardware", "Mobile App"],
    sdgCategory: "SDG 6",
    createdAt: "2026-02-22",
    likes: 34,
    gallery: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
    ],
    overview:
      "AquaSense dikembangkan untuk membantu pemantauan kualitas air secara praktis, cepat, dan terhubung dengan dashboard digital.",
    highlights: [
      "Monitoring kualitas air secara real-time",
      "Data dapat diakses melalui aplikasi mobile",
      "Mendukung evaluasi cepat pada berbagai titik pengukuran",
    ],
    useCases: [
      "Pemantauan kualitas air pada lingkungan kampus",
      "Pengukuran awal untuk project pengabdian masyarakat",
      "Media pembelajaran berbasis sensor dan data lapangan",
    ],
    collaborators: ["Tim Riset IoT Lab", "Mahasiswa Teknik", "SDGs Center"],
    demo: {
      type: "link",
      title: "Demo dashboard tersedia",
      description:
        "Prototype dashboard menampilkan pembacaan sensor dan riwayat pengukuran pada beberapa titik sampel.",
      url: "https://example.com/demo/aquasense",
      ctaLabel: "Lihat Demo",
    },
  },
  {
    id: "inno-2",
    slug: "edubridge-platform-pembelajaran-inklusif",
    title: "EduBridge - Platform Pembelajaran Inklusif",
    creator: "Lab Human-Computer Interaction",
    creatorEmail: "dewi.lestari@student.telkomuniversity.ac.id",
    description:
      "Platform pembelajaran yang dirancang khusus untuk siswa berkebutuhan khusus dengan fitur text-to-speech, sign language video, dan adaptive UI.",
    imageUrl:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80",
    tags: ["EdTech", "Accessibility", "AI"],
    sdgCategory: "SDG 4",
    createdAt: "2026-02-18",
    likes: 27,
    gallery: [
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
    ],
    overview:
      "EduBridge dirancang untuk memperluas akses pembelajaran yang inklusif melalui antarmuka adaptif dan dukungan multimodal.",
    highlights: [
      "Mendukung aksesibilitas melalui text-to-speech",
      "Menyediakan materi dengan pendekatan visual dan audio",
      "Dirancang untuk pengalaman belajar yang lebih inklusif",
    ],
    useCases: [
      "Media pembelajaran untuk kelas inklusif",
      "Pendampingan belajar mandiri berbasis digital",
      "Platform riset pada interaksi manusia dan komputer",
    ],
    collaborators: ["Lab HCI", "Mahasiswa Desain", "Mahasiswa Informatika"],
    demo: {
      type: "gallery",
      title: "Preview antarmuka produk",
      description:
        "Beberapa tampilan ini menunjukkan pendekatan visual EduBridge untuk pengalaman belajar yang lebih inklusif.",
      images: [
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
      ],
    },
  },
  {
    id: "inno-3",
    slug: "wastewise-sistem-klasifikasi-sampah-otomatis",
    title: "WasteWise - Sistem Klasifikasi Sampah Otomatis",
    creator: "Kelompok Riset Computer Vision",
    creatorEmail: "anisa.putri@student.telkomuniversity.ac.id",
    description:
      "Tempat sampah cerdas dengan kamera dan AI yang otomatis mengenali dan memilah jenis sampah organik, anorganik, dan B3.",
    imageUrl:
      "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=1600&q=80",
    tags: ["Computer Vision", "Hardware", "Sustainability"],
    sdgCategory: "SDG 12",
    createdAt: "2026-01-29",
    likes: 41,
    gallery: [
      "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=1600&q=80",
    ],
    overview:
      "WasteWise menggabungkan computer vision dan perangkat fisik untuk membantu proses pemilahan sampah yang lebih cepat dan konsisten.",
    highlights: [
      "Deteksi jenis sampah berbasis kamera dan AI",
      "Mendukung edukasi pengelolaan sampah berkelanjutan",
      "Dapat dikembangkan sebagai perangkat demonstrasi kampus",
    ],
    useCases: [
      "Instalasi edukatif di area kampus",
      "Media riset untuk klasifikasi objek real-time",
      "Prototype solusi pemilahan sampah pintar",
    ],
    collaborators: [
      "Kelompok Riset Computer Vision",
      "Mahasiswa AI",
      "Komunitas Lingkungan",
    ],
    demo: null,
  },
  {
    id: "inno-4",
    slug: "farmbot-telkom-robot-pertanian-mini",
    title: "FarmBot Telkom - Robot Pertanian Mini",
    creator: "Lab Robotika & Otomasi",
    creatorEmail: "muhammad.ilham@student.telkomuniversity.ac.id",
    description:
      "Robot pertanian skala kecil untuk urban farming di kampus, mampu melakukan penyiraman, pemupukan, dan monitoring tanaman secara otomatis.",
    imageUrl:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1600&q=80",
    tags: ["Robotics", "Agriculture", "Automation"],
    sdgCategory: "SDG 2",
    createdAt: "2026-02-11",
    likes: 23,
    gallery: [
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=1600&q=80",
    ],
    overview:
      "FarmBot Telkom adalah robot pertanian mini yang mendukung eksperimen urban farming dengan otomasi dasar untuk penyiraman dan pemantauan tanaman.",
    highlights: [
      "Mendukung eksperimen urban farming kampus",
      "Menggabungkan sensor, aktuator, dan otomasi sederhana",
      "Cocok untuk riset robotika terapan skala kecil",
    ],
    useCases: [
      "Media pembelajaran di laboratorium robotika",
      "Demonstrasi pertanian perkotaan berbasis otomasi",
      "Prototype pengembangan alat pertanian pintar",
    ],
    collaborators: [
      "Lab Robotika & Otomasi",
      "Mahasiswa Mekatronika",
      "Mahasiswa Teknik Industri",
    ],
    demo: null,
  },
];

const INITIAL_IDEAS: Idea[] = [
  {
    id: "idea-1",
    slug: "kantin-zero-waste-di-kampus",
    title: "Kantin Zero Waste di Kampus",
    author: "Anisa Putri",
    email: "anisa.putri@student.telkomuniversity.ac.id",
    description:
      "Mengimplementasikan sistem kantin tanpa limbah plastik dengan menggunakan wadah reusable dan sistem deposit untuk setiap mahasiswa.",
    votes: 47,
    sdgCategory: "SDG 12",
    createdAt: "2026-03-08",
    hasVoted: false,
    gallery: [
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1600&q=80",
    ],
    overview:
      "Ide ini mendorong perubahan sistem layanan kantin agar lebih minim limbah melalui skema wadah guna ulang dan deposit yang mudah diterapkan.",
    potentialImpact:
      "Jika diterapkan, ide ini dapat mengurangi sampah plastik sekali pakai sekaligus membangun kebiasaan konsumsi yang lebih bertanggung jawab di lingkungan kampus.",
    nextSteps: [
      "Uji coba di beberapa tenant kantin",
      "Skema deposit dan pengembalian wadah",
      "Evaluasi perubahan perilaku pengguna",
    ],
    supportNote:
      "Dukungan tinggi menunjukkan bahwa mahasiswa melihat isu sampah kantin sebagai masalah nyata yang layak diprioritaskan.",
  },
  {
    id: "idea-2",
    slug: "bike-sharing-program-antar-gedung",
    title: "Bike Sharing Program antar Gedung",
    author: "Rizki Fajar",
    email: "rizki.fajar@student.telkomuniversity.ac.id",
    description:
      "Program berbagi sepeda untuk mobilitas mahasiswa antar gedung kampus, mengurangi penggunaan kendaraan bermotor di area kampus.",
    votes: 35,
    sdgCategory: "SDG 11",
    createdAt: "2026-03-06",
    hasVoted: false,
    gallery: [
      "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80",
    ],
    overview:
      "Program bike sharing ini diusulkan untuk mendukung mobilitas yang lebih ramah lingkungan di area kampus dengan jarak antargedung yang cukup luas.",
    potentialImpact:
      "Ide ini berpotensi mengurangi ketergantungan pada kendaraan bermotor, menekan emisi, dan membuat perpindahan antar area kampus lebih efisien.",
    nextSteps: [
      "Pemetaan titik parkir sepeda strategis",
      "Simulasi operasional dan peminjaman",
      "Pilot project pada rute kampus tertentu",
    ],
    supportNote:
      "Jumlah dukungan yang tinggi menunjukkan kebutuhan mobilitas kampus yang lebih praktis dan berkelanjutan.",
  },
  {
    id: "idea-3",
    slug: "mentorship-platform-senior-junior",
    title: "Mentorship Platform Senior-Junior",
    author: "Dewi Lestari",
    email: "dewi.lestari@student.telkomuniversity.ac.id",
    description:
      "Platform online untuk menghubungkan mahasiswa senior dengan junior untuk program mentoring akademik dan karir secara terstruktur.",
    votes: 28,
    sdgCategory: "SDG 4",
    createdAt: "2026-03-04",
    hasVoted: false,
    gallery: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1600&q=80",
    ],
    overview:
      "Platform mentorship ini ditujukan untuk memperkuat dukungan akademik dan pengembangan diri mahasiswa melalui hubungan senior-junior yang lebih terstruktur.",
    potentialImpact:
      "Jika dikelola dengan baik, ide ini dapat membantu adaptasi mahasiswa baru, meningkatkan kesiapan akademik, dan memperluas akses dukungan informal.",
    nextSteps: [
      "Merancang alur matching mentor-mentee",
      "Menyusun panduan interaksi dan evaluasi",
      "Menguji program pada skala terbatas",
    ],
    supportNote:
      "Meski belum menjadi ide dengan dukungan tertinggi, usulan ini tetap relevan karena menjawab kebutuhan pendampingan yang nyata.",
  },
  {
    id: "idea-4",
    slug: "green-roof-garden-di-gedung-kuliah",
    title: "Green Roof Garden di Gedung Kuliah",
    author: "Muhammad Ilham",
    email: "muhammad.ilham@student.telkomuniversity.ac.id",
    description:
      "Pemanfaatan atap gedung kuliah untuk urban garden yang dikelola mahasiswa, menghasilkan sayuran organik untuk kantin kampus.",
    votes: 52,
    sdgCategory: "SDG 2",
    createdAt: "2026-03-02",
    hasVoted: false,
    gallery: [
      "https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80",
    ],
    overview:
      "Ide ini mengusulkan pemanfaatan atap gedung kuliah sebagai ruang tanam produktif yang dikelola bersama untuk mendukung kampus hijau.",
    potentialImpact:
      "Green roof garden berpotensi memperbaiki kualitas lingkungan, menjadi media edukasi, serta menghasilkan bahan pangan skala kecil untuk kebutuhan kampus.",
    nextSteps: [
      "Studi kelayakan lokasi dan struktur bangunan",
      "Simulasi pengelolaan bersama mahasiswa",
      "Perancangan pilot area skala kecil",
    ],
    supportNote:
      "Tingginya dukungan menunjukkan ketertarikan kuat pada ide yang berdampak visual sekaligus ekologis di lingkungan kampus.",
  },
  {
    id: "idea-5",
    slug: "aplikasi-carpooling-mahasiswa",
    title: "Aplikasi Carpooling Mahasiswa",
    author: "Sarah Amelia",
    email: "sarah.amelia@student.telkomuniversity.ac.id",
    description:
      "Aplikasi berbagi kendaraan khusus mahasiswa Telkom University untuk mengurangi kemacetan dan emisi karbon dari perjalanan ke kampus.",
    votes: 41,
    sdgCategory: "SDG 13",
    createdAt: "2026-02-28",
    hasVoted: false,
    gallery: [
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80",
    ],
    overview:
      "Aplikasi carpooling mahasiswa diusulkan sebagai solusi mobilitas bersama yang lebih efisien dan rendah emisi untuk perjalanan menuju kampus.",
    potentialImpact:
      "Ide ini dapat membantu mengurangi kemacetan, menekan emisi, dan membangun budaya perjalanan bersama yang lebih bertanggung jawab.",
    nextSteps: [
      "Perumusan skema keamanan dan verifikasi pengguna",
      "Perancangan alur pemesanan dan pencocokan rute",
      "Uji coba pada komunitas mahasiswa terbatas",
    ],
    supportNote:
      "Jumlah dukungan menunjukkan bahwa isu transportasi kampus masih menjadi perhatian besar di kalangan mahasiswa.",
  },
];

const DEFAULT_INNOVATION_IMAGES = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=1600&q=80",
];

const DEFAULT_IDEA_IMAGES = [
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80",
];

const SAMPLE_DOCUMENT: HubDocument = {
  name: "Contoh Proposal SDGs",
  url: "/contohpdf.pdf",
  mimeType: "application/pdf",
};

/* ─── State Interface ─── */

export interface SdgsHubState {
  projects: Project[];
  innovations: Innovation[];
  ideas: Idea[];
  addProject: (project: ProjectInput) => void;
  updateProject: (projectId: string, data: ProjectInput) => void;
  deleteProject: (projectId: string) => void;
  updateProjectStatus: (
    projectId: string,
    nextStatus: Project["status"],
  ) => void;
  addIdea: (idea: IdeaInput) => void;
  addInnovation: (innovation: InnovationInput) => void;
  voteIdea: (ideaId: string) => void;
  updateSubmissionStatus: (
    type: "idea" | "innovation" | "project",
    itemId: string,
    status: SubmissionStatus,
    message?: string,
  ) => void;
  inviteProjectMember: (projectId: string, email: string) => TeamMutationResult;
  removeProjectMember: (
    projectId: string,
    memberId: string,
  ) => TeamMutationResult;
}

/* ─── Hook ─── */

export function useSdgsHubData(): SdgsHubState {
  const [projects, setProjects] = useState<Project[]>(() =>
    INITIAL_PROJECTS.map(normalizeProject),
  );
  const [innovations, setInnovations] = useState<Innovation[]>(() =>
    INITIAL_INNOVATIONS.map(normalizeInnovation),
  );
  const [ideas, setIdeas] = useState<Idea[]>(() =>
    INITIAL_IDEAS.map(normalizeIdea),
  );
  const [hasHydratedStorage, setHasHydratedStorage] = useState(false);

  useEffect(() => {
    try {
      const storedProjects = window.localStorage.getItem("sdgs-hub-projects");
      if (storedProjects) {
        setProjects(
          (
            JSON.parse(storedProjects) as Array<
              ProjectInput &
                Partial<Project> & {
                  id: string;
                  createdAt: string;
                  filledSlots: number;
                  status: Project["status"];
                }
            >
          ).map(normalizeProject),
        );
      }

      const storedIdeas = window.localStorage.getItem("sdgs-hub-ideas");
      if (storedIdeas) {
        setIdeas(
          (
            JSON.parse(storedIdeas) as Array<
              IdeaInput &
                Partial<Idea> & {
                  id: string;
                  votes: number;
                  createdAt: string;
                  hasVoted: boolean;
                }
            >
          ).map(normalizeIdea),
        );
      }

      const storedInnovations = window.localStorage.getItem(
        "sdgs-hub-innovations",
      );
      if (storedInnovations) {
        setInnovations(
          (JSON.parse(storedInnovations) as Innovation[]).map(
            normalizeInnovation,
          ),
        );
      }
    } catch {
      setProjects(INITIAL_PROJECTS.map(normalizeProject));
      setIdeas(INITIAL_IDEAS.map(normalizeIdea));
      setInnovations(INITIAL_INNOVATIONS.map(normalizeInnovation));
    } finally {
      setHasHydratedStorage(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydratedStorage) {
      return;
    }

    window.localStorage.setItem("sdgs-hub-projects", JSON.stringify(projects));
  }, [hasHydratedStorage, projects]);

  useEffect(() => {
    if (!hasHydratedStorage) {
      return;
    }

    window.localStorage.setItem("sdgs-hub-ideas", JSON.stringify(ideas));
  }, [hasHydratedStorage, ideas]);

  useEffect(() => {
    if (!hasHydratedStorage) {
      return;
    }

    window.localStorage.setItem(
      "sdgs-hub-innovations",
      JSON.stringify(innovations),
    );
  }, [hasHydratedStorage, innovations]);

  const addProject = useCallback((project: ProjectInput) => {
    const newProject = normalizeProject({
      ...project,
      id: `proj-${Date.now()}`,
      slug: createProjectSlug(project.title),
      filledSlots: 0,
      status: "open",
      createdAt: new Date().toISOString().split("T")[0],
      heroImages: DEFAULT_PROJECT_IMAGES,
      overview: project.description,
      challenge:
        "Project ini membuka peluang kolaborasi baru bagi mahasiswa yang ingin terlibat langsung.",
      deliverables: [
        "Luaran project yang disepakati bersama tim",
        "Dokumentasi proses dan hasil kerja",
        "Rangkuman tindak lanjut berikutnya",
      ],
      requirements: [
        "Memiliki minat pada topik project",
        "Siap terlibat aktif dalam kolaborasi",
        "Mampu bekerja sesuai target yang disepakati",
      ],
      commitment: "Menyesuaikan agenda project dan tim pembimbing.",
      timeline: "Timeline akan diinformasikan oleh dosen pembimbing.",
      location: "Hybrid",
      teamMembers: [],
    });
    setProjects((prev) => [newProject, ...prev]);
  }, []);

  const updateProjectStatus = useCallback(
    (projectId: string, nextStatus: Project["status"]) => {
      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId
            ? { ...project, status: nextStatus }
            : project,
        ),
      );
    },
    [],
  );

  const updateProject = useCallback((projectId: string, data: ProjectInput) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? {
              ...project,
              ...data,
              tags: data.tags,
              documents: data.documents ?? project.documents,
            }
          : project,
      ),
    );
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== projectId));
  }, []);

  const addIdea = useCallback((idea: IdeaInput) => {
    const newIdea = normalizeIdea({
      ...idea,
      id: `idea-${Date.now()}`,
      votes: 0,
      createdAt: new Date().toISOString().split("T")[0],
      hasVoted: false,
      gallery: DEFAULT_IDEA_IMAGES,
      overview: idea.overview ?? idea.description,
      potentialImpact: idea.potentialImpact,
      nextSteps: idea.nextSteps,
      supportNote: idea.supportNote,
    });
    setIdeas((prev) => [newIdea, ...prev]);
  }, []);

  const voteIdea = useCallback((ideaId: string) => {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === ideaId && !idea.hasVoted
          ? { ...idea, votes: idea.votes + 1, hasVoted: true }
          : idea,
      ),
    );
  }, []);

  const addInnovation = useCallback((innovation: InnovationInput) => {
    const userGallery =
      innovation.gallery && innovation.gallery.length > 0
        ? innovation.gallery
        : DEFAULT_INNOVATION_IMAGES;
    const newInnovation = normalizeInnovation({
      ...innovation,
      id: `inno-${Date.now()}`,
      slug: createProjectSlug(innovation.title),
      imageUrl: userGallery[0],
      gallery: userGallery,
      likes: 0,
      createdAt: new Date().toISOString().split("T")[0],
      overview: innovation.description,
      collaborators: [innovation.creator],
      demo: null,
      submissionStatus: "pending",
      adminMessages: [],
    });
    setInnovations((prev) => [newInnovation, ...prev]);
  }, []);

  const updateSubmissionStatus = useCallback(
    (
      type: "idea" | "innovation" | "project",
      itemId: string,
      status: SubmissionStatus,
      message?: string,
    ) => {
      const adminMsg: AdminMessage | undefined = message
        ? {
            id: `msg-${Date.now()}`,
            from: "admin",
            message,
            createdAt: new Date().toISOString(),
          }
        : undefined;

      if (type === "idea") {
        setIdeas((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  submissionStatus: status,
                  adminMessages: adminMsg
                    ? [...(item.adminMessages || []), adminMsg]
                    : item.adminMessages,
                }
              : item,
          ),
        );
      } else if (type === "innovation") {
        setInnovations((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  submissionStatus: status,
                  adminMessages: adminMsg
                    ? [...(item.adminMessages || []), adminMsg]
                    : item.adminMessages,
                }
              : item,
          ),
        );
      } else if (type === "project") {
        setProjects((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  status:
                    status === "approved"
                      ? "open"
                      : status === "rejected"
                        ? "closed"
                        : item.status,
                }
              : item,
          ),
        );
      }
    },
    [],
  );

  const inviteProjectMember = useCallback(
    (projectId: string, email: string): TeamMutationResult => {
      const normalizedEmail = normalizeEmail(email);

      if (!normalizedEmail) {
        return { ok: false, message: "Email anggota wajib diisi." };
      }

      if (!isValidEmail(normalizedEmail)) {
        return { ok: false, message: "Format email tidak valid." };
      }

      const targetProject = projects.find(
        (project) => project.id === projectId,
      );

      if (!targetProject) {
        return { ok: false, message: "Campaign tidak ditemukan." };
      }

      const alreadyExists = targetProject.teamMembers.some(
        (member) => normalizeEmail(member.email) === normalizedEmail,
      );

      if (alreadyExists) {
        return {
          ok: false,
          message: "Email tersebut sudah ada di anggota tim campaign ini.",
        };
      }

      if (targetProject.teamMembers.length >= targetProject.teamSlots) {
        return {
          ok: false,
          message:
            "Slot tim sudah penuh. Tambah slot atau keluarkan anggota dulu.",
        };
      }

      const member: ProjectMember = {
        id: `member-${Date.now()}`,
        name: titleCaseFromEmail(normalizedEmail),
        email: normalizedEmail,
        role: "Mahasiswa Research Assistant",
        focus: "Onboarding awal",
      };

      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId
            ? {
                ...project,
                teamMembers: [...project.teamMembers, member],
                filledSlots: Math.min(
                  project.teamMembers.length + 1,
                  project.teamSlots,
                ),
              }
            : project,
        ),
      );

      return {
        ok: true,
        message: `Undangan untuk ${normalizedEmail} berhasil ditambahkan ke tim.`,
      };
    },
    [projects],
  );

  const removeProjectMember = useCallback(
    (projectId: string, memberId: string): TeamMutationResult => {
      const targetProject = projects.find(
        (project) => project.id === projectId,
      );

      if (!targetProject) {
        return { ok: false, message: "Campaign tidak ditemukan." };
      }

      const member = targetProject.teamMembers.find(
        (item) => item.id === memberId,
      );

      if (!member) {
        return { ok: false, message: "Anggota tim tidak ditemukan." };
      }

      setProjects((prev) =>
        prev.map((project) => {
          if (project.id !== projectId) {
            return project;
          }

          const nextMembers = project.teamMembers.filter(
            (item) => item.id !== memberId,
          );

          return {
            ...project,
            teamMembers: nextMembers,
            filledSlots: nextMembers.length,
          };
        }),
      );

      return {
        ok: true,
        message: `${member.name} berhasil dikeluarkan dari tim campaign.`,
      };
    },
    [projects],
  );

  return {
    projects,
    innovations,
    ideas,
    addProject,
    updateProject,
    deleteProject,
    updateProjectStatus,
    addIdea,
    addInnovation,
    voteIdea,
    updateSubmissionStatus,
    inviteProjectMember,
    removeProjectMember,
  };
}

/* ─── Context ─── */

const SdgsHubContext = createContext<SdgsHubState | null>(null);

export function SdgsHubProvider({ children }: { children: ReactNode }) {
  const state = useSdgsHubData();
  return (
    <SdgsHubContext.Provider value={state}>{children}</SdgsHubContext.Provider>
  );
}

export function useSdgsHub(): SdgsHubState {
  const ctx = useContext(SdgsHubContext);
  if (!ctx) {
    throw new Error("useSdgsHub must be used within <SdgsHubProvider>");
  }
  return ctx;
}
