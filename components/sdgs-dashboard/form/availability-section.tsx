"use client";

import { useFormikContext } from "formik";

import type { SdgsContentFormValues } from "@/types/sdgs-dashboard";

import { SectionCard } from "../section-card";
import { ToggleRow } from "./toggle-row";

export function AvailabilitySection() {
  const { values, setFieldValue } = useFormikContext<SdgsContentFormValues>();
  const isAvailable = values.isAvailable === "yes";

  return (
    <SectionCard
      title="Status Pelaksanaan"
      description="Sudah ada bukti pelaksanaan inisiatif yang siap dikirim?"
    >
      <ToggleRow
        id="isAvailable"
        label="Inisiatif sudah berjalan?"
        description={
          isAvailable
            ? "Lengkapi bukti pelaksanaan di bagian berikutnya."
            : "Status disimpan sebagai draf — Anda bisa melanjutkan nanti."
        }
        checked={isAvailable}
        onChange={(checked) =>
          setFieldValue("isAvailable", checked ? "yes" : "no")
        }
      />
    </SectionCard>
  );
}
