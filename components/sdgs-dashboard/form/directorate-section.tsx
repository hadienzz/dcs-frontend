"use client";

import { FieldArray, useFormikContext } from "formik";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { directorateById, directorates } from "@/lib/sdgs-dashboard-data";
import type { SdgsContentFormValues } from "@/types/sdgs-dashboard";

import { MultiSelect, type MultiSelectOption } from "../multi-select";
import { SectionCard } from "../section-card";
import { FieldError } from "./field-error";
import { LabeledField } from "./labeled-field";

const directorateOptions = directorates.map((directorate) => ({
  id: directorate.id,
  name: directorate.name,
}));

function unitOptionsFor(directorateId: string): MultiSelectOption[] {
  const directorate = directorateById.get(directorateId);
  if (!directorate) return [];
  return directorate.units.map((unit) => ({
    value: unit.id,
    label: unit.name,
  }));
}

export function DirectorateSection() {
  const { values, errors, touched, setFieldValue, setFieldTouched } =
    useFormikContext<SdgsContentFormValues>();

  const directorateErrors = errors.directorates as
    | Array<{ directorateId?: string; units?: string } | undefined>
    | string
    | undefined;
  const rootError =
    typeof directorateErrors === "string" ? directorateErrors : undefined;

  return (
    <FieldArray name="directorates">
      {({ push, remove }) => (
        <SectionCard
          title="Direktorat & Unit"
          description="Pilih direktorat dan unit yang bertanggung jawab atas dokumen ini."
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => push({ directorateId: "", units: [] })}
              className="text-xs"
            >
              <Plus className="size-3.5" />
              Tambah direktorat
            </Button>
          }
        >
          {values.directorates.length === 0 ? (
            <div className="rounded-xl border border-dashed border-black/[0.08] bg-[#fafafa] px-4 py-8 text-center">
              <p className="text-sm text-slate-400">
                Belum ada direktorat dipilih.
              </p>
              <button
                type="button"
                onClick={() => push({ directorateId: "", units: [] })}
                className="mt-2 text-sm font-medium text-[#b6252a] hover:underline"
              >
                + Tambah direktorat pertama
              </button>
            </div>
          ) : null}

          {values.directorates.map((row, index) => {
            const itemErrors = Array.isArray(directorateErrors)
              ? directorateErrors[index]
              : undefined;
            const itemTouched = (touched.directorates?.[index] ?? undefined) as
              | { directorateId?: boolean; units?: boolean }
              | undefined;

            return (
              <div
                key={index}
                className="space-y-4 rounded-xl border border-black/[0.06] bg-[#fafafa] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <LabeledField label="Direktorat" className="flex-1">
                    <Select
                      value={row.directorateId}
                      onValueChange={(next) => {
                        setFieldValue(
                          `directorates.${index}.directorateId`,
                          next,
                        );
                        setFieldValue(`directorates.${index}.units`, []);
                        setFieldTouched(
                          `directorates.${index}.directorateId`,
                          true,
                          false,
                        );
                      }}
                    >
                      <SelectTrigger className="border-black/[0.08] bg-white">
                        <SelectValue placeholder="Pilih direktorat…" />
                      </SelectTrigger>
                      <SelectContent>
                        {directorateOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError
                      message={
                        itemTouched?.directorateId
                          ? itemErrors?.directorateId
                          : undefined
                      }
                    />
                  </LabeledField>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    aria-label="Hapus direktorat"
                    className="mt-7 rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                {row.directorateId ? (
                  <LabeledField label="Unit">
                    <MultiSelect
                      options={unitOptionsFor(row.directorateId)}
                      value={row.units}
                      onChange={(next) => {
                        setFieldValue(`directorates.${index}.units`, next);
                        setFieldTouched(
                          `directorates.${index}.units`,
                          true,
                          false,
                        );
                      }}
                      placeholder="Pilih unit…"
                    />
                    <FieldError
                      message={
                        itemTouched?.units ? itemErrors?.units : undefined
                      }
                    />
                  </LabeledField>
                ) : null}
              </div>
            );
          })}

          <FieldError message={rootError} />
        </SectionCard>
      )}
    </FieldArray>
  );
}
