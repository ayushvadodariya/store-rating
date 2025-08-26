import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAdminUser } from "@/http/api";
import { toast } from "sonner";

export function useAdminDeleteUser(options = {}) {
  const queryClient = useQueryClient();
  const {
    showSuccessToast = true,
    showErrorToast = true,
    onSuccess,
    onError
  } = options;

  return useMutation({
    mutationFn: async (userId) => {
      return await deleteAdminUser(userId);
    },
    onSuccess: (response, userId) => {
      // Invalidate and refetch users query to update the list
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });

      // invalidate dashboard query to update stats and recent users
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });

      if (showSuccessToast) {
        toast.success("User deleted successfully", {
          description: "The user has been removed from the system"
        });
      }

      onSuccess?.(response);
    },
    onError: (error) => {
      if (showErrorToast) {
        toast.error("Failed to delete user", {
          description: error.response?.data?.message || error.message || "Something went wrong"
        });
      }

      onError?.(error);
    }
  });
}