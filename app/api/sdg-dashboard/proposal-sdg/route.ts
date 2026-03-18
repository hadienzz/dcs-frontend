import {
  GoogleGenAI,
  createPartFromBase64,
  createUserContent,
} from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

import type { ProposalFields } from "@/components/sdg-dashboard/dashboard-data";
import { normalizeSdgGoalNumbers } from "@/lib/sdg-goals";

export const runtime = "nodejs";

type ProposalSdgRequestBody =
  | {
      mode: "form";
      projectName?: string;
      externalName?: string;
      proposalFields?: ProposalFields;
    }
  | {
      mode: "pdf";
      fileName?: string;
      pdfDataUrl?: string;
    };

const proposalSdgResponseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sdgGoals: {
      type: "array",
      minItems: 1,
      maxItems: 3,
      items: {
        type: "integer",
        minimum: 1,
        maximum: 17,
      },
    },
    reasoning: {
      type: "string",
      minLength: 20,
    },
  },
  required: ["sdgGoals", "reasoning"],
  propertyOrdering: ["sdgGoals", "reasoning"],
};

function isProposalFields(value: unknown): value is ProposalFields {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return [
    "title",
    "theme",
    "scheme",
    "overview",
    "background",
    "problemIdentification",
    "programBenefits",
    "objectives",
    "targetPartners",
    "targetBeneficiaries",
    "outputs",
    "location",
    "successIndicators",
    "riskMitigation",
  ].every((key) => typeof candidate[key] === "string");
}

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error(
      "GEMINI_API_KEY belum diisi. Tambahkan dulu ke environment project.",
    );
  }

  return new GoogleGenAI({ apiKey });
}

function buildFormPrompt(input: {
  projectName: string;
  externalName: string;
  proposalFields: ProposalFields;
}) {
  return [
    "Anda adalah analis proposal SDGs.",
    "Tentukan maksimal 3 nomor SDG (1-17) yang paling relevan berdasarkan isi proposal.",
    "Fokus pada masalah utama, tujuan program, penerima manfaat, output, dan dampak yang paling nyata.",
    "Jangan menebak terlalu banyak target. Pilih hanya SDG yang paling kuat dan jelaskan alasannya dalam bahasa Indonesia yang ringkas tapi spesifik.",
    "",
    `Nama project: ${input.projectName}`,
    `Mitra: ${input.externalName}`,
    "",
    "Data proposal:",
    JSON.stringify(input.proposalFields, null, 2),
  ].join("\n");
}

function buildPdfPrompt(fileName: string) {
  return [
    "Anda adalah analis proposal SDGs.",
    "Baca file PDF proposal yang dikirimkan, lalu tentukan maksimal 3 nomor SDG (1-17) yang paling relevan.",
    "Jelaskan alasan pemilihan SDG dalam bahasa Indonesia yang singkat, jelas, dan spesifik pada isi dokumen.",
    "Jika ada beberapa SDG yang mungkin cocok, prioritaskan yang paling kuat tercermin dari tujuan, masalah, aktivitas, dan dampaknya.",
    "",
    `Nama file: ${fileName}`,
  ].join("\n");
}

function parsePdfDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);

  if (!match) {
    throw new Error("Format PDF tidak valid untuk dianalisis.");
  }

  return {
    mimeType: match[1],
    base64Data: match[2],
  };
}

function createSuccessResponse(payload: { sdgGoals: number[]; reasoning: string }) {
  const sdgGoals = normalizeSdgGoalNumbers(payload.sdgGoals).slice(0, 3);
  const reasoning = payload.reasoning.trim();

  if (!sdgGoals.length || !reasoning) {
    throw new Error("Respons AI tidak berisi hasil analisis SDG yang lengkap.");
  }

  return NextResponse.json({
    result: {
      sdgGoals,
      reasoning,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ProposalSdgRequestBody;
    const ai = getGeminiClient();
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    if (body.mode === "form") {
      if (!isProposalFields(body.proposalFields)) {
        return NextResponse.json(
          { error: "Data form proposal tidak lengkap untuk dianalisis." },
          { status: 400 },
        );
      }

      const response = await ai.models.generateContent({
        model,
        contents: createUserContent(
          buildFormPrompt({
            projectName: body.projectName?.trim() || "Project SDGs",
            externalName: body.externalName?.trim() || "Mitra eksternal",
            proposalFields: body.proposalFields,
          }),
        ),
        config: {
          temperature: 0.2,
          responseMimeType: "application/json",
          responseJsonSchema: proposalSdgResponseSchema,
        },
      });

      if (!response.text) {
        throw new Error("AI tidak mengembalikan hasil analisis form proposal.");
      }

      return createSuccessResponse(JSON.parse(response.text));
    }

    if (body.mode === "pdf") {
      if (!body.pdfDataUrl) {
        return NextResponse.json(
          { error: "File PDF belum tersedia untuk dianalisis." },
          { status: 400 },
        );
      }

      const pdfFile = parsePdfDataUrl(body.pdfDataUrl);
      const response = await ai.models.generateContent({
        model,
        contents: createUserContent([
          createPartFromBase64(pdfFile.base64Data, pdfFile.mimeType),
          buildPdfPrompt(body.fileName?.trim() || "proposal.pdf"),
        ]),
        config: {
          temperature: 0.2,
          responseMimeType: "application/json",
          responseJsonSchema: proposalSdgResponseSchema,
        },
      });

      if (!response.text) {
        throw new Error("AI tidak mengembalikan hasil analisis PDF proposal.");
      }

      return createSuccessResponse(JSON.parse(response.text));
    }

    return NextResponse.json(
      { error: "Mode analisis proposal tidak dikenali." },
      { status: 400 },
    );
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: "Analisis proposal dengan AI gagal.",
        detail,
      },
      { status: 500 },
    );
  }
}
