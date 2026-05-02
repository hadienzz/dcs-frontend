import type {
  EnrichedDocumentRecord,
  UpdateDocumentMetadataPayload,
} from "@/types/document-center";
import axiosInstance from "@/utils/axios";
import {
  getDocumentFromResponse,
  mapDocument,
  type BackendDocumentResponse,
} from "@/services/document-center/document-center-mapper";

const updateDocumentMetadata = async (
  payload: UpdateDocumentMetadataPayload,
): Promise<EnrichedDocumentRecord> => {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("division_id", payload.divisionId);
  formData.append("subdivision_id", payload.subdivisionId);
  formData.append("pic_id", payload.picId);
  formData.append("notes", payload.notes ?? "");
  formData.append("updated_by_account", payload.updatedByAccount);

  if (payload.file) {
    formData.append("file", payload.file);
  }

  const { data } = await axiosInstance.patch<BackendDocumentResponse>(
    `/api/document-center/documents/${payload.id}`,
    formData,
  );

  return mapDocument(getDocumentFromResponse(data));
};

export default updateDocumentMetadata;
