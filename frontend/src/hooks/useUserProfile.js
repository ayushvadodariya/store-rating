import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/http/api";

export function useUserProfile(options = {}) {
  const {
    enabled = true,
    refetchOnWindowFocus = false,
    onSuccess,
    onError,
  } = options;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const res = await getUserProfile();
      return res.data;
    },
    enabled,
    refetchOnWindowFocus,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    onSuccess,
    onError,
  });

  // Check if the data is for a user with ratings or admin/owner without ratings
  const isUserWithRatings = data?.role === "USER" && data?.ratingStats?.count > 0;

  return {
    profile: data,
    isAdmin: data?.role === "ADMIN",
    isOwner: data?.role === "OWNER",
    isUser: data?.role === "USER",
    ratingStats: data?.ratingStats || { count: 0, averageRating: 0 },
    recentRatings: data?.recentRatings || [],
    hasRatings: isUserWithRatings,
    isLoading,
    isError,
    error,
    refetch
  };
}