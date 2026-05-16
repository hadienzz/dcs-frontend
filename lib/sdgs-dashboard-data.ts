import type { DirectorateField, Sdg } from "@/types/sdgs-dashboard";
/**
 * Official UN SDG accent colors. Used by the SDG icon tiles in the dashboard
 * so each goal gets the recognized color instead of a generic leaf icon.
 */
export const sdgs: Sdg[] = [
  { id: "sdg-1", number: 1, name: "No Poverty", color: "#E5243B" },
  { id: "sdg-2", number: 2, name: "Zero Hunger", color: "#DDA63A" },
  { id: "sdg-3", number: 3, name: "Good Health and Well-being", color: "#4C9F38" },
  { id: "sdg-4", number: 4, name: "Quality Education", color: "#C5192D" },
  { id: "sdg-5", number: 5, name: "Gender Equality", color: "#FF3A21" },
  { id: "sdg-6", number: 6, name: "Clean Water and Sanitation", color: "#26BDE2" },
  { id: "sdg-7", number: 7, name: "Affordable and Clean Energy", color: "#FCC30B" },
  { id: "sdg-8", number: 8, name: "Decent Work and Economic Growth", color: "#A21942" },
  { id: "sdg-9", number: 9, name: "Industry, Innovation and Infrastructure", color: "#FD6925" },
  { id: "sdg-10", number: 10, name: "Reduced Inequalities", color: "#DD1367" },
  { id: "sdg-11", number: 11, name: "Sustainable Cities and Communities", color: "#FD9D24" },
  { id: "sdg-12", number: 12, name: "Responsible Consumption and Production", color: "#BF8B2E" },
  { id: "sdg-13", number: 13, name: "Climate Action", color: "#3F7E44" },
  { id: "sdg-14", number: 14, name: "Life Below Water", color: "#0A97D9" },
  { id: "sdg-15", number: 15, name: "Life on Land", color: "#56C02B" },
  { id: "sdg-16", number: 16, name: "Peace, Justice and Strong Institutions", color: "#00689D" },
  { id: "sdg-17", number: 17, name: "Partnerships for the Goals", color: "#19486A" },
];

