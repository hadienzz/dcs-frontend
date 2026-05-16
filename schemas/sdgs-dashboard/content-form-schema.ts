import * as Yup from "yup";

import { directorates, sdgs } from "@/lib/sdgs-dashboard-data";
import type { SdgsContentFormValues } from "@/types/sdgs-dashboard";

const sdgIds = sdgs.map((s) => s.id);
const directorateIds = directorates.map((d) => d.id);
const allUnitIds = directorates.flatMap((d) => d.units.map((u) => u.id));

const directorateSelectionSchema = Yup.object({
  directorateId: Yup.string()
    .oneOf(directorateIds, "Direktorat tidak valid.")
    .required("Direktorat wajib dipilih."),
  units: Yup.array()
    .of(
      Yup.string()
        .oneOf(allUnitIds, "Unit tidak valid.")
        .required(),
    )
    .min(1, "Pilih minimal 1 unit.")
    .required(),
});

export const sdgsContentSchema: Yup.ObjectSchema<SdgsContentFormValues> = Yup.object({
  title: Yup.string()
    .trim()
    .min(3, "Judul minimal 3 karakter.")
    .max(200, "Judul maksimal 200 karakter.")
    .required("Judul wajib diisi."),
  description: Yup.string()
    .trim()
    .min(10, "Deskripsi minimal 10 karakter.")
    .required("Deskripsi wajib diisi."),
  thumbnailName: Yup.string().defined(),
  attachmentName: Yup.string().defined(),
  sdgs: Yup.array()
    .of(Yup.string().oneOf(sdgIds, "SDG tidak valid.").required())
    .min(1, "Pilih minimal 1 SDG.")
    .required(),
  isAvailable: Yup.mixed<"yes" | "no">()
    .oneOf(["yes", "no"], "Status tidak valid.")
    .required(),
  publicVisibility: Yup.mixed<"yes" | "no">()
    .oneOf(["yes", "no"], "Visibility tidak valid.")
    .required(),
  evidenceDescription: Yup.string()
    .defined()
    .when("isAvailable", {
      is: "yes",
      then: (schema) =>
        schema
          .trim()
          .min(5, "Deskripsi bukti wajib diisi.")
          .required("Deskripsi bukti wajib diisi."),
    }),
  evidenceFileName: Yup.string().defined(),
  supportingLink: Yup.string()
    .defined()
    .test("is-url", "Link tidak valid.", (value) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }),
  notes: Yup.string().defined(),
  directorates: Yup.array()
    .of(directorateSelectionSchema)
    .min(1, "Pilih minimal 1 direktorat.")
    .required(),
});

export const initialSdgsContentValues: SdgsContentFormValues = {
  title: "",
  description: "",
  thumbnailName: "",
  attachmentName: "",
  sdgs: [],
  isAvailable: "no",
  publicVisibility: "no",
  evidenceDescription: "",
  evidenceFileName: "",
  supportingLink: "",
  notes: "",
  directorates: [],
};
