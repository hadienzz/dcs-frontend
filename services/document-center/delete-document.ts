import axiosInstance from "@/utils/axios";

const deleteDocument = async (documentId: string) => {
  await axiosInstance.delete(`/api/document-center/documents/${documentId}`);

  return documentId;
};

export default deleteDocument;
