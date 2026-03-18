import axiosInstance from "@/utils/axios";
import { ensureApiData } from "@/utils/api-error";
import {
  AuthApiResponse,
  LoginPayload,
  SdgDashboardAccount,
  toSdgDashboardAccount,
} from "@/types/auth";

export interface LoginResponse {
  status: string;
  message: string;
  user: SdgDashboardAccount;
}

const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { data } = await axiosInstance.post<AuthApiResponse>(
    "/api/auth/login",
    payload,
  );
  const user = ensureApiData(
    data.data?.user,
    "Data user hasil login tidak ditemukan.",
  );

  return {
    status: data.status,
    message: data.message,
    user: toSdgDashboardAccount(user),
  };
};

export default login;
