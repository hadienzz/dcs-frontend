import type { ApiResponse } from "@/types/api";
import type { SdgsDashboardFormValues } from "@/types/sdgs-dashboard";
import axiosInstance from "@/utils/axios";
import { ensureApiData } from "@/utils/api-error";

export type CreateContentResponse = {
  id: string;
};

const MOCK_FLAG = "NEXT_PUBLIC_SDGS_DASHBOARD_MOCK_SUBMIT";
const ENDPOINT = "/api/sdgs-dashboard/contents";

const isMockEnabled = () =>
  process.env[MOCK_FLAG] === "true" || process.env[MOCK_FLAG] === "1";

const generateMockId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `mock-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

/**
 * Build the `multipart/form-data` body for the create-content request.
 * Multi-value fields are appended once per entry so the backend can read them
 * as repeated form fields.
 */
const buildContentFormData = (values: SdgsDashboardFormValues): FormData => {
  const formData = new FormData();

  formData.append("title", values.title);
  formData.append("reportingYear", values.reportingYear);
  formData.append("contentType", values.contentType);
  formData.append("metricReference", values.metricReference);
  formData.append("metricTitle", values.metricTitle);
  formData.append("value", values.value);
  formData.append("isAvailable", values.isAvailable);
  formData.append("description", values.description);
  formData.append("isPublic", values.isPublic);
  formData.append("comment", values.comment);

  for (const goal of values.sdgGoals) {
    formData.append("sdgGoals[]", goal);
  }
  for (const directorateId of values.directorateIds) {
    formData.append("directorateIds[]", directorateId);
  }
  for (const unitId of values.unitIds) {
    formData.append("unitIds[]", unitId);
  }
  for (const file of values.evidenceFiles) {
    formData.append("evidenceFiles[]", file, file.name);
  }

  return formData;
};

/**
 * Submit a single Content_Form payload to the backend.
 *
 * Until the backend endpoint is in place, set
 * `NEXT_PUBLIC_SDGS_DASHBOARD_MOCK_SUBMIT=true` in the environment to make
 * this service resolve with a mock id after a short delay. The shape of the
 * resolved value matches what the real endpoint will return.
 */
const createContent = async (
  values: SdgsDashboardFormValues,
): Promise<CreateContentResponse> => {
  if (isMockEnabled()) {
    await wait(800);
    return { id: generateMockId() };
  }

  const formData = buildContentFormData(values);

  const { data } = await axiosInstance.post<ApiResponse<CreateContentResponse>>(
    ENDPOINT,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return ensureApiData(data?.data, "Respons backend tidak valid.");
};

export default createContent;
