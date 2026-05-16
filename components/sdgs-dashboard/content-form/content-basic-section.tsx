"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  SdgsDashboardContentType,
  SdgsDashboardFormValues,
} from "@/types/sdgs-dashboard";

import FormField from "../controls/form-field";

type FieldErrors = Partial<
  Record<
    keyof Pick<
      SdgsDashboardFormValues,
      | "title"
      | "reportingYear"
      | "contentType"
      | "metricReference"
      | "metricTitle"
      | "value"
    >,
    string | undefined
  >
>;

export type ContentBasicSectionProps = {
  values: Pick<
    SdgsDashboardFormValues,
    | "title"
    | "reportingYear"
    | "contentType"
    | "metricReference"
    | "metricTitle"
    | "value"
  >;
  errors?: FieldErrors;
  touched?: Partial<Record<keyof FieldErrors, boolean>>;
  onTextChange: (
    field: keyof FieldErrors,
  ) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onContentTypeChange: (value: SdgsDashboardContentType) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  disabled?: boolean;
};

const errorOf = (
  errors: FieldErrors | undefined,
  touched: ContentBasicSectionProps["touched"],
  field: keyof FieldErrors,
) => (touched?.[field] ? errors?.[field] : undefined);

/**
 * Presentational section that renders the basic identification fields of the
 * Content_Form: Title, Reporting Year, Content Type, Metric Reference,
 * Metric Title, and Value. The parent (`ContentForm`) wires Formik field
 * props to this component; no fetching or state lives here.
 */
export default function ContentBasicSection({
  values,
  errors,
  touched,
  onTextChange,
  onContentTypeChange,
  onBlur,
  disabled = false,
}: ContentBasicSectionProps) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField
        id="content-title"
        label="Judul konten"
        required
        errorMessage={errorOf(errors, touched, "title")}
      >
        <Input
          id="content-title"
          name="title"
          type="text"
          value={values.title}
          onChange={onTextChange("title")}
          onBlur={onBlur}
          placeholder="Contoh: Pelaporan SDG 1.2 tahun 2026"
          aria-invalid={Boolean(errorOf(errors, touched, "title"))}
          aria-describedby={
            errorOf(errors, touched, "title") ? "content-title-error" : undefined
          }
          disabled={disabled}
        />
      </FormField>

      <FormField
        id="content-reporting-year"
        label="Tahun pelaporan"
        required
        errorMessage={errorOf(errors, touched, "reportingYear")}
      >
        <Input
          id="content-reporting-year"
          name="reportingYear"
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={values.reportingYear}
          onChange={onTextChange("reportingYear")}
          onBlur={onBlur}
          placeholder="2026"
          aria-invalid={Boolean(errorOf(errors, touched, "reportingYear"))}
          aria-describedby={
            errorOf(errors, touched, "reportingYear")
              ? "content-reporting-year-error"
              : undefined
          }
          disabled={disabled}
        />
      </FormField>

      <FormField
        id="content-type"
        label="Tipe konten"
        required
        errorMessage={errorOf(errors, touched, "contentType")}
      >
        <Select
          value={values.contentType}
          onValueChange={(next) =>
            onContentTypeChange(next as SdgsDashboardContentType)
          }
          disabled={disabled}
        >
          <SelectTrigger id="content-type">
            <SelectValue placeholder="Pilih tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric</SelectItem>
            <SelectItem value="indicator">Indicator</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      <FormField
        id="content-metric-reference"
        label="Referensi metric/indicator"
        required
        helperText="Contoh: 1.2 atau 1.3.1"
        errorMessage={errorOf(errors, touched, "metricReference")}
      >
        <Input
          id="content-metric-reference"
          name="metricReference"
          type="text"
          value={values.metricReference}
          onChange={onTextChange("metricReference")}
          onBlur={onBlur}
          placeholder="1.2"
          aria-invalid={Boolean(errorOf(errors, touched, "metricReference"))}
          aria-describedby={
            errorOf(errors, touched, "metricReference")
              ? "content-metric-reference-error"
              : undefined
          }
          disabled={disabled}
        />
      </FormField>

      <FormField
        id="content-metric-title"
        label="Nama metric/indicator (Bahasa Inggris)"
        required
        errorMessage={errorOf(errors, touched, "metricTitle")}
        className="md:col-span-2"
      >
        <Input
          id="content-metric-title"
          name="metricTitle"
          type="text"
          value={values.metricTitle}
          onChange={onTextChange("metricTitle")}
          onBlur={onBlur}
          placeholder="e.g. Proportion of students receiving financial aid"
          aria-invalid={Boolean(errorOf(errors, touched, "metricTitle"))}
          aria-describedby={
            errorOf(errors, touched, "metricTitle")
              ? "content-metric-title-error"
              : undefined
          }
          disabled={disabled}
        />
      </FormField>

      <FormField
        id="content-value"
        label="Value (untuk continuous data)"
        helperText="Opsional. Bisa berisi angka, daftar, atau penjelasan singkat."
        errorMessage={errorOf(errors, touched, "value")}
        className="md:col-span-2"
      >
        <Textarea
          id="content-value"
          name="value"
          value={values.value}
          onChange={onTextChange("value")}
          onBlur={onBlur}
          placeholder="Contoh: 25 mahasiswa pada 2026"
          rows={3}
          aria-invalid={Boolean(errorOf(errors, touched, "value"))}
          aria-describedby={
            errorOf(errors, touched, "value")
              ? "content-value-error"
              : undefined
          }
          disabled={disabled}
        />
      </FormField>
    </section>
  );
}
