import { Link } from "react-router-dom";
import Badge from "../common/Badge";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { ORDER_STATUS_COLORS, PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from "../../utils/constants";
import type { IOrder } from "../../types";
import { ChevronRight } from "lucide-react";

interface Props {
  orders: IOrder[];
  onStatusChange?: (orderId: string, status: string) => void;
  onPaymentStatusChange?: (orderId: string, status: string) => void;
}

const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"];

export default function OrderTable({ orders, onStatusChange, onPaymentStatusChange }: Props) {
  if (!orders.length) {
    return <div className="py-12 text-center text-gray-400 dark:text-gray-500">No orders found</div>;
  }

  return (
    <>
      {/* ── Desktop table ──────────────────────────────── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              {["Order ID", "Customer", "Date", "Amount", "Payment", "Paid", "Status", "Action"].map((h) => (
                <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="py-3 px-4 font-mono font-medium text-dark dark:text-gray-100">#{order._id.slice(-8).toUpperCase()}</td>
                <td className="py-3 px-4">
                  <p className="font-medium dark:text-gray-200">{(order.user as unknown as { name: string })?.name || "—"}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{(order.user as unknown as { email: string })?.email}</p>
                </td>
                <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{formatDate(order.createdAt)}</td>
                <td className="py-3 px-4 font-medium dark:text-gray-200">{formatCurrency(order.totalAmount)}</td>
                <td className="py-3 px-4">
                  {onPaymentStatusChange ? (
                    <select
                      value={order.paymentInfo?.status || "pending"}
                      onChange={(e) => onPaymentStatusChange(order._id, e.target.value)}
                      className="border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-2 py-1 text-xs"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
                  ) : (
                    <Badge
                      label={PAYMENT_STATUS_LABELS[order.paymentInfo?.status || order.paymentStatus] || order.paymentInfo?.status || order.paymentStatus}
                      color={PAYMENT_STATUS_COLORS[order.paymentInfo?.status || order.paymentStatus] as "green" | "red" | "yellow" | "blue" | "gray"}
                    />
                  )}
                </td>
                <td className="py-3 px-4">
                  <Badge
                    label={order.paymentInfo?.status === "paid" ? "✓ Paid" : "Unpaid"}
                    color={order.paymentInfo?.status === "paid" ? "green" : "gray"}
                  />
                </td>
                <td className="py-3 px-4">
                  {onStatusChange ? (
                    <select
                      value={order.orderStatus}
                      onChange={(e) => onStatusChange(order._id, e.target.value)}
                      className="border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-2 py-1 text-xs"
                    >
                      {!STATUS_OPTIONS.includes(order.orderStatus) && (
                        <option value={order.orderStatus} disabled>{order.orderStatus}</option>
                      )}
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : (
                    <Badge label={order.orderStatus} color={ORDER_STATUS_COLORS[order.orderStatus] as "green" | "red" | "yellow" | "blue" | "gray"} />
                  )}
                </td>
                <td className="py-3 px-4">
                  <Link to={`/admin/orders/${order._id}`} className="text-primary hover:underline text-xs flex items-center gap-1">
                    View <ChevronRight size={12} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ───────────────────────────────── */}
      <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
        {orders.map((order) => (
          <div key={order._id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-mono font-bold text-dark dark:text-gray-100 text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
              </div>
              <Badge label={order.orderStatus} color={ORDER_STATUS_COLORS[order.orderStatus] as "green" | "red" | "yellow" | "blue" | "gray"} />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium dark:text-gray-200">{(order.user as unknown as { name: string })?.name || "—"}</p>
                <p className="text-xs text-gray-400">{(order.user as unknown as { email: string })?.email}</p>
              </div>
              <span className="font-semibold text-dark dark:text-gray-100">{formatCurrency(order.totalAmount)}</span>
            </div>

            <div className="flex items-center justify-between gap-2">
              {onPaymentStatusChange ? (
                <select
                  value={order.paymentInfo?.status || "pending"}
                  onChange={(e) => onPaymentStatusChange(order._id, e.target.value)}
                  className="border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-2 py-1.5 text-xs flex-1"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>
              ) : (
                <Badge
                  label={PAYMENT_STATUS_LABELS[order.paymentInfo?.status || order.paymentStatus] || order.paymentInfo?.status || order.paymentStatus}
                  color={PAYMENT_STATUS_COLORS[order.paymentInfo?.status || order.paymentStatus] as "green" | "red" | "yellow" | "blue" | "gray"}
                />
              )}
              {onStatusChange ? (
                <select
                  value={order.orderStatus}
                  onChange={(e) => onStatusChange(order._id, e.target.value)}
                  className="border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-2 py-1.5 text-xs flex-1"
                >
                  {!STATUS_OPTIONS.includes(order.orderStatus) && (
                    <option value={order.orderStatus} disabled>{order.orderStatus}</option>
                  )}
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              ) : null}
              <Link to={`/admin/orders/${order._id}`} className="text-primary hover:underline text-xs flex items-center gap-1 whitespace-nowrap">
                View <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
