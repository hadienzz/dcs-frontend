import axiosInstance from "@/utils/axios";

const deleteDivision = async (divisionId: string) => {
  await axiosInstance.delete(`/api/document-center/divisions/${divisionId}`);

  return divisionId;
};

export default deleteDivision;
