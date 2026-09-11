import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";
import { useCart } from "../../hooks/useCart";

const MINIMUM_ORDER_VALUE = 3000;

interface Props {
  onCheckout?: () => void;
  showCheckoutBtn?: boolean;
}

export default function CartSummary({ onCheckout, showCheckoutBtn = true }: Props) {
  const { cart } = useCart();
  if (!cart) return null;

  const subtotal = cart.totalPrice;
  const total = subtotal;
  const belowMin = subtotal < MINIMUM_ORDER_VALUE;
  const remaining = MINIMUM_ORDER_VALUE - subtotal;

  return (
    <div className="card p-5 space-y-3">
      <h3 className="font-semibold text-dark dark:text-gray-100 text-base mb-4">Order Summary</h3>
      <Row label="Subtotal" value={formatCurrency(subtotal)} />
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
        <span>Shipping</span>
        <span className="text-xs text-gray-400 dark:text-gray-500 text-right max-w-[160px]">Depends on location — paid at collection</span>
      </div>
      <hr className="my-2 border-gray-100 dark:border-gray-700" />
      <Row label="Total" value={formatCurrency(total)} bold />

      {belowMin && (
        <div className="rounded-xl p-3 text-xs" style={{ background: "rgba(201,24,74,0.08)", border: "1px solid rgba(201,24,74,0.25)" }}>
          <p className="font-semibold text-primary mb-0.5">Minimum order: ₹{MINIMUM_ORDER_VALUE.toLocaleString("en-IN")}</p>
          <p className="text-gray-500 dark:text-gray-400">Add {formatCurrency(remaining)} more to proceed to checkout.</p>
          <div className="mt-2 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${Math.min(100, (subtotal / MINIMUM_ORDER_VALUE) * 100)}%`, background: "linear-gradient(90deg, #c9184a, #e02b6a)" }} />
          </div>
        </div>
      )}

      {showCheckoutBtn && (
        <>
          {onCheckout ? (
            <button onClick={onCheckout} disabled={belowMin} className="btn-primary w-full mt-3 disabled:opacity-40 disabled:cursor-not-allowed">
              Proceed to Checkout
            </button>
          ) : (
            belowMin ? (
              <button disabled className="btn-primary w-full mt-3 opacity-40 cursor-not-allowed text-center block">
                Proceed to Checkout
              </button>
            ) : (
              <Link to="/checkout" className="btn-primary w-full mt-3 text-center block">
                Proceed to Checkout
              </Link>
            )
          )}
        </>
      )}
      <Link to="/products" className="btn-ghost w-full text-center text-sm block mt-2">
        Continue Shopping
      </Link>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between text-sm ${bold ? "font-semibold text-dark dark:text-gray-100 text-base" : "text-gray-600 dark:text-gray-300"}`}>
      <span>{label}</span><span>{value}</span>
    </div>
  );
}
