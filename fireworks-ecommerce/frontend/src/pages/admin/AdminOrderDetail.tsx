import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { fetchOrderById } from "../../store/slices/orderSlice";
import OrderTimeline from "../../components/order/OrderTimeline";
import OrderItemList from "../../components/order/OrderItemList";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";
import { adminService } from "../../services/adminService";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDateTime } from "../../utils/formatDate";
import { ChevronLeft } from "lucide-react";
import type { IAddress } from "../../types";
import toast from "react-hot-toast";

// Use backend-approved status values (capitalized)
const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"];

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { current: order, loading, error } = useAppSelector((s) => s.orders);

  useEffect(() => {
    if (id) dispatch(fetchOrderById(id));
  }, [id, dispatch]);

  if (loading) return <Loader />;
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-dark dark:hover:text-gray-200 mb-6">
          <ChevronLeft size={16} /> Back to Orders
        </button>
        <div className="card p-6 text-center">
          <p className="text-red-500 font-medium">{error}</p>
          <button onClick={() => navigate(-1)} className="btn-primary mt-4">Go Back</button>
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-dark dark:hover:text-gray-200 mb-6">
          <ChevronLeft size={16} /> Back to Orders
        </button>
        <div className="card p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">Order not found</p>
          <button onClick={() => navigate(-1)} className="btn-primary mt-4">Go Back</button>
        </div>
      </div>
    );
  }

  const addr = order.shippingAddress as unknown as IAddress;
  const paymentStatus = order.paymentInfo?.status ?? order.paymentStatus ?? "pending";
  const orderItems = order.orderItems ?? order.items ?? [];

  const handleStatusChange = async (status: string) => {
    try {
      await adminService.updateOrderStatus(order._id, { status });
      dispatch(fetchOrderById(order._id));
      toast.success("Status updated");
    } catch { toast.error("Failed"); }
  };

  return (
    <div className="p-6 max-w-5xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-dark dark:hover:text-gray-200 mb-6">
        <ChevronLeft size={16} /> Back to Orders
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-dark dark:text-gray-100">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500">{formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={order.orderStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <Badge label={paymentStatus} color={paymentStatus === "paid" ? "green" : "yellow"} />
        </div>
      </div>

      <div className="card p-6 mb-6 overflow-x-auto">
        <OrderTimeline status={order.orderStatus} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 card p-5">
          <h3 className="font-semibold text-dark dark:text-gray-100 mb-4">Items</h3>
          <OrderItemList items={orderItems} />
        </div>
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-semibold text-dark dark:text-gray-100 mb-3">Customer</h3>
            <p className="text-sm font-medium dark:text-gray-200">{(order.user as unknown as { name: string })?.name}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">{(order.user as unknown as { email: string })?.email}</p>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold text-dark dark:text-gray-100 mb-3">Shipping</h3>
            <p className="text-sm dark:text-gray-200">{addr?.fullName}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{addr?.addressLine1}, {addr?.city} - {addr?.pincode}</p>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold text-dark dark:text-gray-100 mb-3">Payment</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Method</span><span className="dark:text-gray-200">{order.paymentMethod}</span></div>
              <div className="flex justify-between font-semibold dark:text-gray-100"><span>Total</span><span>{formatCurrency(order.totalAmount)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
