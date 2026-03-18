import axiosInstance from "@/utils/axios";

const logout = async () => {
  const { data } = await axiosInstance.post("/api/auth/logout");
  return data;
};

export default logout;
