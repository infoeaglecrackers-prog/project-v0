import { Router } from "express";
import { body } from "express-validator";
import {
  placeOrder,
  getMyOrders,
  getOrderDetail,
  cancelOrder,
  getInvoice,
} from "../controllers/order.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { enabledPaymentMethods } from "../config/features";

const router = Router();

router.use(protect); // All order routes are private

router.post(
  "/",
  [
    body("items").isArray({ min: 1 }).withMessage("At least one item is required"),
    body("items.*.productId").notEmpty().withMessage("Product ID is required"),
    body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    body("shippingAddress").notEmpty().withMessage("Shipping address is required"),
    body("shippingAddress.fullName").notEmpty().withMessage("Full name is required"),
    body("shippingAddress.phone")
      .matches(/^[6-9]\d{9}$/)
      .withMessage("Valid phone number required"),
    body("shippingAddress.addressLine1").notEmpty().withMessage("Address line 1 is required"),
    body("shippingAddress.city").notEmpty().withMessage("City is required"),
    body("shippingAddress.state").notEmpty().withMessage("State is required"),
    body("shippingAddress.pincode")
      .matches(/^\d{6}$/)
      .withMessage("Valid 6-digit pincode required"),
    // .custom() rather than .isIn() so the allowed set is read per-request:
    // the flag isn't available at route-registration time (see config/features.ts).
    body("paymentMethod").custom((v) => {
      const allowed = enabledPaymentMethods();
      if (!allowed.includes(v)) {
        throw new Error(`Payment method must be one of: ${allowed.join(", ")}`);
      }
      return true;
    }),
  ],
  validate,
  placeOrder
);

router.get("/", getMyOrders);
router.get("/:id", getOrderDetail);

router.put(
  "/:id/cancel",
  [body("reason").optional().trim()],
  validate,
  cancelOrder
);

router.get("/:id/invoice", getInvoice);

export default router;
