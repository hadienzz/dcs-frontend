"use client";

import { Textarea } from "@/components/ui/textarea";
import type {
  SdgsDashboardFormValues,
  SdgsDashboardYesNo,
} from "@/types/sdgs-dashboard";

import FormField from "../controls/form-field";
import YesNoToggle from "../controls/yes-no-toggle";

import EvidenceUpload from "./evidence-upload";

export type ContentAvailabilitySectionProps = {
  values: Pick<
    SdgsDashboardFormValues,
    "isAvailable" | "description" | "evidenceFiles"
  >;
  errors?: {
    isAvailable?: string;
    description?: string;
    evidenceFiles?: string;
  };
  touched?: {
    isAvailable?: boolean;
    description?: boolean;
    evidenceFiles?: boolean;
  };
  onAvailabilityChange: (value: SdgsDashboardYesNo) => void;
  onDescriptionChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onDescriptionBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  onEvidenceChange: (files: File[]) => void;
  disabled?: boolean;
};

const errorOf = (
  errors: ContentAvailabilitySectionProps["errors"],
  touched: ContentAvailabilitySectionProps["touched"],
  field: keyof NonNullable<ContentAvailabilitySectionProps["errors"]>,
) => (touched?.[field] ? errors?.[field] : undefined);

/**
 * Conditional reveal section for the Content_Form.
 *
 * - Always renders the `Availability` Yes/No toggle.
 * - When availability is "yes", reveals the Description textarea and the
 *   Evidence upload control. The actual clearing of those fields when the
 *   user toggles back to "no" lives in `ContentForm` so that this component
 *   stays presentational.
 */
export default function ContentAvailabilitySection({
  values,
  errors,
  touched,
  onAvailabilityChange,
  onDescriptionChange,
  onDescriptionBlur,
  onEvidenceChange,
  disabled = false,
}: ContentAvailabilitySectionProps) {
  const isAvailableYes = values.isAvailable === "yes";

  return (
    <section className="flex flex-col gap-4">
      <FormField
        id="content-availability"
        label="Apakah data tersedia?"
        required
        errorMessage={errorOf(errors, touched, "isAvailable")}
      >
        <YesNoToggle
          id="content-availability"
          value={values.isAvailable}
          onChange={onAvailabilityChange}
          disabled={disabled}
        />
      </FormField>

      {isAvailableYes ? (
        <>
          <FormField
            id="content-description"
            label="Deskripsi"
            required
            helperText="Minimal 20 karakter. Jelaskan konteks dan capaian terkait data."
            errorMessage={errorOf(errors, touched, "description")}
          >
            <Textarea
              id="content-description"
              name="description"
              value={values.description}
              onChange={onDescriptionChange}
              onBlur={onDescriptionBlur}
              placeholder="Tuliskan deskripsi capaian data..."
              rows={5}
              aria-invalid={Boolean(errorOf(errors, touched, "description"))}
              aria-describedby={
                errorOf(errors, touched, "description")
                  ? "content-description-error"
                  : undefined
              }
              disabled={disabled}
            />
          </FormField>

          <FormField
            id="content-evidence"
            label="Evidence"
            required
            helperText="Upload minimal satu file pendukung (foto, dokumen, dsb)."
            errorMessage={errorOf(errors, touched, "evidenceFiles")}
          >
            <EvidenceUpload
              files={values.evidenceFiles}
              onChange={onEvidenceChange}
              errorMessage={errorOf(errors, touched, "evidenceFiles")}
              disabled={disabled}
            />
          </FormField>
        </>
      ) : null}
    </section>
  );
}
