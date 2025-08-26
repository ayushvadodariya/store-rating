import { useQuery } from "@tanstack/react-query";
import { getOwnerRatings } from "@/http/api";

export function useOwnerRatings(filters = {}, options = {}) {
  const {
    page = 1,
    limit = 10,
    sort = "date_newest",
    minRating = 0,
    maxRating = 5,
    search = ""
  } = filters;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['owner', 'ratings', { page, limit, sort, minRating, maxRating, search }],
    queryFn: async () => {
      const res = await getOwnerRatings({
        page,
        limit,
        sort,
        minRating,
        maxRating,
        search,
      });
      return res.data;
    },
    enabled: options.enabled !== false,
    refetchOnWindowFocus: options.refetchOnWindowFocus || false,
    retry: options.retry !== undefined ? options.retry : 3,
    onSuccess: options.onSuccess,
    onError: options.onError,
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch
  };
}