import type {
  DocumentCenterLoginPayload,
  DocumentCenterSession,
} from "@/types/document-center";
import axiosInstance from "@/utils/axios";
import { ensureApiData } from "@/utils/api-error";
import {
  mapSessionAccount,
  type BackendDocumentCenterAuthResponse,
} from "@/services/document-center/document-center-mapper";

const loginDocumentCenter = async (
  payload: DocumentCenterLoginPayload,
): Promise<DocumentCenterSession> => {
  const { data } = await axiosInstance.post<BackendDocumentCenterAuthResponse>(
    "/api/auth/login",
    payload,
  );

  return mapSessionAccount(
    ensureApiData(
      data.data?.account,
      "Data akun Document Center tidak ditemukan.",
    ),
  );
};

export default loginDocumentCenter;
