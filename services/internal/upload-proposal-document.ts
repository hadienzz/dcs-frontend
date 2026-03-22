import axiosInstance from "@/utils/axios";
import type {
  BackendProposalDocumentUploadResponse,
  UploadedProposalDocument,
} from "@/types/internal";
import { ensureApiData } from "@/utils/api-error";

const uploadProposalDocument = async (
  projectSlug: string,
  file: File,
): Promise<UploadedProposalDocument> => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } =
    await axiosInstance.post<BackendProposalDocumentUploadResponse>(
      `/api/projects/${projectSlug}/stages/proposal/submit`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

  return ensureApiData(
    data.data?.document,
    "Dokumen proposal tidak ditemukan.",
  );
};

export default uploadProposalDocument;
