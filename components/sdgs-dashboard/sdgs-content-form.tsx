"use client";

import { Form, Formik, useFormikContext } from "formik";
import { toast } from "sonner";
import {
  Building2,
  CheckCircle2,
  FileText,
  Globe,
  Layers,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCreateSdgsContent } from "@/hooks/sdgs-dashboard/use-sdgs-content";
import {
  initialSdgsContentValues,
  sdgsContentSchema,
} from "@/schemas/sdgs-dashboard/content-form-schema";
import { getErrorMessage } from "@/utils/api-error";

import { AvailabilitySection } from "./form/availability-section";
import { BasicInfoSection } from "./form/basic-info-section";
import { DirectorateSection } from "./form/directorate-section";
import { SdgsSelectionSection } from "./form/sdgs-selection-section";

interface SdgsContentFormProps {
  onSuccess?: () => void;
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
            toast.success("Dokumen berhasil disimpan.");
            helpers.resetForm();
            onSuccess?.();
          },
          (error) => {
            toast.error(getErrorMessage(error, "Gagal menyimpan dokumen."));
          },
        )
      }
    >
      <FormContent onCancel={onCancel} isPending={isPending} />
    </Formik>
  );
}

function FormContent({
  onCancel,
  isPending,
}: {
  onCancel?: () => void;
  isPending: boolean;
}) {
  const { values } = useFormikContext<typeof initialSdgsContentValues>();

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
      {/* Main form */}
      <Form className="space-y-5 pb-12">
        <BasicInfoSection />
        <SdgsSelectionSection />
        <AvailabilitySection />
        <DirectorateSection />

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-black/[0.04] pt-5">
          {onCancel ? (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
              className="text-sm"
            >
              Batal
            </Button>
          ) : null}
          <Button type="submit" disabled={isPending} className="text-sm">
            {isPending ? "Menyimpan…" : "Simpan dokumen"}
          </Button>
        </div>
      </Form>

      {/* Summary sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-8 space-y-4">
          <SummaryCard values={values} />
        </div>
      </aside>
    </div>
  );
}

function SummaryCard({
  values,
}: {
  values: typeof initialSdgsContentValues;
}) {
  const items = [
    {
      icon: FileText,
      label: "JUDUL",
      value: values.title || "—",
    },
    {
      icon: Target,
      label: "SDGs",
      value:
        values.sdgs.length > 0
          ? `${values.sdgs.length} goal dipilih`
          : "—",
    },
    {
      icon: CheckCircle2,
      label: "INDIKATOR",
      value: (() => {
        const total = values.sdgs.reduce(
          (acc, s) => acc + s.indicators.length,
          0,
        );
        return total > 0 ? `${total} indikator` : "—";
      })(),
    },
    {
      icon: Globe,
      label: "VISIBILITAS",
      value:
        values.publicVisibility === "yes" ? "Publikasi" : "Internal",
    },
    {
      icon: Building2,
      label: "DIREKTORAT",
      value:
        values.directorates.length > 0
          ? `${values.directorates.length} direktorat`
          : "—",
    },
    {
      icon: Layers,
      label: "LAMPIRAN",
      value:
        values.thumbnailName || values.attachmentName
          ? "Ada"
          : "—",
    },
  ];

  return (
    <div className="rounded-xl border border-black/[0.06] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="border-b border-black/[0.04] px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Ringkasan
        </p>
      </div>
      <div className="space-y-0 divide-y divide-black/[0.04]">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-start gap-3 px-4 py-3"
            >
              <Icon className="mt-0.5 size-4 shrink-0 text-slate-400" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  {item.label}
                </p>
                <p
                  className={cn(
                    "mt-0.5 truncate text-sm",
                    item.value === "—"
                      ? "text-slate-300"
                      : "font-medium text-slate-800",
                  )}
                >
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
