export const sdgsContentKeys = {
  all: ["sdgs-dashboard", "content"] as const,
  list: () => [...sdgsContentKeys.all, "list"] as const,
};
