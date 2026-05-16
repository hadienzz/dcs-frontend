"use client";

import { SDGS_DASHBOARD_DIRECTORATES } from "@/lib/sdgs-dashboard-data";
import type {
  SdgsDashboardFormValues,
  SdgsDashboardYesNo,
} from "@/types/sdgs-dashboard";

import DirectorateUnitSelector from "../controls/directorate-unit-selector";
import FormField from "../controls/form-field";
import YesNoToggle from "../controls/yes-no-toggle";

export type ContentOwnershipSectionProps = {
  values: Pick<
    SdgsDashboardFormValues,
    "isPublic" | "directorateIds" | "unitIds"
  >;
  errors?: {
    isPublic?: string;
    directorateIds?: string;
    unitIds?: string;
  };
  touched?: {
    isPublic?: boolean;
    directorateIds?: boolean;
    unitIds?: boolean;
  };
  onPublicChange: (value: SdgsDashboardYesNo) => void;
  onDirectorateChange: (values: string[]) => void;
  onUnitChange: (values: string[]) => void;
  disabled?: boolean;
};

const errorOf = (
  errors: ContentOwnershipSectionProps["errors"],
  touched: ContentOwnershipSectionProps["touched"],
  field: keyof NonNullable<ContentOwnershipSectionProps["errors"]>,
) => (touched?.[field] ? errors?.[field] : undefined);

/**
 * Visibility + ownership section. Renders the Public Yes/No toggle and the
 * cascading directorate -> unit selector. All logic for cascading and
 * orphan pruning is encapsulated in `DirectorateUnitSelector`.
 */
export default function ContentOwnershipSection({
  values,
  errors,
  touched,
  onPublicChange,
  onDirectorateChange,
  onUnitChange,
  disabled = false,
}: ContentOwnershipSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <FormField
        id="content-public"
        label="Visibility"
        required
        helperText="Pilih Ya untuk menampilkan konten di website publik."
        errorMessage={errorOf(errors, touched, "isPublic")}
      >
        <YesNoToggle
          id="content-public"
          value={values.isPublic}
          onChange={onPublicChange}
          yesLabel="Public"
          noLabel="Internal"
          disabled={disabled}
        />
      </FormField>

      <DirectorateUnitSelector
        directorates={SDGS_DASHBOARD_DIRECTORATES}
        directorateValues={values.directorateIds}
        unitValues={values.unitIds}
        onDirectorateChange={onDirectorateChange}
        onUnitChange={onUnitChange}
        directorateError={errorOf(errors, touched, "directorateIds")}
        unitError={errorOf(errors, touched, "unitIds")}
        disabled={disabled}
      />
    </section>
  );
}
