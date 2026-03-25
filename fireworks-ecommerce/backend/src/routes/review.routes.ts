import { Router } from "express";
import { body } from "express-validator";
import {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
} from "../controllers/review.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = Router({ mergeParams: true });

// ─── Public Routes ─────────────────────────────────────────────────────────────
router.get("/products/:productId/reviews", getProductReviews);

// ─── Private Routes ────────────────────────────────────────────────────────────
router.post(
  "/products/:productId/reviews",
  protect,
  upload.array("images", 3),
  [
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("title").optional().trim().isLength({ max: 100 }).withMessage("Title max 100 chars"),
    body("comment").trim().notEmpty().withMessage("Review comment is required"),
  ],
  validate,
  addReview
);

router.put(
  "/reviews/:id",
  protect,
  [
    body("rating")
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("comment")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Comment cannot be empty"),
  ],
  validate,
  updateReview
);

router.delete("/reviews/:id", protect, deleteReview);

export default router;
