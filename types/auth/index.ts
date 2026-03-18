import type { ApiResponse } from "@/types/api";

export const AUTH_ME_QUERY_KEY = ["auth", "me"] as const;

export type SdgDashboardAccountRole = "internal" | "external";

export interface SdgDashboardAccount {
  id: string;
  name: string;
  organization: string;
  email: string;
  role: SdgDashboardAccountRole;
  createdAt: string;
}

export interface AuthApiUser {
  id: string;
  pic_name?: string | null;
  agency_name?: string | null;
  email: string;
  role: "INTERNAL" | "EXTERNAL";
  created_at?: string;
}

export type AuthApiResponse = ApiResponse<{
  user?: AuthApiUser | null;
}>;

export const LOGIN_INITIAL_VALUES = {
  email: "",
  password: "",
};

export interface LoginFormValues {
  email: string;
  password: string;
}

export type LoginPayload = LoginFormValues;

export const REGISTER_INITIAL_VALUES = {
  name: "",
  organization: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export interface RegisterFormValues {
  name: string;
  organization: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterPayload {
  name: string;
  organization: string;
  email: string;
  password: string;
}

export function toSdgDashboardAccount(
  user: AuthApiUser,
): SdgDashboardAccount {
  const role: SdgDashboardAccountRole =
    user.role === "INTERNAL" ? "internal" : "external";
  const name = user.pic_name?.trim() || user.email.split("@")[0] || "Pengguna";
  const organization =
    user.agency_name?.trim() ||
    (role === "internal" ? "Telkom University" : "Mitra eksternal");

  return {
    id: user.id,
    name,
    organization,
    email: user.email,
    role,
    createdAt: user.created_at ?? new Date().toISOString(),
  };
}
