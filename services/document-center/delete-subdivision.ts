import axiosInstance from "@/utils/axios";

const deleteSubdivision = async (divisionId: string, subdivisionId: string) => {
  await axiosInstance.delete(
    `/api/document-center/divisions/${divisionId}/subdivisions/${subdivisionId}`,
  );

  return subdivisionId;
};

export default deleteSubdivision;
