import { useAuthStore } from "@/entities/auth/model/store";
import { Navigate, Outlet } from "react-router";

export const ProtectedRoute = () => {
  const { isAuth } = useAuthStore();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
