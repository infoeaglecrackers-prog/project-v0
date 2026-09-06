/**
 * Payment rail feature flags — must mirror backend/src/config/features.ts.
 *
 * Checkout collects over UPI (deep link / QR + a UTR the customer reports, which
 * an admin verifies against the bank statement). Razorpay is kept in the codebase
 * but hidden; set VITE_ENABLE_RAZORPAY=true — and PAYMENTS_RAZORPAY_ENABLED=true
 * on the backend — to bring the gateway options back.
 */
export const RAZORPAY_ENABLED = import.meta.env.VITE_ENABLE_RAZORPAY === "true";
