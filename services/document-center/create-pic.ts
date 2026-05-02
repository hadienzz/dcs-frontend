import type { DocumentPic, PicPayload } from "@/types/document-center";
import axiosInstance from "@/utils/axios";

const createPic = async (payload: PicPayload): Promise<DocumentPic | undefined> => {
  const { data } = await axiosInstance.post<{ data?: { pic: DocumentPic } }>(
    "/api/document-center/pics",
    {
      division_id: payload.divisionId,
      name: payload.name,
    },
  );

  return data.data?.pic;
};

export default createPic;
