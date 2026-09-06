import { useEffect, useState } from "react";
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
import { ChevronLeft, Loader2, ShieldCheck, ShieldX } from "lucide-react";
import type { IAddress } from "../../types";
import { PAYMENT_STATUS_LABELS, PAYMENT_METHOD_LABELS } from "../../utils/constants";
import toast from "react-hot-toast";

// Use backend-approved status values (capitalized).
// AwaitingPayment/AwaitingVerification are deliberately absent: those transitions
// belong to the payment verify/reject actions below, not the manual dropdown.
const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"];

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { current: order, loading, error } = useAppSelector((s) => s.orders);
  const [verifying, setVerifying] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

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

  const handleVerifyPayment = async () => {
    if (!confirm(`Confirm ₹${order.totalAmount.toFixed(2)} was credited for UTR ${order.paymentInfo?.utr}? This marks the order paid and starts packing.`)) return;
    setVerifying(true);
    try {
      await adminService.verifyOrderPayment(order._id);
      dispatch(fetchOrderById(order._id));
      toast.success("Payment verified — order moved to Processing");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || "Couldn't verify payment");
    } finally {
      setVerifying(false);
    }
  };

  const handleRejectPayment = async () => {
    const reason = rejectReason.trim();
    if (!reason) {
      toast.error("Enter a reason so the customer knows what to fix.");
      return;
    }
    setRejecting(true);
    try {
      await adminService.rejectOrderPayment(order._id, reason);
      setRejectReason("");
      dispatch(fetchOrderById(order._id));
      toast.success("Claim rejected — customer notified");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || "Couldn't reject claim");
    } finally {
      setRejecting(false);
    }
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
            {/* Surface the current status even when it isn't a manually-settable
                one (AwaitingPayment/AwaitingVerification), so the select doesn't
                render blank and misrepresent where the order actually is. */}
            {!STATUS_OPTIONS.includes(order.orderStatus) && (
              <option value={order.orderStatus} disabled>{order.orderStatus}</option>
            )}
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <Badge label={PAYMENT_STATUS_LABELS[paymentStatus] || paymentStatus} color={paymentStatus === "paid" ? "green" : "yellow"} />
        </div>
      </div>

      <div className="card p-6 mb-6 overflow-x-auto">
        <OrderTimeline status={order.orderStatus} />
      </div>

      {/* Manual settlement step. Nothing else can mark a UPI order paid — there is
          no gateway callback, so this is the only confirmation the system gets. */}
      {order.orderStatus === "AwaitingVerification" && (
        <div className="card p-5 mb-6 border-2 border-blue-300 dark:border-blue-700">
          <h3 className="font-semibold text-dark dark:text-gray-100 flex items-center gap-2">
            <ShieldCheck size={17} className="text-blue-500" /> Verify UPI Payment
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Check the bank statement before approving. The customer typed this UTR themselves — it is not proof of payment on its own, and the amount in a UPI link can be edited by the payer.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-sm">
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Claimed UTR</p>
              <p className="font-mono font-medium dark:text-gray-100 mt-0.5">{order.paymentInfo?.utr || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Expected amount</p>
              <p className="font-semibold dark:text-gray-100 mt-0.5">{formatCurrency(order.totalAmount)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Submitted</p>
              <p className="dark:text-gray-100 mt-0.5">
                {order.paymentInfo?.utrSubmittedAt ? formatDateTime(order.paymentInfo.utrSubmittedAt) : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Paid to VPA</p>
              <p className="font-mono text-xs dark:text-gray-100 mt-0.5">{order.paymentInfo?.upiVpa || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Reference shown</p>
              <p className="font-mono text-xs dark:text-gray-100 mt-0.5">{order.paymentInfo?.upiRefId || "—"}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <button
              onClick={handleVerifyPayment}
              disabled={verifying || rejecting}
              className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {verifying ? <Loader2 size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
              {verifying ? "Verifying…" : "Approve — money received"}
            </button>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
            <label htmlFor="reject-reason" className="text-xs text-gray-400 dark:text-gray-500">
              Or send it back with a reason (emailed to the customer)
            </label>
            <div className="flex flex-col sm:flex-row gap-2 mt-1.5">
              <input
                id="reject-reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. No credit found for this UTR"
                className="input-field flex-1 text-sm"
              />
              <button
                onClick={handleRejectPayment}
                disabled={rejecting || verifying || !rejectReason.trim()}
                className="btn-ghost border-red-300 text-red-500 flex items-center justify-center gap-2 text-sm disabled:opacity-40"
              >
                {rejecting ? <Loader2 size={14} className="animate-spin" /> : <ShieldX size={14} />}
                {rejecting ? "Rejecting…" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

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
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Method</span>
                <span className="dark:text-gray-200">
                  {PAYMENT_METHOD_LABELS[order.paymentInfo?.method] || order.paymentInfo?.method || order.paymentMethod}
                </span>
              </div>
              {order.paymentInfo?.utr && (
                <div className="flex justify-between gap-2">
                  <span className="text-gray-500 dark:text-gray-400">UTR</span>
                  <span className="font-mono text-xs dark:text-gray-200">{order.paymentInfo.utr}</span>
                </div>
              )}
              {order.paymentInfo?.verifiedAt && (
                <div className="flex justify-between gap-2">
                  <span className="text-gray-500 dark:text-gray-400">Verified</span>
                  <span className="text-xs dark:text-gray-200">{formatDateTime(order.paymentInfo.verifiedAt)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold dark:text-gray-100"><span>Total</span><span>{formatCurrency(order.totalAmount)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
