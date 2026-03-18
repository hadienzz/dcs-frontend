import {
  normalizeSdgGoalNumbers,
  type ProposalSdgSource,
} from "@/lib/sdg-goals";

export type DashboardTabId =
  | "overview"
  | "proposal"
  | "timeline"
  | "budget"
  | "progress";

export type ProposalMode = "form" | "pdf";
export type ProposalStatus = "draft" | "submitted" | "approved";
export type ExternalApprovalStatus =
  | "not_sent"
  | "pending"
  | "revision_requested"
  | "approved";
export type SdgProjectStatus = "ongoing" | "completed";
export type ProjectParticipantStatus = "joined" | "invited";
export type VisibilityScope = "csr" | "internal";
export type PartnerStageApprovalStatus = "pending" | "approved";

export interface DashboardTab {
  id: DashboardTabId;
  label: string;
  helper: string;
}

export interface ProposalFields {
  title: string;
  theme: string;
  scheme: string;
  overview: string;
  background: string;
  problemIdentification: string;
  programBenefits: string;
  objectives: string;
  targetPartners: string;
  targetBeneficiaries: string;
  outputs: string;
  location: string;
  successIndicators: string;
  riskMitigation: string;
}

export interface TimelineEntry {
  id: string;
  weekLabel: string;
  focus: string;
  deliverable: string;
  owner: string;
}

export interface BudgetExpense {
  id: string;
  description: string;
  date: string;
  amount: number;
}

export interface BudgetItem {
  id: string;
  category: string;
  description: string;
  volume: number;
  unit: string;
  unitCost: number;
  spentAmount: number;
  visibilityScope: VisibilityScope;
  expenses: BudgetExpense[];
}

export interface MonthlyReport {
  id: string;
  month: string;
  summary: string;
  fileName: string | null;
  visibilityScope: VisibilityScope;
}

export interface ProjectParticipant {
  id: string;
  name: string;
  role: string;
  status: ProjectParticipantStatus;
  joinedAt: string | null;
}

export interface SdgDashboardProjectRecord {
  id: string;
  slug: string;
  name: string;
  externalName: string;
  invitationCode: string;
  status: SdgProjectStatus;
  createdAt: string;
  updatedAt: string;
  participants: ProjectParticipant[];
  proposalMode: ProposalMode;
  proposalStatus: ProposalStatus;
  externalApprovalStatus: ExternalApprovalStatus;
  externalApprovalNote: string;
  externalApprovalUpdatedAt: string | null;
  timelineApprovalStatus: PartnerStageApprovalStatus;
  budgetApprovalStatus: PartnerStageApprovalStatus;
  progressApprovalStatus: PartnerStageApprovalStatus;
  proposalPdfName: string | null;
  proposalPdfDataUrl: string | null;
  proposalSdgGoals: number[];
  proposalSdgReasoning: string;
  proposalSdgSource: ProposalSdgSource;
  proposalSdgUpdatedAt: string | null;
  proposalFields: ProposalFields;
  timelineEntries: TimelineEntry[];
  timelineSaved: boolean;
  budgetItems: BudgetItem[];
  budgetSaved: boolean;
  monthlyReports: MonthlyReport[];
}

interface CreateProjectRecordInput {
  name: string;
  externalName: string;
}

type SeedBudgetItemInput = Omit<Partial<BudgetItem>, "expenses"> & {
  expenses?: Array<Partial<BudgetExpense>>;
};

interface CreateSeedProjectInput extends CreateProjectRecordInput {
  status?: SdgProjectStatus;
  createdAt?: string;
  updatedAt?: string;
  proposalMode?: ProposalMode;
  proposalStatus?: ProposalStatus;
  externalApprovalStatus?: ExternalApprovalStatus;
  externalApprovalNote?: string;
  externalApprovalUpdatedAt?: string | null;
  timelineApprovalStatus?: PartnerStageApprovalStatus;
  budgetApprovalStatus?: PartnerStageApprovalStatus;
  progressApprovalStatus?: PartnerStageApprovalStatus;
  proposalPdfName?: string | null;
  proposalPdfDataUrl?: string | null;
  proposalSdgGoals?: number[];
  proposalSdgReasoning?: string;
  proposalSdgSource?: ProposalSdgSource;
  proposalSdgUpdatedAt?: string | null;
  proposalFields?: Partial<ProposalFields>;
  timelineEntries?: Array<Partial<TimelineEntry>>;
  timelineSaved?: boolean;
  budgetItems?: SeedBudgetItemInput[];
  budgetSaved?: boolean;
  participants?: ProjectParticipant[];
  monthlyReports?: Array<Partial<MonthlyReport>>;
}

export const dashboardTabs: DashboardTab[] = [
  { id: "overview", label: "Ringkasan", helper: "Status kolaborasi & mitra" },
  { id: "proposal", label: "Proposal", helper: "Susun dan kirim ke mitra" },
  { id: "timeline", label: "Timeline", helper: "Rencana 3 bulan" },
  { id: "budget", label: "Budget RAB", helper: "RAB, realisasi, visibilitas" },
  { id: "progress", label: "Progress", helper: "Monitoring bulanan" },
];

export const proposalThemeOptions = [
  "Pendidikan inklusif dan dampak sosial",
  "Ketahanan iklim dan lingkungan",
  "Circular economy untuk kampus",
  "Pemberdayaan UMKM berbasis teknologi",
  "Kesehatan komunitas dan wellbeing",
];

export const proposalSchemeOptions = [
  "Pilot program kolaboratif",
  "Riset terapan berbasis mitra",
  "Program CSR bersama",
  "Implementasi multi stakeholder",
];

export const timelineOwnerOptions = [
  "Tim SDGs",
  "Mitra eksternal",
  "Gabungan SDGs + mitra",
  "Tim lapangan",
];

