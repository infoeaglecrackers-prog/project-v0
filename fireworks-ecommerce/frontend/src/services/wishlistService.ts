import api from "./api";

export const wishlistService = {
  getWishlist: () => api.get("/wishlist"),

  toggle: (productId: string) => api.post(`/wishlist/${productId}`),
};
