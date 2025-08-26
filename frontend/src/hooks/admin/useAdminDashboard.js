import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "@/http/api";

export function useAdminDashboard(options = {}) {
  const {
    enabled = true,
    refetchInterval = false,
    onSuccess,
    onError,
  } = options;

  const { data, isSuccess, isLoading, error } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const response = await getAdminDashboard();
      return response.data;
    },
    enabled,
    refetchInterval,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onSuccess,
    onError,
  });

  return {
    stats: data?.stats || { users: 0, stores: 0, ratings: 0 },
    recentUsers: data?.recentUsers || [],
    recentStores: data?.recentStores || [],
    isSuccess,
    isLoading,
    error
  }
}