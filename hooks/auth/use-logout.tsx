"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import logout from "@/services/auth/logout";
import { AUTH_ME_QUERY_KEY } from "@/types/auth";

const useLogout = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: logout,
    mutationKey: ["auth", "logout"],
    onSuccess: () => {
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: AUTH_ME_QUERY_KEY,
      });
    },
  });

  return {
    logout: () => mutation.mutate(),
    isPending: mutation.isPending,
  };
};

export default useLogout;
