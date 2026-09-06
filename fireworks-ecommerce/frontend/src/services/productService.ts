import api from "./api";
import type { IProductFilters } from "../types";
import { cachedApiCall } from "../utils/cachedApiCall";
import { CACHE_DURATIONS } from "../utils/apiCache";

export const productService = {
  getAll: (filters: IProductFilters = {}) =>
    cachedApiCall(() => api.get("/products", { params: filters }), {
      cacheKey: `products_${JSON.stringify(filters)}`,
      ttl: CACHE_DURATIONS.PRODUCTS,
    }),

  getById: (id: string) =>
    cachedApiCall(() => api.get(`/products/${id}`), {
      cacheKey: `product_${id}`,
      ttl: CACHE_DURATIONS.PRODUCTS,
    }),

  getFeatured: () =>
    cachedApiCall(() => api.get("/products/featured"), {
      cacheKey: "products_featured",
      ttl: CACHE_DURATIONS.FEATURED,
    }),

  getBestSellers: () =>
    cachedApiCall(() => api.get("/products/bestsellers"), {
      cacheKey: "products_bestsellers",
      ttl: CACHE_DURATIONS.FEATURED,
    }),

  create: (data: FormData) =>
    api.post("/products", data, { headers: { "Content-Type": "multipart/form-data" } }).then(res => {
      import("../utils/cacheInvalidation").then(m => m.invalidateCache.products());
      return res;
    }),

  update: (id: string, data: object) =>
    api.put(`/products/${id}`, data).then(res => {
      import("../utils/cacheInvalidation").then(m => {
        m.invalidateCache.product(id);
        m.invalidateCache.products();
      });
      return res;
    }),

  delete: (id: string) =>
    api.delete(`/products/${id}`).then(res => {
      import("../utils/cacheInvalidation").then(m => m.invalidateCache.products());
      return res;
    }),

  uploadImages: (id: string, data: FormData) =>
    api.post(`/products/${id}/images`, data, { headers: { "Content-Type": "multipart/form-data" } }),

  deleteImage: (id: string, imgId: string) =>
    api.delete(`/products/${id}/images/${imgId}`),
};
