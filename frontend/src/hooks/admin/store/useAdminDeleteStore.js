import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAdminStore } from "@/http/api";
import { toast } from "sonner";

export function useAdminDeleteStore(options = {}) {
  const queryClient = useQueryClient();
  const {
    showSuccessToast = true,
    showErrorToast = true,
    onSuccess,
    onError
  } = options;

  return useMutation({
    mutationFn: async (storeId) => {
      return await deleteAdminStore(storeId);
    },
    onSuccess: (response, storeId) => {
      // Invalidate and refetch stores query
      queryClient.invalidateQueries({ queryKey: ["admin", "stores"] });

      if (showSuccessToast) {
        toast.success("Store deleted successfully", {
          description: "The store has been removed from the system"
        });
      }

      onSuccess?.(response);
    },
    onError: (error) => {
      if (showErrorToast) {
        toast.error("Failed to delete store", {
          description: error.response?.data?.message || error.message || "Something went wrong"
        });
      }

      onError?.(error);
    }
  });
}