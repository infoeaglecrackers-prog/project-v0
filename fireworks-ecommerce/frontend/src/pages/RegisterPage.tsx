import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import toast from "react-hot-toast";

interface FormData { name: string; email: string; password: string; confirm: string; }

export default function RegisterPage() {
  const { register: authRegister, isAuthenticated, loading, error } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();

  useEffect(() => { if (isAuthenticated) navigate("/"); }, [isAuthenticated, navigate]);

  const onSubmit = async (data: FormData) => {
    const ok = await authRegister({ name: data.name, email: data.email, password: data.password });
    if (!ok) toast.error(error || "Registration failed");
    else { toast.success("Account created!"); navigate("/"); }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-bg">
      <div className="card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl">🎇</span>
          <h1 className="text-2xl font-bold text-dark dark:text-gray-100 mt-3">Create Account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Join the celebrations!</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Full Name</label>
            <input {...register("name", { required: "Name is required" })} className="input-field mt-1" placeholder="Ravi Kumar" />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
            <input type="email" {...register("email", { required: "Email is required" })} className="input-field mt-1" placeholder="ravi@example.com" />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
            <input type="password" {...register("password", { required: true, minLength: { value: 8, message: "Min 8 characters" } })} className="input-field mt-1" placeholder="Min 8 characters" />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Confirm Password</label>
            <input type="password" {...register("confirm", { validate: (v) => v === watch("password") || "Passwords don't match" })} className="input-field mt-1" />
            {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm.message}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
