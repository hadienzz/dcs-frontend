export const sdgsContentKeys = {
  all: ["sdgs-dashboard", "content"] as const,
  list: () => [...sdgsContentKeys.all, "list"] as const,
};

export const sdgsDirectorateKeys = {
  all: ["sdgs-dashboard", "directorates"] as const,
  list: () => [...sdgsDirectorateKeys.all, "list"] as const,
};
