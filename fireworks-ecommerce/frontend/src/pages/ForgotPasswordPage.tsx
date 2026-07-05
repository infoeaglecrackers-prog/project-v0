import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../services/authService";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success("Reset link sent to your email!");
    } catch {
      toast.error("Email not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-bg">
      <div className="card p-8 w-full max-w-md text-center">
        <span className="text-4xl">🔒</span>
        <h1 className="text-2xl font-bold text-dark dark:text-gray-100 mt-3 mb-1">Forgot Password?</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter your email and we'll send a reset link</p>

        {sent ? (
          <div className="py-4">
            <p className="text-green-600 font-medium mb-4">✅ Reset link sent! Check your inbox.</p>
            <Link to="/login" className="text-primary hover:underline text-sm">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
              placeholder="your@email.com"
            />
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            <Link to="/login" className="block text-sm text-gray-500 dark:text-gray-400 hover:text-dark dark:hover:text-gray-200">← Back to Login</Link>
          </form>
        )}
      </div>
    </div>
  );
}
