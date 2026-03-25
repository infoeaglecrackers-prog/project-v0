import api from "./api";

export const reviewService = {
  getByProduct: (productId: string, params = {}) =>
    api.get(`/reviews/product/${productId}`, { params }),

  add: (productId: string, data: { rating: number; title?: string; comment: string }) =>
    api.post(`/reviews/product/${productId}`, data),

  update: (reviewId: string, data: { rating?: number; title?: string; comment?: string }) =>
    api.put(`/reviews/${reviewId}`, data),

  delete: (reviewId: string) => api.delete(`/reviews/${reviewId}`),
};
