import { Router } from "express";
import { body } from "express-validator";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/address.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";

const router = Router();

router.use(protect); // All address routes are private

router.get("/", getAddresses);

router.post(
  "/",
  [
    body("fullName").trim().notEmpty().withMessage("Full name is required"),
    body("phone")
      .matches(/^[6-9]\d{9}$/)
      .withMessage("Valid 10-digit Indian phone number required"),
    body("addressLine1").trim().notEmpty().withMessage("Address line 1 is required"),
    body("city").trim().notEmpty().withMessage("City is required"),
    body("state").trim().notEmpty().withMessage("State is required"),
    body("pincode")
      .matches(/^\d{6}$/)
      .withMessage("Valid 6-digit pincode required"),
    body("type")
      .optional()
      .isIn(["home", "work", "other"])
      .withMessage("Type must be home, work, or other"),
  ],
  validate,
  addAddress
);

router.put(
  "/:id",
  [
    body("phone")
      .optional()
      .matches(/^[6-9]\d{9}$/)
      .withMessage("Valid phone number required"),
    body("pincode")
      .optional()
      .matches(/^\d{6}$/)
      .withMessage("Valid 6-digit pincode required"),
    body("type")
      .optional()
      .isIn(["home", "work", "other"])
      .withMessage("Type must be home, work, or other"),
  ],
  validate,
  updateAddress
);

router.delete("/:id", deleteAddress);
router.put("/:id/set-default", setDefaultAddress);

export default router;
