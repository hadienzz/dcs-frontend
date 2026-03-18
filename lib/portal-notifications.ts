import type {
  LecturerProfile,
  StudentProfile,
  StudentResearchApplication,
  StudentResearchApplicationStatus,
} from "@/hooks/useLecturerPortal";
import type { SdgDashboardAccountRole } from "@/hooks/use-sdg-dashboard-auth";
import type { Project } from "@/hooks/useSdgsHubData";
import {
  getExternalPortalPath,
  getInternalProjectPath,
  getProjectReportUploadCount,
  getProjectVisibleBudgetItems,
  getProjectVisibleMonthlyReports,
  type SdgDashboardProjectRecord,
} from "@/components/sdg-dashboard/dashboard-data";

export interface PortalNotificationItem {
  id: string;
  href: string;
  label: string;
  title: string;
  description: string;
  meta: string;
  badgeLabel: string;
  badgeClassName: string;
}

const STATUS_META: Record<
  StudentResearchApplicationStatus,
  {
    label: string;
    badgeClassName: string;
    notificationLabel: string;
  }
> = {
  pending: {
    label: "Menunggu Review",
    badgeClassName: "border-amber-200 bg-amber-50 text-amber-700",
    notificationLabel: "Permintaan Dikirim",
  },
  reviewed: {
    label: "Sedang Ditinjau",
    badgeClassName: "border-sky-200 bg-sky-50 text-sky-700",
    notificationLabel: "Sedang Ditinjau",
  },
  accepted: {
    label: "Diterima",
    badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
    notificationLabel: "Diterima Penelitian",
  },
  completed: {
    label: "Selesai",
    badgeClassName: "border-violet-200 bg-violet-50 text-violet-700",
    notificationLabel: "Riset Selesai",
  },
};

export function getApplicationStatusMeta(
  status: StudentResearchApplicationStatus,
) {
  return STATUS_META[status];
}

