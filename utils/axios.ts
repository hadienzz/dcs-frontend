import axios from "axios";
import { toAppRequestError } from "@/utils/api-error";

function normalizeLocalBackendUrl(url?: string) {
  if (!url) {
    return undefined;
  }

  if (
    url === "http://localhost:3000" ||
    url === "https://localhost:3000" ||
    url === "http://127.0.0.1:3000" ||
    url === "https://127.0.0.1:3000"
  ) {
    return url.replace(":3000", ":3001");
  }

  return url;
}

function resolveBackendBaseUrl() {
  const configuredBaseUrl = normalizeLocalBackendUrl(
    process.env.NEXT_PUBLIC_BACKEND_URL?.trim(),
  );

  if (configuredBaseUrl) {
    return configuredBaseUrl;
  }

  if (typeof window !== "undefined") {
    const { origin, hostname, protocol } = window.location;

    if (
      origin === "http://localhost:3000" ||
      origin === "https://localhost:3000" ||
      origin === "http://127.0.0.1:3000" ||
      origin === "https://127.0.0.1:3000"
    ) {
      return `${protocol}//${hostname}:3001`;
    }

    return origin;
  }

  return "http://localhost:3001";
}

const axiosInstance = axios.create({
  withCredentials: true,
  timeout: 15000,
});

axiosInstance.interceptors.request.use((config) => {
  config.baseURL = resolveBackendBaseUrl();

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toAppRequestError(error)),
);

export default axiosInstance;
