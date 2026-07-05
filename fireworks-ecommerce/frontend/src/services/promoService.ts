import api from "./api";

export const promoService = {
  validate: (code: string, orderValue: number) =>
    api.post("/promos/validate", { code, orderValue }),

  getAll: () => api.get("/promos"),

  create: (data: {
    code: string;
    discountPercent: number;
    isActive?: boolean;
    expiresAt?: string;
    minOrderValue?: number;
    usageLimit?: number;
  }) => api.post("/promos", data),

  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/promos/${id}`, data),

  delete: (id: string) => api.delete(`/promos/${id}`),
};
