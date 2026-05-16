"use client";

import { useFormikContext } from "formik";

import { sdgs } from "@/lib/sdgs-dashboard-data";
import type { SdgsContentFormValues } from "@/types/sdgs-dashboard";

import { MultiSelect, type MultiSelectOption } from "../multi-select";
import { SectionCard } from "../section-card";
import { SdgIcon } from "../sdg-icon";
import { FieldError } from "./field-error";

const options: MultiSelectOption[] = sdgs.map((s) => ({
  value: s.id,
  label: `SDG ${s.number} — ${s.name}`,
}));

export function SdgsSelectionSection() {
  const { values, errors, touched, setFieldValue, setFieldTouched } =
    useFormikContext<SdgsContentFormValues>();

  return (
    <SectionCard
      title="Pemetaan SDGs"
      description="Inisiatif dapat berkontribusi ke lebih dari satu tujuan SDGs."
    >
      <MultiSelect
        options={options}
        value={values.sdgs}
        onChange={(next) => {
          setFieldValue("sdgs", next);
          setFieldTouched("sdgs", true, false);
        }}
        placeholder="Pilih SDGs terkait…"
      />
      {values.sdgs.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-1">
          {values.sdgs.map((id) => (
            <SdgIcon key={id} id={id} size="sm" />
          ))}
        </div>
      ) : null}
      <FieldError
        message={touched.sdgs ? (errors.sdgs as string | undefined) : undefined}
      />
    </SectionCard>
  );
}
