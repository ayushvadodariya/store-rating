import { useQuery } from "@tanstack/react-query";
import { getUserStoreRating } from "@/http/api";

export function useUserStoreRating(storeId, options = {}) {
  const {
    enabled = !!storeId,
    onSuccess,
    onError,
    refetchOnWindowFocus = false,
  } = options;

  return useQuery({
    queryKey: ["user", "store-rating", storeId],
    queryFn: async () => {
      const response = await getUserStoreRating(storeId);
      return response.data;
    },
    enabled,
    onSuccess,
    onError,
    refetchOnWindowFocus,
    retry: false
  });
}