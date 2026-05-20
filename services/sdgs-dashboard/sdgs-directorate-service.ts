import type { ApiResponse } from "@/types/api";
import type { DirectorateField } from "@/types/sdgs-dashboard";
import axiosInstance from "@/utils/axios";
import { ensureApiData } from "@/utils/api-error";

type DirectorateFieldsResponse = {
  directorateFields: DirectorateField[];
};

type NamePayload = {
  name: string;
};

export type UpdateSdgsDirectoratePayload = NamePayload & {
  targetFieldId?: string;
};

export type UpdateSdgsUnitPayload = NamePayload & {
  targetFieldId?: string;
  targetDirectorateId?: string;
};

function getDirectorateFieldsFromResponse(
  response: ApiResponse<DirectorateFieldsResponse>,
) {
  return ensureApiData(
    response.data?.directorateFields,
    "Respons direktorat dari backend tidak valid.",
  );
}

export const sdgsDirectorateService = {
  async list(): Promise<DirectorateField[]> {
    const { data } = await axiosInstance.get<
      ApiResponse<DirectorateFieldsResponse>
    >("/api/sdgs-dashboard/directorate-fields");

    return getDirectorateFieldsFromResponse(data);
  },

  async createField(payload: NamePayload): Promise<DirectorateField[]> {
    const { data } = await axiosInstance.post<
      ApiResponse<DirectorateFieldsResponse>
    >("/api/sdgs-dashboard/directorate-fields", payload);

    return getDirectorateFieldsFromResponse(data);
  },

  async updateField(
    fieldId: string,
    payload: NamePayload,
  ): Promise<DirectorateField[]> {
    const { data } = await axiosInstance.patch<
      ApiResponse<DirectorateFieldsResponse>
    >(`/api/sdgs-dashboard/directorate-fields/${fieldId}`, payload);

    return getDirectorateFieldsFromResponse(data);
  },

  async deleteField(fieldId: string): Promise<DirectorateField[]> {
    const { data } = await axiosInstance.delete<
      ApiResponse<DirectorateFieldsResponse>
    >(`/api/sdgs-dashboard/directorate-fields/${fieldId}`);

    return getDirectorateFieldsFromResponse(data);
  },

  async createDirectorate(
    fieldId: string,
    payload: NamePayload,
  ): Promise<DirectorateField[]> {
    const { data } = await axiosInstance.post<
      ApiResponse<DirectorateFieldsResponse>
    >(`/api/sdgs-dashboard/directorate-fields/${fieldId}/directorates`, payload);

    return getDirectorateFieldsFromResponse(data);
  },

  async updateDirectorate(
    fieldId: string,
    directorateId: string,
    payload: UpdateSdgsDirectoratePayload,
  ): Promise<DirectorateField[]> {
    const { data } = await axiosInstance.patch<
      ApiResponse<DirectorateFieldsResponse>
    >(
      `/api/sdgs-dashboard/directorate-fields/${fieldId}/directorates/${directorateId}`,
      payload,
    );

    return getDirectorateFieldsFromResponse(data);
  },

  async deleteDirectorate(
    fieldId: string,
    directorateId: string,
  ): Promise<DirectorateField[]> {
    const { data } = await axiosInstance.delete<
      ApiResponse<DirectorateFieldsResponse>
    >(
      `/api/sdgs-dashboard/directorate-fields/${fieldId}/directorates/${directorateId}`,
    );

    return getDirectorateFieldsFromResponse(data);
  },

  async createUnit(
    fieldId: string,
    directorateId: string,
    payload: NamePayload,
  ): Promise<DirectorateField[]> {
    const { data } = await axiosInstance.post<
      ApiResponse<DirectorateFieldsResponse>
    >(
      `/api/sdgs-dashboard/directorate-fields/${fieldId}/directorates/${directorateId}/units`,
      payload,
    );

    return getDirectorateFieldsFromResponse(data);
  },

  async updateUnit(
    fieldId: string,
    directorateId: string,
    unitId: string,
    payload: UpdateSdgsUnitPayload,
  ): Promise<DirectorateField[]> {
    const { data } = await axiosInstance.patch<
      ApiResponse<DirectorateFieldsResponse>
    >(
      `/api/sdgs-dashboard/directorate-fields/${fieldId}/directorates/${directorateId}/units/${unitId}`,
      payload,
    );

    return getDirectorateFieldsFromResponse(data);
  },

  async deleteUnit(
    fieldId: string,
    directorateId: string,
    unitId: string,
  ): Promise<DirectorateField[]> {
    const { data } = await axiosInstance.delete<
      ApiResponse<DirectorateFieldsResponse>
    >(
      `/api/sdgs-dashboard/directorate-fields/${fieldId}/directorates/${directorateId}/units/${unitId}`,
    );

    return getDirectorateFieldsFromResponse(data);
  },
};
