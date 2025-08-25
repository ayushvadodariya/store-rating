import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdminStore } from "@/http/api";
import { toast } from "sonner";

export function useAdminUpdateStore(options = {}) {
  const queryClient = useQueryClient();
  const {
    showSuccessToast = true,
    showErrorToast = true,
    onSuccess,
    onError
  } = options;

  return useMutation({
    mutationFn: async ({ storeId, storeData }) => {
      return await updateAdminStore(storeId, storeData);
    },
    onSuccess: (response) => {
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ["admin", "stores"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "store", response.data.id] });

      // invalidate dashboard query to update stats and recent users
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });

      if (showSuccessToast) {
        toast.success("Store updated successfully", {
          description: `${response.data.name} has been updated`
        });
      }

      onSuccess?.(response);
    },
    onError: (error) => {
      if (showErrorToast) {
        toast.error("Failed to update store", {
          description: error.response?.data?.message || error.message || "Something went wrong"
        });
      }

      onError?.(error);
    }
  });
}