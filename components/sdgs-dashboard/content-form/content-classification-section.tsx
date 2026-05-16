"use client";

import { useMemo } from "react";

import { SDGS_DASHBOARD_SDG_GOALS } from "@/lib/sdgs-dashboard-data";
import type {
  SdgsDashboardFormValues,
  SdgsDashboardSdgGoalId,
} from "@/types/sdgs-dashboard";

import FormField from "../controls/form-field";
import MultiSelect, { type MultiSelectOption } from "../controls/multi-select";

export type ContentClassificationSectionProps = {
  values: Pick<SdgsDashboardFormValues, "sdgGoals">;
  errors?: { sdgGoals?: string };
  touched?: { sdgGoals?: boolean };
  onSdgGoalsChange: (values: SdgsDashboardSdgGoalId[]) => void;
  disabled?: boolean;
};

/**
 * SDG mapping section. Renders the multi-select for SDG goals only -
 * other classification fields can join later if the form grows.
 */
export default function ContentClassificationSection({
  values,
  errors,
  touched,
  onSdgGoalsChange,
  disabled = false,
}: ContentClassificationSectionProps) {
  const sdgOptions = useMemo<MultiSelectOption[]>(
    () =>
      SDGS_DASHBOARD_SDG_GOALS.map((goal) => ({
        value: goal.id,
        label: goal.label,
        shortLabel: goal.shortLabel,
        toneClassName: goal.toneClassName,
        group: "SDG Goals",
      })),
    [],
  );

  const errorMessage = touched?.sdgGoals ? errors?.sdgGoals : undefined;

  return (
    <section>
      <FormField
        id="content-sdg-goals"
        label="SDG yang dipetakan"
        required
        helperText="Konten dapat dipetakan ke lebih dari satu SDG."
        errorMessage={errorMessage}
      >
        <MultiSelect
          id="content-sdg-goals"
          label="SDG yang dipetakan"
          options={sdgOptions}
          values={values.sdgGoals}
          onChange={(next) =>
            onSdgGoalsChange(next as SdgsDashboardSdgGoalId[])
          }
          placeholder="Pilih SDG"
          searchPlaceholder="Cari SDG..."
          emptyMessage="Tidak ada SDG yang cocok."
          disabled={disabled}
          errorMessage={errorMessage}
        />
      </FormField>
    </section>
  );
}
