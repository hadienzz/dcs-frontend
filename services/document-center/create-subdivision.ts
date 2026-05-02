import type {
  DocumentSubdivision,
  SubdivisionPayload,
} from "@/types/document-center";
import axiosInstance from "@/utils/axios";

const createSubdivision = async (payload: SubdivisionPayload) => {
  const { data } = await axiosInstance.post<{
    data?: { subdivision: DocumentSubdivision };
  }>(`/api/document-center/divisions/${payload.divisionId}/subdivisions`, {
    name: payload.name,
  });

  return data.data?.subdivision;
};

export default createSubdivision;
