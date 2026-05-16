"use client";

import { useEffect, useRef } from "react";
import { useFormik, type FormikErrors, type FormikTouched } from "formik";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SDGS_DASHBOARD_INITIAL_VALUES } from "@/lib/sdgs-dashboard-data";
import { sdgsDashboardContentFormSchema } from "@/schemas/sdgs-dashboard/content-form-schema";
import type {
  SdgsDashboardContentType,
  SdgsDashboardFormValues,
  SdgsDashboardSdgGoalId,
  SdgsDashboardYesNo,
} from "@/types/sdgs-dashboard";
import useCreateContent from "@/hooks/sdgs-dashboard/use-create-content";

import ContentAvailabilitySection from "./content-availability-section";
import ContentBasicSection from "./content-basic-section";
import ContentClassificationSection from "./content-classification-section";
import ContentMetaSection from "./content-meta-section";
import ContentOwnershipSection from "./content-ownership-section";

export type ContentFormProps = {
  initialValues?: SdgsDashboardFormValues;
};

type Errors = FormikErrors<SdgsDashboardFormValues>;
type Touched = FormikTouched<SdgsDashboardFormValues>;

const sectionWrapperClass =
  "rounded-2xl border border-border/70 bg-card p-5 shadow-sm";

const sectionTitleClass = "text-base font-semibold text-foreground";

const sectionSubtitleClass = "mt-0.5 text-sm text-muted-foreground";

const sectionHeaderClass = "mb-4 flex flex-col";

/**
 * Top-level Content_Form component. Owns form state via Formik and delegates
 * the network call to `useCreateContent`. The component is presentational in
 * the sense that it does not call axios/fetch directly; all submit logic
 * flows through the mutation hook.
 *
 * Behavior contract (see design.md):
 * - `initialValues` defaults to `SDGS_DASHBOARD_INITIAL_VALUES`.
 * - On submit, calls `mutation.mutate(values)` directly (no exception handling).
 * - On `onSuccess`, resets the form back to `SDGS_DASHBOARD_INITIAL_VALUES`.
 * - When the user toggles `isAvailable` from "yes" to "no", the Description
 *   and Evidence Upload values are cleared. Toggling back to "yes" preserves
 *   any existing values (Formik never clears them on its own).
 */
