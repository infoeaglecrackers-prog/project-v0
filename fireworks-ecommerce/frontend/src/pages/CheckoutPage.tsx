import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { createOrder } from "../store/slices/orderSlice";
import { fetchCart } from "../store/slices/cartSlice";
import AddressList from "../components/checkout/AddressList";
import AddressForm from "../components/checkout/AddressForm";
import PaymentOptions from "../components/checkout/PaymentOptions";
import OrderReview from "../components/checkout/OrderReview";
import Modal from "../components/common/Modal";
import { addressService } from "../services/addressService";
import { paymentService } from "../services/paymentService";
import { promoService } from "../services/promoService";
import type { IAddress } from "../types";
import toast from "react-hot-toast";
import { useCart } from "../hooks/useCart";

const STEPS = ["Address", "Payment", "Review"];

// Mirrors backend/src/controllers/order.controller.ts so the checkout preview
// (and the amount actually sent to Razorpay) matches what gets stored server-side.
const GST_RATE = 0.18;
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_CHARGE = 99;

// Restricts which tabs Razorpay's checkout shows, so the method picked in step 2 actually matters
// instead of every option opening the same all-methods Razorpay screen.
const RAZORPAY_METHOD: Record<string, Record<string, boolean>> = {
  razorpay_card: { card: true, netbanking: false, upi: false, wallet: false, paylater: false },
  razorpay_upi: { card: false, netbanking: false, upi: true, wallet: false, paylater: false },
  razorpay_nb: { card: false, netbanking: true, upi: false, wallet: false, paylater: false },
};

