import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import useTokenStore from "@/store/tokenStore";
import { useUserStore } from "@/store/userStore";
import { useSyncUser } from "@/hooks/useSyncUser";
import { LoaderCircle } from "lucide-react";

// Root route that redirects based on role
export function RootRedirect() {
  const { isLoading } = useSyncUser();
  const token = useTokenStore((state) => state.token);
  const user = useUserStore((state) => state.user);

  // Don't redirect while still loading user data
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoaderCircle className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  if (user.role === "ADMIN") {
    return <Navigate to={ROUTES.ADMIN.BASE} replace />;
  }
  if (user.role === "OWNER") {
    return <Navigate to={ROUTES.OWNER.BASE} replace />;
  }

  // Default to user role
  return <Navigate to={ROUTES.USER.BASE} replace />;
}