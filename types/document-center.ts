export type DocumentUserRole = "superadmin" | "shared-user";

export interface DocumentSubdivision {
  id: string;
  name: string;
  documentCount?: number;
}

export interface DocumentPic {
  id: string;
  name: string;
  divisionId: string;
}

export interface DocumentDivision {
  id: string;
  name: string;
  documentCount?: number;
  subdivisions: DocumentSubdivision[];
  people: DocumentPic[];
}

export interface DocumentRecord {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  divisionId: string;
  subdivisionId: string;
  picId: string;
  notes?: string;
  uploadedByAccount: string;
  uploadedAt: string;
  updatedByAccount: string;
  updatedAt: string;
}

export interface EnrichedDocumentRecord extends DocumentRecord {
  divisionName: string;
  subdivisionName: string;
  picName: string;
}

export interface DocumentAccount {
  id: string;
  name: string;
  username: string;
  role: DocumentUserRole;
  assignedDivisionIds: string[];
  createdAt: string;
}

export type DocumentActivityAction =
  | "upload"
  | "edit"
  | "delete"
  | "create-division"
  | "edit-division"
  | "delete-division"
  | "create-subdivision"
  | "edit-subdivision"
  | "delete-subdivision"
  | "create-pic"
  | "edit-pic"
  | "delete-pic"
  | "create-user"
  | "edit-user"
  | "delete-user";

export interface ActivityLogEntry {
  id: string;
  action: DocumentActivityAction;
  documentTitle?: string;
  divisionId?: string;
  subdivisionId?: string;
  picId?: string;
  account: string;
  timestamp: string;
}

export interface EnrichedActivityLogEntry extends ActivityLogEntry {
  actionLabel: string;
  divisionName: string;
  subdivisionName: string;
  picName: string;
}

export interface DocumentDashboardStats {
  totalDocuments: number;
  totalDivisions: number;
  totalSubdivisions: number;
  totalPicEntries: number;
}

export type RecentDocumentRange = "all" | "today" | "7d" | "30d" | "90d";

export type RecentDocumentSort = "newest" | "oldest";

export interface RecentDocumentsPagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  range: RecentDocumentRange;
  sort: RecentDocumentSort;
}

export interface DocumentCenterStore {
  divisions: DocumentDivision[];
  documents: EnrichedDocumentRecord[];
  users: DocumentAccount[];
  activityLogs: EnrichedActivityLogEntry[];
  recentDocuments: EnrichedDocumentRecord[];
  recentDocumentsPagination: RecentDocumentsPagination;
  recentActivityLogs: EnrichedActivityLogEntry[];
  stats: DocumentDashboardStats;
}

export interface DocumentFilters {
  search: string;
  divisionId: string;
  subdivisionId: string;
  picId: string;
}

export interface DocumentCenterQuery extends Partial<DocumentFilters> {
  driveDivisionId?: string;
  driveSubdivisionId?: string;
  recentRange?: RecentDocumentRange;
  recentSort?: RecentDocumentSort;
  recentPage?: number;
  recentPageSize?: number;
}

export interface UploadDocumentFormValues {
  title: string;
  file: File | null;
  divisionId: string;
  subdivisionId: string;
  picId: string;
  notes: string;
}

export interface CreateDocumentPayload {
  title: string;
  file: File;
  divisionId: string;
  subdivisionId: string;
  picId: string;
  notes?: string;
  uploadedByAccount: string;
}

export interface UpdateDocumentMetadataPayload {
  id: string;
  title: string;
  file?: File | null;
  divisionId: string;
  subdivisionId: string;
  picId: string;
  notes?: string;
  updatedByAccount: string;
}

export interface DivisionPayload {
  name: string;
}

export interface SubdivisionPayload {
  divisionId: string;
  name: string;
}

export interface PicPayload {
  divisionId: string;
  name: string;
}

export interface UpdatePicPayload extends PicPayload {
  id: string;
}

export interface UserPayload {
  name: string;
  username: string;
  role: DocumentUserRole;
  assignedDivisionIds: string[];
}

export interface UpdateUserPayload extends UserPayload {
  id: string;
}

export const EMPTY_DOCUMENT_CENTER_STORE: DocumentCenterStore = {
  divisions: [],
  documents: [],
  users: [],
  activityLogs: [],
  recentDocuments: [],
  recentDocumentsPagination: {
    page: 1,
    pageSize: 6,
    totalItems: 0,
    totalPages: 1,
    range: "all",
    sort: "newest",
  },
  recentActivityLogs: [],
  stats: {
    totalDocuments: 0,
    totalDivisions: 0,
    totalSubdivisions: 0,
    totalPicEntries: 0,
  },
};
