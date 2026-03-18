import type { ProposalFields } from "@/components/sdg-dashboard/dashboard-data";

export interface ProposalSdgAnalysisResult {
  sdgGoals: number[];
  reasoning: string;
}

type ProposalSdgAnalysisRequest =
  | {
      mode: "form";
      projectName: string;
      externalName: string;
      proposalFields: ProposalFields;
    }
  | {
      mode: "pdf";
      fileName: string;
      pdfDataUrl: string;
    };

async function requestProposalSdgAnalysis(
  body: ProposalSdgAnalysisRequest,
): Promise<ProposalSdgAnalysisResult> {
  const response = await fetch("/api/sdg-dashboard/proposal-sdg", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = (await response.json().catch(() => null)) as
    | {
        error?: string;
        detail?: string;
        result?: ProposalSdgAnalysisResult;
      }
    | null;

  if (!response.ok || !payload?.result) {
    throw new Error(
      payload?.error || payload?.detail || "Analisis SDG dengan AI gagal diproses.",
    );
  }

  return payload.result;
}

export function analyzeFormProposalSdg(input: {
  projectName: string;
  externalName: string;
  proposalFields: ProposalFields;
}) {
  return requestProposalSdgAnalysis({
    mode: "form",
    projectName: input.projectName,
    externalName: input.externalName,
    proposalFields: input.proposalFields,
  });
}

export function analyzePdfProposalSdg(input: {
  fileName: string;
  pdfDataUrl: string;
}) {
  return requestProposalSdgAnalysis({
    mode: "pdf",
    fileName: input.fileName,
    pdfDataUrl: input.pdfDataUrl,
  });
}
