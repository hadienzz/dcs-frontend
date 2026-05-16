"use client";

import { Form, Formik } from "formik";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCreateSdgsContent } from "@/hooks/sdgs-dashboard/use-sdgs-content";
import {
  initialSdgsContentValues,
  sdgsContentSchema,
} from "@/schemas/sdgs-dashboard/content-form-schema";
import { getErrorMessage } from "@/utils/api-error";

import { AvailabilitySection } from "./form/availability-section";
import { BasicInfoSection } from "./form/basic-info-section";
import { DirectorateSection } from "./form/directorate-section";
import { EvidenceSection } from "./form/evidence-section";
import { SdgsSelectionSection } from "./form/sdgs-selection-section";

interface SdgsContentFormProps {
  /** Called after a successful save. Use for navigation. */
  onSuccess?: () => void;
  /** Called when the user clicks the cancel button. */
  onCancel?: () => void;
}

export function SdgsContentForm({ onSuccess, onCancel }: SdgsContentFormProps) {
  const { mutateAsync, isPending } = useCreateSdgsContent();

  return (
    <Formik
      initialValues={initialSdgsContentValues}
      validationSchema={sdgsContentSchema}
      onSubmit={(values, helpers) =>
        mutateAsync(values).then(
          () => {
            toast.success("Inisiatif berhasil disimpan.");
            helpers.resetForm();
            onSuccess?.();
          },
          (error) => {
            toast.error(getErrorMessage(error, "Gagal menyimpan inisiatif."));
          },
        )
      }
    >
      <Form className="space-y-6 pb-12">
        <BasicInfoSection />
        <SdgsSelectionSection />
        <AvailabilitySection />
        <EvidenceSection />
        <DirectorateSection />
        <div className="flex justify-end gap-2">
          {onCancel ? (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
            >
              Batal
            </Button>
          ) : null}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Menyimpan…" : "Simpan inisiatif"}
          </Button>
        </div>
      </Form>
    </Formik>
  );
}
