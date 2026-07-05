import api from "./api";

export const authService = {
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  googleAuth: (credential: string) =>
    api.post("/auth/google", { credential }),

  logout: () => api.post("/auth/logout"),

  me: () => api.get("/auth/me"),

  refreshToken: () => api.post("/auth/refresh-token"),

  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),

  resetPassword: (token: string, password: string, confirmPassword: string) =>
    api.put(`/auth/reset-password/${token}`, { password, confirmPassword }),

  sendEmailOtp: () => api.post("/auth/send-email-otp"),

  verifyEmailOtp: (otp: string) => api.post("/auth/verify-email-otp", { otp }),
};
