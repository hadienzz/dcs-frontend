import axios from "axios";
import type { ApiErrorDetail, ApiResponse } from "@/types/api";

interface AppRequestErrorOptions {
  statusCode?: number;
  code?: string;
  details?: ApiErrorDetail[];
}

const BACKEND_MESSAGE_MAP: Record<string, string> = {
  Unauthorized: "Sesi kamu sudah habis. Silakan masuk lagi.",
  "Authentication failed": "Autentikasi gagal. Silakan masuk lagi.",
  "Invalid email or password": "Email atau password tidak sesuai.",
  "User with this email already exists":
    "Email ini sudah terdaftar. Silakan masuk atau gunakan email lain.",
  "Invitation code is not valid":
    "Invitation code belum terdaftar. Cek lagi kode dari tim internal.",
  "Project with this slug already exists":
    "Slug project sudah dipakai. Gunakan judul atau slug lain.",
  "Project not found": "Project tidak ditemukan.",
  "Forbidden: Access is denied":
    "Kamu tidak punya akses untuk melakukan aksi ini.",
  "This stage is still locked": "Tahap ini masih terkunci.",
  "No submitted stage data is available for review":
    "Belum ada data yang bisa direview saat ini.",
};

function looksInternalErrorMessage(message?: string) {
  const normalizedMessage = message?.toLowerCase() ?? "";

  return (
    normalizedMessage.includes("prisma") ||
    normalizedMessage.includes("invalid `prisma") ||
    normalizedMessage.includes("invocation") ||
    normalizedMessage.includes("the column") ||
    normalizedMessage.includes("select `") ||
    normalizedMessage.includes("stack:")
  );
}

function translateBackendMessage(message?: string) {
  if (!message) {
    return undefined;
  }

  if (looksInternalErrorMessage(message)) {
    return undefined;
  }

  if (BACKEND_MESSAGE_MAP[message]) {
    return BACKEND_MESSAGE_MAP[message];
  }

  if (message.endsWith("stage not found")) {
    return "Tahap project yang diminta tidak ditemukan.";
  }

  return message;
}

function getDefaultMessageByStatus(statusCode?: number) {
  if (statusCode === 400) {
    return "Permintaan belum valid. Periksa lagi data yang kamu isi.";
  }

  if (statusCode === 401) {
    return "Sesi kamu sudah habis. Silakan masuk lagi.";
  }

  if (statusCode === 403) {
    return "Kamu tidak punya akses untuk melakukan aksi ini.";
  }

  if (statusCode === 404) {
    return "Data yang kamu cari tidak ditemukan.";
  }

  if (statusCode === 409) {
    return "Data ini sudah digunakan. Coba nilai lain.";
  }

  if (statusCode === 422) {
    return "Data yang kamu kirim belum valid.";
  }

  if (statusCode === 429) {
    return "Terlalu banyak permintaan. Coba lagi sebentar.";
  }

  if (statusCode && statusCode >= 500) {
    return "Server sedang bermasalah. Coba lagi sebentar.";
  }

  return "Terjadi kesalahan. Coba lagi sebentar.";
}

export class AppRequestError extends Error {
  statusCode?: number;
  code?: string;
  details?: ApiErrorDetail[];

  constructor(message: string, options: AppRequestErrorOptions = {}) {
    super(message);
    this.name = "AppRequestError";
    this.statusCode = options.statusCode;
    this.code = options.code;
    this.details = options.details;
  }
}

export function toAppRequestError(
  error: unknown,
  fallbackMessage?: string,
): AppRequestError {
  if (error instanceof AppRequestError) {
    return error;
  }

  if (axios.isAxiosError<ApiResponse>(error)) {
    const responseStatus = error.response?.status;
    const responseData = error.response?.data;
    const responseDetails =
      responseData?.errors ?? responseData?.error?.details ?? [];

    if (error.code === "ECONNABORTED") {
      return new AppRequestError(
        "Permintaan ke server terlalu lama. Coba lagi sebentar.",
        {
          code: "REQUEST_TIMEOUT",
        },
      );
    }

    if (!error.response) {
      return new AppRequestError(
        "Tidak bisa terhubung ke server. Periksa koneksi lalu coba lagi.",
        {
          code: "NETWORK_ERROR",
        },
      );
    }

    return new AppRequestError(
      translateBackendMessage(responseData?.message) ??
        fallbackMessage ??
        getDefaultMessageByStatus(responseStatus),
      {
        statusCode: responseStatus,
        code: responseData?.error?.code,
        details: Array.isArray(responseDetails) ? responseDetails : undefined,
      },
    );
  }

  if (error instanceof Error) {
    return new AppRequestError(
      error.message || fallbackMessage || "Terjadi kesalahan.",
      {
        code: "UNKNOWN_ERROR",
      },
    );
  }

  return new AppRequestError(
    fallbackMessage ?? "Terjadi kesalahan. Coba lagi sebentar.",
    {
      code: "UNKNOWN_ERROR",
    },
  );
}

export function getErrorMessage(error: unknown, fallbackMessage: string) {
  return toAppRequestError(error, fallbackMessage).message;
}

export function isRequestErrorStatus(error: unknown, statusCode: number) {
  return error instanceof AppRequestError && error.statusCode === statusCode;
}

export function ensureApiData<T>(
  value: T | null | undefined,
  message: string,
) {
  if (value == null) {
    throw new AppRequestError(message, {
      code: "INVALID_API_RESPONSE",
    });
  }

  return value;
}
