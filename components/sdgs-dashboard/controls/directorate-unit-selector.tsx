"use client";

import { useEffect, useMemo, useRef } from "react";

import {
  getUnitsForDirectorates,
  pruneUnitIds,
  selectedDirectoratesHaveUnits,
} from "@/lib/sdgs-dashboard-data";
import type { SdgsDashboardDirectorate } from "@/types/sdgs-dashboard";

import FormField from "./form-field";
import MultiSelect, { type MultiSelectOption } from "./multi-select";

export type DirectorateUnitSelectorProps = {
  directorates: SdgsDashboardDirectorate[];
  directorateValues: string[];
  unitValues: string[];
  onDirectorateChange: (values: string[]) => void;
  onUnitChange: (values: string[]) => void;
  directorateError?: string;
  unitError?: string;
  disabled?: boolean;
  className?: string;
};

/**
 * Composite control: two cascading multi-selects for `Directorate` and `Unit`.
 *
 * Behavior:
 * - Directorate options are grouped by `field` (e.g. "Bidang Akademik...").
 * - The Unit selector is rendered if and only if at least one selected
 *   directorate has a non-empty `units` array.
 * - When the parent removes a directorate, this component prunes orphan
 *   `unitValues` whose `directorateId` no longer maps to a selected
 *   directorate, then forwards the cleaned list to `onUnitChange`.
 *
 * Logic-only side effects (pruning) are delegated to pure helpers in
 * `lib/sdgs-dashboard-data.ts`; the component remains presentational.
 */
export default function DirectorateUnitSelector({
  directorates,
  directorateValues,
  unitValues,
  onDirectorateChange,
  onUnitChange,
  directorateError,
  unitError,
  disabled = false,
  className,
}: DirectorateUnitSelectorProps) {
  const directorateOptions = useMemo<MultiSelectOption[]>(
    () =>
      directorates.map((directorate) => ({
        value: directorate.id,
        label: directorate.name,
        group: directorate.field,
      })),
    [directorates],
  );

  const unitOptions = useMemo<MultiSelectOption[]>(() => {
    const units = getUnitsForDirectorates(directorates, directorateValues);
    const directorateById = new Map(
      directorates.map((directorate) => [directorate.id, directorate]),
    );

    return units.map((unit) => {
      const parent = directorateById.get(unit.directorateId);
      return {
        value: unit.id,
        label: unit.name,
        group: parent?.name,
      };
    });
  }, [directorates, directorateValues]);

  const showUnit = selectedDirectoratesHaveUnits(
    directorates,
    directorateValues,
  );

  const onUnitChangeRef = useRef(onUnitChange);
  onUnitChangeRef.current = onUnitChange;

  useEffect(() => {
    const pruned = pruneUnitIds(directorates, directorateValues, unitValues);
    if (pruned.length === unitValues.length) {
      return;
    }
    onUnitChangeRef.current(pruned);
  }, [directorates, directorateValues, unitValues]);

  return (
    <div className={className}>
      <FormField
        id="directorate-select"
        label="Direktorat"
        required
        helperText="Pilih satu atau lebih direktorat yang bertanggung jawab."
        errorMessage={directorateError}
      >
        <MultiSelect
          id="directorate-select"
          label="Direktorat"
          options={directorateOptions}
          values={directorateValues}
          onChange={onDirectorateChange}
          placeholder="Pilih direktorat"
          searchPlaceholder="Cari direktorat..."
          emptyMessage="Tidak ada direktorat yang cocok."
          disabled={disabled}
          errorMessage={directorateError}
        />
      </FormField>

      {showUnit ? (
        <FormField
          id="unit-select"
          label="Unit"
          required
          helperText="Pilih unit di bawah direktorat yang sudah dipilih."
          errorMessage={unitError}
          className="mt-4"
        >
          <MultiSelect
            id="unit-select"
            label="Unit"
            options={unitOptions}
            values={unitValues}
            onChange={onUnitChange}
            placeholder="Pilih unit"
            searchPlaceholder="Cari unit..."
            emptyMessage="Tidak ada unit yang cocok."
            disabled={disabled}
            errorMessage={unitError}
          />
        </FormField>
      ) : null}
    </div>
  );
}
