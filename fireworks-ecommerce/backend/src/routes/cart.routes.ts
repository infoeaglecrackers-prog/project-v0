import { Router } from "express";
import { body } from "express-validator";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";

const router = Router();

router.use(protect); // All cart routes are private

router.get("/", getCart);

router.post(
  "/",
  [
    body("productId").notEmpty().withMessage("Product ID is required"),
    body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  ],
  validate,
  addToCart
);

router.put(
  "/:productId",
  [
    // 0 is allowed here — it means "remove this item" (see updateCartItem).
    body("quantity").isInt({ min: 0 }).withMessage("Quantity cannot be negative"),
  ],
  validate,
  updateCartItem
);

router.delete("/clear", clearCart);
router.delete("/:productId", removeFromCart);

export default router;
