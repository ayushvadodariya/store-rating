import { useQuery } from "@tanstack/react-query";
import { getUserRating } from "@/http/api";

export function useUserRating(ratingId, options = {}) {
  const {
    enabled = !!ratingId,
    onSuccess,
    onError,
  } = options;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user", "rating", ratingId],
    queryFn: async () => {
      const response = await getUserRating(ratingId);
      return response.data;
    },
    enabled,
    onSuccess,
    onError,
  });

  return { data, isLoading, isError, error };
}