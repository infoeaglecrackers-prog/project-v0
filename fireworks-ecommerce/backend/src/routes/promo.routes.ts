import { Router } from "express";
import { body } from "express-validator";
import {
  validatePromo,
  getPromos,
  createPromo,
  updatePromo,
  deletePromo,
} from "../controllers/promo.controller";
import { protect } from "../middlewares/auth.middleware";
import { adminOnly } from "../middlewares/admin.middleware";
import { validate } from "../middlewares/validate.middleware";

const router = Router();

router.use(protect);

// ─── Checkout — any logged-in user ─────────────────────────────────────────────
router.post(
  "/validate",
  [body("code").trim().notEmpty().withMessage("Promo code is required")],
  validate,
  validatePromo
);

// ─── Admin Routes ──────────────────────────────────────────────────────────────
router.use(adminOnly);

router.get("/", getPromos);

router.post(
  "/",
  [
    body("code").trim().notEmpty().withMessage("Promo code is required"),
    body("discountPercent")
      .isFloat({ min: 1, max: 90 })
      .withMessage("Discount must be between 1 and 90"),
  ],
  validate,
  createPromo
);

router.put("/:id", updatePromo);
router.delete("/:id", deletePromo);

export default router;
