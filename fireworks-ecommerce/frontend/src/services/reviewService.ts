import api from "./api";
import { cachedApiCall } from "../utils/cachedApiCall";
import { CACHE_DURATIONS } from "../utils/apiCache";

export const reviewService = {
  getByProduct: (productId: string, params = {}) =>
    cachedApiCall(() => api.get(`/reviews/product/${productId}`, { params }), {
      cacheKey: `reviews_product_${productId}_${JSON.stringify(params)}`,
      ttl: CACHE_DURATIONS.REVIEWS,
    }),

  add: (productId: string, data: { rating: number; title?: string; comment: string }) =>
    api.post(`/reviews/product/${productId}`, data).then(res => {
      import("../utils/cacheInvalidation").then(m => m.invalidateCache.reviews(productId));
      return res;
    }),

  update: (reviewId: string, data: { rating?: number; title?: string; comment?: string }) =>
    api.put(`/reviews/${reviewId}`, data).then(res => {
      import("../utils/cacheInvalidation").then(m => m.invalidateCache.reviews());
      return res;
    }),

  delete: (reviewId: string) =>
    api.delete(`/reviews/${reviewId}`).then(res => {
      import("../utils/cacheInvalidation").then(m => m.invalidateCache.reviews());
      return res;
    }),
};
