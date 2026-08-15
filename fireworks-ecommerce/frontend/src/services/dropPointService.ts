import api from "./api";

export interface IDropPoint {
  _id: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  contactPhone?: string;
  workingHours?: string;
  isActive: boolean;
}

export const dropPointService = {
  getActive: (params?: { pincode?: string; city?: string }) =>
    api.get("/drop-points", { params }),
  adminGetAll: () => api.get("/drop-points/all"),
  create: (data: object) => api.post("/drop-points", data),
  update: (id: string, data: object) => api.put(`/drop-points/${id}`, data),
  delete: (id: string) => api.delete(`/drop-points/${id}`),
};
