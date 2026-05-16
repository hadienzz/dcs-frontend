/**
 * Shared types for the SDGs Dashboard content management feature.
 *
 * These types are the single source of truth for form values, datasets, and
 * supporting domain models consumed by:
 *  - lib/sdgs-dashboard-data.ts (static dataset)
 *  - schemas/sdgs-dashboard/content-form-schema.ts (Yup schema)
 *  - components/sdgs-dashboard/** (presentational components)
 *  - hooks/sdgs-dashboard/** + services/sdgs-dashboard/** (mutation layer)
 */

/**
 * Const tuple of SDG goal ids. Re-exported so the Yup schema and other
 * consumers can narrow string values to `SdgsDashboardSdgGoalId` without
 * duplicating the literal list.
 */
export const SDGS_DASHBOARD_SDG_GOAL_IDS = [
  "sdg-1",
  "sdg-2",
  "sdg-3",
  "sdg-4",
  "sdg-5",
  "sdg-6",
  "sdg-7",
  "sdg-8",
  "sdg-9",
  "sdg-10",
  "sdg-11",
  "sdg-12",
  "sdg-13",
  "sdg-14",
  "sdg-15",
  "sdg-16",
  "sdg-17",
] as const;

export type SdgsDashboardSdgGoalId = (typeof SDGS_DASHBOARD_SDG_GOAL_IDS)[number];

export type SdgsDashboardSdgGoal = {
  id: SdgsDashboardSdgGoalId;
  label: string;
  shortLabel: string;
  /** Tailwind utilities for the pill background. */
  toneClassName: string;
};

export type SdgsDashboardUnit = {
  /** Unique within the dataset. */
  id: string;
  name: string;
  /** Must match the parent `SdgsDashboardDirectorate.id`. */
  directorateId: string;
};

export type SdgsDashboardDirectorate = {
  id: string;
  name: string;
  /** Grouping label, e.g. "Bidang Akademik dan Perencanaan Strategis". */
  field: string;
  units: SdgsDashboardUnit[];
};

export type SdgsDashboardContentType = "metric" | "indicator";

export type SdgsDashboardYesNo = "yes" | "no";

export type SdgsDashboardFormValues = {
  title: string;
  /** 4-digit year matching `/^20\d{2}$/`. */
  reportingYear: string;
  contentType: SdgsDashboardContentType;
  metricReference: string;
  metricTitle: string;
  value: string;
  isAvailable: SdgsDashboardYesNo;
  description: string;
  evidenceFiles: File[];
  isPublic: SdgsDashboardYesNo;
  sdgGoals: SdgsDashboardSdgGoalId[];
  directorateIds: string[];
  unitIds: string[];
  comment: string;
};
