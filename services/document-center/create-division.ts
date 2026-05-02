import type { DivisionPayload, DocumentDivision } from "@/types/document-center";
import axiosInstance from "@/utils/axios";

const createDivision = async (payload: DivisionPayload) => {
  const { data } = await axiosInstance.post<{
    data?: { division: DocumentDivision };
  }>("/api/document-center/divisions", payload);

  return data.data?.division;
};

export default createDivision;