export const sdgById = new Map(sdgs.map((s) => [s.id, s]));
export const directorateFields: DirectorateField[] = [
  {
    id: "academic-strategic-planning",
    name: "Bidang Akademik dan Perencanaan Strategis",
    directorates: [
      {
        id: "academic",
        name: "Direktorat Akademik",
        units: [
          {
            id: "academic-bsla",
            name: "Bagian Standar dan Layanan Akademik (BSLA)",
          },
          {
            id: "academic-bpa",
            name: "Bagian Pengembangan Akademik (BPA)",
          },
          {
            id: "academic-open-library",
            name: "Bagian Open Library",
          },
          {
            id: "academic-pddikti",
            name: "Bagian Pengelolaan PDDIKTI",
          },
        ],
      },
      {
        id: "digital-learning-language",
        name: "Direktorat Pembelajaran Digital & Pusat Bahasa",
        units: [
          {
            id: "dll-celoe-services",
            name: "Bagian Layanan Center of E-learning & Open Education (CELOE)",
          },
          {
            id: "dll-language-center",
            name: "Bagian Pusat Bahasa",
          },
          {
            id: "dll-celoe-content",
            name: "Bagian Pengembangan Content Center of E-learning & Open Education",
          },
        ],
      },
      {
        id: "postgraduate-international",
        name: "Direktorat Pasca Sarjana & Kantor Urusan Internasional",
        units: [
          {
            id: "postgrad-international-office",
            name: "Bagian Kantor Internasional (ICAO)",
          },
        ],
      },
      {
        id: "strategic-planning-quality",
        name: "Direktorat Perencanaan Strategis & Penjaminan Mutu",
        units: [
          {
            id: "spq-p3i",
            name: "Bagian Perencanaan, Pengembangan, dan Pengendalian Institusi (P3I)",
          },
          {
            id: "spq-data-analytics",
            name: "Bagian Data Analytics",
          },
          {
            id: "spq-quality-assurance",
            name: "Bagian Satuan Penjaminan Mutu (Sarmut)",
          },
        ],
      },
    ],
  },

  {
    id: "resources",
    name: "Bidang Sumber Daya",
    directorates: [
      {
        id: "finance",
        name: "Direktorat Keuangan",
        units: [
          {
            id: "finance-budgeting",
            name: "Bagian Anggaran",
          },
          {
            id: "finance-treasury",
            name: "Bagian Perbendaharaan",
          },
          {
            id: "finance-accounting",
            name: "Bagian Akuntansi",
          },
          {
            id: "finance-revenue-assurance",
            name: "Bagian Revenue Assurance Direktorat Keuangan",
          },
        ],
      },
      {
        id: "human-resources",
        name: "Direktorat Sumber Daya Manusia",
        units: [
          {
            id: "hr-development",
            name: "Bagian Pengembangan SDM",
          },
          {
            id: "hr-planning-culture-performance",
            name: "Bagian Perencanaan, Budaya dan Performansi",
          },
          {
            id: "hr-services",
            name: "Bagian Pelayanan SDM",
          },
        ],
      },
      {
        id: "asset-sustainability",
        name: "Direktorat Asset & Sustainability",
        units: [
          {
            id: "asset-management",
            name: "Bagian Aset",
          },
          {
            id: "asset-maintenance-sustainability",
            name: "Bagian Maintenance Dan Sustainability",
          },
          {
            id: "asset-dormitory-management",
            name: "Bagian Pengelolaan Asrama",
          },
        ],
      },
      {
        id: "information-technology",
        name: "Direktorat Pusat Teknologi Informasi",
        units: [
          {
            id: "it-research-services-qm",
            name: "Bagian Riset, Layanan, Dan Quality Management (TI)",
          },
          {
            id: "it-infrastructure",
            name: "Bagian Infrastruktur TI",
          },
          {
            id: "it-product-development",
            name: "Bagian Pengembangan Produk (TI)",
          },
        ],
      },
    ],
  },

  {
    id: "admission-student-endowment",
    name: "Bidang Admisi, Kemahasiswaan dan Endowment",
    directorates: [
      {
        id: "marketing-admission",
        name: "Direktorat Pemasaran dan Admisi",
        units: [
          {
            id: "admission-digital-marketing",
            name: "Bagian Riset & Pemasaran Digital",
          },
          {
            id: "admission-admission",
            name: "Bagian Admisi",
          },
          {
            id: "admission-services",
            name: "Bagian Layanan Admisi",
          },
          {
            id: "admission-international",
            name: "Bagian Admisi International",
          },
        ],
      },
      {
        id: "student-career-alumni",
        name: "Direktorat Kemahasiswaan, Pengembangan Karier, dan Alumni",
        units: [
          {
            id: "student-achievement-activities",
            name: "Bagian Prestasi Dan Kegiatan Mahasiswa",
          },
          {
            id: "student-character-welfare",
            name: "Bagian Pengembangan Karakter dan Kesejahteraan Mahasiswa",
          },
          {
            id: "student-career-alumni-dev",
            name: "Bagian Pengembangan Karir & Alumni (CAE)",
          },
        ],
      },
      {
        id: "endowment-fund",
        name: "Direktorat Pengelolaan Dana Abadi",
        units: [
          {
            id: "endowment-development-utilization",
            name: "Bagian Pengembangan dan Pemanfaatan",
          },
          {
            id: "endowment-fundraising",
            name: "Bagian Penghimpunan",
          },
        ],
      },
    ],
  },

  {
    id: "research-innovation-business",
    name: "Bidang Riset, Inovasi, dan Pengembangan Bisnis",
    directorates: [
      {
        id: "research-community-service",
        name: "Direktorat Penelitian & Pengabdian Masyarakat",
        units: [
          {
            id: "ppm-research",
            name: "Bagian Penelitian",
          },
          {
            id: "ppm-journal-publication-community",
            name: "Bagian Jurnal, Publikasi, & Pengabdian Masyarakat",
          },
        ],
      },
      {
        id: "btp-business-development",
        name: "Direktorat Bandung Techno Park & Pengembangan Bisnis",
        units: [
          {
            id: "btp-technology-transfer",
            name: "Bagian Teknologi Transfer dan Innovation Partnership",
          },
          {
            id: "btp-business-development-incubation",
            name: "Bagian Business Development & Incubation",
          },
          {
            id: "btp-business-operation-support",
            name: "Bagian Layanan Business Operation and Support",
          },
          {
            id: "btp-strategic-marketing",
            name: "Bagian Strategic Marketing",
          },
        ],
      },
      {
        id: "sdgs-dcs",
        name: "SDGs Center: Digital Collaboration for Sustainability (DCS)",
        units: [],
      },
      {
        id: "pui-pt",
        name: "Pusat Unggulan IPTEKS Perguruan Tinggi (PUI-PT)",
        units: [],
      },
      {
        id: "research-institute",
        name: "Research Institute (RI)",
        units: [
          {
            id: "ri-connectivity-convergence",
            name: "Research Institute Connectivity and Convergence",
          },
          {
            id: "ri-intelligent-business",
            name: "Research Institute Intelligent Business and Sustainable Economy",
          },
          {
            id: "ri-digital-health",
            name: "Research Institute Digital Health, Social and Wellness",
          },
        ],
      },
      {
        id: "center-of-excellence",
        name: "Center of Excellence (CoE)",
        units: [],
      },
    ],
  },
];

export const directorateFieldById = new Map(
  directorateFields.map((field) => [field.id, field])
);

export const directorates = directorateFields.flatMap(
  (field) => field.directorates,
);

export const directorateById = new Map(
  directorates.map((directorate) => [directorate.id, directorate]),
);

export const unitById = new Map(
  directorates.flatMap((directorate) =>
    directorate.units.map((unit) => [unit.id, unit] as const),
  ),
);