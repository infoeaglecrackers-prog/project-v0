import api from "./api";

export const addressService = {
  getAll: () => api.get("/addresses"),

  add: (data: object) => api.post("/addresses", data),

  update: (id: string, data: object) => api.put(`/addresses/${id}`, data),

  delete: (id: string) => api.delete(`/addresses/${id}`),

  setDefault: (id: string) => api.put(`/addresses/${id}/default`),
};
