import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAppSelector } from "../../hooks/useAppDispatch";
import { formatCurrency } from "../../utils/formatCurrency";

const MINIMUM_ORDER_VALUE = 3000;

// Persistent bottom bar shown on mobile once items are selected — mirrors the
// desktop CartSummaryPanel so users don't need to open the cart drawer to check totals.
export default function MobileCartBar() {
  const cart = useAppSelector((s) => s.cart.cart);
  const items = cart?.items ?? [];

  if (items.length === 0) return null;

  const totalItems = cart?.totalItems ?? 0;
  const totalPrice = cart?.totalPrice ?? 0;
  const savings = items.reduce((sum, item) => {
    const mrp = item.product.discountPrice;
    return mrp && mrp > item.price ? sum + (mrp - item.price) * item.quantity : sum;
  }, 0);
  const remaining = MINIMUM_ORDER_VALUE - totalPrice;

  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-dark-200
                 border-t border-gray-100 dark:border-white/[0.06] shadow-premium"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <Link to="/cart" className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-dark dark:text-gray-100">
            {totalItems} {totalItems === 1 ? "item" : "items"} · {formatCurrency(totalPrice)}
          </p>
          {savings > 0 && (
            <p className="text-xs font-semibold text-green-600 dark:text-green-400">
              Save {formatCurrency(savings)}
            </p>
          )}
        </div>
        {remaining > 0 ? (
          <span className="shrink-0 text-sm font-semibold px-4 py-2.5 rounded-xl
                            bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
            {formatCurrency(remaining)} more
          </span>
        ) : (
          <span className="shrink-0 flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl text-white"
                style={{ background: "linear-gradient(135deg, #c9184a 0%, #e02b6a 100%)" }}>
            View Cart <ArrowRight size={15} />
          </span>
        )}
      </Link>
    </div>
  );
}
