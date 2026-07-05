import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";
import type { ICartItem } from "../../types";
import { useCart } from "../../hooks/useCart";

interface Props {
  item: ICartItem;
}

export default function CartItem({ item }: Props) {
  const { updateQty, removeItem } = useCart();

  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <Link to={`/products/${item.product._id}`}>
        <img
          src={item.product.images?.[0]?.url || "https://placehold.co/80x80?text=🎆"}
          alt={item.product.name}
          className="w-20 h-20 object-cover rounded-xl shrink-0"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/products/${item.product._id}`} className="font-medium text-dark dark:text-gray-100 hover:text-primary line-clamp-2 text-sm">
          {item.product.name}
        </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{formatCurrency(item.price)} each</p>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
            <button onClick={() => updateQty(item.product._id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="px-2.5 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40">
              <Minus size={13} />
            </button>
            <span className="px-3 text-sm font-medium">{item.quantity}</span>
            <button onClick={() => updateQty(item.product._id, item.quantity + 1)}
              disabled={item.quantity >= item.product.stock}
              className="px-2.5 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40">
              <Plus size={13} />
            </button>
          </div>
          <button onClick={() => removeItem(item.product._id)} className="text-red-400 hover:text-red-600">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="font-semibold text-dark dark:text-gray-100">{formatCurrency(item.price * item.quantity)}</p>
      </div>
    </div>
  );
}
