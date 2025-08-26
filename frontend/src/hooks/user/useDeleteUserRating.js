import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserRating } from "@/http/api";
import { toast } from "sonner";

export function useDeleteUserRating(options = {}) {
  const queryClient = useQueryClient();
  const {
    onSuccess,
    onError,
    showSuccessToast = true,
    showErrorToast = true,
  } = options;

  return useMutation({
    mutationFn: async (ratingId) => {
      const response = await deleteUserRating(ratingId);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries(["public", "stores"]);
      queryClient.invalidateQueries(["user", "ratings"]);

      // Invalidate the specific store rating by ID
      if (data?.store?.id) {
        queryClient.invalidateQueries(["user", "store-rating", data.store.id]);
        // Also REMOVE the query data from cache entirely
        queryClient.removeQueries(["user", "store-rating", data.store.id]);
      }

      if (showSuccessToast) {
        toast.success("Rating deleted successfully");
      }

      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error) => {
      if (showErrorToast) {
        toast.error(
          "Failed to delete rating",
          { description: error?.response?.data?.message || error.message }
        );
      }

      if (onError) {
        onError(error);
      }
    },
  });
}