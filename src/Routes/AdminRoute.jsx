import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const AdminRoute = () => {
  const { user, role, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>;
  
  // Check if user is logged in AND has admin role (or specific email)
  const isAdmin = role === 'admin' || user?.email === 'admin@gmail.com';
  
  if (!user || !isAdmin) {
    return <Navigate to="/notallowed" state={{ role }} replace />;
  }

  return <Outlet />;
};

export default AdminRoute;