import type {
  SdgsContent,
  SdgsContentFormValues,
} from "@/types/sdgs-dashboard";

/**
 * Mock store. Acts as the "backend" until the real API is wired.
 * Module-scope keeps it stable across hook re-renders during a session.
 */
const mockStore: SdgsContent[] = [
  {
    id: "1",
    title: "Pemasangan Solar Panel — Gedung Bangkit",
    description:
      "Inisiatif efisiensi energi kampus melalui panel surya rooftop di Gedung Bangkit.",
    sdgs: ["sdg-7", "sdg-13"],
    isAvailable: "yes",
    publicVisibility: "yes",
    evidenceDescription:
      "Foto instalasi dan laporan konsumsi energi kuartal I 2026.",
    directorates: [
      { directorateId: "asset-sustainability", units: ["asset-maintenance-sustainability"] },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Beasiswa Inklusif 2026",
    description:
      "Program beasiswa untuk mahasiswa dari daerah 3T sebagai dukungan akses pendidikan.",
    sdgs: ["sdg-4", "sdg-10"],
    isAvailable: "yes",
    publicVisibility: "no",
    directorates: [
      {
        directorateId: "student-career-alumni",
        units: ["student-character-welfare"],
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const generateId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `mock-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const sdgsContentService = {
  async list(): Promise<SdgsContent[]> {
    await wait(120);
    return [...mockStore];
  },

  async create(values: SdgsContentFormValues): Promise<SdgsContent> {
    await wait(400);
    const created: SdgsContent = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      title: values.title,
      description: values.description,
      thumbnailName: values.thumbnailName || undefined,
      attachmentName: values.attachmentName || undefined,
      sdgs: values.sdgs.map((selection) => selection.sdgId),
      isAvailable: values.isAvailable,
      publicVisibility: values.publicVisibility,
      evidenceDescription: values.evidenceDescription || undefined,
      evidenceFileName: values.evidenceFileName || undefined,
      supportingLink: values.supportingLink || undefined,
      notes: values.notes || undefined,
      directorates: values.directorates,
    };
    mockStore.unshift(created);
    return created;
  },
};
