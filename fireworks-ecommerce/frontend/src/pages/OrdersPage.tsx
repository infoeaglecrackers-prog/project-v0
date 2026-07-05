import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { fetchMyOrders } from "../store/slices/orderSlice";
import type { IOrder } from "../types";
import OrderCard from "../components/order/OrderCard";
import Loader from "../components/common/Loader";
import { Package } from "lucide-react";
import { Link } from "react-router-dom";

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchMyOrders({}));
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-dark dark:text-gray-100 mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="py-20 text-center">
          <Package size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">No orders yet</p>
          <Link to="/products" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o: IOrder) => <OrderCard key={o._id} order={o} />)}
        </div>
      )}
    </div>
  );
}