export const visibilityScopeOptions: Array<{
  value: VisibilityScope;
  label: string;
  helper: string;
}> = [
  {
    value: "csr",
    label: "Bagikan ke mitra",
    helper: "Item ini tampil di portal eksternal.",
  },
  {
    value: "internal",
    label: "Internal saja",
    helper: "Item ini hanya terlihat di workspace SDGs.",
  },
];

export const initialProposalFields: ProposalFields = {
  title: "Program Kolaborasi SDGs",
  theme: "Circular economy untuk kampus",
  scheme: "Pilot program kolaboratif",
  overview:
    "Program ini menghubungkan tim SDGs dan mitra eksternal untuk membangun alur kerja kolaborasi yang transparan, terukur, dan mudah dipantau.",
  background:
    "Kolaborasi proyek SDGs melibatkan beberapa pihak dengan ritme kerja, dokumen, dan approval yang berbeda. Tanpa workspace bersama, proposal, timeline, anggaran, dan laporan mudah terpencar.",
  problemIdentification:
    "Belum ada satu dashboard yang merapikan alur proposal sampai progress report. Dampaknya, approval sulit ditelusuri, pembagian peran tidak selalu jelas, dan laporan berkala rawan terlambat.",
  programBenefits:
    "Portal ini membantu SDGs dan mitra eksternal melihat status proyek, menyamakan ekspektasi, serta memastikan milestone, RAB, dan laporan tersusun rapi.",
  objectives:
    "Menyediakan alur kerja proyek yang terstruktur dari proposal, approval, timeline, budget RAB, sampai monitoring bulanan dalam satu dashboard bersama.",
  targetPartners:
    "Mitra CSR, perusahaan implementasi, lembaga donor, komunitas lokal, dan institusi pendamping.",
  targetBeneficiaries:
    "Tim SDGs internal, mitra eksternal, pengelola proyek lapangan, dan stakeholder evaluasi.",
  outputs:
    "Satu proposal terverifikasi, timeline 3 bulan, dokumen budget RAB, realisasi anggaran, dan laporan bulanan yang mudah ditelusuri.",
  location: "Bandung, Jawa Barat",
  successIndicators:
    "Proposal disetujui tepat waktu, timeline dan RAB terisi lengkap, serta tiga laporan bulanan dapat diunggah sesuai jadwal.",
  riskMitigation:
    "Setiap tahap diberi status yang jelas, akses mitra dikunci melalui invitation code, dan setiap dokumen punya owner yang bertanggung jawab.",
};

export const initialTimelineEntries: TimelineEntry[] = [
  {
    id: "month-1",
    weekLabel: "Bulan 1",
    focus: "Kickoff proyek, alignment scope, dan finalisasi indikator monitoring bersama mitra.",
    deliverable: "Berita acara kickoff, indikator baseline, dan kebutuhan implementasi awal.",
    owner: "Gabungan SDGs + mitra",
  },
  {
    id: "month-2",
    weekLabel: "Bulan 2",
    focus: "Eksekusi aktivitas utama, monitoring lapangan, serta pembaruan realisasi anggaran.",
    deliverable: "Dokumentasi implementasi, status serapan anggaran, dan evaluasi tengah.",
    owner: "Tim lapangan",
  },
  {
    id: "month-3",
    weekLabel: "Bulan 3",
    focus: "Penutupan fase program, evaluasi dampak, dan persiapan laporan akhir ke mitra.",
    deliverable: "Laporan pembelajaran, rekomendasi tindak lanjut, dan paket dokumentasi akhir.",
    owner: "Tim SDGs",
  },
];

const legacyDefaultBudgetItems: BudgetItem[] = [
  {
    id: "budget-1",
    category: "Persiapan",
    description: "Workshop kickoff dan alignment stakeholder",
    volume: 1,
    unit: "paket",
    unitCost: 5000000,
    spentAmount: 0,
    visibilityScope: "csr",
    expenses: [],
  },
  {
    id: "budget-2",
    category: "Operasional",
    description: "Kunjungan lapangan dan koordinasi mingguan",
    volume: 4,
    unit: "minggu",
    unitCost: 2500000,
    spentAmount: 0,
    visibilityScope: "csr",
    expenses: [],
  },
  {
    id: "budget-3",
    category: "Dokumentasi",
    description: "Dokumentasi visual, rekap laporan, dan desain report",
    volume: 3,
    unit: "bulan",
    unitCost: 1800000,
    spentAmount: 0,
    visibilityScope: "internal",
    expenses: [],
  },
];

export const initialBudgetItems: BudgetItem[] = [];

export const initialMonthlyReports: MonthlyReport[] = [
  {
    id: "month-1",
    month: "Bulan 1",
    summary: "Kickoff, proposal final, dan baseline aktivitas.",
    fileName: null,
    visibilityScope: "internal",
  },
  {
    id: "month-2",
    month: "Bulan 2",
    summary: "Implementasi utama, monitoring mingguan, dan evaluasi tengah.",
    fileName: null,
    visibilityScope: "internal",
  },
  {
    id: "month-3",
    month: "Bulan 3",
    summary: "Penutupan fase pertama, pembelajaran, dan rekomendasi lanjutan.",
    fileName: null,
    visibilityScope: "internal",
  },
];

const legacyDefaultMonthlyReports: MonthlyReport[] = [
  {
    id: "month-1",
    month: "Bulan 1",
    summary: "Kickoff, proposal final, dan baseline aktivitas.",
    fileName: null,
    visibilityScope: "csr",
  },
  {
    id: "month-2",
    month: "Bulan 2",
    summary: "Implementasi utama, monitoring mingguan, dan evaluasi tengah.",
    fileName: null,
    visibilityScope: "csr",
  },
  {
    id: "month-3",
    month: "Bulan 3",
    summary: "Penutupan fase pertama, pembelajaran, dan rekomendasi lanjutan.",
    fileName: null,
    visibilityScope: "csr",
  },
];

