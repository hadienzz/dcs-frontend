import type {
  DocumentSubdivision,
  SubdivisionPayload,
} from "@/types/document-center";
import axiosInstance from "@/utils/axios";

const updateSubdivision = async (
  subdivisionId: string,
  payload: SubdivisionPayload,
) => {
  const { data } = await axiosInstance.patch<{
    data?: { subdivision: DocumentSubdivision };
  }>(
    `/api/document-center/divisions/${payload.divisionId}/subdivisions/${subdivisionId}`,
    {
      name: payload.name,
    },
  );

  return data.data?.subdivision;
};

export default updateSubdivision;
