"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type MutationKey,
} from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";

import { directorateFields as initialDirectorateFields } from "@/lib/sdgs-dashboard-data";
import {
  sdgsDirectorateService,
  type UpdateSdgsDirectoratePayload,
  type UpdateSdgsUnitPayload,
} from "@/services/sdgs-dashboard/sdgs-directorate-service";
import type { DirectorateField } from "@/types/sdgs-dashboard";
import { getErrorMessage } from "@/utils/api-error";
import { sdgsDirectorateKeys } from "./query-keys";

type UpdateFieldVariables = {
  fieldId: string;
  name: string;
};

type DirectorateVariables = {
  fieldId: string;
  directorateId: string;
};

type UpdateDirectorateVariables = DirectorateVariables &
  UpdateSdgsDirectoratePayload;

type UnitVariables = DirectorateVariables & {
  unitId: string;
};

type UpdateUnitVariables = UnitVariables & UpdateSdgsUnitPayload;

function useDirectorateFieldsMutation<TVariables>({
  mutationKey,
  mutationFn,
  successMessage,
  errorMessage,
}: {
  mutationKey: MutationKey;
  mutationFn: (variables: TVariables) => Promise<DirectorateField[]>;
  successMessage: string;
  errorMessage: string;
}) {
  const queryClient = useQueryClient();

  return useMutation<DirectorateField[], unknown, TVariables>({
    mutationKey,
    mutationFn,
    onSuccess: (fields) => {
      queryClient.setQueryData(sdgsDirectorateKeys.list(), fields);
      toast.success(successMessage);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, errorMessage));
    },
  });
}

export function useSdgsDirectorateFields() {
  const query = useQuery({
    queryKey: sdgsDirectorateKeys.list(),
    queryFn: () => sdgsDirectorateService.list(),
    placeholderData: initialDirectorateFields,
  });

  const fields = useMemo<DirectorateField[]>(
    () => query.data ?? initialDirectorateFields,
    [query.data],
  );

  return { ...query, fields };
}

export function useCreateSdgsDirectorateField() {
  return useDirectorateFieldsMutation<{ name: string }>({
    mutationKey: [...sdgsDirectorateKeys.all, "field", "create"],
    mutationFn: (payload) => sdgsDirectorateService.createField(payload),
    successMessage: "Bidang berhasil ditambahkan.",
    errorMessage: "Bidang belum bisa ditambahkan.",
  });
}

export function useUpdateSdgsDirectorateField() {
  return useDirectorateFieldsMutation<UpdateFieldVariables>({
    mutationKey: [...sdgsDirectorateKeys.all, "field", "update"],
    mutationFn: ({ fieldId, name }) =>
      sdgsDirectorateService.updateField(fieldId, { name }),
    successMessage: "Bidang berhasil diperbarui.",
    errorMessage: "Bidang belum bisa diperbarui.",
  });
}

export function useDeleteSdgsDirectorateField() {
  return useDirectorateFieldsMutation<string>({
    mutationKey: [...sdgsDirectorateKeys.all, "field", "delete"],
    mutationFn: (fieldId) => sdgsDirectorateService.deleteField(fieldId),
    successMessage: "Bidang berhasil dihapus.",
    errorMessage: "Bidang belum bisa dihapus.",
  });
}

export function useCreateSdgsDirectorate() {
  return useDirectorateFieldsMutation<{ fieldId: string; name: string }>({
    mutationKey: [...sdgsDirectorateKeys.all, "directorate", "create"],
    mutationFn: ({ fieldId, name }) =>
      sdgsDirectorateService.createDirectorate(fieldId, { name }),
    successMessage: "Direktorat berhasil ditambahkan.",
    errorMessage: "Direktorat belum bisa ditambahkan.",
  });
}

export function useUpdateSdgsDirectorate() {
  return useDirectorateFieldsMutation<UpdateDirectorateVariables>({
    mutationKey: [...sdgsDirectorateKeys.all, "directorate", "update"],
    mutationFn: ({ fieldId, directorateId, name, targetFieldId }) =>
      sdgsDirectorateService.updateDirectorate(fieldId, directorateId, {
        name,
        targetFieldId,
      }),
    successMessage: "Direktorat berhasil diperbarui.",
    errorMessage: "Direktorat belum bisa diperbarui.",
  });
}

export function useDeleteSdgsDirectorate() {
  return useDirectorateFieldsMutation<DirectorateVariables>({
    mutationKey: [...sdgsDirectorateKeys.all, "directorate", "delete"],
    mutationFn: ({ fieldId, directorateId }) =>
      sdgsDirectorateService.deleteDirectorate(fieldId, directorateId),
    successMessage: "Direktorat berhasil dihapus.",
    errorMessage: "Direktorat belum bisa dihapus.",
  });
}

export function useCreateSdgsUnit() {
  return useDirectorateFieldsMutation<
    DirectorateVariables & { name: string }
  >({
    mutationKey: [...sdgsDirectorateKeys.all, "unit", "create"],
    mutationFn: ({ fieldId, directorateId, name }) =>
      sdgsDirectorateService.createUnit(fieldId, directorateId, { name }),
    successMessage: "Unit berhasil ditambahkan.",
    errorMessage: "Unit belum bisa ditambahkan.",
  });
}

export function useUpdateSdgsUnit() {
  return useDirectorateFieldsMutation<UpdateUnitVariables>({
    mutationKey: [...sdgsDirectorateKeys.all, "unit", "update"],
    mutationFn: ({
      fieldId,
      directorateId,
      unitId,
      name,
      targetFieldId,
      targetDirectorateId,
    }) =>
      sdgsDirectorateService.updateUnit(fieldId, directorateId, unitId, {
        name,
        targetFieldId,
        targetDirectorateId,
      }),
    successMessage: "Unit berhasil diperbarui.",
    errorMessage: "Unit belum bisa diperbarui.",
  });
}

export function useDeleteSdgsUnit() {
  return useDirectorateFieldsMutation<UnitVariables>({
    mutationKey: [...sdgsDirectorateKeys.all, "unit", "delete"],
    mutationFn: ({ fieldId, directorateId, unitId }) =>
      sdgsDirectorateService.deleteUnit(fieldId, directorateId, unitId),
    successMessage: "Unit berhasil dihapus.",
    errorMessage: "Unit belum bisa dihapus.",
  });
}
