import { register } from "@/http/api";
import useTokenStore from "@/store/tokenStore";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useRegister(options = {}) {
  const {
    showSuccessToast = true,
    showErrorToast = true,
    onSuccess,
    onError
  } = options;

  const setToken = useTokenStore(state => state.setToken);

  return useMutation({
    mutationFn: async (credentials) => {
      return await register(credentials);
    },
    onSuccess: (response) => {
      setToken(response.data.token);
      if (showSuccessToast) {
        toast.success("Register Successful!", {
          description: "Welcome! Redirecting..."
        });
      }
      if (onSuccess) onSuccess(response);
    },
    onError: (error) => {
      if (showErrorToast) {
        toast.error("Registration Failed", {
          description: error instanceof Error ? error.message : "Registration failed. Please try again"
        });
      }
      if (onError) onError(error);
    },
    retry: false
  });
}