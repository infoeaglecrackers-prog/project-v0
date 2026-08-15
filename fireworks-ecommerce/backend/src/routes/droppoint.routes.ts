import { Router } from "express";
import { body } from "express-validator";
import {
  getDropPoints,
  adminGetAllDropPoints,
  createDropPoint,
  updateDropPoint,
  deleteDropPoint,
} from "../controllers/droppoint.controller";
import { protect } from "../middlewares/auth.middleware";
import { adminOnly } from "../middlewares/admin.middleware";
import { validate } from "../middlewares/validate.middleware";

const router = Router();

// ─── Public: Active drop points (used on checkout page) ──────────────────────
router.get("/", getDropPoints);

// ─── Admin routes ─────────────────────────────────────────────────────────────
router.use(protect, adminOnly);

router.get("/all", adminGetAllDropPoints);

router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("addressLine1").trim().notEmpty().withMessage("Address is required"),
    body("city").trim().notEmpty().withMessage("City is required"),
    body("state").trim().notEmpty().withMessage("State is required"),
    body("pincode").matches(/^\d{6}$/).withMessage("Valid 6-digit pincode required"),
    body("contactPhone").optional().matches(/^[6-9]\d{9}$/).withMessage("Valid phone required"),
    body("workingHours").optional().trim(),
    body("landmark").optional().trim(),
  ],
  validate,
  createDropPoint
);

router.put(
  "/:id",
  [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
    body("city").optional().trim(),
    body("state").optional().trim(),
    body("pincode").optional().matches(/^\d{6}$/).withMessage("Valid 6-digit pincode required"),
    body("isActive").optional().isBoolean(),
  ],
  validate,
  updateDropPoint
);

router.delete("/:id", deleteDropPoint);

export default router;
