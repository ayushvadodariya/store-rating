import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePassword } from "@/http/api";
import { toast } from "sonner";

export function useUpdatePassword(options = {}) {
  const queryClient = useQueryClient();
  const {
    showSuccessToast = true,
    showErrorToast = true,
    onSuccess,
    onError
  } = options;

  return useMutation({
    mutationFn: async (passwordData) => {
      return await updatePassword(passwordData);
    },
    onSuccess: (response) => {

      if (showSuccessToast) {
        toast.success("Password updated successfully", {
          description: "Your password has been changed"
        });
      }

      onSuccess?.(response);
    },
    onError: (error) => {
      if (showErrorToast) {
        toast.error("Failed to update password", {
          description: error.response?.data?.message || error.message || "Please check your current password and try again"
        });
      }

      onError?.(error);
    }
  });
}