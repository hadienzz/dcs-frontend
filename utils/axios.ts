import axios from "axios";
import { toAppRequestError } from "@/utils/api-error";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
  timeout: 15000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toAppRequestError(error)),
);

export default axiosInstance;
