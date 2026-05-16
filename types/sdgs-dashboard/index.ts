export interface Sdg {
  id: string;
  number: number;
  name: string;
  /** SDG official accent color (hex). */
  color: string;
}

export interface Unit {
  id: string;
  name: string;
}

export interface Directorate {
  id: string;
  name: string;
  units: Unit[];
}

/**
 * Top-level grouping (Bidang) that contains multiple Direktorat.
 * Mirrors the Telkom University organization chart.
 */
export interface DirectorateField {
  id: string;
  name: string;
  directorates: Directorate[];
}

/**
 * What gets stored on a record / form: the directorate the contributor picked
 * plus the specific unit ids tagged underneath it.
 */
export interface DirectorateUnitSelection {
  directorateId: string;
  units: string[];
}

export type YesNo = "yes" | "no";

export interface SdgsContent {
  id: string;
  title: string;
  description: string;
  thumbnailName?: string;
  attachmentName?: string;
  sdgs: string[];
  isAvailable: YesNo;
  publicVisibility: YesNo;
  evidenceDescription?: string;
  evidenceFileName?: string;
  supportingLink?: string;
  notes?: string;
  directorates: DirectorateUnitSelection[];
  createdAt: string;
}

export interface SdgsContentFormValues {
  title: string;
  description: string;
  thumbnailName: string;
  attachmentName: string;
  sdgs: string[];
  isAvailable: YesNo;
  publicVisibility: YesNo;
  evidenceDescription: string;
  evidenceFileName: string;
  supportingLink: string;
  notes: string;
  directorates: DirectorateUnitSelection[];
}
