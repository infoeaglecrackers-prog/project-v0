import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { createOrder } from "../store/slices/orderSlice";
import { fetchCart } from "../store/slices/cartSlice";
import { fetchAddresses, addAddress, updateAddress, deleteAddress } from "../store/slices/addressSlice";
import AddressList from "../components/checkout/AddressList";
import AddressForm from "../components/checkout/AddressForm";
import PaymentOptions from "../components/checkout/PaymentOptions";
import OrderReview from "../components/checkout/OrderReview";
import DropPointSelector from "../components/checkout/DropPointSelector";
import Modal from "../components/common/Modal";
import { paymentService } from "../services/paymentService";
import type { IAddress } from "../types";
import type { IDropPoint } from "../services/dropPointService";
import toast from "react-hot-toast";
import { useCart } from "../hooks/useCart";
import { RAZORPAY_ENABLED } from "../config/features";

const STEPS = ["Address", "Payment", "Review"];
const MINIMUM_ORDER_VALUE = 3000;

// Restricts which tabs Razorpay's checkout shows, so the method picked in step 2 actually matters
// instead of every option opening the same all-methods Razorpay screen.
// Only reachable while RAZORPAY_ENABLED — see config/features.ts.
const RAZORPAY_METHOD: Record<string, Record<string, boolean>> = {
  razorpay_card: { card: true, netbanking: false, upi: false, wallet: false, paylater: false },
  razorpay_upi: { card: false, netbanking: false, upi: true, wallet: false, paylater: false },
  razorpay_gpay: { card: false, netbanking: false, upi: true, wallet: false, paylater: false },
  razorpay_nb: { card: false, netbanking: true, upi: false, wallet: false, paylater: false },
};

