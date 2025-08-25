import { useQuery } from "@tanstack/react-query";
import { getAdminUsers } from "@/http/api";
import useTokenStore from "@/store/tokenStore";

export function useAdminUsers(params = {}) {
  const token = useTokenStore(state => state.token);

  const {data:users, isLoading, error} = useQuery({
    queryKey: ["admin", "users", params],
    queryFn: async () => {
      const response = await getAdminUsers(params);
      return response.data;
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return {
    users,
    isLoading,
    error
  }
}