import type {
  DocumentFilters,
  RecentDocumentRange,
  RecentDocumentSort,
} from "@/types/document-center";

export type DocumentCenterTab =
  | "overview"
  | "center"
  | "upload"
  | "divisions"
  | "pic"
  | "users";

export type DocumentViewMode = "cards" | "table";

export const RECENT_DOCUMENT_PAGE_SIZE = 6;

export const RECENT_RANGE_OPTIONS: {
  value: RecentDocumentRange;
  label: string;
}[] = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

export const RECENT_SORT_OPTIONS: {
  value: RecentDocumentSort;
  label: string;
}[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];

export const EMPTY_FILTERS: DocumentFilters = {
  search: "",
  divisionId: "",
  subdivisionId: "",
  picId: "",
};

const SUPERADMIN_TABS: DocumentCenterTab[] = [
  "overview",
  "center",
  "upload",
  "divisions",
  "pic",
  "users",
];

const SHARED_USER_TABS: DocumentCenterTab[] = [
  "overview",
  "center",
  "upload",
];

export function getAvailableDocumentCenterTabs(isSuperadmin: boolean) {
  return isSuperadmin ? SUPERADMIN_TABS : SHARED_USER_TABS;
}

export function getRecentRangeLabel(range: RecentDocumentRange) {
  return (
    RECENT_RANGE_OPTIONS.find((option) => option.value === range)?.label ??
    "All time"
  );
}
