import { useEffect } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { fetchCart } from "../store/slices/cartSlice";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import EmptyCart from "../components/cart/EmptyCart";
import Loader from "../components/common/Loader";
import { useCart } from "../hooks/useCart";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { cart, loading } = useCart();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-dark dark:text-gray-100 mb-6">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 card p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{cart.totalItems} item(s)</p>
            {cart.items.map((item) => (
              <CartItem key={item.product._id} item={item} />
            ))}
          </div>
          <CartSummary />
        </div>
      )}
    </div>
  );
}
