"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getSdgGoalByParam,
  getSdgGoalsSnapshot,
  sdgsPublicService,
} from "@/services/sdgs-public/sdgs-public-service";
import { sdgsPublicKeys } from "./query-keys";

export function useSdgsGoals() {
  return useQuery({
    queryKey: sdgsPublicKeys.goals(),
    queryFn: () => sdgsPublicService.listGoals(),
    initialData: getSdgGoalsSnapshot,
    staleTime: 1000 * 60 * 10,
  });
}

export function useSdgGoal(goal: string | number) {
  return useQuery({
    queryKey: sdgsPublicKeys.goal(goal),
    queryFn: () => sdgsPublicService.getGoal(goal),
    initialData: () => getSdgGoalByParam(goal),
    staleTime: 1000 * 60 * 10,
  });
}
