import { useAppSelector, useAppDispatch } from "./useAppDispatch";
import { loginUser, logoutUser, registerUser } from "../store/slices/authSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error } = useAppSelector((s) => s.auth);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    isAdmin: user?.role === "admin",
    login: (email: string, password: string) => dispatch(loginUser({ email, password })),
    register: (data: { name: string; email: string; password: string; phone?: string }) =>
      dispatch(registerUser(data)),
    logout: () => dispatch(logoutUser()),
  };
};
