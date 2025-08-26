import { useQuery } from "@tanstack/react-query";
import { getPublicStores } from "@/http/api";

export function usePublicStores(params = {}, options = {}) {
  const {
    page = 1,
    limit = 10,
    sort = "rating_highest",
    search = "",
    address = "",
    includeUserRatings = true // Add this parameter
  } = params;

  const {
    enabled = true,
    onSuccess,
    onError,
    refetchInterval,
  } = options;

  // Update params object to include the new parameter
  const queryParams = {
    page,
    limit,
    sort,
    search,
    address
  };

  // Add the include user ratings flag if true
  if (includeUserRatings) {
    queryParams.includeUserRatings = true;
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["public", "stores", { page, limit, sort, search, address }],
    queryFn: async () => {
      const response = await getPublicStores(queryParams);
      return response.data;
    },
    enabled,
    onSuccess,
    onError,
    refetchInterval,
    keepPreviousData: true,
  });

  return { data, isLoading, isError, error };
}