import axiosInstance from "@/utils/axios";
import { ensureApiData } from "@/utils/api-error";
import {
  AuthApiResponse,
  RegisterPayload,
  SdgDashboardAccount,
  toSdgDashboardAccount,
} from "@/types/auth";

export interface RegisterResponse {
  status: string;
  message: string;
  user: SdgDashboardAccount;
}

const register = async (
  payload: RegisterPayload,
): Promise<RegisterResponse> => {
  const { data } = await axiosInstance.post<AuthApiResponse>(
    "/api/auth/register",
    {
      pic_name: payload.name,
      agency_name: payload.organization,
      email: payload.email,
      password: payload.password,
    },
  );
  const user = ensureApiData(
    data.data?.user,
    "Data user hasil pendaftaran tidak ditemukan.",
  );

  return {
    status: data.status,
    message: data.message,
    user: toSdgDashboardAccount(user),
  };
};

export default register;
