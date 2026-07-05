import { useAppSelector, useAppDispatch } from "./useAppDispatch";
import { addToCart, removeFromCart, updateCartQty, clearCart } from "../store/slices/cartSlice";

export const useCart = () => {
  const dispatch = useAppDispatch();
  const { cart, loading } = useAppSelector((s) => s.cart);

  return {
    cart,
    loading,
    items: cart?.items || [],
    totalItems: cart?.totalItems || 0,
    totalPrice: cart?.totalPrice || 0,
    addItem: (productId: string, quantity = 1) => dispatch(addToCart({ productId, quantity })),
    removeItem: (productId: string) => dispatch(removeFromCart(productId)),
    updateQty: (productId: string, quantity: number) => dispatch(updateCartQty({ productId, quantity })),
    clear: () => dispatch(clearCart()),
  };
};
