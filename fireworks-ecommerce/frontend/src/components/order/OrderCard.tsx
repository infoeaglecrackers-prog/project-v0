import { Link } from "react-router-dom";
import Badge from "../common/Badge";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from "../../utils/constants";
import type { IOrder } from "../../types";
import { ChevronRight } from "lucide-react";

interface Props {
  order: IOrder;
}

export default function OrderCard({ order }: Props) {
  const statusColor = ORDER_STATUS_COLORS[order.orderStatus] || "gray";
  const payStatus = order.paymentInfo?.status || order.paymentStatus;
  const payColor = PAYMENT_STATUS_COLORS[payStatus] || "gray";
  const orderItems = order.orderItems || order.items || [];

  return (
    <Link to={`/orders/${order._id}`} className="card p-4 hover:shadow-modal transition-shadow block">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500">Order ID</p>
          <p className="font-mono text-sm font-medium text-dark dark:text-gray-100">#{order._id.slice(-8).toUpperCase()}</p>
        </div>
        <div className="flex gap-2">
          <Badge label={order.orderStatus} color={statusColor as "green" | "red" | "yellow" | "blue" | "purple" | "gray"} />
          <Badge label={payStatus} color={payColor as "green" | "red" | "yellow" | "gray"} />
        </div>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-3">
        {orderItems.slice(0, 3).map((item, idx) => (
          <img
            key={idx}
            src={(item.product as { images?: { url: string }[] })?.images?.[0]?.url || item.image || "https://placehold.co/50x50"}
            alt={(item.product as { name?: string })?.name || item.name}
            className="w-12 h-12 rounded-lg object-cover shrink-0"
          />
        ))}
        {orderItems.length > 3 && (
          <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500 dark:text-gray-300">
            +{orderItems.length - 3}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(order.createdAt)}</p>
          <p className="font-semibold text-dark dark:text-gray-100">{formatCurrency(order.totalAmount)}</p>
        </div>
        <ChevronRight size={16} className="text-gray-400" />
      </div>
    </Link>
  );
}
