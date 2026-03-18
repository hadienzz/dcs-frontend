"use client";

import { useQuery } from "@tanstack/react-query";

import getMe from "@/services/auth/get-me";
import { AUTH_ME_QUERY_KEY } from "@/types/auth";

const useGetMe = () => {
  return useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: getMe,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export default useGetMe;
