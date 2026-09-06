import Razorpay from "razorpay";
import AppError from "./AppError";

/**
 * Razorpay is disabled by default — see config/features.ts. The SDK is built on
 * first use rather than at import time for two reasons: it must not be
 * constructed at all while the flag is off, and server.ts imports this module's
 * dependents *before* it calls dotenv.config(), so a top-level
 * `new Razorpay({ key_id: process.env... })` would capture an empty environment.
 */
let instance: Razorpay | null = null;

export const getRazorpay = (): Razorpay => {
  if (instance) return instance;

  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new AppError(
      "Razorpay is enabled but RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set.",
      500
    );
  }

  instance = new Razorpay({ key_id, key_secret });
  return instance;
};
