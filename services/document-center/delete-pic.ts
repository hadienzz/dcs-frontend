import axiosInstance from "@/utils/axios";

const deletePic = async (picId: string) => {
  await axiosInstance.delete(`/api/document-center/pics/${picId}`);

  return picId;
};

export default deletePic;
