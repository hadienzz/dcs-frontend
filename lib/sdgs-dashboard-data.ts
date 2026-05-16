import type {
  SdgsDashboardDirectorate,
  SdgsDashboardFormValues,
  SdgsDashboardSdgGoal,
  SdgsDashboardUnit,
} from "@/types/sdgs-dashboard";

function unit(
  directorateId: string,
  id: string,
  name: string,
): SdgsDashboardUnit {
  return {
    id,
    name,
    directorateId,
  };
}

export const SDGS_DASHBOARD_SDG_GOALS: SdgsDashboardSdgGoal[] = [
  {
    id: "sdg-1",
    label: "SDG 1 - No Poverty",
    shortLabel: "SDG 1",
    toneClassName: "bg-rose-500/10 text-rose-700",
  },
  {
    id: "sdg-2",
    label: "SDG 2 - Zero Hunger",
    shortLabel: "SDG 2",
    toneClassName: "bg-amber-500/10 text-amber-700",
  },
  {
    id: "sdg-3",
    label: "SDG 3 - Good Health and Well-being",
    shortLabel: "SDG 3",
    toneClassName: "bg-emerald-500/10 text-emerald-700",
  },
  {
    id: "sdg-4",
    label: "SDG 4 - Quality Education",
    shortLabel: "SDG 4",
    toneClassName: "bg-red-500/10 text-red-700",
  },
  {
    id: "sdg-5",
    label: "SDG 5 - Gender Equality",
    shortLabel: "SDG 5",
    toneClassName: "bg-orange-500/10 text-orange-700",
  },
  {
    id: "sdg-6",
    label: "SDG 6 - Clean Water and Sanitation",
    shortLabel: "SDG 6",
    toneClassName: "bg-sky-500/10 text-sky-700",
  },
  {
    id: "sdg-7",
    label: "SDG 7 - Affordable and Clean Energy",
    shortLabel: "SDG 7",
    toneClassName: "bg-yellow-500/10 text-yellow-700",
  },
  {
    id: "sdg-8",
    label: "SDG 8 - Decent Work and Economic Growth",
    shortLabel: "SDG 8",
    toneClassName: "bg-fuchsia-500/10 text-fuchsia-700",
  },
  {
    id: "sdg-9",
    label: "SDG 9 - Industry, Innovation and Infrastructure",
    shortLabel: "SDG 9",
    toneClassName: "bg-orange-500/10 text-orange-700",
  },
  {
    id: "sdg-10",
    label: "SDG 10 - Reduced Inequalities",
    shortLabel: "SDG 10",
    toneClassName: "bg-pink-500/10 text-pink-700",
  },
  {
    id: "sdg-11",
    label: "SDG 11 - Sustainable Cities and Communities",
    shortLabel: "SDG 11",
    toneClassName: "bg-amber-500/10 text-amber-700",
  },
  {
    id: "sdg-12",
    label: "SDG 12 - Responsible Consumption and Production",
    shortLabel: "SDG 12",
    toneClassName: "bg-lime-500/10 text-lime-700",
  },
  {
    id: "sdg-13",
    label: "SDG 13 - Climate Action",
    shortLabel: "SDG 13",
    toneClassName: "bg-green-500/10 text-green-700",
  },
  {
    id: "sdg-14",
    label: "SDG 14 - Life Below Water",
    shortLabel: "SDG 14",
    toneClassName: "bg-cyan-500/10 text-cyan-700",
  },
  {
    id: "sdg-15",
    label: "SDG 15 - Life on Land",
    shortLabel: "SDG 15",
    toneClassName: "bg-teal-500/10 text-teal-700",
  },
  {
    id: "sdg-16",
    label: "SDG 16 - Peace, Justice and Strong Institutions",
    shortLabel: "SDG 16",
    toneClassName: "bg-blue-500/10 text-blue-700",
  },
  {
    id: "sdg-17",
    label: "SDG 17 - Partnerships for the Goals",
    shortLabel: "SDG 17",
    toneClassName: "bg-indigo-500/10 text-indigo-700",
  },
];

