import api from "./api";

export const orderService = {
  create: (data: object) => api.post("/orders", data),

  getMyOrders: (params = {}) => api.get("/orders", { params }),

  getById: (id: string) => api.get(`/orders/${id}`),

  cancel: (id: string, reason: string) =>
    api.put(`/orders/${id}/cancel`, { reason }),

  getInvoice: (id: string) => api.get(`/orders/${id}/invoice`),
};
