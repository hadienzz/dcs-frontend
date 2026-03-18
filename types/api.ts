export interface ApiErrorDetail {
  path?: string;
  message: string;
}

export interface ApiErrorInfo {
  code?: string;
  details?: ApiErrorDetail[];
}

export interface ApiResponse<T = unknown> {
  status: "success" | "error" | string;
  message: string;
  data?: T;
  errors?: ApiErrorDetail[];
  error?: ApiErrorInfo;
}