function cloneProposalFields(
  name: string,
  externalName: string,
  overrides?: Partial<ProposalFields>,
): ProposalFields {
  return {
    ...initialProposalFields,
    title: name,
    targetPartners: externalName,
    overview: `Program ${name} dirancang untuk memudahkan koordinasi tim SDGs dengan ${externalName} melalui satu workspace pelaporan yang rapi, transparan, dan mudah dipantau.`,
    ...overrides,
  };
}

function cloneTimelineEntries(
  timelineEntries?: Array<Partial<TimelineEntry>>,
): TimelineEntry[] {
  const source = timelineEntries ?? initialTimelineEntries;

  return source.map((entry, index) => ({
    id: entry.id ?? `timeline-${index + 1}`,
    weekLabel: entry.weekLabel ?? `Bulan ${index + 1}`,
    focus: entry.focus ?? "",
    deliverable: entry.deliverable ?? "",
    owner: entry.owner ?? "Tim SDGs",
  }));
}

function cloneBudgetExpenses(
  budgetItem: SeedBudgetItemInput,
  fallbackDescription: string,
): BudgetExpense[] {
  if (budgetItem.expenses?.length) {
    return budgetItem.expenses.map((expense, index) => ({
      id: expense.id ?? `expense-${index + 1}`,
      description: expense.description ?? fallbackDescription,
      date: expense.date ?? new Date().toISOString().slice(0, 10),
      amount: Number(expense.amount) || 0,
    }));
  }

  const fallbackAmount = Number(budgetItem.spentAmount) || 0;

  if (fallbackAmount <= 0) {
    return [];
  }

  return [
    {
      id: createId("expense"),
      description: fallbackDescription,
      date: new Date().toISOString().slice(0, 10),
      amount: fallbackAmount,
    },
  ];
}

function cloneBudgetItems(budgetItems?: SeedBudgetItemInput[]): BudgetItem[] {
  const source = budgetItems ?? initialBudgetItems;

  return source.map((item, index) => {
    const description = item.description ?? "";
    const expenses = cloneBudgetExpenses(item, description || "Pengeluaran");
    const spentAmount = expenses.reduce((total, expense) => total + expense.amount, 0);

    return {
      id: item.id ?? `budget-${index + 1}`,
      category: item.category ?? "Operasional",
      description,
      volume: Number(item.volume) || 0,
      unit: item.unit ?? "paket",
      unitCost: Number(item.unitCost) || 0,
      spentAmount,
      visibilityScope: item.visibilityScope === "internal" ? "internal" : "csr",
      expenses,
    };
  });
}

function cloneMonthlyReports(
  monthlyReports?: Array<Partial<MonthlyReport>>,
): MonthlyReport[] {
  const source = monthlyReports ?? initialMonthlyReports;

  return source.map((report, index) => ({
    id: report.id ?? `report-${index + 1}`,
    month: report.month ?? `Bulan ${index + 1}`,
    summary: report.summary ?? "",
    fileName: report.fileName ?? null,
    visibilityScope: report.visibilityScope === "internal" ? "internal" : "csr",
  }));
}

function matchesLegacyBudgetTemplate(items: BudgetItem[]) {
  return (
    items.length === legacyDefaultBudgetItems.length &&
    items.every((item, index) => {
      const legacyItem = legacyDefaultBudgetItems[index];

      return (
        item.category === legacyItem.category &&
        item.description === legacyItem.description &&
        item.volume === legacyItem.volume &&
        item.unit === legacyItem.unit &&
        item.unitCost === legacyItem.unitCost &&
        item.spentAmount === 0 &&
        item.visibilityScope === legacyItem.visibilityScope &&
        item.expenses.length === 0
      );
    })
  );
}

function matchesLegacyMonthlyReportTemplate(reports: MonthlyReport[]) {
  return (
    reports.length === legacyDefaultMonthlyReports.length &&
    reports.every((report, index) => {
      const legacyReport = legacyDefaultMonthlyReports[index];

      return (
        report.month === legacyReport.month &&
        report.summary === legacyReport.summary &&
        report.fileName === null &&
        report.visibilityScope === legacyReport.visibilityScope
      );
    })
  );
}

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function deriveExternalApprovalStatus(
  proposalStatus: ProposalStatus,
  currentStatus?: string | null,
): ExternalApprovalStatus {
  if (currentStatus === "approved") {
    return "approved";
  }

  if (currentStatus === "revision_requested") {
    return "revision_requested";
  }

  if (currentStatus === "pending") {
    return "pending";
  }

  if (proposalStatus === "approved") {
    return "approved";
  }

  if (proposalStatus === "submitted") {
    return "pending";
  }

  return "not_sent";
}

export function slugifyProjectName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function ensureUniqueSlug(baseName: string, existingSlugs: string[]) {
  const normalizedBase = slugifyProjectName(baseName) || "proyek-sdgs";

  if (!existingSlugs.includes(normalizedBase)) {
    return normalizedBase;
  }

  let counter = 2;
  let candidate = `${normalizedBase}-${counter}`;

  while (existingSlugs.includes(candidate)) {
    counter += 1;
    candidate = `${normalizedBase}-${counter}`;
  }

  return candidate;
}

