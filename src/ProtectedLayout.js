import { Navigate, Outlet } from "react-router-dom";
import { initAuth } from "../services/auth_utils";

const ProtectedLayout = () => {
  const isAuthenticated = initAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedLayout;
