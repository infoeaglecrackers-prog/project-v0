import { Router } from "express";
import { body } from "express-validator";
import {
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
} from "../controllers/user.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.use(protect); // All user routes require auth

router.get("/profile", getProfile);

router.put(
  "/profile",
  [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
    body("phone")
      .optional()
      .isMobilePhone("en-IN")
      .withMessage("Valid Indian phone number required"),
  ],
  validate,
  updateProfile
);

router.put(
  "/change-password",
  [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
  ],
  validate,
  changePassword
);

router.post("/avatar", upload.single("avatar"), uploadAvatar);

export default router;
