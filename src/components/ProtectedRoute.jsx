import { Navigate } from "react-router-dom";
import Login from "../pages/Login";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading..........</p>;
  if (!user) return <Navigate to="/login" replace />;
  
  if (roles && !roles.includes(user.role)) {
    return <p className="text-red-500">Not Authorized</p>;
  }
  return children;
};

export default ProtectedRoute;
