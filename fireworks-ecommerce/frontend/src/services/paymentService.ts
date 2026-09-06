import api from "./api";

export interface UpiIntentResponse {
  upiUri: string;
  /** PNG data URL. Absent if server-side QR rendering failed. */
  qrDataUrl?: string;
  vpa: string;
  payeeName: string;
  /** Rupees, fixed to 2 decimals. */
  amount: string;
  refId: string;
  paymentDueDate?: string;
}

export const paymentService = {
  // ── Self-hosted UPI rail ──
  /** Deep link + QR for an order awaiting payment. */
  getUpiIntent: (orderId: string) =>
    api.get<{ success: boolean; data: UpiIntentResponse }>(
      `/payment/upi/${orderId}/intent`
    ),

  /** Report the 12-digit UTR — queues the order for admin verification. */
  submitUtr: (orderId: string, utr: string) =>
    api.post(`/payment/upi/${orderId}/claim`, { utr }),

  // ── Razorpay (only reachable when the flag is on, both ends) ──
  createRazorpayOrder: (amountInRupees: number) =>
    api.post("/payment/create-order", { amount: Math.round(amountInRupees * 100) }),

  verifyPayment: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    shippingAddress: object;
    items: { productId: string; quantity: number }[];
    promoCode?: string;
  }) => api.post("/payment/verify", data),

  // Pay-Later: create a Razorpay order for an existing AwaitingPayment order
  createRazorpayOrderForExisting: (orderId: string) =>
    api.post(`/payment/pay-order/${orderId}`),

  // Pay-Later: verify payment and move order to Processing
  verifyPayForOrder: (orderId: string, data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => api.post(`/payment/pay-order/${orderId}/verify`, data),
};
