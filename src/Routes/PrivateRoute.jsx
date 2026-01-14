import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const PrivateRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/auth/login" state={{ from: location }} replace />;

  return <Outlet />;
};

export default PrivateRoute;