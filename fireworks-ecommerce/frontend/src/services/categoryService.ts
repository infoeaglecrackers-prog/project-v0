import api from "./api";
import { cachedApiCall } from "../utils/cachedApiCall";
import { CACHE_DURATIONS } from "../utils/apiCache";

export const categoryService = {
  getAll: () =>
    cachedApiCall(() => api.get("/categories"), {
      cacheKey: "categories_all",
      ttl: CACHE_DURATIONS.CATEGORIES,
    }),
  getById: (id: string) =>
    cachedApiCall(() => api.get(`/categories/${id}`), {
      cacheKey: `category_${id}`,
      ttl: CACHE_DURATIONS.CATEGORIES,
    }),
  create: (data: object) =>
    api.post("/categories", data).then(res => {
      import("../utils/cacheInvalidation").then(m => m.invalidateCache.categories());
      return res;
    }),
  update: (id: string, data: object) =>
    api.put(`/categories/${id}`, data).then(res => {
      import("../utils/cacheInvalidation").then(m => {
        m.invalidateCache.category(id);
        m.invalidateCache.categories();
      });
      return res;
    }),
  delete: (id: string) =>
    api.delete(`/categories/${id}`).then(res => {
      import("../utils/cacheInvalidation").then(m => m.invalidateCache.categories());
      return res;
    }),
};
