import { Tag, X } from "lucide-react";
import type { IAddress } from "../../types";
import { formatCurrency } from "../../utils/formatCurrency";
import { useCart } from "../../hooks/useCart";

interface Pricing {
  subtotal: number;
  discountAmount: number;
  shipping: number;
  tax: number;
  total: number;
}

interface AppliedPromo {
  code: string;
  discountPercent: number;
  discountAmount: number;
}

interface Props {
  address: IAddress;
  paymentMethod: string;
  pricing: Pricing;
  appliedPromo: AppliedPromo | null;
  showPromoInput?: boolean;
  promoInput?: string;
  onPromoInputChange?: (v: string) => void;
  onApplyPromo?: () => void;
  onRemovePromo?: () => void;
  promoLoading?: boolean;
}

export default function OrderReview({
  address, paymentMethod, pricing, appliedPromo,
  showPromoInput, promoInput, onPromoInputChange, onApplyPromo, onRemovePromo, promoLoading,
}: Props) {
  const { cart } = useCart();
  const { subtotal, discountAmount, shipping, tax, total } = pricing;

  return (
    <div className="card p-5 space-y-4">
      <h3 className="font-semibold text-dark dark:text-gray-100">Order Summary</h3>

      {/* Items */}
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {cart?.items.map((item) => (
          <div key={item.product._id} className="flex items-center gap-3">
            <img src={item.product.images?.[0]?.url || ""} alt={item.product.name} className="w-10 h-10 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.product.name}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">×{item.quantity}</p>
            </div>
            <span className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <hr className="border-gray-100 dark:border-gray-700" />

      {/* Address */}
      <div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Delivering to</p>
        <p className="text-sm font-medium dark:text-gray-200">{address.fullName}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{address.addressLine1}, {address.city}, {address.state} {address.pincode}</p>
      </div>

      <hr className="border-gray-100 dark:border-gray-700" />

      {/* Promo code */}
      {showPromoInput && (
        <div>
          {appliedPromo ? (
            <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm px-3 py-2 rounded-lg">
              <span className="flex items-center gap-1.5 font-medium">
                <Tag size={14} /> {appliedPromo.code} applied — {appliedPromo.discountPercent}% off
              </span>
              <button onClick={onRemovePromo} aria-label="Remove promo code" className="hover:opacity-70">
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={promoInput}
                onChange={(e) => onPromoInputChange?.(e.target.value.toUpperCase())}
                placeholder="Promo code"
                className="input-field flex-1 font-mono uppercase text-sm"
              />
              <button
                onClick={onApplyPromo}
                disabled={promoLoading || !promoInput?.trim()}
                className="btn-ghost text-sm px-4 disabled:opacity-40"
              >
                {promoLoading ? "..." : "Apply"}
              </button>
            </div>
          )}
        </div>
      )}

      <hr className="border-gray-100 dark:border-gray-700" />

      {/* Pricing */}
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>Promo discount{appliedPromo ? ` (${appliedPromo.code})` : ""}</span>
            <span>−{formatCurrency(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Shipping</span><span>{shipping === 0 ? "FREE" : formatCurrency(shipping)}</span></div>
        <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Tax (GST 18%)</span><span>{formatCurrency(tax)}</span></div>
        <div className="flex justify-between font-semibold text-dark dark:text-gray-100 text-base pt-1 border-t dark:border-gray-700">
          <span>Total</span><span>{formatCurrency(total)}</span>
        </div>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500">Payment: {paymentMethod.replace("razorpay_", "").toUpperCase()}</p>
    </div>
  );
}
