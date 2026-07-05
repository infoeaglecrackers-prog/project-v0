import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppDispatch";
import Loader from "../common/Loader";

interface Props {
  adminOnly?: boolean;
}

export default function ProtectedRoute({ adminOnly = false }: Props) {
  const { isAuthenticated, initialized, user } = useAppSelector((s) => s.auth);

  // Wait for the initial session check to complete before redirecting
  if (!initialized) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
}
