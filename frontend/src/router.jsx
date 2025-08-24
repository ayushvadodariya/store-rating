import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AuthLayout from "./layouts/AuthLayout";
import { ROUTES } from "./config/routes";

const router = createBrowserRouter([
  {
    path: `${ROUTES.AUTH.BASE}`,
    element: <AuthLayout />,
    children: [
      {
        path: `${ROUTES.AUTH.LOGIN}`,
        element: <LoginPage /> 
      },
      {
        path: `${ROUTES.AUTH.REGISTER}`,
        element: <RegisterPage /> 
      }   
    ]
  }
]);

export default router;