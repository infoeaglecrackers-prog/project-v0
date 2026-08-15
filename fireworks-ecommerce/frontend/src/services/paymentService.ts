import api from "./api";

export const paymentService = {
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
