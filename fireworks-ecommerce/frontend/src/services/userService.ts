import api from "./api";

export const userService = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data: { name?: string; phone?: string }) => api.put("/users/profile", data),
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
