import * as Yup from "yup";

import {
  SDGS_DASHBOARD_DIRECTORATES,
  selectedDirectoratesHaveUnits,
} from "@/lib/sdgs-dashboard-data";
import {
  SDGS_DASHBOARD_SDG_GOAL_IDS,
  type SdgsDashboardFormValues,
} from "@/types/sdgs-dashboard";

const allowedDirectorateIds = SDGS_DASHBOARD_DIRECTORATES.map(
  (directorate) => directorate.id,
);

const allowedUnitIds = SDGS_DASHBOARD_DIRECTORATES.flatMap((directorate) =>
  directorate.units.map((unit) => unit.id),
);

export const sdgsDashboardContentFormSchema: Yup.ObjectSchema<SdgsDashboardFormValues> =
  Yup.object({
    title: Yup.string()
      .trim()
      .min(5, "Judul minimal 5 karakter.")
      .max(140, "Judul maksimal 140 karakter.")
      .required("Judul konten wajib diisi."),
    reportingYear: Yup.string()
      .trim()
      .matches(/^20\d{2}$/, "Tahun harus format 4 digit, contoh 2026.")
      .required("Tahun pelaporan wajib diisi."),
    contentType: Yup.mixed<"metric" | "indicator">()
      .oneOf(["metric", "indicator"], "Tipe konten tidak valid.")
      .required("Tipe konten wajib dipilih."),
    metricReference: Yup.string()
      .trim()
      .min(1, "Referensi metric/indicator wajib diisi.")
      .max(40, "Referensi maksimal 40 karakter.")
      .required("Referensi metric/indicator wajib diisi."),
    metricTitle: Yup.string()
      .trim()
      .min(6, "Nama metric/indicator minimal 6 karakter.")
      .max(220, "Nama metric/indicator maksimal 220 karakter.")
      .required("Nama metric/indicator wajib diisi."),
    value: Yup.string()
      .trim()
      .max(500, "Value maksimal 500 karakter.")
      .defined(),
    isAvailable: Yup.mixed<"yes" | "no">()
      .oneOf(["yes", "no"], "Status data tidak valid.")
      .required("Status data wajib dipilih."),
    description: Yup.string()
      .defined()
      .when("isAvailable", {
        is: "yes",
        then: (schema) =>
          schema
            .trim()
            .min(20, "Deskripsi minimal 20 karakter.")
            .required("Deskripsi wajib diisi saat data tersedia.")
            .defined(),
        otherwise: (schema) =>
          schema.trim().max(900, "Deskripsi maksimal 900 karakter.").defined(),
      }),
    evidenceFiles: Yup.array()
      .of(Yup.mixed<File>().required())
      .when("isAvailable", {
        is: "yes",
        then: (schema) =>
          schema.min(1, "Upload minimal satu evidence saat data tersedia."),
        otherwise: (schema) => schema,
      })
      .required(),
    isPublic: Yup.mixed<"yes" | "no">()
      .oneOf(["yes", "no"], "Visibility tidak valid.")
      .required("Visibility wajib dipilih."),
    sdgGoals: Yup.array()
      .of(
        Yup.string()
          .oneOf([...SDGS_DASHBOARD_SDG_GOAL_IDS], "SDG tidak valid.")
          .required(),
      )
      .min(1, "Pilih minimal satu SDG.")
      .required(),
    directorateIds: Yup.array()
      .of(
        Yup.string()
          .oneOf(allowedDirectorateIds, "Direktorat tidak valid.")
          .required(),
      )
      .min(1, "Pilih minimal satu direktorat.")
      .required(),
    unitIds: Yup.array()
      .of(
        Yup.string()
          .oneOf(allowedUnitIds, "Unit tidak valid.")
          .required(),
      )
      .test(
        "unit-required-for-selected-directorate",
        "Pilih minimal satu unit dari direktorat yang dipilih.",
        (unitIds, context) => {
          const values = context.parent as SdgsDashboardFormValues;

          if (
            !selectedDirectoratesHaveUnits(
              SDGS_DASHBOARD_DIRECTORATES,
              values.directorateIds,
            )
          ) {
            return true;
          }

          return Boolean(unitIds?.length);
        },
      )
      .required(),
    comment: Yup.string()
      .trim()
      .max(500, "Catatan maksimal 500 karakter.")
      .defined(),
  });

/**
 * Thin wrapper around `sdgsDashboardContentFormSchema.validate` used by tests
 * and call sites that want a single-line validation entry point. Returns the
 * cast values on success and throws a `Yup.ValidationError` on failure.
 */
export async function validateContentFormValues(
  values: SdgsDashboardFormValues,
): Promise<SdgsDashboardFormValues> {
  return sdgsDashboardContentFormSchema.validate(values, {
    abortEarly: false,
  });
}

export default sdgsDashboardContentFormSchema;
