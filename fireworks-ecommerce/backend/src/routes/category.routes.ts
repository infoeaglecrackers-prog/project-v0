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

const router = Router();

// ─── Public Routes ─────────────────────────────────────────────────────────────
router.get("/", getCategories);
router.get("/:id", getCategory);

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
