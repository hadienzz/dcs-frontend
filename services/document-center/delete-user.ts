import axiosInstance from "@/utils/axios";

const deleteUser = async (userId: string) => {
  await axiosInstance.delete(`/api/document-center/users/${userId}`);

  return userId;
};

export default deleteUser;
