import type {
  ActivityLogEntry,
  DocumentAccount,
  DocumentCenterQuery,
  DocumentCenterStore,
  DocumentDivision,
  EnrichedActivityLogEntry,
  EnrichedDocumentRecord,
} from "@/types/document-center";
import { ensureApiData } from "@/utils/api-error";

export type BackendDocumentCenterResponse = {
  status: "success" | "error";
  message: string;
  data?: {
    document_center: BackendDocumentCenterStore;
  };
};

export type BackendDocumentResponse = {
  status: "success" | "error";
  message: string;
  data?: {
    document: BackendDocumentRecord;
  };
};

export type BackendDocumentCenterStore = {
  divisions: BackendDivision[];
  documents: BackendDocumentRecord[];
  users: BackendAccount[];
  activity_logs: BackendActivityLog[];
  recent_documents: BackendDocumentRecord[];
  recent_documents_pagination?: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
    range: "all" | "today" | "7d" | "30d" | "90d";
    sort: "newest" | "oldest";
  };
  recent_activity_logs: BackendActivityLog[];
  stats: {
    total_documents: number;
    total_divisions: number;
    total_subdivisions: number;
    total_pic_entries: number;
  };
};

type BackendDivision = {
  id: string;
  name: string;
  document_count?: number;
  subdivisions: {
    id: string;
    name: string;
    document_count?: number;
  }[];
  people: {
    id: string;
    name: string;
    division_id: string;
  }[];
};

export type BackendDocumentRecord = {
  id: string;
  title: string;
  file_name: string;
  file_url: string;
  division_id: string;
  subdivision_id: string;
  pic_id: string;
  notes?: string | null;
  uploaded_by_account: string;
  uploaded_at: string;
  updated_by_account: string;
  updated_at: string;
  division_name: string;
  subdivision_name: string;
  pic_name: string;
};

type BackendAccount = {
  id: string;
  name: string;
  username: string;
  role: "superadmin" | "shared-user";
  assigned_division_ids: string[];
  created_at: string;
};

type BackendActivityLog = {
  id: string;
  action: ActivityLogEntry["action"];
  action_label: string;
  document_title?: string | null;
  division_id?: string | null;
  subdivision_id?: string | null;
  pic_id?: string | null;
  account: string;
  timestamp: string;
  division_name: string;
  subdivision_name: string;
  pic_name: string;
};

function mapDivision(division: BackendDivision): DocumentDivision {
  return {
    id: division.id,
    name: division.name,
    documentCount: division.document_count ?? 0,
    subdivisions: division.subdivisions.map((subdivision) => ({
      id: subdivision.id,
      name: subdivision.name,
      documentCount: subdivision.document_count ?? 0,
    })),
    people: division.people.map((person) => ({
      id: person.id,
      name: person.name,
      divisionId: person.division_id,
    })),
  };
}

export function mapDocument(
  document: BackendDocumentRecord,
): EnrichedDocumentRecord {
  return {
    id: document.id,
    title: document.title,
    fileName: document.file_name,
    fileUrl: document.file_url,
    divisionId: document.division_id,
    subdivisionId: document.subdivision_id,
    picId: document.pic_id,
    notes: document.notes ?? undefined,
    uploadedByAccount: document.uploaded_by_account,
    uploadedAt: document.uploaded_at,
    updatedByAccount: document.updated_by_account,
    updatedAt: document.updated_at,
    divisionName: document.division_name,
    subdivisionName: document.subdivision_name,
    picName: document.pic_name,
  };
}

function mapUser(user: BackendAccount): DocumentAccount {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role,
    assignedDivisionIds: user.assigned_division_ids,
    createdAt: user.created_at,
  };
}

function mapActivityLog(log: BackendActivityLog): EnrichedActivityLogEntry {
  return {
    id: log.id,
    action: log.action,
    actionLabel: log.action_label,
    documentTitle: log.document_title ?? undefined,
    divisionId: log.division_id ?? undefined,
    subdivisionId: log.subdivision_id ?? undefined,
    picId: log.pic_id ?? undefined,
    account: log.account,
    timestamp: log.timestamp,
    divisionName: log.division_name,
    subdivisionName: log.subdivision_name,
    picName: log.pic_name,
  };
}

export function mapStore(store: BackendDocumentCenterStore): DocumentCenterStore {
  const recentDocuments = store.recent_documents.map(mapDocument);
  const recentPagination = store.recent_documents_pagination;

  return {
    divisions: store.divisions.map(mapDivision),
    documents: store.documents.map(mapDocument),
    users: store.users.map(mapUser),
    activityLogs: store.activity_logs.map(mapActivityLog),
    recentDocuments,
    recentDocumentsPagination: {
      page: recentPagination?.page ?? 1,
      pageSize: recentPagination?.page_size ?? recentDocuments.length,
      totalItems: recentPagination?.total_items ?? recentDocuments.length,
      totalPages: recentPagination?.total_pages ?? 1,
      range: recentPagination?.range ?? "all",
      sort: recentPagination?.sort ?? "newest",
    },
    recentActivityLogs: store.recent_activity_logs.map(mapActivityLog),
    stats: {
      totalDocuments: store.stats.total_documents,
      totalDivisions: store.stats.total_divisions,
      totalSubdivisions: store.stats.total_subdivisions,
      totalPicEntries: store.stats.total_pic_entries,
    },
  };
}

export function getDocumentCenterFromResponse(
  data: BackendDocumentCenterResponse,
) {
  return ensureApiData(
    data.data?.document_center,
    "Data document center tidak ditemukan.",
  );
}

export function getDocumentFromResponse(data: BackendDocumentResponse) {
  return ensureApiData(data.data?.document, "Data dokumen tidak ditemukan.");
}

export function buildDocumentCenterQuery(query: DocumentCenterQuery) {
  return {
    search: query.search || undefined,
    division_id: query.divisionId || undefined,
    subdivision_id: query.subdivisionId || undefined,
    pic_id: query.picId || undefined,
    drive_division_id: query.driveDivisionId || undefined,
    drive_subdivision_id: query.driveSubdivisionId || undefined,
    recent_range: query.recentRange || undefined,
    recent_sort: query.recentSort || undefined,
    recent_page: query.recentPage || undefined,
    recent_page_size: query.recentPageSize || undefined,
  };
}
