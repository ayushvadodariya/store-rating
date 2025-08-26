import { useQuery } from "@tanstack/react-query";
import { getPublicStoreDetails } from "@/http/api";

export function usePublicStoreDetails(storeId, options = {}) {
  const {
    enabled = !!storeId,
    onSuccess,
    onError,
  } = options;

  const {data: storeDetail, isLoading, isError, error} = useQuery({
    queryKey: ["public", "store", storeId],
    queryFn: async () => {
      const response = await getPublicStoreDetails(storeId);
      return response.data;
    },
    enabled,
    onSuccess,
    onError,
  });

  return { storeDetail, isLoading, isError, error };
}