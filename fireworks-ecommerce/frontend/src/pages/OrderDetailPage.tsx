import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { fetchOrderById, cancelOrder } from "../store/slices/orderSlice";
import { orderService } from "../services/orderService";
import OrderTimeline from "../components/order/OrderTimeline";
import OrderItemList from "../components/order/OrderItemList";
import Badge from "../components/common/Badge";
import Loader from "../components/common/Loader";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDateTime } from "../utils/formatDate";
import { ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS, PAYMENT_STATUS_LABELS } from "../utils/constants";
import { ChevronLeft, FileText, Loader2 } from "lucide-react";
import type { IAddress } from "../types";
import toast from "react-hot-toast";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { current: order, loading, error } = useAppSelector((s) => s.orders);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  useEffect(() => {
    if (id) {
      console.log("Fetching order with ID:", id);
      dispatch(fetchOrderById(id));
    }
  }, [id, dispatch]);

  console.log("OrderDetailPage state:", { loading, error, order }); // Debug log

  if (loading) {
    console.log("Loading order...");
    return <Loader />;
  }
  
  if (error) {
    console.log("Error fetching order:", error);
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
    console.log("Order is null");
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

  console.log("Rendering order details for:", order._id);

  const addr = order.shippingAddress as unknown as IAddress;
  const taxAmt = order.taxAmount ?? order.taxPrice ?? 0;
  const subtotal = order.totalAmount - (order.shippingPrice || 0) - taxAmt;
  const paymentStatus = order.paymentInfo?.status ?? order.paymentStatus ?? "pending";
  const orderItems = order.orderItems ?? order.items ?? [];

  const handleCancel = async () => {
    if (!confirm("Cancel this order?")) return;
    const r = await dispatch(cancelOrder({ id: order._id, reason: "Cancelled by user" }));
    if (cancelOrder.fulfilled.match(r)) toast.success("Order cancelled");
  };

  const handleDownloadInvoice = async () => {
    setDownloadingInvoice(true);
    try {
      const res = await orderService.downloadInvoice(order._id);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${order._id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Couldn't download invoice. Please try again.");
    } finally {
      setDownloadingInvoice(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-dark mb-6">
        <ChevronLeft size={16} /> Back to Orders
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-dark dark:text-gray-100">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex gap-2">
          <Badge label={order.orderStatus} color={ORDER_STATUS_COLORS[order.orderStatus] as "green" | "red" | "yellow" | "blue" | "purple" | "gray"} />
          <Badge label={PAYMENT_STATUS_LABELS[paymentStatus] || paymentStatus} color={PAYMENT_STATUS_COLORS[paymentStatus] as "green" | "red" | "yellow" | "gray"} />
        </div>
      </div>

      {/* Timeline */}
      <div className="card p-6 mb-6 overflow-x-auto">
        <OrderTimeline status={order.orderStatus} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Items */}
        <div className="md:col-span-2 card p-5">
          <h3 className="font-semibold text-dark dark:text-gray-100 mb-4">Order Items</h3>
          <OrderItemList items={orderItems} />
        </div>

        {/* Summary + Address */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-semibold text-dark dark:text-gray-100 mb-3">Price Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Shipping</span><span>{order.shippingPrice === 0 ? "FREE" : formatCurrency(order.shippingPrice || 0)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Tax</span><span>{formatCurrency(taxAmt)}</span></div>
              <div className="flex justify-between font-semibold text-dark dark:text-gray-100 border-t dark:border-gray-700 pt-2"><span>Total</span><span>{formatCurrency(order.totalAmount)}</span></div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-dark dark:text-gray-100 mb-3">Deliver To</h3>
            <p className="font-medium text-sm dark:text-gray-200">{addr?.fullName}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{addr?.addressLine1}, {addr?.city}, {addr?.state} - {addr?.pincode}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">📞 {addr?.phone}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleDownloadInvoice}
              disabled={downloadingInvoice}
              className="btn-ghost flex-1 flex items-center justify-center gap-1 text-sm disabled:opacity-60"
            >
              {downloadingInvoice ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
              Invoice
            </button>
            {["Pending", "Confirmed", "pending", "confirmed"].includes(order.orderStatus) && (
              <button onClick={handleCancel} className="btn-ghost border-red-300 text-red-500 flex-1 text-sm">
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