export default function ContentForm({ initialValues }: ContentFormProps) {
  const mutation = useCreateContent({
    onSuccess: () => {
      formik.resetForm();
    },
  });

  const formik = useFormik<SdgsDashboardFormValues>({
    initialValues: initialValues ?? SDGS_DASHBOARD_INITIAL_VALUES,
    validationSchema: sdgsDashboardContentFormSchema,
    validateOnBlur: true,
    enableReinitialize: false,
    onSubmit: (values) => mutation.mutate(values),
  });

  const previousAvailabilityRef = useRef(formik.values.isAvailable);

  useEffect(() => {
    const previous = previousAvailabilityRef.current;
    const current = formik.values.isAvailable;

    if (previous === "yes" && current === "no") {
      formik.setFieldValue("description", "");
      formik.setFieldValue("evidenceFiles", []);
    }

    previousAvailabilityRef.current = current;
  }, [formik.values.isAvailable, formik]);

  const errors = formik.errors as Errors;
  const touched = formik.touched as Touched;
  const disabled = mutation.isPending;

  const handleTextChange =
    <Field extends keyof SdgsDashboardFormValues>(field: Field) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      formik.setFieldValue(field, event.target.value);
    };

  const handleReset = () => {
    if (disabled) return;
    formik.resetForm();
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={formik.handleSubmit} noValidate>
      <div className={sectionWrapperClass}>
        <header className={sectionHeaderClass}>
          <h2 className={sectionTitleClass}>Identitas konten</h2>
          <p className={sectionSubtitleClass}>
            Informasi dasar metric/indicator yang akan dilaporkan.
          </p>
        </header>
        <ContentBasicSection
          values={formik.values}
          errors={{
            title: errors.title as string | undefined,
            reportingYear: errors.reportingYear as string | undefined,
            contentType: errors.contentType as string | undefined,
            metricReference: errors.metricReference as string | undefined,
            metricTitle: errors.metricTitle as string | undefined,
            value: errors.value as string | undefined,
          }}
          touched={{
            title: touched.title,
            reportingYear: touched.reportingYear,
            contentType: touched.contentType,
            metricReference: touched.metricReference,
            metricTitle: touched.metricTitle,
            value: touched.value,
          }}
          onTextChange={handleTextChange}
          onContentTypeChange={(next: SdgsDashboardContentType) =>
            formik.setFieldValue("contentType", next)
          }
          onBlur={formik.handleBlur}
          disabled={disabled}
        />
      </div>

      <div className={sectionWrapperClass}>
        <header className={sectionHeaderClass}>
          <h2 className={sectionTitleClass}>Ketersediaan data & evidence</h2>
          <p className={sectionSubtitleClass}>
            Tentukan apakah data tersedia. Jika ya, lengkapi deskripsi dan upload evidence.
          </p>
        </header>
        <ContentAvailabilitySection
          values={formik.values}
          errors={{
            isAvailable: errors.isAvailable as string | undefined,
            description: errors.description as string | undefined,
            evidenceFiles: errors.evidenceFiles as string | undefined,
          }}
          touched={{
            isAvailable: touched.isAvailable,
            description: touched.description,
            evidenceFiles: Array.isArray(touched.evidenceFiles)
              ? touched.evidenceFiles.length > 0
              : Boolean(touched.evidenceFiles),
          }}
          onAvailabilityChange={(next: SdgsDashboardYesNo) =>
            formik.setFieldValue("isAvailable", next)
          }
          onDescriptionChange={handleTextChange("description")}
          onDescriptionBlur={formik.handleBlur}
          onEvidenceChange={(files) => formik.setFieldValue("evidenceFiles", files)}
          disabled={disabled}
        />
      </div>

      <div className={sectionWrapperClass}>
        <header className={sectionHeaderClass}>
          <h2 className={sectionTitleClass}>Pemetaan SDG</h2>
          <p className={sectionSubtitleClass}>
            Konten dapat dikaitkan ke lebih dari satu SDG.
          </p>
        </header>
        <ContentClassificationSection
          values={formik.values}
          errors={{ sdgGoals: errors.sdgGoals as string | undefined }}
          touched={{
            sdgGoals: Array.isArray(touched.sdgGoals)
              ? touched.sdgGoals.length > 0
              : Boolean(touched.sdgGoals),
          }}
          onSdgGoalsChange={(next: SdgsDashboardSdgGoalId[]) =>
            formik.setFieldValue("sdgGoals", next)
          }
          disabled={disabled}
        />
      </div>

      <div className={sectionWrapperClass}>
        <header className={sectionHeaderClass}>
          <h2 className={sectionTitleClass}>Visibility & kepemilikan</h2>
          <p className={sectionSubtitleClass}>
            Atur visibility publik dan pilih direktorat/unit pengelola.
          </p>
        </header>
        <ContentOwnershipSection
          values={formik.values}
          errors={{
            isPublic: errors.isPublic as string | undefined,
            directorateIds: errors.directorateIds as string | undefined,
            unitIds: errors.unitIds as string | undefined,
          }}
          touched={{
            isPublic: touched.isPublic,
            directorateIds: Array.isArray(touched.directorateIds)
              ? touched.directorateIds.length > 0
              : Boolean(touched.directorateIds),
            unitIds: Array.isArray(touched.unitIds)
              ? touched.unitIds.length > 0
              : Boolean(touched.unitIds),
          }}
          onPublicChange={(next: SdgsDashboardYesNo) =>
            formik.setFieldValue("isPublic", next)
          }
          onDirectorateChange={(next) =>
            formik.setFieldValue("directorateIds", next)
          }
          onUnitChange={(next) => formik.setFieldValue("unitIds", next)}
          disabled={disabled}
        />
      </div>

      <div className={sectionWrapperClass}>
        <header className={sectionHeaderClass}>
          <h2 className={sectionTitleClass}>Catatan</h2>
          <p className={sectionSubtitleClass}>
            Opsional. Tinggalkan kosong jika tidak ada catatan tambahan.
          </p>
        </header>
        <ContentMetaSection
          values={formik.values}
          errors={{ comment: errors.comment as string | undefined }}
          touched={{ comment: touched.comment }}
          onCommentChange={handleTextChange("comment")}
          onCommentBlur={formik.handleBlur}
          disabled={disabled}
        />
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={disabled}
        >
          Reset
        </Button>
        <Button type="submit" size="sm" disabled={disabled} className="gap-1.5">
          {mutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Menyimpan...
            </>
          ) : (
            "Simpan konten"
          )}
        </Button>
      </div>
    </form>
  );
}
