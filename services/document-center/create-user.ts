import type { DocumentAccount, UserPayload } from "@/types/document-center";
import axiosInstance from "@/utils/axios";

const createUser = async (payload: UserPayload) => {
  const { data } = await axiosInstance.post<{ data?: { user: DocumentAccount } }>(
    "/api/document-center/users",
    {
      name: payload.name,
      username: payload.username,
      role: payload.role,
      assigned_division_ids: payload.assignedDivisionIds,
    },
  );

  return data.data?.user;
};

export default createUser;
