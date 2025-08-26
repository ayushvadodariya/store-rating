import { userDetail } from "@/http/api";
import useTokenStore from "@/store/tokenStore";
import { useUserStore } from "@/store/userStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function useSyncUser() {
  const token = useTokenStore(state => state.token);
  const setUser = useUserStore(state => state.setUser);

  const { data: user, isSuccess, isLoading, error } = useQuery({
    queryKey: ['user', token],
    queryFn: async () => {
      const res = await userDetail();
      return res.data.user;
    },
    enabled: !!token,
    retry: false,
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isSuccess && user) setUser(user);
  }, [isSuccess, user, setUser]);

  return {
    user,
    isLoading,
    error
  };
}