"use client";

import type { SdgDashboardProjectRecord } from "@/components/sdg-dashboard/dashboard-data";
import { formatSdgGoalList } from "@/lib/sdg-goals";

function escapePdfText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrapText(text: string, maxChars = 88) {
  const normalized = text.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return [""];
  }

  const words = normalized.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length <= maxChars) {
      currentLine = nextLine;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    currentLine = word;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function buildProposalLines(project: SdgDashboardProjectRecord) {
  const fields = project.proposalFields;
  const lines = [
    `Mitra: ${project.externalName}`,
    `Lokasi: ${fields.location}`,
    `Tema: ${fields.theme}`,
    `Skema: ${fields.scheme}`,
    `SDG Terkait: ${formatSdgGoalList(project.proposalSdgGoals)}`,
    "",
    "Gambaran Umum",
    fields.overview,
    "",
    "Latar Belakang",
    fields.background,
    "",
    "Identifikasi Masalah",
    fields.problemIdentification,
    "",
    "Manfaat Program",
    fields.programBenefits,
    "",
    "Tujuan Program",
    fields.objectives,
    "",
    "Output yang Diharapkan",
    fields.outputs,
    "",
    "Target Mitra",
    fields.targetPartners,
    "",
    "Target Penerima Manfaat",
    fields.targetBeneficiaries,
    "",
    "Indikator Keberhasilan",
    fields.successIndicators,
    "",
    "Mitigasi Risiko",
    fields.riskMitigation,
  ];

  if (project.proposalSdgReasoning.trim()) {
    lines.push(
      "",
      "Alasan Klasifikasi SDG",
      project.proposalSdgReasoning.trim(),
    );
  }

  return lines;
}

function createPdfBlob(title: string, lines: string[]) {
  const encoder = new TextEncoder();
  const preparedLines = lines.flatMap((line) => wrapText(line));
  const linesPerPage = 44;
  const pages = [];

  for (let index = 0; index < preparedLines.length; index += linesPerPage) {
    pages.push(preparedLines.slice(index, index + linesPerPage));
  }

  if (pages.length === 0) {
    pages.push([""]);
  }

  const parts: string[] = ["%PDF-1.4\n"];
  const offsets: number[] = [0];
  let byteLength = encoder.encode(parts[0]).length;

  function pushPart(value: string) {
    parts.push(value);
    byteLength += encoder.encode(value).length;
  }

  function addObject(id: number, body: string) {
    offsets[id] = byteLength;
    pushPart(`${id} 0 obj\n${body}\nendobj\n`);
  }

  const pageCount = pages.length;
  const fontId = 3 + pageCount * 2;

  addObject(1, "<< /Type /Catalog /Pages 2 0 R >>");
  addObject(
    2,
    `<< /Type /Pages /Kids [${pages
      .map((_, index) => `${3 + index * 2} 0 R`)
      .join(" ")}] /Count ${pageCount} >>`,
  );

  pages.forEach((pageLines, index) => {
    const pageId = 3 + index * 2;
    const contentId = 4 + index * 2;
    const contentLines = [
      "BT",
      "/F1 16 Tf",
      "50 800 Td",
      `(${escapePdfText(title)}) Tj`,
      "0 -26 Td",
      "/F1 10 Tf",
      "14 TL",
      ...pageLines.flatMap((line) => [
        `(${escapePdfText(line || " ")}) Tj`,
        "T*",
      ]),
      "ET",
    ];
    const content = contentLines.join("\n");
    const contentLength = encoder.encode(content).length;

    addObject(
      pageId,
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`,
    );
    addObject(
      contentId,
      `<< /Length ${contentLength} >>\nstream\n${content}\nendstream`,
    );
  });

  addObject(fontId, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  const startXref = byteLength;
  pushPart(`xref\n0 ${fontId + 1}\n`);
  pushPart("0000000000 65535 f \n");

  for (let index = 1; index <= fontId; index += 1) {
    pushPart(`${String(offsets[index] ?? 0).padStart(10, "0")} 00000 n \n`);
  }

  pushPart(`trailer\n<< /Size ${fontId + 1} /Root 1 0 R >>\n`);
  pushPart(`startxref\n${startXref}\n%%EOF`);

  return new Blob(parts, { type: "application/pdf" });
}

function triggerDownload(filename: string, href: string) {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  link.click();
}

export function readPdfFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("PDF gagal dibaca."));
    };

    reader.onerror = () => reject(new Error("PDF gagal dibaca."));
    reader.readAsDataURL(file);
  });
}

export function downloadProjectProposal(project: SdgDashboardProjectRecord) {
  const fallbackFilename = `${project.slug}-proposal.pdf`;

  if (project.proposalMode === "pdf" && project.proposalPdfDataUrl) {
    triggerDownload(project.proposalPdfName || fallbackFilename, project.proposalPdfDataUrl);
    return;
  }

  const blob = createPdfBlob(project.proposalFields.title, buildProposalLines(project));
  const objectUrl = URL.createObjectURL(blob);
  triggerDownload(project.proposalPdfName || fallbackFilename, objectUrl);
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

export function getProjectProposalDownloadLabel(
  project: SdgDashboardProjectRecord,
) {
  if (project.proposalMode === "pdf" && project.proposalPdfDataUrl) {
    return "Unduh PDF asli";
  }

  return "Unduh proposal PDF";
}
