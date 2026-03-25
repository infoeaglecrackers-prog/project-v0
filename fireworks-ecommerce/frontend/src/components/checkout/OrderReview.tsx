import type { IAddress } from "../../types";
import { formatCurrency } from "../../utils/formatCurrency";
import { useCart } from "../../hooks/useCart";

interface Props {
  address: IAddress;
  paymentMethod: string;
}

export default function OrderReview({ address, paymentMethod }: Props) {
  const { cart } = useCart();
  const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal > 500 ? 0 : 60;
  const tax = Math.round(subtotal * 0.05);

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

      {/* Pricing */}
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
        <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Shipping</span><span>{shipping === 0 ? "FREE" : formatCurrency(shipping)}</span></div>
        <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Tax</span><span>{formatCurrency(tax)}</span></div>
        <div className="flex justify-between font-semibold text-dark dark:text-gray-100 text-base pt-1 border-t dark:border-gray-700">
          <span>Total</span><span>{formatCurrency(subtotal + shipping + tax)}</span>
        </div>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500">Payment: {paymentMethod.replace("razorpay_", "").toUpperCase()}</p>
    </div>
  );
}