export const SDGS_DASHBOARD_DIRECTORATES: SdgsDashboardDirectorate[] = [
  {
    id: "direktorat-akademik",
    name: "Direktorat Akademik",
    field: "Bidang Akademik dan Perencanaan Strategis",
    units: [
      unit("direktorat-akademik", "bsla", "Bagian Standar dan Layanan Akademik (BSLA)"),
      unit("direktorat-akademik", "bpa", "Bagian Pengembangan Akademik (BPA)"),
      unit("direktorat-akademik", "open-library", "Bagian Open Library"),
      unit("direktorat-akademik", "pddikti", "Bagian Pengelolaan PDDIKTI"),
    ],
  },
  {
    id: "direktorat-pembelajaran-digital-pusat-bahasa",
    name: "Direktorat Pembelajaran Digital & Pusat Bahasa",
    field: "Bidang Akademik dan Perencanaan Strategis",
    units: [
      unit(
        "direktorat-pembelajaran-digital-pusat-bahasa",
        "celoe",
        "Bagian Layanan Center of E-learning & Open Education (CELOE)",
      ),
      unit(
        "direktorat-pembelajaran-digital-pusat-bahasa",
        "pusat-bahasa",
        "Bagian Pusat Bahasa",
      ),
      unit(
        "direktorat-pembelajaran-digital-pusat-bahasa",
        "content-celoe",
        "Bagian Pengembangan Content Center of E-learning & Open Education",
      ),
    ],
  },
  {
    id: "direktorat-pasca-sarjana-kui",
    name: "Direktorat Pasca Sarjana & Kantor Urusan Internasional",
    field: "Bidang Akademik dan Perencanaan Strategis",
    units: [
      unit(
        "direktorat-pasca-sarjana-kui",
        "kantor-internasional",
        "Bagian Kantor Internasional",
      ),
    ],
  },
  {
    id: "direktorat-perencanaan-strategis-penjaminan-mutu",
    name: "Direktorat Perencanaan Strategis & Penjaminan Mutu",
    field: "Bidang Akademik dan Perencanaan Strategis",
    units: [
      unit(
        "direktorat-perencanaan-strategis-penjaminan-mutu",
        "p3i",
        "Bagian Perencanaan, Pengembangan, dan Pengendalian Institusi (P3I)",
      ),
      unit(
        "direktorat-perencanaan-strategis-penjaminan-mutu",
        "data-analytics",
        "Bagian Data Analytics",
      ),
      unit(
        "direktorat-perencanaan-strategis-penjaminan-mutu",
        "sarmut",
        "Bagian Satuan Penjaminan Mutu",
      ),
    ],
  },
  {
    id: "direktorat-keuangan",
    name: "Direktorat Keuangan",
    field: "Bidang Sumber Daya",
    units: [
      unit("direktorat-keuangan", "anggaran", "Bagian Anggaran"),
      unit("direktorat-keuangan", "perbendaharaan", "Bagian Perbendaharaan"),
      unit("direktorat-keuangan", "akuntansi", "Bagian Akuntansi"),
      unit(
        "direktorat-keuangan",
        "revenue-assurance",
        "Bagian Revenue Assurance Direktorat Keuangan",
      ),
    ],
  },
  {
    id: "direktorat-sdm",
    name: "Direktorat Sumber Daya Manusia",
    field: "Bidang Sumber Daya",
    units: [
      unit("direktorat-sdm", "pengembangan-sdm", "Bagian Pengembangan SDM"),
      unit(
        "direktorat-sdm",
        "perencanaan-budaya-performansi",
        "Bagian Perencanaan, Budaya dan Performansi",
      ),
      unit("direktorat-sdm", "pelayanan-sdm", "Bagian Pelayanan SDM"),
    ],
  },
  {
    id: "direktorat-asset-sustainability",
    name: "Direktorat Asset & Sustainability",
    field: "Bidang Sumber Daya",
    units: [
      unit("direktorat-asset-sustainability", "aset", "Bagian Aset"),
      unit(
        "direktorat-asset-sustainability",
        "maintenance-sustainability",
        "Bagian Maintenance dan Sustainability",
      ),
      unit(
        "direktorat-asset-sustainability",
        "pengelolaan-asrama",
        "Bagian Pengelolaan Asrama",
      ),
    ],
  },
  {
    id: "direktorat-pusat-teknologi-informasi",
    name: "Direktorat Pusat Teknologi Informasi",
    field: "Bidang Sumber Daya",
    units: [
      unit(
        "direktorat-pusat-teknologi-informasi",
        "riset-layanan-quality-management",
        "Bagian Riset, Layanan, dan Quality Management (TI)",
      ),
      unit(
        "direktorat-pusat-teknologi-informasi",
        "infrastruktur-ti",
        "Bagian Infrastruktur TI",
      ),
      unit(
        "direktorat-pusat-teknologi-informasi",
        "pengembangan-produk-ti",
        "Bagian Pengembangan Produk (TI)",
      ),
    ],
  },
  {
    id: "direktorat-pemasaran-admisi",
    name: "Direktorat Pemasaran dan Admisi",
    field: "Bidang Admisi, Kemahasiswaan dan Endowment",
    units: [
      unit(
        "direktorat-pemasaran-admisi",
        "riset-pemasaran-digital",
        "Bagian Riset & Pemasaran Digital",
      ),
      unit("direktorat-pemasaran-admisi", "admisi", "Bagian Admisi"),
      unit(
        "direktorat-pemasaran-admisi",
        "layanan-admisi",
        "Bagian Layanan Admisi",
      ),
      unit(
        "direktorat-pemasaran-admisi",
        "admisi-international",
        "Bagian Admisi International",
      ),
    ],
  },
  {
    id: "direktorat-kemahasiswaan-karier-alumni",
    name: "Direktorat Kemahasiswaan, Pengembangan Karier, dan Alumni",
    field: "Bidang Admisi, Kemahasiswaan dan Endowment",
    units: [
      unit(
        "direktorat-kemahasiswaan-karier-alumni",
        "prestasi-kegiatan-mahasiswa",
        "Bagian Prestasi dan Kegiatan Mahasiswa",
      ),
      unit(
        "direktorat-kemahasiswaan-karier-alumni",
        "pengembangan-karakter-kesejahteraan",
        "Bagian Pengembangan Karakter dan Kesejahteraan Mahasiswa",
      ),
      unit(
        "direktorat-kemahasiswaan-karier-alumni",
        "cae",
        "Bagian Pengembangan Karir & Alumni (CAE)",
      ),
    ],
  },
  {
    id: "direktorat-pengelolaan-dana-abadi",
    name: "Direktorat Pengelolaan Dana Abadi",
    field: "Bidang Admisi, Kemahasiswaan dan Endowment",
    units: [
      unit(
        "direktorat-pengelolaan-dana-abadi",
        "pengembangan-pemanfaatan",
        "Bagian Pengembangan dan Pemanfaatan",
      ),
      unit(
        "direktorat-pengelolaan-dana-abadi",
        "penghimpunan",
        "Bagian Penghimpunan",
      ),
    ],
  },
  {
    id: "direktorat-ppm",
    name: "Direktorat Penelitian & Pengabdian Masyarakat",
    field: "Bidang Riset, Inovasi, dan Pengembangan Bisnis",
    units: [
      unit("direktorat-ppm", "penelitian", "Bagian Penelitian"),
      unit(
        "direktorat-ppm",
        "jurnal-publikasi-pengabdian",
        "Bagian Jurnal, Publikasi, & Pengabdian Masyarakat",
      ),
    ],
  },
  {
    id: "direktorat-btp-pengembangan-bisnis",
    name: "Direktorat Bandung Techno Park & Pengembangan Bisnis",
    field: "Bidang Riset, Inovasi, dan Pengembangan Bisnis",
    units: [
      unit(
        "direktorat-btp-pengembangan-bisnis",
        "technology-transfer-innovation-partnership",
        "Bagian Teknologi Transfer dan Innovation Partnership",
      ),
      unit(
        "direktorat-btp-pengembangan-bisnis",
        "business-development-incubation",
        "Bagian Business Development & Incubation",
      ),
      unit(
        "direktorat-btp-pengembangan-bisnis",
        "business-operation-support",
        "Bagian Layanan Business Operation and Support",
      ),
      unit(
        "direktorat-btp-pengembangan-bisnis",
        "strategic-marketing",
        "Bagian Strategic Marketing",
      ),
    ],
  },
  {
    id: "sdgs-center-dcs",
    name: "SDGs Center: Digital Collaboration for Sustainability (DCS)",
    field: "Bidang Riset, Inovasi, dan Pengembangan Bisnis",
    units: [],
  },
  {
    id: "pui-pt",
    name: "Pusat Unggulan IPTEKS Perguruan Tinggi (PUI-PT)",
    field: "Bidang Riset, Inovasi, dan Pengembangan Bisnis",
    units: [],
  },
  {
    id: "research-institute",
    name: "Research Institute (RI)",
    field: "Bidang Riset, Inovasi, dan Pengembangan Bisnis",
    units: [
      unit(
        "research-institute",
        "connectivity-convergence",
        "Research Institute Connectivity and Convergence",
      ),
      unit(
        "research-institute",
        "intelligent-business-sustainable-economy",
        "Research Institute Intelligent Business and Sustainable Economy",
      ),
      unit(
        "research-institute",
        "digital-health-social-wellness",
        "Research Institute Digital Health, Social and Wellness",
      ),
    ],
  },
  {
    id: "center-of-excellence",
    name: "Center of Excellence (CoE)",
    field: "Bidang Riset, Inovasi, dan Pengembangan Bisnis",
    units: [],
  },
];

