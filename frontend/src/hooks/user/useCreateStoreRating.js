import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStoreRating } from "@/http/api";
import { toast } from "sonner";

export function useCreateStoreRating(options = {}) {
  const queryClient = useQueryClient();
  const {
    onSuccess,
    onError,
    showSuccessToast = true,
    showErrorToast = true,
  } = options;

  return useMutation({
    mutationFn: async ({ storeId, ratingData }) => {
      const response = await createStoreRating(storeId, ratingData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries(["public", "stores"]);
      queryClient.invalidateQueries(["public", "store", variables.storeId]);
      queryClient.invalidateQueries(["user", "ratings"]);

      if (showSuccessToast) {
        toast.success("Rating submitted successfully");
      }

      if (onSuccess) {
        onSuccess(data, variables);
      }
    },
    onError: (error, variables) => {
      if (showErrorToast) {
        toast.error(
          "Failed to submit rating",
          { description: error.response?.data?.message || error.message }
        );
      }

      if (onError) {
        onError(error, variables);
      }
    },
  });
}