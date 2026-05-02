import type { DocumentCenterQuery, DocumentCenterStore } from "@/types/document-center";
import axiosInstance from "@/utils/axios";
import {
  buildDocumentCenterQuery,
  getDocumentCenterFromResponse,
  mapStore,
  type BackendDocumentCenterResponse,
} from "@/services/document-center/document-center-mapper";

const getDocumentCenterStore = async (
  query: DocumentCenterQuery = {},
): Promise<DocumentCenterStore> => {
  const { data } = await axiosInstance.get<BackendDocumentCenterResponse>(
    "/api/document-center",
    {
      params: buildDocumentCenterQuery(query),
    },
  );

  return mapStore(getDocumentCenterFromResponse(data));
};

export default getDocumentCenterStore;
