import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import GoogleAuthButton from "../components/common/GoogleAuthButton";

interface FormData { email: string; password: string; }

const SPARKLES = [
  { left: "10%", top: "15%", dur: "4.5s", delay: "0s"   },
  { left: "85%", top: "25%", dur: "3.8s", delay: "1.2s" },
  { left: "20%", top: "80%", dur: "5.2s", delay: "0.6s" },
  { left: "75%", top: "70%", dur: "4.0s", delay: "2.0s" },
  { left: "50%", top: "10%", dur: "3.5s", delay: "1.8s" },
  { left: "35%", top: "60%", dur: "4.8s", delay: "0.3s" },
  { left: "90%", top: "55%", dur: "5.5s", delay: "2.5s" },
  { left: "5%",  top: "45%", dur: "4.2s", delay: "3.0s" },
];

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  useEffect(() => { if (isAuthenticated) navigate("/"); }, [isAuthenticated, navigate]);

  const onSubmit = async (data: FormData) => {
    setAuthError(null);
    try {
      // @ts-ignore
      await login(data.email, data.password).unwrap();
      navigate("/");
    } catch {
      const msg = "Invalid username or password";
      setAuthError(msg);
      toast.error(msg);
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0D0D1F 0%, #1A1A2E 50%, #2d1a0e 100%)" }}
    >
      {/* Glow orbs */}
      <div
        className="hero-orb"
        style={{ width: "450px", height: "450px", background: "rgba(201,24,74,0.12)", top: "-120px", left: "-100px" }}
      />
      <div
        className="hero-orb"
        style={{ width: "350px", height: "350px", background: "rgba(255,215,0,0.07)", bottom: "-80px", right: "-60px", animationDelay: "3s" }}
      />

      {/* Sparkle dots */}
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className="sparkle-dot"
          style={{ left: s.left, top: s.top, "--dur": s.dur, "--delay": s.delay } as React.CSSProperties}
        />
      ))}

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Glass card */}
      <div className="relative z-10 card-glass p-8 w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3 animate-float inline-block">🎆</div>
          <h1 className="text-2xl font-bold text-dark dark:text-white mt-2">
            Welcome back!
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Sign in to your account to continue
          </p>
        </div>

        {/* Error */}
        {authError && (
          <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/20
                          border border-red-100 dark:border-red-800/30 rounded-xl px-4 py-3 mb-4">
            <span className="shrink-0">⚠</span>
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
              Email address
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="input-field pl-10"
                placeholder="ravi@example.com"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Password
              </label>
              <Link to="/forgot-password"
                    className="text-xs text-primary hover:underline font-medium">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Password is required" })}
                className="input-field pl-10 pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 mt-2 text-base justify-center"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in…
              </span>
            ) : (
              "Sign In"
            )}
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
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Create one
          </Link>
        </p>

        {/* Trust note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          🔒 Your data is safe &amp; encrypted
        </p>
      </div>
    </div>
  );
}
