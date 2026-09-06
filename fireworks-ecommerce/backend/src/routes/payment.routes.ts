import { Router, Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import {
  getUpiIntent,
  submitUtr,
  createRazorpayOrder,
  verifyPayment,
  razorpayWebhook,
  createRazorpayOrderForExisting,
  verifyPayForOrder,
} from "../controllers/payment.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { isRazorpayEnabled } from "../config/features";
import AppError from "../utils/AppError";

const router = Router();

/**
 * Gates the Razorpay routes at request time rather than skipping registration.
 * server.ts imports this module before dotenv.config() runs, so the flag isn't
 * readable yet at mount time — and a request-time check means flipping
 * PAYMENTS_RAZORPAY_ENABLED only needs a restart, not a code change.
 */
const requireRazorpay = (_req: Request, _res: Response, next: NextFunction): void => {
  if (!isRazorpayEnabled()) {
    return next(new AppError("Razorpay payments are disabled.", 404));
  }
  next();
};

// ─── Webhook ─────────────────────────────────────────────────────────────────
// IMPORTANT: Webhook gets raw body (configured in server.ts BEFORE json middleware)
router.post("/webhook", requireRazorpay, razorpayWebhook);

// ─── Protected Routes ─────────────────────────────────────────────────────────
router.use(protect);

// ─── Self-Hosted UPI Rail ─────────────────────────────────────────────────────
// Fetch the upi:// deep link + QR for an order awaiting payment
router.get("/upi/:orderId/intent", getUpiIntent);

// Report the UTR of a completed transfer — queues the order for admin verification
router.post(
  "/upi/:orderId/claim",
  [
    body("utr")
      .trim()
      .matches(/^\d{12}$/)
      .withMessage("UTR must be exactly 12 digits"),
  ],
  validate,
  submitUtr
);

// ─── Razorpay (disabled unless PAYMENTS_RAZORPAY_ENABLED=true) ─────────────────
router.post(
  "/create-order",
  requireRazorpay,
  [
    body("amount")
      .isNumeric()
      .custom((v) => v > 0)
      .withMessage("Amount must be a positive number (in paise)"),
  ],
  validate,
  createRazorpayOrder
);

router.post(
  "/verify",
  requireRazorpay,
  [
    body("razorpay_order_id").notEmpty().withMessage("Razorpay order ID is required"),
    body("razorpay_payment_id").notEmpty().withMessage("Payment ID is required"),
    body("razorpay_signature").notEmpty().withMessage("Signature is required"),
    body("shippingAddress").notEmpty().withMessage("Shipping address is required"),
    body("items").isArray({ min: 1 }).withMessage("Items are required"),
  ],
  validate,
  verifyPayment
);

// Create a Razorpay order for an existing pay-later order
router.post("/pay-order/:orderId", requireRazorpay, createRazorpayOrderForExisting);

// Verify and confirm payment for a pay-later order
router.post(
  "/pay-order/:orderId/verify",
  requireRazorpay,
  [
    body("razorpay_order_id").notEmpty().withMessage("Razorpay order ID is required"),
    body("razorpay_payment_id").notEmpty().withMessage("Payment ID is required"),
    body("razorpay_signature").notEmpty().withMessage("Signature is required"),
  ],
  validate,
  verifyPayForOrder
);

export default router;