export function formatPortalDate(date: string) {
  const parsedDate = Date.parse(date);
  if (Number.isNaN(parsedDate)) {
    return date;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function sortApplicationsByUpdate(
  left: StudentResearchApplication,
  right: StudentResearchApplication,
) {
  const leftTime = Date.parse(left.statusUpdatedAt ?? left.requestedAt ?? "");
  const rightTime = Date.parse(right.statusUpdatedAt ?? right.requestedAt ?? "");

  return rightTime - leftTime;
}

export function buildStudentNotifications(
  applications: StudentResearchApplication[],
): PortalNotificationItem[] {
  return [...applications].sort(sortApplicationsByUpdate).map((application) => {
    const statusMeta = getApplicationStatusMeta(application.status);
    const updatedAt = application.statusUpdatedAt ?? application.requestedAt;

    return {
      id: `student-notification-${application.id}`,
      href: `/sdgs-hub/profil-saya/riset/${application.id}`,
      label: "Notifikasi Mahasiswa",
      title: application.projectTitle,
      description: application.note,
      meta: `${statusMeta.label} • ${formatPortalDate(updatedAt)}`,
      badgeLabel: statusMeta.notificationLabel,
      badgeClassName: statusMeta.badgeClassName,
    };
  });
}

export function buildLecturerNotifications(params: {
  currentLecturer: LecturerProfile | null;
  projects: Project[];
  students: StudentProfile[];
  applications: StudentResearchApplication[];
}) {
  const { currentLecturer, projects, students, applications } = params;

  if (!currentLecturer) {
    return [] as PortalNotificationItem[];
  }

  const ownProjects = projects.filter(
    (project) => project.lecturerId === currentLecturer.id,
  );
  const ownProjectSlugs = new Set(ownProjects.map((project) => project.slug));
  const projectLookup = new Map(ownProjects.map((project) => [project.slug, project]));
  const studentLookup = new Map(
    students.map((student) => [student.email.toLowerCase(), student]),
  );

  return applications
    .filter((application) => ownProjectSlugs.has(application.projectSlug))
    .sort(sortApplicationsByUpdate)
    .map((application) => {
      const student = studentLookup.get(application.studentEmail.toLowerCase());
      const project = projectLookup.get(application.projectSlug);
      const statusMeta = getApplicationStatusMeta(application.status);
      const applicantName = student?.name ?? application.studentEmail;
      const applicantMeta = student
        ? `${student.program} • ${student.faculty}`
        : application.studentEmail;
      const cvMeta = student?.cvAttachment
        ? `CV ${student.cvAttachment.fileName}`
        : "CV belum tersedia";
      const updatedAt = application.statusUpdatedAt ?? application.requestedAt;

      return {
        id: `lecturer-notification-${application.id}`,
        href: `/sdgs-hub/riset/dashboard/saya/${application.projectSlug}?applicant=${application.id}`,
        label: "Notifikasi Dosen",
        title: `${applicantName} ingin masuk ke ${project?.title ?? application.projectTitle}`,
        description: `${application.role} • ${cvMeta} • ${application.note}`,
        meta: `${applicantMeta} • ${formatPortalDate(updatedAt)}`,
        badgeLabel:
          application.status === "pending"
            ? "Permintaan Masuk"
            : statusMeta.notificationLabel,
        badgeClassName: statusMeta.badgeClassName,
      };
    });
}

type DashboardNotificationDraft = PortalNotificationItem & {
  sortTimestamp: number;
};

function parseNotificationTime(date: string | null | undefined) {
  const parsedDate = Date.parse(date ?? "");
  return Number.isNaN(parsedDate) ? 0 : parsedDate;
}

function sortDashboardNotifications(
  drafts: DashboardNotificationDraft[],
): PortalNotificationItem[] {
  return [...drafts]
    .sort((left, right) => right.sortTimestamp - left.sortTimestamp)
    .map((item) => ({
      id: item.id,
      href: item.href,
      label: item.label,
      title: item.title,
      description: item.description,
      meta: item.meta,
      badgeLabel: item.badgeLabel,
      badgeClassName: item.badgeClassName,
    }));
}

function getLatestSharedReport(project: SdgDashboardProjectRecord) {
  return [...getProjectVisibleMonthlyReports(project, "csr")]
    .reverse()
    .find((report) => Boolean(report.fileName));
}

function buildInternalDashboardNotifications(
  projects: SdgDashboardProjectRecord[],
): PortalNotificationItem[] {
  const drafts = projects.flatMap((project) => {
    const notificationDate = project.externalApprovalUpdatedAt ?? project.updatedAt;
    const sortTimestamp = parseNotificationTime(notificationDate);
    const sharedBudgetItems = getProjectVisibleBudgetItems(project, "csr");
    const sharedReportsCount = getProjectReportUploadCount(project, "csr");
    const items: DashboardNotificationDraft[] = [];

    if (project.externalApprovalStatus === "revision_requested") {
      items.push({
        id: `dashboard-internal-revision-${project.id}`,
        href: getInternalProjectPath(project),
        label: "Dashboard Internal",
        title: `${project.externalName} meminta revisi proposal`,
        description:
          project.externalApprovalNote ||
          "Periksa catatan mitra lalu kirim revisi proposal terbaru.",
        meta: `${project.name} • ${formatPortalDate(notificationDate)}`,
        badgeLabel: "Perlu revisi",
        badgeClassName: "border-amber-200 bg-amber-50 text-amber-700",
        sortTimestamp,
      });
    }

    if (project.externalApprovalStatus === "approved") {
      items.push({
        id: `dashboard-internal-proposal-approved-${project.id}`,
        href: getInternalProjectPath(project),
        label: "Dashboard Internal",
        title: `Proposal ${project.name} diterima oleh ${project.externalName}`,
        description:
          "Proposal sudah disetujui dan workflow bisa lanjut ke timeline, RAB, dan progress.",
        meta: `${project.name} • ${formatPortalDate(notificationDate)}`,
        badgeLabel: "Proposal diterima",
        badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
        sortTimestamp,
      });
    }

    if (project.timelineSaved && project.timelineApprovalStatus === "approved") {
      items.push({
        id: `dashboard-internal-timeline-approved-${project.id}`,
        href: getInternalProjectPath(project),
        label: "Dashboard Internal",
        title: `${project.externalName} menyetujui timeline`,
        description:
          "Timeline implementasi sudah disepakati dan bisa dipakai sebagai acuan kerja tim.",
        meta: `${project.name} • ${formatPortalDate(project.updatedAt)}`,
        badgeLabel: "Timeline diterima",
        badgeClassName: "border-sky-200 bg-sky-50 text-sky-700",
        sortTimestamp: parseNotificationTime(project.updatedAt),
      });
    }

    if (
      project.budgetSaved &&
      sharedBudgetItems.length > 0 &&
      project.budgetApprovalStatus === "approved"
    ) {
      items.push({
        id: `dashboard-internal-budget-approved-${project.id}`,
        href: getInternalProjectPath(project),
        label: "Dashboard Internal",
        title: `Laporan RAB ${project.name} diterima oleh ${project.externalName}`,
        description:
          `${sharedBudgetItems.length} item RAB dan realisasi yang dibagikan sudah disetujui mitra.`,
        meta: `${project.name} • ${formatPortalDate(project.updatedAt)}`,
        badgeLabel: "RAB diterima",
        badgeClassName: "border-violet-200 bg-violet-50 text-violet-700",
        sortTimestamp: parseNotificationTime(project.updatedAt),
      });
    }

    if (sharedReportsCount > 0 && project.progressApprovalStatus === "approved") {
      items.push({
        id: `dashboard-internal-progress-approved-${project.id}`,
        href: getInternalProjectPath(project),
        label: "Dashboard Internal",
        title: `Laporan progress ${project.name} diterima oleh ${project.externalName}`,
        description:
          `${sharedReportsCount} laporan progress yang dibagikan sudah disetujui pihak eksternal.`,
        meta: `${project.name} • ${formatPortalDate(project.updatedAt)}`,
        badgeLabel: "Progress diterima",
        badgeClassName: "border-rose-200 bg-rose-50 text-rose-700",
        sortTimestamp: parseNotificationTime(project.updatedAt),
      });
    }

    return items;
  });

  return sortDashboardNotifications(drafts);
}

function buildExternalDashboardNotifications(
  projects: SdgDashboardProjectRecord[],
): PortalNotificationItem[] {
  const drafts = projects.flatMap((project) => {
    const sharedBudgetItems = getProjectVisibleBudgetItems(project, "csr");
    const latestSharedReport = getLatestSharedReport(project);
    const sharedReportsCount = getProjectReportUploadCount(project, "csr");
    const sortTimestamp = parseNotificationTime(project.updatedAt);
    const items: DashboardNotificationDraft[] = [];

    if (project.externalApprovalStatus === "pending") {
      items.push({
        id: `dashboard-external-proposal-review-${project.id}`,
        href: getExternalPortalPath(project),
        label: "Portal Eksternal",
        title: "Pihak SDGs sudah mengirim proposal atau revisi terbaru",
        description:
          `Versi terbaru untuk ${project.name} sudah siap ditinjau dan menunggu keputusan Anda.`,
        meta: `${project.externalName} • ${formatPortalDate(project.updatedAt)}`,
        badgeLabel: "Perlu review",
        badgeClassName: "border-amber-200 bg-amber-50 text-amber-700",
        sortTimestamp,
      });
    }

    if (project.budgetSaved && sharedBudgetItems.length > 0) {
      items.push({
        id: `dashboard-external-budget-updated-${project.id}`,
        href: getExternalPortalPath(project),
        label: "Portal Eksternal",
        title: "Pihak SDGs sudah mengisi laporan RAB",
        description:
          `${sharedBudgetItems.length} item RAB dan realisasi sudah dibagikan untuk ${project.externalName}.`,
        meta: `${project.name} • ${formatPortalDate(project.updatedAt)}`,
        badgeLabel: "RAB diperbarui",
        badgeClassName: "border-sky-200 bg-sky-50 text-sky-700",
        sortTimestamp,
      });
    }

    if (latestSharedReport && sharedReportsCount > 0) {
      items.push({
        id: `dashboard-external-progress-updated-${project.id}`,
        href: getExternalPortalPath(project),
        label: "Portal Eksternal",
        title: "Pihak SDGs sudah mengupdate laporan progress",
        description:
          `${latestSharedReport.month} sudah dibagikan: ${latestSharedReport.summary}`,
        meta: `${project.name} • ${formatPortalDate(project.updatedAt)}`,
        badgeLabel: "Laporan baru",
        badgeClassName: "border-rose-200 bg-rose-50 text-rose-700",
        sortTimestamp,
      });
    }

    if (project.status === "completed" && sharedReportsCount > 0) {
      items.push({
        id: `dashboard-external-final-report-${project.id}`,
        href: getExternalPortalPath(project),
        label: "Portal Eksternal",
        title: "Pihak SDGs sudah menyiapkan laporan akhir program",
        description:
          `Dokumen penutupan dan rangkuman deliverable ${project.name} sudah siap ditinjau.`,
        meta: `${project.externalName} • ${formatPortalDate(project.updatedAt)}`,
        badgeLabel: "Program selesai",
        badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
        sortTimestamp,
      });
    }

    return items;
  });

  return sortDashboardNotifications(drafts);
}

export function buildSdgDashboardNotifications(params: {
  role: SdgDashboardAccountRole;
  projects: SdgDashboardProjectRecord[];
}) {
  const relevantProjects = params.projects.filter(
    (project) => project.status === "ongoing" || project.status === "completed",
  );

  if (params.role === "internal") {
    return buildInternalDashboardNotifications(relevantProjects);
  }

  return buildExternalDashboardNotifications(relevantProjects);
}
