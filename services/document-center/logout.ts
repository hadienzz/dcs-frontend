import axiosInstance from "@/utils/axios";

const logoutDocumentCenter = async () => {
  await axiosInstance.post("/api/document-center/auth/logout");
};

export default logoutDocumentCenter;
