import Link from "next/link";
import { Download, FileText } from "lucide-react";
import type { HubDocument } from "@/hooks/useSdgsHubData";

interface DocumentPreviewSectionProps {
  title: string;
  description?: string;
  documents?: HubDocument[];
}

const fallbackDocument: HubDocument = {
  name: "Contoh Proposal SDGs",
  url: "/contohpdf.pdf",
  mimeType: "application/pdf",
};

export function DocumentPreviewSection({
  title,
  description,
  documents,
}: DocumentPreviewSectionProps) {
  const availableDocuments =
    documents && documents.length > 0 ? documents : [fallbackDocument];

  const primaryDocument = availableDocuments[0];

  return (
    <section className="mx-auto max-w-6xl px-6 py-10 lg:py-14">
      <div className="rounded-[30px] border border-gray-100 bg-white p-7 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.32)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#b6252a]">
              {title}
            </p>
            {description ? (
              <p className="mt-2 text-sm leading-7 text-gray-600">
                {description}
              </p>
            ) : null}
          </div>
          <Link
            href={primaryDocument.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#b6252a]/20 bg-[#fff7f7] px-4 py-2 text-sm font-semibold text-[#b6252a] transition hover:border-[#b6252a]/35"
          >
            <Download className="h-4 w-4" />
            Buka PDF Utama
          </Link>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <iframe
            src={`${primaryDocument.url}#view=FitH`}
            title={primaryDocument.name}
            className="h-[560px] w-full"
          />
        </div>

        <div className="mt-5 space-y-3">
          {availableDocuments.map((doc, index) => (
            <div
              key={`${doc.url}-${index}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-[#fcfcfc] px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="rounded-xl bg-[#fff1f1] p-2 text-[#b6252a]">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {doc.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {doc.uploadedAt
                      ? new Date(doc.uploadedAt).toLocaleDateString("id-ID")
                      : "Dokumen contoh"}
                  </p>
                </div>
              </div>
              <Link
                href={doc.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-[#b6252a]/25 hover:text-[#b6252a]"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
