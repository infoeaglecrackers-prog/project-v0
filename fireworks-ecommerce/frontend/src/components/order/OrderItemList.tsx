import { formatCurrency } from "../../utils/formatCurrency";
import type { IOrderItem } from "../../types";

interface Props {
  items: IOrderItem[];
}

export default function OrderItemList({ items }: Props) {
  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const product = typeof item.product === "object" ? item.product : null;
        return (
          <div key={item._id || idx} className="flex items-center gap-4">
            <img
              src={product?.images?.[0]?.url || item.image || "https://placehold.co/60x60"}
              alt={product?.name || item.name}
              className="w-14 h-14 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1">
              <p className="font-medium text-dark dark:text-gray-100 text-sm">{product?.name || item.name}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
            </div>
            <p className="font-semibold text-dark dark:text-gray-100">{formatCurrency(item.quantity * item.price)}</p>
          </div>
        );
      })}
    </div>
  );
}
