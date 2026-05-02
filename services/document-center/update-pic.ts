import type { DocumentPic, UpdatePicPayload } from "@/types/document-center";
import axiosInstance from "@/utils/axios";

const updatePic = async (payload: UpdatePicPayload) => {
  const { data } = await axiosInstance.patch<{ data?: { pic: DocumentPic } }>(
    `/api/document-center/pics/${payload.id}`,
    {
      division_id: payload.divisionId,
      name: payload.name,
    },
  );

  return data.data?.pic;
};

export default updatePic;
