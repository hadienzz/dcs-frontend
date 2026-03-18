import axiosInstance from "@/utils/axios";
import { isRequestErrorStatus } from "@/utils/api-error";
import {
  AuthApiResponse,
  SdgDashboardAccount,
  toSdgDashboardAccount,
} from "@/types/auth";

const getMe = async (): Promise<SdgDashboardAccount | null> => {
  try {
    const { data } = await axiosInstance.get<AuthApiResponse>("/api/auth/me");
    const user = data.data?.user;

    return user ? toSdgDashboardAccount(user) : null;
  } catch (error) {
    if (isRequestErrorStatus(error, 401)) {
      return null;
    }

    throw error;
  }
};

export default getMe;
