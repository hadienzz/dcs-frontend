import type { FormikProps } from "formik";
import { FileUp, Loader2, Save, X } from "lucide-react";

import { DivisionSelect } from "@/components/document-center/division-select";
import { PICSelect } from "@/components/document-center/pic-select";
import { SubdivisionSelect } from "@/components/document-center/subdivision-select";
import {
  FieldBlock,
  Input,
  Textarea,
} from "@/components/sdg-dashboard/internal/internal-form-primitives";
import { Button } from "@/components/ui/button";
import type {
  DocumentDivision,
  DocumentPic,
  DocumentSubdivision,
  UploadDocumentFormValues,
} from "@/types/document-center";
import { cn } from "@/lib/utils";

interface UploadDocumentFormStatus {
  submitError?: string;
  successMessage?: string;
}

interface UploadDocumentFormProps {
  formik: FormikProps<UploadDocumentFormValues>;
  divisions: DocumentDivision[];
  subdivisionOptions: DocumentSubdivision[];
  picOptions: DocumentPic[];
  isSubmitting: boolean;
  isEditMode?: boolean;
  onDivisionChange: (divisionId: string) => void;
  onCancelEdit?: () => void;
}

function getFieldError(
  formik: FormikProps<UploadDocumentFormValues>,
  field: keyof UploadDocumentFormValues,
) {
  const error = formik.errors[field];
  const touched = formik.touched[field];

  return touched && error ? String(error) : undefined;
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm font-medium text-destructive">{message}</p>;
}

export function UploadDocumentForm({
  formik,
  divisions,
  subdivisionOptions,
  picOptions,
  isSubmitting,
  isEditMode,
  onDivisionChange,
  onCancelEdit,
}: UploadDocumentFormProps) {
  const status = formik.status as UploadDocumentFormStatus | undefined;

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <FieldBlock htmlFor="title" label="Title">
          <Input
            id="title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Masukkan judul dokumen"
          />
          <FieldError message={getFieldError(formik, "title")} />
        </FieldBlock>

        <FieldBlock
          htmlFor="file"
          label="File upload"
          hint={isEditMode ? "Kosongkan jika file tidak berubah." : undefined}
        >
          <input
            id="file"
            name="file"
            type="file"
            onChange={(event) =>
              formik.setFieldValue("file", event.currentTarget.files?.[0] ?? null)
            }
            onBlur={() => formik.setFieldTouched("file", true)}
            className={cn(
              "flex h-12 w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-[15px] text-foreground shadow-sm transition-[border-color,box-shadow,background-color] file:mr-4 file:rounded-lg file:border-0 file:bg-primary/[0.08] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-primary focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/15",
            )}
          />
          <FieldError message={getFieldError(formik, "file")} />
        </FieldBlock>

        <FieldBlock htmlFor="divisionId" label="Division">
          <DivisionSelect
            id="divisionId"
            name="divisionId"
            value={formik.values.divisionId}
            divisions={divisions}
            onChange={onDivisionChange}
            onBlur={formik.handleBlur}
          />
          <FieldError message={getFieldError(formik, "divisionId")} />
        </FieldBlock>

        <FieldBlock htmlFor="subdivisionId" label="Subdivision">
          <SubdivisionSelect
            id="subdivisionId"
            name="subdivisionId"
            value={formik.values.subdivisionId}
            subdivisions={subdivisionOptions}
            onChange={(value) => formik.setFieldValue("subdivisionId", value)}
            onBlur={formik.handleBlur}
            disabled={!formik.values.divisionId}
          />
          <FieldError message={getFieldError(formik, "subdivisionId")} />
        </FieldBlock>

        <FieldBlock htmlFor="picId" label="Inputted By / PIC">
          <PICSelect
            id="picId"
            name="picId"
            value={formik.values.picId}
            people={picOptions}
            onChange={(value) => formik.setFieldValue("picId", value)}
            onBlur={formik.handleBlur}
            disabled={!formik.values.divisionId}
          />
          <FieldError message={getFieldError(formik, "picId")} />
        </FieldBlock>

        <FieldBlock htmlFor="notes" label="Optional notes">
          <Textarea
            id="notes"
            name="notes"
            value={formik.values.notes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Tambahkan catatan singkat bila perlu"
            className="min-h-28"
          />
          <FieldError message={getFieldError(formik, "notes")} />
        </FieldBlock>
      </div>

      {status?.submitError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
          {status.submitError}
        </div>
      ) : null}

      {status?.successMessage ? (
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {status.successMessage}
        </div>
      ) : null}

      <div className="flex flex-wrap justify-end gap-3 border-t border-border/70 pt-5">
        {isEditMode && onCancelEdit ? (
          <Button
            type="button"
            variant="outline"
            onClick={onCancelEdit}
            disabled={isSubmitting}
          >
            <X data-icon="inline-start" />
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 data-icon="inline-start" className="animate-spin" />
          ) : isEditMode ? (
            <Save data-icon="inline-start" />
          ) : (
            <FileUp data-icon="inline-start" />
          )}
          {isSubmitting
            ? isEditMode
              ? "Saving..."
              : "Uploading..."
            : isEditMode
              ? "Save Metadata"
              : "Upload Document"}
        </Button>
      </div>
    </form>
  );
}
