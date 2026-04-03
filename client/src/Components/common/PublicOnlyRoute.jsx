import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PublicOnlyRoute = ({ children }) => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return null;
  }

  if (user) {
    return <Navigate to="/feed" replace />;
  }

  return children;
};

export default PublicOnlyRoute;