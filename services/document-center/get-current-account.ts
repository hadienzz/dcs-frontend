import type { DocumentCenterSession } from "@/types/document-center";
import axiosInstance from "@/utils/axios";
import { ensureApiData } from "@/utils/api-error";
import {
  mapSessionAccount,
  type BackendDocumentCenterAuthResponse,
} from "@/services/document-center/document-center-mapper";

const getCurrentDocumentCenterAccount =
  async (): Promise<DocumentCenterSession> => {
    const { data } =
      await axiosInstance.get<BackendDocumentCenterAuthResponse>(
        "/api/auth/me",
      );

    return mapSessionAccount(
      ensureApiData(
        data.data?.account,
        "Data sesi Document Center tidak ditemukan.",
      ),
    );
  };

export default getCurrentDocumentCenterAccount;
