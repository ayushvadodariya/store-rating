import { createBrowserRouter } from "react-router-dom";
import { RootRedirect } from "@/layouts/ProtectedRoutes";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import UserHomePage from "@/pages/user/UserHomePage";
import ProfilePage from "@/pages/ProfilePage";
import AuthLayout from "@/layouts/AuthLayout";
import { ROUTES } from "@/config/routes";
import AdminLayout from "@/layouts/AdminLayout";
import UserLayout from "@/layouts/UserLayout";
import OwnerLayout from "@/layouts/OwnerLayout";
import AdminHomePage from "@/pages/admin/AdminHomePage";
import OwnerHomePage from "@/pages/owner/OwnerHomePage";
import OwnderRatingPage from "./pages/owner/OwnderRatingPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminStoresPage from "./pages/admin/AdminStoresPage";

const router = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    element: <RootRedirect/>,
  },
    // children: [
      {
        path: ROUTES.ADMIN.BASE,
        element: <AdminLayout />,
        children: [
          { path: ROUTES.ADMIN.BASE, element: <AdminHomePage /> },
          { path: ROUTES.ADMIN.USERS, element: <AdminUsersPage/> },
          { path: ROUTES.ADMIN.STORES, element: <AdminStoresPage/> },
          { path: ROUTES.ADMIN.PROFILE, element: <ProfilePage /> }
        ]
      },
      {
        path: ROUTES.OWNER.BASE,
        element: <OwnerLayout />,
        children: [
          { path: ROUTES.OWNER.BASE, element: <OwnerHomePage /> },
          { path: ROUTES.OWNER.RATINGS, element: <OwnderRatingPage/> },
          { path: ROUTES.OWNER.PROFILE, element: <ProfilePage /> }
        ]
      },
      {
        path: ROUTES.USER.BASE,
        element: <UserLayout />,
        children: [
          { path: ROUTES.USER.BASE, element: <UserHomePage /> },
          { path: ROUTES.USER.PROFILE, element: <ProfilePage /> }
        ]
      },
  //   ]
  // },
  {
    path: ROUTES.AUTH.BASE,
    element: <AuthLayout />,
    children: [
      { path: ROUTES.AUTH.LOGIN, element: <LoginPage /> },
      { path: ROUTES.AUTH.REGISTER, element: <RegisterPage /> }
    ]
  }
]);

export default router;