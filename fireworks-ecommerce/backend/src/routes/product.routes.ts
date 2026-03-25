import { Router } from "express";
import { body } from "express-validator";
import {
  getProducts,
  getFeaturedProducts,
  getBestSellers,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  deleteProductImage,
} from "../controllers/product.controller";
import { protect } from "../middlewares/auth.middleware";
import { adminOnly } from "../middlewares/admin.middleware";
import { validate } from "../middlewares/validate.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

// ─── Public Routes ─────────────────────────────────────────────────────────────
router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/bestsellers", getBestSellers);
router.get("/:id", getProduct);

// ─── Admin Routes ──────────────────────────────────────────────────────────────
router.use(protect, adminOnly);

router.post(
  "/",
  upload.array("images", 5),
  [
    body("name").trim().notEmpty().withMessage("Product name is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Valid price is required"),
    body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
    body("category").notEmpty().withMessage("Category is required"),
  ],
  validate,
  createProduct
);

router.put(
  "/:id",
  upload.array("images", 5),
  [
    body("price").optional().isFloat({ gt: 0 }).withMessage("Valid price required"),
    body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be non-negative"),
    body("discountPercent")
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage("Discount must be between 0 and 100"),
  ],
  validate,
  updateProduct
);

router.delete("/:id", deleteProduct);
router.post("/:id/images", upload.array("images", 5), uploadProductImages);
router.delete("/:id/images/:publicId", deleteProductImage);

export default router;
