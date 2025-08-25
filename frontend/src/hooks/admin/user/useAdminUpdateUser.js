import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdminUser } from "@/http/api";
import { toast } from "sonner";

export function useAdminUpdateUser(options = {}) {
  const queryClient = useQueryClient();
  const {
    showSuccessToast = true,
    showErrorToast = true,
    onSuccess,
    onError
  } = options;

  return useMutation({
    mutationFn: async ({ userId, userData }) => {
      return await updateAdminUser(userId, userData);
    },
    onSuccess: (response) => {
      // Invalidate and refetch users query to update the list
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });

      if (showSuccessToast) {
        toast.success("User updated successfully", {
          description: `${response.data.name}'s information has been updated`
        });
      }

      onSuccess?.(response);
    },
    onError: (error) => {
      if (showErrorToast) {
        toast.error("Failed to update user", {
          description: error.response?.data?.message || error.message || "Something went wrong"
        });
      }

      onError?.(error);
    }
  });
}