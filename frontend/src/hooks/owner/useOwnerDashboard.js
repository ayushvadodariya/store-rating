import { getOwnerDashboard } from "@/http/api";
import { useQuery } from "@tanstack/react-query";

export function useOwnerDashboard(options = {}) {
  const {
    enabled = true,
    onSuccess,
    onError,
    refetchInterval,
  } = options;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["owner", "dashboard"],
    queryFn: async () => {
      const response = await getOwnerDashboard();
      return response.data;
    },
    enabled,
    onSuccess,
    onError,
    refetchInterval,
  });

  // Extract the store info, rating stats, and recent activity
  const storeInfo = data?.storeInfo || {};
  const ratingStats = data?.ratingStats || {
    averageRating: 0,
    totalRatings: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  };
  const recentActivity = data?.recentActivity || {
    latestRatings: [],
    ratingTrend: []
  };

  return {
    storeInfo,
    ratingStats,
    recentActivity,
    isLoading,
    isError,
    error,
  };
}