declare global { interface Window { Razorpay: new (options: unknown) => { open: () => void }; } }

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cart } = useCart();
  const { loading } = useAppSelector((s) => s.orders);
  const [step, setStep] = useState(0);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddr, setSelectedAddr] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState("razorpay_card");
  const [addrModal, setAddrModal] = useState(false);
  const [editAddr, setEditAddr] = useState<IAddress | null>(null);

  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number; discountAmount: number } | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);

  const subtotal = cart?.totalPrice || 0;
  const discountAmount = appliedPromo?.discountAmount || 0;
  const taxableAmount = subtotal - discountAmount;
  const shipping = taxableAmount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  const tax = Math.round(taxableAmount * GST_RATE * 100) / 100;
  const total = Math.round((taxableAmount + tax + shipping) * 100) / 100;

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    try {
      const { data } = await promoService.validate(promoInput.trim(), subtotal);
      setAppliedPromo(data.data);
      toast.success(`Promo applied — ${data.data.discountPercent}% off!`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Invalid promo code");
      setAppliedPromo(null);
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput("");
  };

  useEffect(() => {
    dispatch(fetchCart());
    addressService.getAll().then((r) => {
      setAddresses(r.data.data?.addresses || []);
      const def = r.data.data?.addresses?.find((a: IAddress) => a.isDefault);
      if (def) setSelectedAddr(def._id);
    }).catch(() => {});
  }, [dispatch]);

  const handleAddrSave = async (data: Omit<IAddress, "_id">) => {
    try {
      if (editAddr) {
        await addressService.update(editAddr._id, data);
      } else {
        await addressService.add(data);
      }
      const r = await addressService.getAll();
      setAddresses(r.data.data?.addresses || []);
      setAddrModal(false);
      toast.success("Address saved!");
    } catch { toast.error("Failed to save address"); }
  };

  const handleDeleteAddr = async (id: string) => {
    await addressService.delete(id);
    setAddresses((prev) => prev.filter((a) => a._id !== id));
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddr || !cart) return;
    const addr = addresses.find((a) => a._id === selectedAddr)!;

    // Build items array required by backend
    const items = cart.items.map((item) => ({
      productId: typeof item.product === "object" ? item.product._id : item.product,
      quantity: item.quantity,
    }));

    const isCod = payMethod === "cod";

    if (!isCod) {
      // Razorpay flow
      try {
        const { data } = await paymentService.createRazorpayOrder(total);
        const { razorpayOrder, key } = data.data;
        const rzpOptions = {
          key,
          amount: razorpayOrder.amount,
          currency: "INR",
          order_id: razorpayOrder.id,
          name: "Eagle Crackers",
          description: "Fireworks Order",
          handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
            try {
              const verified = await paymentService.verifyPayment({
                ...response,
                shippingAddress: addr,
                items,
                promoCode: appliedPromo?.code,
              });
              if (verified.data.success) {
                toast.success("Order placed!");
                dispatch(fetchCart());
                navigate(`/orders/${verified.data.data.orderId}`);
              }
            } catch {
              toast.error("Payment verification failed. Contact support if money was deducted.");
            }
          },
          prefill: { name: addr.fullName, contact: addr.phone },
          theme: { color: "#c9184a" },
          method: RAZORPAY_METHOD[payMethod],
        };
        if (!window.Razorpay) {
          toast.error("Payment gateway failed to load. Check your internet connection or ad-blocker and try again.");
          return;
        }
        const rzp = new window.Razorpay(rzpOptions);
        rzp.open();
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        toast.error(error.response?.data?.message || "Payment failed");
      }
    } else {
      const result = await dispatch(createOrder({ items, shippingAddress: addr, paymentMethod: "cod", promoCode: appliedPromo?.code }));
      if (createOrder.fulfilled.match(result)) {
        toast.success("Order placed!");
        navigate(`/orders/${(result.payload as { _id: string })._id}`);
      } else {
        toast.error("Order failed");
      }
    }
  };

  const selectedAddrObj = addresses.find((a) => a._id === selectedAddr);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-dark dark:text-gray-100 mb-6">Checkout</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${i <= step ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}>
              {i + 1}
            </div>
            <span className={`text-sm ${i === step ? "font-medium text-dark dark:text-gray-100" : "text-gray-400 dark:text-gray-500"}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`w-16 h-0.5 ${i < step ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card p-6">
          {step === 0 && (
            <AddressList
              addresses={addresses}
              selected={selectedAddr}
              onSelect={setSelectedAddr}
              onAdd={() => { setEditAddr(null); setAddrModal(true); }}
              onEdit={(a) => { setEditAddr(a); setAddrModal(true); }}
              onDelete={handleDeleteAddr}
            />
          )}
          {step === 1 && <PaymentOptions selected={payMethod} onSelect={setPayMethod} />}
          {step === 2 && selectedAddrObj && (
            <OrderReview
              address={selectedAddrObj}
              paymentMethod={payMethod}
              pricing={{ subtotal, discountAmount, shipping, tax, total }}
              appliedPromo={appliedPromo}
            />
          )}

          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="btn-ghost flex-1">Back</button>
            )}
            {step < 2 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 0 && !selectedAddr}
                className="btn-primary flex-1 disabled:opacity-40"
              >
                Continue
              </button>
            ) : (
              <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1">
                {loading ? "Placing order..." : payMethod === "cod" ? "Place Order" : "Pay Now"}
              </button>
            )}
          </div>
        </div>

        {selectedAddrObj && cart && (
          <div className="space-y-4">
            <OrderReview
              address={selectedAddrObj}
              paymentMethod={payMethod}
              pricing={{ subtotal, discountAmount, shipping, tax, total }}
              appliedPromo={appliedPromo}
              showPromoInput
              promoInput={promoInput}
              onPromoInputChange={setPromoInput}
              onApplyPromo={handleApplyPromo}
              onRemovePromo={handleRemovePromo}
              promoLoading={promoLoading}
            />
          </div>
        )}
      </div>

      <Modal isOpen={addrModal} onClose={() => setAddrModal(false)} title={editAddr ? "Edit Address" : "Add New Address"}>
        <AddressForm initial={editAddr || undefined} onSubmit={handleAddrSave} onCancel={() => setAddrModal(false)} />
      </Modal>
    </div>
  );
}
