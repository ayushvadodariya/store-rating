import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserRating } from "@/http/api";
import { toast } from "sonner";

export function useUpdateUserRating(options = {}) {
  const queryClient = useQueryClient();
  const {
    onSuccess,
    onError,
    showSuccessToast = true,
    showErrorToast = true,
  } = options;

  return useMutation({
    mutationFn: async ({ ratingId, ratingData }) => {
      const response = await updateUserRating(ratingId, ratingData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries(["public", "stores"]);
      queryClient.invalidateQueries(["user", "rating", variables.ratingId]);
      queryClient.invalidateQueries(["user", "ratings"]);

      if (showSuccessToast) {
        toast.success("Rating updated successfully");
      }

      if (onSuccess) {
        onSuccess(data, variables);
      }
    },
    onError: (error, variables) => {
      if (showErrorToast) {
        toast.error(
          "Failed to update rating",
          { description: error.response?.data?.message || error.message }
        );
      }

      if (onError) {
        onError(error, variables);
      }
    },
  });
}