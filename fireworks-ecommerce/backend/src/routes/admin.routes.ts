import { Router } from "express";
import { body } from "express-validator";
import {
  getDashboardStats,
  getAllOrders,
  getOrderDetail,
  updateOrderStatus,
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