declare global { interface Window { Razorpay: new (options: unknown) => { open: () => void }; } }

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cart } = useCart();
  const { loading } = useAppSelector((s) => s.orders);
  const addresses = useAppSelector((s) => s.address.addresses);
  const [step, setStep] = useState(0);
  const [selectedAddr, setSelectedAddr] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState("upi");
  const [addrModal, setAddrModal] = useState(false);
  const [editAddr, setEditAddr] = useState<IAddress | null>(null);
  const [selectedDropPoint, setSelectedDropPoint] = useState<IDropPoint | null>(null);

  const GST_RATE = 0;
  const FREE_SHIPPING_THRESHOLD = 0;
  const SHIPPING_CHARGE = 0;

  const subtotal = cart?.totalPrice || 0;
  const taxableAmount = subtotal;
  const shipping = taxableAmount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  // Mirrors the backend exactly (order.controller.ts / payment.controller.ts use
  // parseFloat(x.toFixed(2))) so the checkout bill never drifts from the amount
  // the order is actually created with — that drift was the QR/bill mismatch.
  const tax = parseFloat((taxableAmount * GST_RATE).toFixed(2));
  const total = parseFloat((taxableAmount + tax).toFixed(2));



  useEffect(() => {
    dispatch(fetchCart());
    // Cached addresses (localStorage + Redux) paint instantly; this only hits
    // the network the first time this session — see fetchAddresses' condition.
    dispatch(fetchAddresses());
  }, [dispatch]);

  // Default the selection once addresses are available, whether that's from
  // the instant cache or the background fetch resolving.
  useEffect(() => {
    if (selectedAddr || addresses.length === 0) return;
    const def = addresses.find((a) => a.isDefault) || addresses[0];
    setSelectedAddr(def._id);
  }, [addresses, selectedAddr]);

  const handleAddrSave = async (data: Omit<IAddress, "_id">) => {
    try {
      if (editAddr) {
        await dispatch(updateAddress({ id: editAddr._id, data })).then((r) => {
          if (updateAddress.rejected.match(r)) throw new Error();
        });
      } else {
        await dispatch(addAddress(data)).then((r) => {
          if (addAddress.rejected.match(r)) throw new Error();
        });
      }
      setAddrModal(false);
      toast.success("Address saved!");
    } catch { toast.error("Failed to save address"); }
  };

  const handleDeleteAddr = async (id: string) => {
    await dispatch(deleteAddress(id));
    if (selectedAddr === id) setSelectedAddr(null);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddr || !cart) return;
    if (subtotal < MINIMUM_ORDER_VALUE) {
      toast.error(`Minimum order value is ₹${MINIMUM_ORDER_VALUE.toLocaleString("en-IN")}. Add more items to proceed.`);
      return;
    }
    const addr = addresses.find((a) => a._id === selectedAddr)!;

    // If a drop point is selected, build a shipping address from it
    const shippingAddress = selectedDropPoint
      ? {
          fullName: addr.fullName,
          phone: addr.phone,
          addressLine1: selectedDropPoint.addressLine1,
          addressLine2: selectedDropPoint.addressLine2 || selectedDropPoint.name,
          city: selectedDropPoint.city,
          state: selectedDropPoint.state,
          pincode: selectedDropPoint.pincode,
          country: "India",
          isDropPoint: true,
          dropPointName: selectedDropPoint.name,
        }
      : addr;

    // Build items array required by backend
    const items = cart.items.map((item) => ({
      productId: typeof item.product === "object" ? item.product._id : item.product,
      quantity: item.quantity,
    }));

    // Self-hosted rails: create the order, then send the customer to its detail
    // page, which owns the UPI pay panel. Routing both through one place means
    // the checkout, the "Pay Now" email link and a later retry all behave the same.
    if (payMethod === "upi" || payMethod === "pay_later") {
      const result = await dispatch(
        createOrder({
          items,
          shippingAddress,
          paymentMethod: payMethod as "upi" | "pay_later",
        })
      );
      if (createOrder.fulfilled.match(result)) {
        const orderId = (result.payload as { _id: string })?._id;
        if (!orderId) {
          toast.error("Order created but no ID found. Please contact support.");
          return;
        }
        toast.success(
          payMethod === "pay_later"
            ? "Order placed! Pay by UPI within 2 days to start packing."
            : "Order placed! Complete the UPI payment to confirm it."
        );
        navigate(`/orders/${orderId}`);
      } else {
        const errorMsg = (result.payload as string) || "Order creation failed";
        console.error("Order creation failed:", errorMsg);
        toast.error(errorMsg);
      }
      return;
    }

    if (!RAZORPAY_ENABLED) {
      toast.error("This payment method is unavailable. Please choose UPI or Pay Later.");
      return;
    }

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
          name: "Elite Eagle Crackers",
          description: "Fireworks Order",
          handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
            try {
              const verified = await paymentService.verifyPayment({
                ...response,
                shippingAddress,
                items,
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
          config: payMethod === "razorpay_gpay"
            ? { display: { blocks: { gpay: { name: "Google Pay", instruments: [{ method: "upi", flows: ["intent"], apps: ["google_pay"] }] } }, sequence: ["block.gpay"], preferences: { show_default_blocks: false } } }
            : undefined,
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
      // COD — no payment to collect up front
      const result = await dispatch(createOrder({ items, shippingAddress, paymentMethod: "cod" }));
      if (createOrder.fulfilled.match(result)) {
        const orderId = (result.payload as { _id: string })?._id;
        if (!orderId) {
          toast.error("Order created but no ID found. Please contact support.");
          return;
        }
        toast.success("Order placed!");
        navigate(`/orders/${orderId}`);
      } else {
        const errorMsg = (result.payload as string) || "Order creation failed";
        console.error("COD order creation failed:", errorMsg);
        toast.error(errorMsg);
      }
    }
  };

  const selectedAddrObj = addresses.find((a) => a._id === selectedAddr);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 min-h-screen">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-dark dark:text-gray-100 mb-4 sm:mb-6 md:mb-8">Checkout</h1>

      {/* Step indicator - responsive */}
      <div className="flex items-center gap-1 sm:gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0 ${i <= step ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}>
              {i + 1}
            </div>
            <span className={`text-xs sm:text-sm hidden sm:inline ${i === step ? "font-medium text-dark dark:text-gray-100" : "text-gray-400 dark:text-gray-500"}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`w-8 sm:w-12 h-0.5 flex-shrink-0 ${i < step ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8">
        <div className="card p-4 sm:p-5 md:p-6">
          {step === 0 && (
            <>
              <AddressList
                addresses={addresses}
                selected={selectedAddr}
                onSelect={(id) => {
                  setSelectedAddr(id);
                  setSelectedDropPoint(null); // reset drop point when address changes
                }}
                onAdd={() => { setEditAddr(null); setAddrModal(true); }}
                onEdit={(a) => { setEditAddr(a); setAddrModal(true); }}
                onDelete={handleDeleteAddr}
              />
              {/* Drop point selector — shows after an address is chosen, uses its pincode/city for smart ranking */}
              {selectedAddr && (
                <DropPointSelector
                  selectedId={selectedDropPoint?._id || null}
                  onSelect={setSelectedDropPoint}
                  pincode={addresses.find((a) => a._id === selectedAddr)?.pincode}
                  city={addresses.find((a) => a._id === selectedAddr)?.city}
                />
              )}
            </>
          )}
          {step === 1 && <PaymentOptions selected={payMethod} onSelect={setPayMethod} />}
          {step === 2 && selectedAddrObj && (
            <OrderReview
              address={selectedAddrObj}
              dropPoint={selectedDropPoint}
              paymentMethod={payMethod}
              pricing={{ subtotal, discountAmount: 0, shipping, tax, total }}
              appliedPromo={null}
            />
          )}

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-5 sm:mt-6 md:mt-8">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="btn-ghost flex-1 text-sm sm:text-base">Back</button>
            )}
            {step < 2 ? (
              <button
                onClick={() => {
                  if (step === 0 && subtotal < MINIMUM_ORDER_VALUE) {
                    toast.error(`Minimum order value is ₹${MINIMUM_ORDER_VALUE.toLocaleString("en-IN")}. Please add more items.`);
                    return;
                  }
                  setStep(step + 1);
                }}
                disabled={step === 0 && !selectedAddr}
                className="btn-primary flex-1 disabled:opacity-40 text-sm sm:text-base"
              >
                Continue
              </button>
            ) : (
              <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1 text-sm sm:text-base">
                {loading
                  ? "Placing order..."
                  : payMethod === "upi"
                    ? "Place Order & Pay"
                    : payMethod === "cod" || payMethod === "pay_later"
                      ? "Place Order"
                      : "Pay Now"}
              </button>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={addrModal} onClose={() => setAddrModal(false)} title={editAddr ? "Edit Address" : "Add New Address"}>
        <AddressForm initial={editAddr || undefined} onSubmit={handleAddrSave} onCancel={() => setAddrModal(false)} />
      </Modal>
    </div>
  );
}
