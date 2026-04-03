import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../ui/Loader";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return <Loader text="Checking authentication..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;