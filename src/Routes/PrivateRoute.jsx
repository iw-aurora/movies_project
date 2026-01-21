import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { HeroSkeleton } from "../components/skeleton/Skeletons";

const PrivateRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div className="min-h-screen bg-[#111112]">
       <HeroSkeleton />
    </div>
  );
  if (!user) return <Navigate to="/auth/login" state={{ from: location }} replace />;

  return <Outlet />;
};

export default PrivateRoute;