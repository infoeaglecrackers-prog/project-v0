import { Router } from "express";
import { body } from "express-validator";
import { getWishlist, toggleWishlist } from "../controllers/wishlist.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";

const router = Router();

router.use(protect); // All wishlist routes are private

router.get("/", getWishlist);

router.post(
  "/toggle",
  [body("productId").notEmpty().withMessage("Product ID is required")],
  validate,
  toggleWishlist
);

export default router;
