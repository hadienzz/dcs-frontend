import type { DocumentAccount, UpdateUserPayload } from "@/types/document-center";
import axiosInstance from "@/utils/axios";

const updateUser = async (payload: UpdateUserPayload) => {
  const { data } = await axiosInstance.patch<{ data?: { user: DocumentAccount } }>(
    `/api/document-center/users/${payload.id}`,
    {
      name: payload.name,
      username: payload.username,
      role: payload.role,
      assigned_division_ids: payload.assignedDivisionIds,
    },
  );

  return data.data?.user;
};

export default updateUser;
