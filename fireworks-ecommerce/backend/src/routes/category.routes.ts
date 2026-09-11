import { Router } from "express";
import { body } from "express-validator";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import { protect } from "../middlewares/auth.middleware";
import { adminOnly } from "../middlewares/admin.middleware";
import { validate } from "../middlewares/validate.middleware";
import { upload } from "../middlewares/upload.middleware";
import { cacheMiddleware } from "../middlewares/cache.middleware";

const router = Router();

// ─── Public Routes ─────────────────────────────────────────────────────────────
// Caches categories for 15 minutes (900s)
router.get("/", cacheMiddleware({ ttlSeconds: 900, keyPrefix: "cache:categories:list:" }), getCategories);
router.get("/:id", cacheMiddleware({ ttlSeconds: 900, keyPrefix: "cache:categories:item:" }), getCategory);

// ─── Admin Routes ──────────────────────────────────────────────────────────────
router.use(protect, adminOnly);

router.post(
  "/",
  upload.single("image"),
  [
    body("name").trim().notEmpty().withMessage("Category name is required"),
  ],
  validate,
  createCategory
);

router.put(
  "/:id",
  upload.single("image"),
  [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  ],
  validate,
  updateCategory
);

router.delete("/:id", deleteCategory);

export default router;
