import type { DivisionPayload, DocumentDivision } from "@/types/document-center";
import axiosInstance from "@/utils/axios";

const updateDivision = async (divisionId: string, payload: DivisionPayload) => {
  const { data } = await axiosInstance.patch<{
    data?: { division: DocumentDivision };
  }>(`/api/document-center/divisions/${divisionId}`, payload);

  return data.data?.division;
};

export default updateDivision;
