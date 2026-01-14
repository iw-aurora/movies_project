import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const AdminRoute = ({ allowedRoles = ["admin"], redirectTo = "/auth/login" }) => {
  const { user, role, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to={redirectTo} replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/notallowed" replace />;

  return <Outlet />;
};

export default AdminRoute;