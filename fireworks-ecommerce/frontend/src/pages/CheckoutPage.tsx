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
import type { IAddress } from "../types";
import toast from "react-hot-toast";
import { useCart } from "../hooks/useCart";

const STEPS = ["Address", "Payment", "Review"];

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
        const total = cart.totalPrice;
        const { data } = await paymentService.createRazorpayOrder(total);
        const rzpOptions = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: data.order.amount,
          currency: "INR",
          order_id: data.order.id,
          name: "Crackers Bazaar",
          description: "Fireworks Order",
          handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
            const verified = await paymentService.verifyPayment({
              ...response,
              orderId: response.razorpay_order_id,
            });
            if (verified.data.success) {
              const result = await dispatch(createOrder({
                items,
                shippingAddress: addr,
                paymentMethod: "razorpay",
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              }));
              if (createOrder.fulfilled.match(result)) {
                toast.success("Order placed!");
                navigate(`/orders/${(result.payload as { _id: string })._id}`);
              }
            }
          },
          prefill: { name: addr.fullName, contact: addr.phone },
          theme: { color: "#FF4500" },
        };
        const rzp = new window.Razorpay(rzpOptions);
        rzp.open();
      } catch { toast.error("Payment failed"); }
    } else {
      const result = await dispatch(createOrder({ items, shippingAddress: addr, paymentMethod: "cod" }));
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
          {step === 2 && selectedAddrObj && <OrderReview address={selectedAddrObj} paymentMethod={payMethod} />}

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
            <OrderReview address={selectedAddrObj} paymentMethod={payMethod} />
          </div>
        )}
      </div>

      <Modal isOpen={addrModal} onClose={() => setAddrModal(false)} title={editAddr ? "Edit Address" : "Add New Address"}>
        <AddressForm initial={editAddr || undefined} onSubmit={handleAddrSave} onCancel={() => setAddrModal(false)} />
      </Modal>
    </div>
  );
}
