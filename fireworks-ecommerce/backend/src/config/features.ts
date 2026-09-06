/**
 * Payment rail feature flags.
 *
 * The store collects over a self-hosted UPI rail: a `upi://pay` deep link / QR
 * pointing at our own merchant VPA, settled by an admin who matches the
 * customer-submitted UTR against the bank statement. No payment aggregator is
 * involved, so there is no webhook and nothing confirms a payment except a human.
 *
 * Razorpay is left fully intact but gated off. Set PAYMENTS_RAZORPAY_ENABLED=true
 * to re-expose its routes and checkout options without touching code.
 *
 * Everything here is read lazily, never at module load: server.ts imports the
 * whole route tree before it calls dotenv.config(), so a top-level process.env
 * read in this file would see an empty environment.
 */

const truthy = (v?: string): boolean => v === "true" || v === "1";

export const isRazorpayEnabled = (): boolean =>
  truthy(process.env.PAYMENTS_RAZORPAY_ENABLED);

export interface UpiConfig {
  vpa: string;
  payeeName: string;
}

export const getUpiConfig = (): UpiConfig => ({
  vpa: (process.env.UPI_VPA || "").trim(),
  payeeName: (process.env.UPI_PAYEE_NAME || "Elite Eagle Crackers").trim(),
});

/** Payment methods `POST /api/orders` accepts under the current flags. */
export const enabledPaymentMethods = (): string[] =>
  isRazorpayEnabled()
    ? ["upi", "pay_later", "razorpay", "cod"]
    : ["upi", "pay_later"];
