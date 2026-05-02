import type {
  CreateDocumentPayload,
  EnrichedDocumentRecord,
} from "@/types/document-center";
import axiosInstance from "@/utils/axios";
import {
  getDocumentFromResponse,
  mapDocument,
  type BackendDocumentResponse,
} from "@/services/document-center/document-center-mapper";

const uploadDocument = async (
  payload: CreateDocumentPayload,
): Promise<EnrichedDocumentRecord> => {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("division_id", payload.divisionId);
  formData.append("subdivision_id", payload.subdivisionId);
  formData.append("pic_id", payload.picId);
  formData.append("notes", payload.notes ?? "");
  formData.append("file", payload.file);
  formData.append("uploaded_by_account", payload.uploadedByAccount);

  const { data } = await axiosInstance.post<BackendDocumentResponse>(
    "/api/document-center/documents",
    formData,
  );

  return mapDocument(getDocumentFromResponse(data));
};

export default uploadDocument;