export function generateInvitationCode() {
  return `SDGS-EXT-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function createDefaultParticipants(externalName: string) {
  return [
    {
      id: createId("participant"),
      name: "Admin SDGs",
      role: "Project owner",
      status: "joined" as const,
      joinedAt: new Date().toISOString(),
    },
    {
      id: createId("participant"),
      name: externalName,
      role: "Mitra eksternal",
      status: "invited" as const,
      joinedAt: null,
    },
  ];
}

function hasSharedPartnerReports(reports?: Array<Partial<MonthlyReport>>) {
  return (reports ?? []).some(
    (report) => report.visibilityScope !== "internal" && Boolean(report.fileName),
  );
}

function derivePartnerStageApprovalStatus(
  status: PartnerStageApprovalStatus | null,
  isEligible: boolean,
  fallbackApproved: boolean,
): PartnerStageApprovalStatus {
  if (!isEligible) {
    return "pending";
  }

  if (status === "approved") {
    return "approved";
  }

  return fallbackApproved ? "approved" : "pending";
}

export function normalizeProjectRecord(
  rawProject: Partial<SdgDashboardProjectRecord>,
  existingSlugs: string[] = [],
): SdgDashboardProjectRecord {
  const projectName = rawProject.name?.trim() || "Project SDGs";
  const externalName = rawProject.externalName?.trim() || "Mitra eksternal";
  const proposalStatus: ProposalStatus =
    rawProject.proposalStatus === "approved" ||
    rawProject.proposalStatus === "submitted"
      ? rawProject.proposalStatus
      : "draft";
  const externalApprovalStatus = deriveExternalApprovalStatus(
    proposalStatus,
    rawProject.externalApprovalStatus ?? null,
  );
  const slug =
    rawProject.slug && !existingSlugs.includes(rawProject.slug)
      ? rawProject.slug
      : ensureUniqueSlug(projectName, existingSlugs);
  const createdAt = rawProject.createdAt ?? new Date().toISOString();
  const updatedAt = rawProject.updatedAt ?? createdAt;
  const budgetSaved = Boolean(rawProject.budgetSaved);
  const normalizedBudgetItems = cloneBudgetItems(rawProject.budgetItems);
  const budgetItems =
    !budgetSaved && matchesLegacyBudgetTemplate(normalizedBudgetItems)
      ? []
      : normalizedBudgetItems;
  const normalizedMonthlyReports = cloneMonthlyReports(rawProject.monthlyReports);
  const monthlyReports = matchesLegacyMonthlyReportTemplate(normalizedMonthlyReports)
    ? cloneMonthlyReports(initialMonthlyReports)
    : normalizedMonthlyReports;
  const timelineApprovalEligible =
    externalApprovalStatus === "approved" && Boolean(rawProject.timelineSaved);
  const budgetApprovalEligible =
    externalApprovalStatus === "approved" && budgetSaved;
  const progressApprovalEligible =
    externalApprovalStatus === "approved" && hasSharedPartnerReports(monthlyReports);
  const timelineApprovalStatus = derivePartnerStageApprovalStatus(
    rawProject.timelineApprovalStatus ?? null,
    timelineApprovalEligible,
    rawProject.timelineApprovalStatus == null && timelineApprovalEligible,
  );
  const budgetApprovalStatus = derivePartnerStageApprovalStatus(
    rawProject.budgetApprovalStatus ?? null,
    budgetApprovalEligible,
    rawProject.budgetApprovalStatus == null && budgetApprovalEligible,
  );
  const progressApprovalStatus = derivePartnerStageApprovalStatus(
    rawProject.progressApprovalStatus ?? null,
    progressApprovalEligible,
    rawProject.progressApprovalStatus == null && progressApprovalEligible,
  );

  return {
    id: rawProject.id ?? createId("project"),
    slug,
    name: projectName,
    externalName,
    invitationCode: rawProject.invitationCode ?? generateInvitationCode(),
    status: rawProject.status === "completed" ? "completed" : "ongoing",
    createdAt,
    updatedAt,
    participants:
      rawProject.participants?.length
        ? rawProject.participants.map((participant) => ({
            id: participant.id ?? createId("participant"),
            name: participant.name ?? externalName,
            role: participant.role ?? "Mitra eksternal",
            status: participant.status === "joined" ? "joined" : "invited",
            joinedAt: participant.joinedAt ?? null,
          }))
        : createDefaultParticipants(externalName),
    proposalMode: rawProject.proposalMode === "pdf" ? "pdf" : "form",
    proposalStatus,
    externalApprovalStatus,
    externalApprovalNote: rawProject.externalApprovalNote ?? "",
    externalApprovalUpdatedAt: rawProject.externalApprovalUpdatedAt ?? null,
    timelineApprovalStatus,
    budgetApprovalStatus,
    progressApprovalStatus,
    proposalPdfName: rawProject.proposalPdfName ?? null,
    proposalPdfDataUrl: rawProject.proposalPdfDataUrl ?? null,
    proposalSdgGoals: normalizeSdgGoalNumbers(rawProject.proposalSdgGoals),
    proposalSdgReasoning: rawProject.proposalSdgReasoning?.trim() ?? "",
    proposalSdgSource:
      rawProject.proposalSdgSource === "ai" || rawProject.proposalSdgSource === "manual"
        ? rawProject.proposalSdgSource
        : null,
    proposalSdgUpdatedAt: rawProject.proposalSdgUpdatedAt ?? null,
    proposalFields: cloneProposalFields(
      projectName,
      externalName,
      rawProject.proposalFields,
    ),
    timelineEntries: cloneTimelineEntries(rawProject.timelineEntries),
    timelineSaved: Boolean(rawProject.timelineSaved),
    budgetItems,
    budgetSaved,
    monthlyReports,
  };
}

export function createProjectRecord(
  input: CreateProjectRecordInput,
  existingSlugs: string[] = [],
): SdgDashboardProjectRecord {
  const now = new Date().toISOString();
  const slug = ensureUniqueSlug(input.name, existingSlugs);

  return {
    id: createId("project"),
    slug,
    name: input.name,
    externalName: input.externalName,
    invitationCode: generateInvitationCode(),
    status: "ongoing",
    createdAt: now,
    updatedAt: now,
    participants: createDefaultParticipants(input.externalName),
    proposalMode: "form",
    proposalStatus: "draft",
    externalApprovalStatus: "not_sent",
    externalApprovalNote: "",
    externalApprovalUpdatedAt: null,
    timelineApprovalStatus: "pending",
    budgetApprovalStatus: "pending",
    progressApprovalStatus: "pending",
    proposalPdfName: null,
    proposalPdfDataUrl: null,
    proposalSdgGoals: [],
    proposalSdgReasoning: "",
    proposalSdgSource: null,
    proposalSdgUpdatedAt: null,
    proposalFields: cloneProposalFields(input.name, input.externalName),
    timelineEntries: cloneTimelineEntries(),
    timelineSaved: false,
    budgetItems: [],
    budgetSaved: false,
    monthlyReports: cloneMonthlyReports(initialMonthlyReports),
  };
}

function createSeedProject(
  input: CreateSeedProjectInput,
  existingSlugs: string[] = [],
): SdgDashboardProjectRecord {
  const project = createProjectRecord(input, existingSlugs);

  return normalizeProjectRecord(
    {
      ...project,
      status: input.status ?? project.status,
      createdAt: input.createdAt ?? project.createdAt,
      updatedAt: input.updatedAt ?? input.createdAt ?? project.updatedAt,
      participants: input.participants ?? project.participants,
      proposalMode: input.proposalMode ?? project.proposalMode,
      proposalStatus: input.proposalStatus ?? project.proposalStatus,
      externalApprovalStatus:
        input.externalApprovalStatus ?? project.externalApprovalStatus,
      externalApprovalNote:
        input.externalApprovalNote ?? project.externalApprovalNote,
      externalApprovalUpdatedAt:
        input.externalApprovalUpdatedAt ?? project.externalApprovalUpdatedAt,
      timelineApprovalStatus:
        input.timelineApprovalStatus ?? project.timelineApprovalStatus,
      budgetApprovalStatus: input.budgetApprovalStatus ?? project.budgetApprovalStatus,
      progressApprovalStatus:
        input.progressApprovalStatus ?? project.progressApprovalStatus,
      proposalPdfName: input.proposalPdfName ?? project.proposalPdfName,
      proposalPdfDataUrl: input.proposalPdfDataUrl ?? project.proposalPdfDataUrl,
      proposalSdgGoals: input.proposalSdgGoals ?? project.proposalSdgGoals,
      proposalSdgReasoning:
        input.proposalSdgReasoning ?? project.proposalSdgReasoning,
      proposalSdgSource: input.proposalSdgSource ?? project.proposalSdgSource,
      proposalSdgUpdatedAt:
        input.proposalSdgUpdatedAt ?? project.proposalSdgUpdatedAt,
      proposalFields: cloneProposalFields(
        input.name,
        input.externalName,
        input.proposalFields,
      ),
      timelineEntries: cloneTimelineEntries(input.timelineEntries),
      timelineSaved: input.timelineSaved ?? project.timelineSaved,
      budgetItems: cloneBudgetItems(input.budgetItems),
      budgetSaved: input.budgetSaved ?? project.budgetSaved,
      monthlyReports: cloneMonthlyReports(input.monthlyReports),
    },
    existingSlugs,
  );
}

export function createSeedProjects(): SdgDashboardProjectRecord[] {
  const now = new Date();
  const joinedAt = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 18).toISOString();
  const reviewAt = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 4).toISOString();

  const firstProject = createSeedProject({
    name: "Circular Campus Partnership 2026",
    externalName: "PT Green Circle Indonesia",
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
    proposalStatus: "approved",
    externalApprovalStatus: "approved",
    externalApprovalNote:
      "Proposal sudah sesuai ruang lingkup CSR dan dapat dilanjutkan ke implementasi tahap pertama.",
    externalApprovalUpdatedAt: reviewAt,
    timelineSaved: true,
    budgetSaved: true,
    participants: [
      {
        id: createId("participant"),
        name: "Admin SDGs",
        role: "Project owner",
        status: "joined",
        joinedAt,
      },
      {
        id: createId("participant"),
        name: "Nadia Rahma",
        role: "PIC eksternal",
        status: "joined",
        joinedAt,
      },
      {
        id: createId("participant"),
        name: "PT Green Circle Indonesia",
        role: "Mitra organisasi",
        status: "joined",
        joinedAt,
      },
    ],
    budgetItems: [
      {
        category: "Persiapan",
        description: "Workshop kickoff dan alignment stakeholder",
        volume: 1,
        unit: "paket",
        unitCost: 6500000,
        spentAmount: 6500000,
        visibilityScope: "csr",
        expenses: [
          {
            description: "Sewa ruang kickoff dan perlengkapan presentasi",
            date: "2026-02-20",
            amount: 3200000,
          },
          {
            description: "Konsumsi stakeholder kickoff",
            date: "2026-02-20",
            amount: 1800000,
          },
          {
            description: "Dokumentasi dan materi workshop",
            date: "2026-02-21",
            amount: 1500000,
          },
        ],
      },
      {
        category: "Operasional",
        description: "Pendampingan lapangan dan monitoring mingguan",
        volume: 6,
        unit: "kunjungan",
        unitCost: 2750000,
        spentAmount: 8250000,
        visibilityScope: "csr",
        expenses: [
          {
            description: "Transport tim monitoring minggu 1-3",
            date: "2026-03-01",
            amount: 4100000,
          },
          {
            description: "Transport tim monitoring minggu 4-6",
            date: "2026-03-12",
            amount: 4150000,
          },
        ],
      },
      {
        category: "Dokumentasi",
        description: "Konten visual internal dan rekap media",
        volume: 3,
        unit: "bulan",
        unitCost: 2000000,
        spentAmount: 1300000,
        visibilityScope: "internal",
      },
    ],
    monthlyReports: [
      {
        month: "Bulan 1",
        summary: "Kickoff, baseline emisi kampus, dan finalisasi dashboard monitoring bersama mitra.",
        fileName: "circular-campus-bulan-1.pdf",
        visibilityScope: "csr",
      },
      {
        month: "Bulan 2",
        summary: "Pendampingan pengumpulan sampah terpilah dan evaluasi awal serapan anggaran.",
        fileName: null,
        visibilityScope: "csr",
      },
      {
        month: "Bulan 3",
        summary: "Penutupan fase pertama dan rekomendasi scale-up program.",
        fileName: null,
        visibilityScope: "internal",
      },
    ],
  });

  const secondProject = createSeedProject(
    {
      name: "Smart Waste Routing for School Network",
      externalName: "Astra Infra Foundation",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 12).toISOString(),
      updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 18).toISOString(),
      proposalStatus: "submitted",
      externalApprovalStatus: "pending",
      externalApprovalNote:
        "Proposal sedang direview tim CSR untuk penyelarasan scope program dan penjadwalan kickoff.",
      participants: [
        {
          id: createId("participant"),
          name: "Admin SDGs",
          role: "Lead program",
          status: "joined",
          joinedAt,
        },
        {
          id: createId("participant"),
          name: "Fajar Saputra",
          role: "Koordinator operasional",
          status: "joined",
          joinedAt,
        },
        {
          id: createId("participant"),
          name: "Astra Infra Foundation",
          role: "Mitra CSR",
          status: "invited",
          joinedAt: null,
        },
      ],
      budgetItems: [
        {
          category: "Persiapan",
          description: "Survei sekolah mitra dan rapat koordinasi awal",
          volume: 2,
          unit: "agenda",
          unitCost: 3000000,
          spentAmount: 0,
          visibilityScope: "csr",
        },
        {
          category: "Internal support",
          description: "Penyusunan template monitoring internal",
          volume: 1,
          unit: "paket",
          unitCost: 1750000,
          spentAmount: 750000,
          visibilityScope: "internal",
        },
      ],
      monthlyReports: [
        {
          month: "Bulan 1",
          summary: "Rencana kickoff, baseline sekolah mitra, dan finalisasi scope proyek.",
          fileName: null,
          visibilityScope: "csr",
        },
        {
          month: "Bulan 2",
          summary: "Implementasi sistem routing dan monitoring bersama sekolah.",
          fileName: null,
          visibilityScope: "csr",
        },
        {
          month: "Bulan 3",
          summary: "Review hasil pilot dan rekomendasi fase lanjutan.",
          fileName: null,
          visibilityScope: "csr",
        },
      ],
    },
    [firstProject.slug],
  );

  const thirdProject = createSeedProject(
    {
      name: "Women Digital Finance Circles",
      externalName: "Bank Syariah Nusantara",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 8).toISOString(),
      updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 12).toISOString(),
      proposalStatus: "draft",
      externalApprovalStatus: "revision_requested",
      externalApprovalNote:
        "Mitra meminta target peserta dipersempit dan timeline pelatihan dibuat lebih realistis untuk fase awal.",
      participants: [
        {
          id: createId("participant"),
          name: "Admin SDGs",
          role: "Program lead",
          status: "joined",
          joinedAt,
        },
        {
          id: createId("participant"),
          name: "Bank Syariah Nusantara",
          role: "Mitra CSR",
          status: "joined",
          joinedAt,
        },
      ],
      budgetItems: [
        {
          category: "Pelatihan",
          description: "Pelatihan literasi keuangan dan pendampingan mentor",
          volume: 3,
          unit: "kelas",
          unitCost: 2400000,
          spentAmount: 0,
          visibilityScope: "csr",
        },
      ],
    },
    [firstProject.slug, secondProject.slug],
  );

  const fourthProject = createSeedProject(
    {
      name: "Community Health Impact Review",
      externalName: "Yayasan Sehat Bersama",
      status: "completed",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 120).toISOString(),
      updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 36).toISOString(),
      proposalStatus: "approved",
      externalApprovalStatus: "approved",
      externalApprovalNote:
        "Seluruh deliverable fase pertama sudah diterima dan program dapat ditutup sebagai arsip.",
      externalApprovalUpdatedAt: new Date(
        now.getTime() - 1000 * 60 * 60 * 24 * 40,
      ).toISOString(),
      timelineSaved: true,
      budgetSaved: true,
      participants: [
        {
          id: createId("participant"),
          name: "Admin SDGs",
          role: "Project owner",
          status: "joined",
          joinedAt,
        },
        {
          id: createId("participant"),
          name: "Rizky Mahendra",
          role: "Koordinator program",
          status: "joined",
          joinedAt,
        },
        {
          id: createId("participant"),
          name: "Yayasan Sehat Bersama",
          role: "Mitra eksternal",
          status: "joined",
          joinedAt,
        },
      ],
      budgetItems: [
      {
        category: "Operasional",
        description: "Kunjungan kesehatan komunitas dan evaluasi tengah",
        volume: 6,
        unit: "kunjungan",
        unitCost: 1850000,
        spentAmount: 11100000,
        visibilityScope: "csr",
        expenses: [
          {
            description: "Kunjungan lapangan bulan 1",
            date: "2025-11-10",
            amount: 3600000,
          },
          {
            description: "Kunjungan lapangan bulan 2",
            date: "2025-12-08",
            amount: 3700000,
          },
          {
            description: "Evaluasi tengah dan kunjungan lanjutan",
            date: "2026-01-14",
            amount: 3800000,
          },
        ],
      },
      {
        category: "Pelaporan",
        description: "Rekap data dan dokumen penutupan program",
        volume: 1,
        unit: "paket",
        unitCost: 4000000,
        spentAmount: 3600000,
        visibilityScope: "csr",
        expenses: [
          {
            description: "Desain laporan akhir",
            date: "2026-01-28",
            amount: 1800000,
          },
          {
            description: "Verifikasi data dan layout dokumen",
            date: "2026-02-02",
            amount: 1800000,
          },
        ],
      },
      ],
      monthlyReports: [
        {
          month: "Bulan 1",
          summary: "Kickoff, koordinasi lapangan, dan baseline kesehatan.",
          fileName: "laporan-progres-bulan-1.pdf",
          visibilityScope: "csr",
        },
        {
          month: "Bulan 2",
          summary: "Pelaksanaan intervensi utama dan evaluasi tengah.",
          fileName: "laporan-progres-bulan-2.pdf",
          visibilityScope: "csr",
        },
        {
          month: "Bulan 3",
          summary: "Penutupan fase pertama dan rekomendasi tindak lanjut.",
          fileName: "laporan-progres-bulan-3.pdf",
          visibilityScope: "csr",
        },
      ],
    },
    [firstProject.slug, secondProject.slug, thirdProject.slug],
  );

  const fifthProject = createSeedProject(
    {
      name: "Urban Farming Learning Pods",
      externalName: "PT Pangan Lestari",
      status: "completed",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 160).toISOString(),
      updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 52).toISOString(),
      proposalStatus: "approved",
      externalApprovalStatus: "approved",
      externalApprovalNote:
        "Program berhasil diselesaikan dengan dokumentasi lengkap untuk fase arsip.",
      timelineSaved: true,
      budgetSaved: true,
      participants: [
        {
          id: createId("participant"),
          name: "Admin SDGs",
          role: "Project owner",
          status: "joined",
          joinedAt,
        },
        {
          id: createId("participant"),
          name: "PT Pangan Lestari",
          role: "Mitra CSR",
          status: "joined",
          joinedAt,
        },
      ],
      budgetItems: [
        {
          category: "Implementasi",
          description: "Instalasi kebun belajar dan perawatan awal",
          volume: 4,
          unit: "site",
          unitCost: 3200000,
          spentAmount: 12100000,
          visibilityScope: "csr",
        },
        {
          category: "Internal support",
          description: "Kontrol kualitas bahan dan dokumentasi internal",
          volume: 2,
          unit: "paket",
          unitCost: 1500000,
          spentAmount: 2100000,
          visibilityScope: "internal",
        },
      ],
      monthlyReports: [
        {
          month: "Bulan 1",
          summary: "Instalasi awal dan orientasi komunitas sasaran.",
          fileName: "urban-farming-bulan-1.pdf",
          visibilityScope: "csr",
        },
        {
          month: "Bulan 2",
          summary: "Pendampingan perawatan dan kelas praktik menanam.",
          fileName: "urban-farming-bulan-2.pdf",
          visibilityScope: "csr",
        },
        {
          month: "Bulan 3",
          summary: "Panen perdana dan rekomendasi scale-up program.",
          fileName: "urban-farming-bulan-3.pdf",
          visibilityScope: "csr",
        },
      ],
    },
    [firstProject.slug, secondProject.slug, thirdProject.slug, fourthProject.slug],
  );

  const sixthProject = createSeedProject(
    {
      name: "Inclusive Talent Bridge",
      externalName: "Digital Future Alliance",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 6).toISOString(),
      proposalStatus: "approved",
      externalApprovalStatus: "approved",
      externalApprovalNote:
        "Mitra menyetujui fase implementasi dan meminta update bulanan tetap dibagikan melalui portal eksternal.",
      timelineSaved: true,
      budgetSaved: true,
      participants: [
        {
          id: createId("participant"),
          name: "Admin SDGs",
          role: "Project owner",
          status: "joined",
          joinedAt,
        },
        {
          id: createId("participant"),
          name: "Gina Lestari",
          role: "Program coordinator",
          status: "joined",
          joinedAt,
        },
        {
          id: createId("participant"),
          name: "Digital Future Alliance",
          role: "Mitra eksternal",
          status: "joined",
          joinedAt,
        },
      ],
      budgetItems: [
      {
        category: "Pelatihan",
        description: "Pelatihan soft skill dan simulasi interview",
        volume: 5,
        unit: "sesi",
        unitCost: 2200000,
        spentAmount: 6600000,
        visibilityScope: "csr",
        expenses: [
          {
            description: "Honor fasilitator sesi 1-2",
            date: "2026-02-16",
            amount: 2600000,
          },
          {
            description: "Honor fasilitator sesi 3-5",
            date: "2026-03-02",
            amount: 4000000,
          },
        ],
      },
      {
        category: "Mentoring",
        description: "Pendampingan mentor industri",
        volume: 8,
        unit: "sesi",
        unitCost: 950000,
        spentAmount: 2850000,
        visibilityScope: "csr",
        expenses: [
          {
            description: "Sesi mentoring batch pertama",
            date: "2026-02-24",
            amount: 1400000,
          },
          {
            description: "Sesi mentoring batch kedua",
            date: "2026-03-10",
            amount: 1450000,
          },
        ],
      },
        {
          category: "Internal support",
          description: "Evaluasi talent mapping internal",
          volume: 1,
          unit: "paket",
          unitCost: 2000000,
          spentAmount: 450000,
          visibilityScope: "internal",
        },
      ],
      monthlyReports: [
        {
          month: "Bulan 1",
          summary: "Rekrutmen peserta, assessment awal, dan kickoff mentoring.",
          fileName: "inclusive-talent-bulan-1.pdf",
          visibilityScope: "csr",
        },
        {
          month: "Bulan 2",
          summary: "Pelatihan intensif dan evaluasi kesiapan kerja peserta.",
          fileName: "inclusive-talent-bulan-2.pdf",
          visibilityScope: "csr",
        },
        {
          month: "Bulan 3",
          summary: "Pendampingan penempatan dan rekomendasi fase lanjutan.",
          fileName: null,
          visibilityScope: "csr",
        },
      ],
    },
    [
      firstProject.slug,
      secondProject.slug,
      thirdProject.slug,
      fourthProject.slug,
      fifthProject.slug,
    ],
  );

  return [
    sixthProject,
    secondProject,
    thirdProject,
    firstProject,
    fourthProject,
    fifthProject,
  ];
}

export function getJoinedParticipants(project: SdgDashboardProjectRecord) {
  return project.participants.filter((participant) => participant.status === "joined");
}

export function getInvitedParticipants(project: SdgDashboardProjectRecord) {
  return project.participants.filter((participant) => participant.status === "invited");
}

export function getBudgetItemSubtotal(item: BudgetItem) {
  return item.volume * item.unitCost;
}

export function getBudgetItemRemainingAmount(item: BudgetItem) {
  return Math.max(getBudgetItemSubtotal(item) - item.spentAmount, 0);
}

export function getProjectVisibleBudgetItems(
  project: SdgDashboardProjectRecord,
  scope: VisibilityScope | "all" = "all",
) {
  if (scope === "all") {
    return project.budgetItems;
  }

  return project.budgetItems.filter((item) => item.visibilityScope === scope);
}

export function getProjectVisibleMonthlyReports(
  project: SdgDashboardProjectRecord,
  scope: VisibilityScope | "all" = "all",
) {
  if (scope === "all") {
    return project.monthlyReports;
  }

  return project.monthlyReports.filter((report) => report.visibilityScope === scope);
}

export function getProjectPublishedBudgetItems(project: SdgDashboardProjectRecord) {
  if (!project.budgetSaved) {
    return [] as BudgetItem[];
  }

  return getProjectVisibleBudgetItems(project, "csr");
}

export function getProjectPublishedMonthlyReports(project: SdgDashboardProjectRecord) {
  return getProjectVisibleMonthlyReports(project, "csr").filter((report) =>
    Boolean(report.summary.trim()),
  );
}

export function getProjectBudgetTotals(
  project: SdgDashboardProjectRecord,
  scope: VisibilityScope | "all" = "all",
) {
  const visibleBudgetItems = getProjectVisibleBudgetItems(project, scope);
  const totalBudget = visibleBudgetItems.reduce(
    (total, item) => total + item.volume * item.unitCost,
    0,
  );
  const spentBudget = visibleBudgetItems.reduce(
    (total, item) => total + item.spentAmount,
    0,
  );

  return {
    totalBudget,
    spentBudget,
    remainingBudget: Math.max(totalBudget - spentBudget, 0),
  };
}

export function getProjectReportUploadCount(
  project: SdgDashboardProjectRecord,
  scope: VisibilityScope | "all" = "all",
) {
  return getProjectVisibleMonthlyReports(project, scope).filter((report) =>
    Boolean(report.summary.trim()),
  ).length;
}

export function getExternalPortalPath(
  project: Pick<SdgDashboardProjectRecord, "slug"> | string,
) {
  const slug = typeof project === "string" ? project : project.slug;
  return `/sdgdashboard/external/${slug}`;
}

export function getInternalDashboardPath() {
  return "/sdgdashboard/internal";
}

export function getInternalCreateProjectPath() {
  return "/sdgdashboard/internal/create";
}

export function getInternalOngoingProjectsPath() {
  return "/sdgdashboard/internal/ongoing";
}

export function getInternalArchiveProjectsPath() {
  return "/sdgdashboard/internal/archive";
}

export function getInternalProjectPath(
  project: Pick<SdgDashboardProjectRecord, "slug"> | string,
) {
  const slug = typeof project === "string" ? project : project.slug;
  return `/sdgdashboard/internal/${slug}`;
}

export function getExternalApprovalMeta(status: ExternalApprovalStatus) {
  if (status === "approved") {
    return {
      label: "Disetujui mitra",
      helper: "Mitra sudah memberi persetujuan untuk melanjutkan proyek.",
      variant: "success" as const,
    };
  }

  if (status === "revision_requested") {
    return {
      label: "Perlu revisi",
      helper: "Mitra meminta penyesuaian proposal sebelum dikirim ulang.",
      variant: "warning" as const,
    };
  }

  if (status === "pending") {
    return {
      label: "Menunggu review mitra",
      helper: "Proposal sudah dikirim dan sedang ditinjau pihak eksternal.",
      variant: "outline" as const,
    };
  }

  return {
    label: "Belum dikirim ke mitra",
    helper: "Proposal masih berupa draft internal dan belum dikirim.",
    variant: "neutral" as const,
  };
}

export function getProjectWorkflowProgress(project: SdgDashboardProjectRecord) {
  const steps = [
    true,
    project.proposalStatus !== "draft",
    project.externalApprovalStatus === "approved",
    project.timelineSaved,
    project.timelineApprovalStatus === "approved",
    project.budgetSaved,
    project.budgetApprovalStatus === "approved",
    getProjectReportUploadCount(project, "csr") > 0,
    project.progressApprovalStatus === "approved",
  ];

  const completedSteps = steps.filter(Boolean).length;

  return {
    completedSteps,
    totalSteps: steps.length,
    percentage: Math.round((completedSteps / steps.length) * 100),
  };
}

export function getProjectCurrentStage(project: SdgDashboardProjectRecord) {
  const sharedReportsCount = getProjectReportUploadCount(project, "csr");

  if (project.status === "completed") {
    return "Masuk arsip selesai";
  }

  if (project.externalApprovalStatus === "revision_requested") {
    return "Revisi proposal dari mitra";
  }

  if (project.proposalStatus === "draft") {
    return "Menyusun proposal";
  }

  if (project.externalApprovalStatus === "pending") {
    return "Menunggu review mitra";
  }

  if (!project.timelineSaved) {
    return "Menyiapkan timeline 3 bulan";
  }

  if (project.timelineApprovalStatus !== "approved") {
    return "Menunggu persetujuan timeline mitra";
  }

  if (!project.budgetSaved) {
    return "Menyusun RAB dan realisasi";
  }

  if (project.budgetApprovalStatus !== "approved") {
    return "Menunggu persetujuan budget mitra";
  }

  if (sharedReportsCount === 0) {
    return "Monitoring dan pelaporan";
  }

  if (project.progressApprovalStatus !== "approved") {
    return "Menunggu persetujuan progress mitra";
  }

  return "Siap penutupan program";
}

export function getProjectsNeedingAttention(
  projects: SdgDashboardProjectRecord[],
) {
  return projects.filter(
    (project) =>
      project.status === "ongoing" &&
      (project.externalApprovalStatus === "pending" ||
        project.externalApprovalStatus === "revision_requested"),
  );
}
