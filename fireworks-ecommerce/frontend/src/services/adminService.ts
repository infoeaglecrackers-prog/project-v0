import api from "./api";

export const adminService = {
  getDashboard: () => api.get("/admin/dashboard"),

  // Orders
  getOrders: (params = {}) => api.get("/admin/orders", { params }),
  getOrderById: (id: string) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id: string, data: { status: string; trackingNumber?: string; courier?: string }) =>
    api.put(`/admin/orders/${id}/status`, data),

  // Users
  getUsers: (params = {}) => api.get("/admin/users", { params }),
  getUserById: (id: string) => api.get(`/admin/users/${id}`),
  changeUserRole: (id: string, role: string) =>
    api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),

  // Categories
  getCategories: (params = {}) => api.get("/admin/categories", { params }),
  getCategoryById: (id: string) => api.get(`/admin/categories/${id}`),
  createCategory: (data: object) => api.post("/admin/categories", data),
  updateCategory: (id: string, data: object) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/admin/categories/${id}`),

  // Products
  deleteProduct: (id: string) => api.delete(`/products/${id}`),
  getLowStock: (threshold = 10) =>
    api.get("/admin/products/low-stock", { params: { threshold } }),

  // Revenue
  getRevenue: (period = "monthly") =>
    api.get("/admin/revenue", { params: { period } }),
};
