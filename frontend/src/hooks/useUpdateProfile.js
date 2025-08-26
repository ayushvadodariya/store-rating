import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "@/http/api";
import { toast } from "sonner";

export function useUpdateProfile(options = {}) {
  const queryClient = useQueryClient();
  const {
    showSuccessToast = true,
    showErrorToast = true,
    onSuccess,
    onError
  } = options;

  return useMutation({
    mutationFn: async (userData) => {
      return await updateUserProfile(userData);
    },
    onSuccess: (response) => {
      // Invalidate and refetch profile query to update the UI
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });

      if (showSuccessToast) {
        toast.success("Profile updated successfully", {
          description: "Your profile information has been updated"
        });
      }

      onSuccess?.(response);
    },
    onError: (error) => {
      if (showErrorToast) {
        toast.error("Failed to update profile", {
          description: error.response?.data?.message || error.message || "Something went wrong"
        });
      }

      onError?.(error);
    }
  });
}