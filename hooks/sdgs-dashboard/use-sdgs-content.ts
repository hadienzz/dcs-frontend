"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import { sdgsContentService } from "@/services/sdgs-dashboard/sdgs-content-service";
import type { SdgsContent, SdgsContentFormValues } from "@/types/sdgs-dashboard";
import { sdgsContentKeys } from "./query-keys";

export function useSdgsContents() {
  const query = useQuery({
    queryKey: sdgsContentKeys.list(),
    queryFn: () => sdgsContentService.list(),
    staleTime: 30_000,
  });

  const all = useMemo<SdgsContent[]>(() => query.data ?? [], [query.data]);
  const publicContents = useMemo(
    () => all.filter((c) => c.publicVisibility === "yes"),
    [all],
  );
  const internalContents = useMemo(
    () => all.filter((c) => c.publicVisibility === "no"),
    [all],
  );

  return { ...query, all, publicContents, internalContents };
}

export function useCreateSdgsContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: SdgsContentFormValues) =>
      sdgsContentService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sdgsContentKeys.list() });
    },
  });
}
