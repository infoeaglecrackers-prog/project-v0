import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface FormData { email: string; password: string; }

export default function LoginPage() {
  const { login, isAuthenticated, loading, error } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  useEffect(() => { if (isAuthenticated) navigate("/"); }, [isAuthenticated, navigate]);

  const onSubmit = async (data: FormData) => {
    setAuthError(null);
    try {
      // unwrap() will throw if the thunk was rejected
      // `login` returns the dispatched thunk result so unwrap is available
      // @ts-ignore - runtime unwrap exists on the returned promise
      await login(data.email, data.password).unwrap();
      navigate("/");
    } catch (err: unknown) {
      const msg = "Invalid username or password";
      setAuthError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-bg">
      <div className="card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl">🎆</span>
          <h1 className="text-2xl font-bold text-dark dark:text-gray-100 mt-3">Welcome back!</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Login to your account</p>
        </div>

        {authError && <p className="text-sm text-red-500 mb-2">{authError}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="input-field mt-1"
              placeholder="ravi@example.com"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
            </div>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="input-field mt-1"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
