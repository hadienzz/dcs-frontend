import type { DirectorateField, Sdg } from "@/types/sdgs-dashboard";
/**
 * Official UN SDG accent colors with indicators.
 */
export const sdgs: Sdg[] = [
  {
    id: "sdg-1", number: 1, name: "No Poverty", color: "#E5243B",
    indicators: [
      { id: "1.1", label: "1.1 Kemiskinan ekstrem" },
      { id: "1.2", label: "1.2 Kemiskinan nasional" },
      { id: "1.3", label: "1.3 Perlindungan sosial" },
      { id: "1.4", label: "1.4 Akses layanan dasar" },
      { id: "1.5", label: "1.5 Ketahanan bencana" },
    ],
  },
  {
    id: "sdg-2", number: 2, name: "Zero Hunger", color: "#DDA63A",
    indicators: [
      { id: "2.1", label: "2.1 Akses pangan" },
      { id: "2.2", label: "2.2 Malnutrisi" },
      { id: "2.3", label: "2.3 Produktivitas pertanian" },
      { id: "2.4", label: "2.4 Pertanian berkelanjutan" },
      { id: "2.5", label: "2.5 Keanekaragaman genetik" },
    ],
  },
  {
    id: "sdg-3", number: 3, name: "Good Health and Well-being", color: "#4C9F38",
    indicators: [
      { id: "3.1", label: "3.1 Kematian ibu" },
      { id: "3.2", label: "3.2 Kematian bayi" },
      { id: "3.3", label: "3.3 Penyakit menular" },
      { id: "3.4", label: "3.4 Penyakit tidak menular" },
      { id: "3.5", label: "3.5 Penyalahgunaan zat" },
      { id: "3.8", label: "3.8 Cakupan kesehatan universal" },
    ],
  },
  {
    id: "sdg-4", number: 4, name: "Quality Education", color: "#C5192D",
    indicators: [
      { id: "4.1", label: "4.1 Pendidikan dasar & menengah" },
      { id: "4.2", label: "4.2 Pendidikan anak usia dini" },
      { id: "4.3", label: "4.3 Pendidikan tinggi & vokasi" },
      { id: "4.4", label: "4.4 Keterampilan kerja" },
      { id: "4.5", label: "4.5 Kesetaraan akses" },
      { id: "4.7", label: "4.7 Pendidikan pembangunan berkelanjutan" },
    ],
  },
  {
    id: "sdg-5", number: 5, name: "Gender Equality", color: "#FF3A21",
    indicators: [
      { id: "5.1", label: "5.1 Diskriminasi gender" },
      { id: "5.2", label: "5.2 Kekerasan terhadap perempuan" },
      { id: "5.4", label: "5.4 Pekerjaan domestik" },
      { id: "5.5", label: "5.5 Partisipasi kepemimpinan" },
    ],
  },
  {
    id: "sdg-6", number: 6, name: "Clean Water and Sanitation", color: "#26BDE2",
    indicators: [
      { id: "6.1", label: "6.1 Air minum aman" },
      { id: "6.2", label: "6.2 Sanitasi & kebersihan" },
      { id: "6.3", label: "6.3 Kualitas air" },
      { id: "6.4", label: "6.4 Efisiensi air" },
      { id: "6.6", label: "6.6 Ekosistem air" },
    ],
  },
  {
    id: "sdg-7", number: 7, name: "Affordable and Clean Energy", color: "#FCC30B",
    indicators: [
      { id: "7.1", label: "7.1 Akses energi" },
      { id: "7.2", label: "7.2 Energi terbarukan" },
      { id: "7.3", label: "7.3 Efisiensi energi" },
    ],
  },
  {
    id: "sdg-8", number: 8, name: "Decent Work and Economic Growth", color: "#A21942",
    indicators: [
      { id: "8.1", label: "8.1 Pertumbuhan ekonomi" },
      { id: "8.2", label: "8.2 Produktivitas ekonomi" },
      { id: "8.3", label: "8.3 Formalisasi UMKM" },
      { id: "8.5", label: "8.5 Pekerjaan layak" },
      { id: "8.6", label: "8.6 Pemuda NEET" },
    ],
  },
  {
    id: "sdg-9", number: 9, name: "Industry, Innovation and Infrastructure", color: "#FD6925",
    indicators: [
      { id: "9.1", label: "9.1 Infrastruktur berkualitas" },
      { id: "9.2", label: "9.2 Industrialisasi inklusif" },
      { id: "9.4", label: "9.4 Infrastruktur berkelanjutan" },
      { id: "9.5", label: "9.5 Riset & inovasi" },
    ],
  },
  {
    id: "sdg-10", number: 10, name: "Reduced Inequalities", color: "#DD1367",
    indicators: [
      { id: "10.1", label: "10.1 Pertumbuhan pendapatan" },
      { id: "10.2", label: "10.2 Inklusi sosial" },
      { id: "10.3", label: "10.3 Kesetaraan kesempatan" },
      { id: "10.4", label: "10.4 Kebijakan fiskal" },
    ],
  },
  {
    id: "sdg-11", number: 11, name: "Sustainable Cities and Communities", color: "#FD9D24",
    indicators: [
      { id: "11.1", label: "11.1 Perumahan layak" },
      { id: "11.2", label: "11.2 Transportasi publik" },
      { id: "11.4", label: "11.4 Warisan budaya" },
      { id: "11.6", label: "11.6 Kualitas udara" },
    ],
  },
  {
    id: "sdg-12", number: 12, name: "Responsible Consumption and Production", color: "#BF8B2E",
    indicators: [
      { id: "12.2", label: "12.2 Pengelolaan SDA" },
      { id: "12.3", label: "12.3 Limbah pangan" },
      { id: "12.4", label: "12.4 Pengelolaan bahan kimia" },
      { id: "12.5", label: "12.5 Pengurangan limbah" },
      { id: "12.6", label: "12.6 Pelaporan keberlanjutan" },
    ],
  },
  {
    id: "sdg-13", number: 13, name: "Climate Action", color: "#3F7E44",
    indicators: [
      { id: "13.1", label: "13.1 Ketahanan iklim" },
      { id: "13.2", label: "13.2 Kebijakan iklim" },
      { id: "13.3", label: "13.3 Pendidikan iklim" },
    ],
  },
  {
    id: "sdg-14", number: 14, name: "Life Below Water", color: "#0A97D9",
    indicators: [
      { id: "14.1", label: "14.1 Polusi laut" },
      { id: "14.2", label: "14.2 Ekosistem laut" },
      { id: "14.4", label: "14.4 Perikanan berkelanjutan" },
      { id: "14.5", label: "14.5 Konservasi laut" },
    ],
  },
  {
    id: "sdg-15", number: 15, name: "Life on Land", color: "#56C02B",
    indicators: [
      { id: "15.1", label: "15.1 Konservasi hutan" },
      { id: "15.2", label: "15.2 Pengelolaan hutan" },
      { id: "15.3", label: "15.3 Degradasi lahan" },
      { id: "15.5", label: "15.5 Keanekaragaman hayati" },
    ],
  },
  {
    id: "sdg-16", number: 16, name: "Peace, Justice and Strong Institutions", color: "#00689D",
    indicators: [
      { id: "16.1", label: "16.1 Pengurangan kekerasan" },
      { id: "16.3", label: "16.3 Akses keadilan" },
      { id: "16.5", label: "16.5 Anti korupsi" },
      { id: "16.6", label: "16.6 Institusi efektif" },
      { id: "16.7", label: "16.7 Partisipasi inklusif" },
    ],
  },
  {
    id: "sdg-17", number: 17, name: "Partnerships for the Goals", color: "#19486A",
    indicators: [
      { id: "17.6", label: "17.6 Kerja sama teknologi" },
      { id: "17.7", label: "17.7 Transfer teknologi" },
      { id: "17.16", label: "17.16 Kemitraan multi-pihak" },
      { id: "17.17", label: "17.17 Kemitraan publik-swasta" },
    ],
  },
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