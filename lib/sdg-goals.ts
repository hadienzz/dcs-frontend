export type ProposalSdgSource = "manual" | "ai" | null;

export const sdgGoalOptions = Array.from({ length: 17 }, (_, index) => ({
  value: index + 1,
  label: `SDG ${index + 1}`,
}));

export function normalizeSdgGoalNumbers(values: number[] | null | undefined) {
  return [...new Set(values ?? [])]
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value >= 1 && value <= 17)
    .sort((left, right) => left - right);
}

export function formatSdgGoalList(values: number[] | null | undefined) {
  const goals = normalizeSdgGoalNumbers(values);

  if (!goals.length) {
    return "Belum dipilih";
  }

  return goals.map((goal) => `SDG ${goal}`).join(", ");
}

export function getProposalSdgSourceLabel(source: ProposalSdgSource) {
  if (source === "ai") {
    return "AI Gemini";
  }

  if (source === "manual") {
    return "Manual";
  }

  return "Belum ditentukan";
}
