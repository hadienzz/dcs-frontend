import axiosInstance from "@/utils/axios";
import type {
  ActivityLogEntry,
  CreateDocumentPayload,
  DivisionPayload,
  DocumentAccount,
  DocumentCenterQuery,
  DocumentCenterStore,
  DocumentDivision,
  DocumentPic,
  DocumentSubdivision,
  EnrichedActivityLogEntry,
  EnrichedDocumentRecord,
  PicPayload,
  SubdivisionPayload,
  UpdateDocumentMetadataPayload,
  UpdatePicPayload,
  UpdateUserPayload,
  UserPayload,
} from "@/types/document-center";

type BackendDocumentCenterResponse = {
  status: "success" | "error";
  message: string;
  data?: {
    document_center: BackendDocumentCenterStore;
  };
};

type BackendDocumentResponse = {
  status: "success" | "error";
  message: string;
  data?: {
    document: BackendDocumentRecord;
  };
};

type BackendDocumentCenterStore = {
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

type BackendDocumentRecord = {
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

function mapDocument(document: BackendDocumentRecord): EnrichedDocumentRecord {
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

function mapStore(store: BackendDocumentCenterStore): DocumentCenterStore {
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

function toApiQuery(query: DocumentCenterQuery) {
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

function appendFilePayload(formData: FormData, payload: CreateDocumentPayload) {
  formData.append("title", payload.title);
  formData.append("division_id", payload.divisionId);
  formData.append("subdivision_id", payload.subdivisionId);
  formData.append("pic_id", payload.picId);
  formData.append("notes", payload.notes ?? "");
  formData.append("file", payload.file);
}

export async function getDocumentCenterStore(
  query: DocumentCenterQuery = {},
): Promise<DocumentCenterStore> {
  const { data } = await axiosInstance.get<BackendDocumentCenterResponse>(
    "/api/document-center",
    {
      params: toApiQuery(query),
    },
  );

  return mapStore(data.data?.document_center as BackendDocumentCenterStore);
}

export async function uploadDocument(
  payload: CreateDocumentPayload,
): Promise<EnrichedDocumentRecord> {
  const formData = new FormData();
  appendFilePayload(formData, payload);
  formData.append("uploaded_by_account", payload.uploadedByAccount);

  const { data } = await axiosInstance.post<BackendDocumentResponse>(
    "/api/document-center/documents",
    formData,
  );

  return mapDocument(data.data?.document as BackendDocumentRecord);
}

export async function updateDocumentMetadata(
  payload: UpdateDocumentMetadataPayload,
): Promise<EnrichedDocumentRecord> {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("division_id", payload.divisionId);
  formData.append("subdivision_id", payload.subdivisionId);
  formData.append("pic_id", payload.picId);
  formData.append("notes", payload.notes ?? "");
  formData.append("updated_by_account", payload.updatedByAccount);

  if (payload.file) {
    formData.append("file", payload.file);
  }

  const { data } = await axiosInstance.patch<BackendDocumentResponse>(
    `/api/document-center/documents/${payload.id}`,
    formData,
  );

  return mapDocument(data.data?.document as BackendDocumentRecord);
}

export async function deleteDocument(documentId: string) {
  await axiosInstance.delete(`/api/document-center/documents/${documentId}`);
  return documentId;
}

export async function createDivision(payload: DivisionPayload) {
  const { data } = await axiosInstance.post<{ data?: { division: DocumentDivision } }>(
    "/api/document-center/divisions",
    payload,
  );

  return data.data?.division;
}

export async function updateDivision(divisionId: string, payload: DivisionPayload) {
  const { data } = await axiosInstance.patch<{ data?: { division: DocumentDivision } }>(
    `/api/document-center/divisions/${divisionId}`,
    payload,
  );

  return data.data?.division;
}

export async function deleteDivision(divisionId: string) {
  await axiosInstance.delete(`/api/document-center/divisions/${divisionId}`);
  return divisionId;
}

export async function createSubdivision(payload: SubdivisionPayload) {
  const { data } = await axiosInstance.post<{
    data?: { subdivision: DocumentSubdivision };
  }>(`/api/document-center/divisions/${payload.divisionId}/subdivisions`, {
    name: payload.name,
  });

  return data.data?.subdivision;
}

export async function updateSubdivision(
  subdivisionId: string,
  payload: SubdivisionPayload,
) {
  const { data } = await axiosInstance.patch<{
    data?: { subdivision: DocumentSubdivision };
  }>(
    `/api/document-center/divisions/${payload.divisionId}/subdivisions/${subdivisionId}`,
    {
      name: payload.name,
    },
  );

  return data.data?.subdivision;
}

export async function deleteSubdivision(divisionId: string, subdivisionId: string) {
  await axiosInstance.delete(
    `/api/document-center/divisions/${divisionId}/subdivisions/${subdivisionId}`,
  );

  return subdivisionId;
}

export async function createPic(payload: PicPayload): Promise<DocumentPic | undefined> {
  const { data } = await axiosInstance.post<{ data?: { pic: DocumentPic } }>(
    "/api/document-center/pics",
    {
      division_id: payload.divisionId,
      name: payload.name,
    },
  );

  return data.data?.pic;
}

export async function updatePic(payload: UpdatePicPayload) {
  const { data } = await axiosInstance.patch<{ data?: { pic: DocumentPic } }>(
    `/api/document-center/pics/${payload.id}`,
    {
      division_id: payload.divisionId,
      name: payload.name,
    },
  );

  return data.data?.pic;
}

export async function deletePic(picId: string) {
  await axiosInstance.delete(`/api/document-center/pics/${picId}`);
  return picId;
}

export async function createUser(payload: UserPayload) {
  const { data } = await axiosInstance.post<{ data?: { user: DocumentAccount } }>(
    "/api/document-center/users",
    {
      name: payload.name,
      username: payload.username,
      role: payload.role,
      assigned_division_ids: payload.assignedDivisionIds,
    },
  );

  return data.data?.user;
}

export async function updateUser(payload: UpdateUserPayload) {
  const { data } = await axiosInstance.patch<{ data?: { user: DocumentAccount } }>(
    `/api/document-center/users/${payload.id}`,
    {
      name: payload.name,
      username: payload.username,
      role: payload.role,
      assigned_division_ids: payload.assignedDivisionIds,
    },
  );

  return data.data?.user;
}

export async function deleteUser(userId: string) {
  await axiosInstance.delete(`/api/document-center/users/${userId}`);
  return userId;
}
