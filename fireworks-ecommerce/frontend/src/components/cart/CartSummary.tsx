import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";
import { useCart } from "../../hooks/useCart";

interface Props {
  onCheckout?: () => void;
  showCheckoutBtn?: boolean;
}

export default function CartSummary({ onCheckout, showCheckoutBtn = true }: Props) {
  const { cart } = useCart();
  if (!cart) return null;

  const subtotal = cart.totalPrice;
  const total = subtotal;

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
      {showCheckoutBtn && (
        <>
          {onCheckout ? (
            <button onClick={onCheckout} className="btn-primary w-full mt-3">
              Proceed to Checkout
            </button>
          ) : (
            <Link to="/checkout" className="btn-primary w-full mt-3 text-center block">
              Proceed to Checkout
            </Link>
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
