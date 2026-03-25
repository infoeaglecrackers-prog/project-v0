import api from "./api";
import type { IProductFilters } from "../types";

export const productService = {
  getAll: (filters: IProductFilters = {}) =>
    api.get("/products", { params: filters }),

  getById: (id: string) => api.get(`/products/${id}`),

  getFeatured: () => api.get("/products/featured"),

  getBestSellers: () => api.get("/products/bestsellers"),

  create: (data: FormData) =>
    api.post("/products", data, { headers: { "Content-Type": "multipart/form-data" } }),

  update: (id: string, data: object) => api.put(`/products/${id}`, data),

  delete: (id: string) => api.delete(`/products/${id}`),

  uploadImages: (id: string, data: FormData) =>
    api.post(`/products/${id}/images`, data, { headers: { "Content-Type": "multipart/form-data" } }),

  deleteImage: (id: string, imgId: string) =>
    api.delete(`/products/${id}/images/${imgId}`),
};
