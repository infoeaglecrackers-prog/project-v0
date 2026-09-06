import api from "./api";
import { cachedApiCall } from "../utils/cachedApiCall";
import { CACHE_DURATIONS } from "../utils/apiCache";

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
    cachedApiCall(() => api.get("/drop-points", { params }), {
      cacheKey: `drop_points_${JSON.stringify(params || {})}`,
      ttl: CACHE_DURATIONS.DROP_POINTS,
    }),
  adminGetAll: () =>
    cachedApiCall(() => api.get("/drop-points/all"), {
      cacheKey: "drop_points_all",
      ttl: CACHE_DURATIONS.DROP_POINTS,
    }),
  create: (data: object) =>
    api.post("/drop-points", data).then(res => {
      import("../utils/cacheInvalidation").then(m => m.invalidateCache.dropPoints());
      return res;
    }),
  update: (id: string, data: object) =>
    api.put(`/drop-points/${id}`, data).then(res => {
      import("../utils/cacheInvalidation").then(m => m.invalidateCache.dropPoints());
      return res;
    }),
  delete: (id: string) =>
    api.delete(`/drop-points/${id}`).then(res => {
      import("../utils/cacheInvalidation").then(m => m.invalidateCache.dropPoints());
      return res;
    }),
};
