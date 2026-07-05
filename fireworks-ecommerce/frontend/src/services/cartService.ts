import api from "./api";

export const cartService = {
  getCart: () => api.get("/cart"),

  addItem: (productId: string, quantity: number) =>
    api.post("/cart", { productId, quantity }),

  updateQuantity: (productId: string, quantity: number) =>
    api.put(`/cart/${productId}`, { quantity }),

  removeItem: (productId: string) => api.delete(`/cart/${productId}`),

  clearCart: () => api.delete("/cart"),
};
