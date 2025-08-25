import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdminUser } from "@/http/api";
import { toast } from "sonner";

export function useAdminCreateUser(options = {}) {
  const queryClient = useQueryClient();
  const {
    showSuccessToast = true,
    showErrorToast = true,
    onSuccess,
    onError
  } = options;

  return useMutation({
    mutationFn: async (userData) => {
      return await createAdminUser(userData);
    },
    onSuccess: (response) => {
      // Invalidate and refetch users query to update the list
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });

      // invalidate dashboard query to update stats and recent users
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });

      if (showSuccessToast) {
        toast.success("User created successfully", {
          description: `${response.data.name} has been added to the system`
        });
      }

      onSuccess?.(response);
    },
    onError: (error) => {
      if (showErrorToast) {
        toast.error("Failed to create user", {
          description: error.response?.data?.message || error.message || "Something went wrong"
        });
      }

      onError?.(error);
    }
  });
}