export const SDGS_DASHBOARD_INITIAL_VALUES: SdgsDashboardFormValues = {
  title: "",
  reportingYear: "",
  contentType: "metric",
  metricReference: "",
  metricTitle: "",
  value: "",
  isAvailable: "no",
  description: "",
  evidenceFiles: [],
  isPublic: "no",
  sdgGoals: [],
  directorateIds: [],
  unitIds: [],
  comment: "",
};

/**
 * Returns the flat list of units whose parent `directorateId` is in
 * `selectedDirectorateIds`.
 */
export function getUnitsForDirectorates(
  directorates: SdgsDashboardDirectorate[],
  selectedDirectorateIds: string[],
): SdgsDashboardUnit[] {
  if (selectedDirectorateIds.length === 0) {
    return [];
  }

  const selected = new Set(selectedDirectorateIds);
  const units: SdgsDashboardUnit[] = [];

  for (const directorate of directorates) {
    if (!selected.has(directorate.id)) continue;
    for (const item of directorate.units) {
      units.push(item);
    }
  }

  return units;
}

/**
 * Returns true when at least one selected directorate has a non-empty
 * `units` array. Used by the schema and the cascading selector to know
 * whether the Unit field is required/visible.
 */
export function selectedDirectoratesHaveUnits(
  directorates: SdgsDashboardDirectorate[],
  selectedDirectorateIds: string[],
): boolean {
  if (selectedDirectorateIds.length === 0) {
    return false;
  }

  const selected = new Set(selectedDirectorateIds);

  return directorates.some(
    (directorate) =>
      selected.has(directorate.id) && directorate.units.length > 0,
  );
}

/**
 * Filters `currentUnitIds` to only those whose parent unit's `directorateId`
 * is in `selectedDirectorateIds`. Removes orphan units that no longer belong
 * to any selected directorate.
 */
export function pruneUnitIds(
  directorates: SdgsDashboardDirectorate[],
  selectedDirectorateIds: string[],
  currentUnitIds: string[],
): string[] {
  if (currentUnitIds.length === 0) {
    return currentUnitIds;
  }

  const selected = new Set(selectedDirectorateIds);
  const allowedUnitIds = new Set<string>();

  for (const directorate of directorates) {
    if (!selected.has(directorate.id)) continue;
    for (const item of directorate.units) {
      allowedUnitIds.add(item.id);
    }
  }

  return currentUnitIds.filter((id) => allowedUnitIds.has(id));
}
