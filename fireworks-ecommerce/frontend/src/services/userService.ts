import api from "./api";
import { cachedApiCall } from "../utils/cachedApiCall";
import { CACHE_DURATIONS } from "../utils/apiCache";

export const userService = {
  getProfile: () =>
    cachedApiCall(() => api.get("/users/profile"), {
      cacheKey: "user_profile",
      ttl: CACHE_DURATIONS.USER_PROFILE,
    }),
  updateProfile: (data: { name?: string; phone?: string }) =>
    api.put("/users/profile", data).then(res => {
      import("../utils/cacheInvalidation").then(m => m.invalidateCache.userProfile());
      return res;
    }),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put("/users/change-password", data),
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return api.post("/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
