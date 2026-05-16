import axiosInstance from "@/utils/axios";

const logoutDocumentCenter = async () => {
  await axiosInstance.post("/api/auth/logout");
};

export default logoutDocumentCenter;
