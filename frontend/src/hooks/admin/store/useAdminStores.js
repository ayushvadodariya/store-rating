import { useQuery } from "@tanstack/react-query";
import { getAdminStores } from "@/http/api";
import useTokenStore from "@/store/tokenStore";

export function useAdminStores(params = {}) {
  const token = useTokenStore(state => state.token);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "stores", params],
    queryFn: async () => {
      const response = await getAdminStores(params);
      return response.data;
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return {
    stores: data || [],
    isLoading,
    error,
    isError: !!error
  }
}