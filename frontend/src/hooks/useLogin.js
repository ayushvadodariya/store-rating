import { login } from "@/http/api";
import useTokenStore from "@/store/tokenStore";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useLogin(options = {}) {
  const {
    showSuccessToast = true,
    showErrorToast = true,
    onSuccess,
    onError
  } = options;

  const setToken = useTokenStore(state => state.setToken);

  return useMutation({
    mutationFn: async (credentials) => {
      return await login(credentials);
    },
    onSuccess: (response) => {
      setToken(response.data.token);
      if (showSuccessToast) {
        toast.success("Login Successful!", {
          description: "Welcome back! Redirecting..."
        });
      }
      if (onSuccess) onSuccess(response);
    },
    onError: (error) => {
      if (showErrorToast) {
        toast.error("Login Failed", {
          description: error instanceof Error ? error.message : "Login failed. Please try again"
        });
      }
      if (onError) onError(error);
    },
    retry: false
  });
}
