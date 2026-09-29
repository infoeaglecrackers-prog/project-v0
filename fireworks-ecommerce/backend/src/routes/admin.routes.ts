import { Router } from "express";
import { body } from "express-validator";
import {
  getDashboardStats,
  getAllOrders,
  getOrderDetail,
  createManualOrder,
  updateOrderStatus,
  updatePaymentStatus,
  verifyUpiPayment,
  rejectUpiPayment,
  getAllUsers,
  getUserDetail,
  changeUserRole,
  deleteUser,
  getLowStockProducts,
  getRevenueAnalytics,
  getAllCategories,
  getCategoryDetail,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/admin.controller";
import { protect } from "../middlewares/auth.middleware";
import { adminOnly } from "../middlewares/admin.middleware";
import { validate } from "../middlewares/validate.middleware";

const router = Router();

// All admin routes require protect + adminOnly
router.use(protect, adminOnly);

// ─── Dashboard ─────────────────────────────────────────────────────────────────
router.get("/dashboard", getDashboardStats);
router.get("/analytics/revenue", getRevenueAnalytics);
router.get("/products/low-stock", getLowStockProducts);

// ─── Orders ────────────────────────────────────────────────────────────────────
router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderDetail);

// Manual/offline order entry — admin fills in the customer + billing details.
router.post(
  "/orders/manual",
  [
    body("items").isArray({ min: 1 }).withMessage("At least one item is required"),
    body("items.*.productId").notEmpty().withMessage("Product ID is required"),
    body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    body("customer.name").trim().notEmpty().withMessage("Customer name is required"),
    body("customer.phone")
      .matches(/^[6-9]\d{9}$/)
      .withMessage("Valid 10-digit phone number required"),
    body("customer.email").optional({ checkFalsy: true }).isEmail().withMessage("Valid email required"),
    body("shippingAddress.fullName").notEmpty().withMessage("Billing name is required"),
    body("shippingAddress.phone")
      .matches(/^[6-9]\d{9}$/)
      .withMessage("Valid billing phone number required"),
    body("shippingAddress.addressLine1").notEmpty().withMessage("Address line 1 is required"),
    body("shippingAddress.city").notEmpty().withMessage("City is required"),
    body("shippingAddress.state").notEmpty().withMessage("State is required"),
    body("shippingAddress.pincode")
      .matches(/^\d{6}$/)
      .withMessage("Valid 6-digit pincode required"),
    body("paymentMethod")
      .isIn(["upi", "pay_later", "razorpay", "cod"])
      .withMessage("Invalid payment method"),
    body("paymentStatus").optional().isIn(["paid", "pending"]).withMessage("Invalid payment status"),
  ],
  validate,
  createManualOrder
);

router.put(
  "/orders/:id/status",
  [
    body("status")
      .isIn(["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"])
      .withMessage("Invalid order status"),
    body("trackingNumber").optional().trim(),
    body("note").optional().trim(),
  ],
  validate,
  updateOrderStatus
);

router.put(
  "/orders/:id/payment",
  [
    body("status")
      .isIn(["paid", "pending", "failed"])
      .withMessage("Invalid payment status"),
  ],
  validate,
  updatePaymentStatus
);

// ─── UPI Payment Verification ──────────────────────────────────────────────────
// The manual settlement step: an admin confirms the credit on the bank statement
// before the order can move to Processing.
router.post("/orders/:id/payment/verify", verifyUpiPayment);

router.post(
  "/orders/:id/payment/reject",
  [body("reason").trim().notEmpty().withMessage("A rejection reason is required")],
  validate,
  rejectUpiPayment
);

// ─── Users ─────────────────────────────────────────────────────────────────────
router.get("/users", getAllUsers);
router.get("/users/:id", getUserDetail);

router.put(
  "/users/:id/role",
  [
    body("role")
      .isIn(["user", "admin"])
      .withMessage("Role must be 'user' or 'admin'"),
  ],
  validate,
  changeUserRole
);

router.delete("/users/:id", deleteUser);

// ─── Categories ────────────────────────────────────────────────────────────────
router.get("/categories", getAllCategories);
router.get("/categories/:id", getCategoryDetail);

router.post(
  "/categories",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Category name is required"),
    body("description").optional().trim(),
    body("sortOrder").optional().isInt({ min: 1 }).withMessage("Sort order must be a positive number"),
  ],
  validate,
  createCategory
);

router.put(
  "/categories/:id",
  [
    body("name").optional().trim().notEmpty().withMessage("Category name cannot be empty"),
    body("description").optional().trim(),
    body("sortOrder").optional().isInt({ min: 1 }).withMessage("Sort order must be a positive number"),
    body("isActive").optional().isBoolean().withMessage("isActive must be a boolean"),
  ],
  validate,
  updateCategory
);

router.delete("/categories/:id", deleteCategory);

export default router;
