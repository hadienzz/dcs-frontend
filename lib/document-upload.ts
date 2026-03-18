export interface UploadedHubDocument {
  name: string;
  url: string;
  mimeType?: string;
  size?: number;
  uploadedAt?: string;
}

export async function uploadPdfDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload-document", {
    method: "POST",
    body: formData,
  });

  const data = (await response.json()) as {
    document?: UploadedHubDocument;
    error?: string;
  };

  if (!response.ok || !data.document) {
    throw new Error(data.error || "Upload dokumen gagal.");
  }

  return data.document;
}
