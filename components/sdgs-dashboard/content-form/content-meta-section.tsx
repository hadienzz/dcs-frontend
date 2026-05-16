"use client";

import { Textarea } from "@/components/ui/textarea";
import type { SdgsDashboardFormValues } from "@/types/sdgs-dashboard";

import FormField from "../controls/form-field";

export type ContentMetaSectionProps = {
  values: Pick<SdgsDashboardFormValues, "comment">;
  errors?: { comment?: string };
  touched?: { comment?: boolean };
  onCommentChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCommentBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  disabled?: boolean;
};

/**
 * Meta/optional notes section. Currently hosts the free-form comment field.
 */
export default function ContentMetaSection({
  values,
  errors,
  touched,
  onCommentChange,
  onCommentBlur,
  disabled = false,
}: ContentMetaSectionProps) {
  const errorMessage = touched?.comment ? errors?.comment : undefined;

  return (
    <section>
      <FormField
        id="content-comment"
        label="Catatan tambahan"
        helperText="Opsional. Maksimal 500 karakter."
        errorMessage={errorMessage}
      >
        <Textarea
          id="content-comment"
          name="comment"
          value={values.comment}
          onChange={onCommentChange}
          onBlur={onCommentBlur}
          placeholder="Catatan untuk reviewer atau tim internal..."
          rows={3}
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={errorMessage ? "content-comment-error" : undefined}
          disabled={disabled}
        />
      </FormField>
    </section>
  );
}
