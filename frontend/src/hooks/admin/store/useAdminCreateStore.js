import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdminStore } from "@/http/api";
import { toast } from "sonner";

export function useAdminCreateStore(options = {}) {
  const queryClient = useQueryClient();
  const {
    showSuccessToast = true,
    showErrorToast = true,
    onSuccess,
    onError
  } = options;

  return useMutation({
    mutationFn: async (storeData) => {
      return await createAdminStore(storeData);
    },
    onSuccess: (response) => {
      // Invalidate and refetch stores query
      queryClient.invalidateQueries({ queryKey: ["admin", "stores"] });

      // invalidate dashboard query to update stats and recent stores
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });

      if (showSuccessToast) {
        toast.success("Store created successfully", {
          description: `${response.data.data.store.name} has been added to the system`
        });
      }

      onSuccess?.(response);
    },
    onError: (error) => {
      if (showErrorToast) {
        toast.error("Failed to create store", {
          description: error.response?.data?.message || error.message || "Something went wrong"
        });
      }

      onError?.(error);
    }
  });
}