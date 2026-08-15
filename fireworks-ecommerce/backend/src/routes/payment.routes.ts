import { Router } from "express";
import { body } from "express-validator";
import {
  createRazorpayOrder,
  verifyPayment,
  razorpayWebhook,
  createRazorpayOrderForExisting,
  verifyPayForOrder,
} from "../controllers/payment.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";

const router = Router();

// ─── Webhook ─────────────────────────────────────────────────────────────────
// IMPORTANT: Webhook gets raw body (configured in server.ts BEFORE json middleware)
router.post("/webhook", razorpayWebhook);

// ─── Protected Routes ─────────────────────────────────────────────────────────
router.use(protect);

router.post(
  "/create-order",
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

// ─── Pay-Later Routes ─────────────────────────────────────────────────────────
// Create a Razorpay order for an existing pay-later order
router.post("/pay-order/:orderId", createRazorpayOrderForExisting);

// Verify and confirm payment for a pay-later order
router.post(
  "/pay-order/:orderId/verify",
  [
    body("razorpay_order_id").notEmpty().withMessage("Razorpay order ID is required"),
    body("razorpay_payment_id").notEmpty().withMessage("Payment ID is required"),
    body("razorpay_signature").notEmpty().withMessage("Signature is required"),
  ],
  validate,
  verifyPayForOrder
);

export default router;
