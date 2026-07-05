import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { updateUser } from "../store/slices/authSlice";
import { authService } from "../services/authService";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import GoogleAuthButton from "../components/common/GoogleAuthButton";

interface FormData { name: string; email: string; phone: string; password: string; confirm: string; }

export default function RegisterPage() {
  const { register: authRegister, user, isAuthenticated, loading, error } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();

  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !showOtpStep) navigate("/");
  }, [isAuthenticated, showOtpStep, navigate]);

  const onSubmit = async (data: FormData) => {
    const ok = await authRegister({ name: data.name, email: data.email, phone: data.phone, password: data.password });
    if (!ok) toast.error(error || "Registration failed");
    else {
      toast.success("Account created! Check your email for a verification code.");
      setShowOtpStep(true);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) { toast.error("Enter the 6-digit code"); return; }
    setVerifying(true);
    try {
      await authService.verifyEmailOtp(otp);
      dispatch(updateUser({ isVerified: true }));
      toast.success("Email verified!");
      navigate("/");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Invalid or expired code");
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    try {
      await authService.sendEmailOtp();
      toast.success("Verification code resent!");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Couldn't resend code");
    } finally {
      setResending(false);
    }
  };

  if (showOtpStep) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-bg">
        <div className="card p-8 w-full max-w-md text-center">
          <span className="text-4xl">📧</span>
          <h1 className="text-2xl font-bold text-dark dark:text-gray-100 mt-3">Verify Your Email</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            We sent a 6-digit code to <strong>{user?.email}</strong>
          </p>

          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            maxLength={6}
            inputMode="numeric"
            className="input-field mt-6 text-center text-2xl tracking-[0.5em] font-bold"
          />

          <button onClick={handleVerifyOtp} disabled={verifying} className="btn-primary w-full py-3 mt-4">
            {verifying ? "Verifying..." : "Verify Email"}
          </button>

          <button
            onClick={handleResendOtp}
            disabled={resending}
            className="text-sm text-primary font-medium hover:underline mt-4 disabled:opacity-60"
          >
            {resending ? "Resending..." : "Resend Code"}
          </button>

          <button
            onClick={() => navigate("/")}
            className="block w-full text-center text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 mt-4"
          >
            Skip for now
          </button>
        </div>
      </div>
    );
  }

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
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Mobile Number</label>
            <input
              type="tel"
              inputMode="numeric"
              {...register("phone", {
                required: "Mobile number is required",
                pattern: { value: /^[6-9]\d{9}$/, message: "Enter a valid 10-digit Indian mobile number" },
              })}
              className="input-field mt-1"
              placeholder="9876543210"
              maxLength={10}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
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

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
        </div>

        <GoogleAuthButton />

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
