export const sdgsPublicKeys = {
  all: ["sdgs-public"] as const,
  goals: () => [...sdgsPublicKeys.all, "goals"] as const,
  goal: (goal: string | number) => [...sdgsPublicKeys.goals(), String(goal)] as const,
};
