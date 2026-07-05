import { Router } from "express";
import { body } from "express-validator";
import {
  register,
  login,
  googleAuth,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  getMe,
  sendEmailOtp,
  verifyEmailOtp,
} from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";

const router = Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("phone")
      .optional({ checkFalsy: true })
      .matches(/^[6-9]\d{9}$/)
      .withMessage("Please provide a valid 10-digit Indian mobile number"),
  ],
  validate,
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

router.post(
  "/google",
  [body("credential").notEmpty().withMessage("Google credential is required")],
  validate,
  googleAuth
);

router.post("/logout", protect, logout);
router.post("/refresh-token", refreshToken);

router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Valid email is required")],
  validate,
  forgotPassword
);

router.post(
  "/reset-password/:token",
  [
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  validate,
  resetPassword
);

router.get("/me", protect, getMe);

router.post("/send-email-otp", protect, sendEmailOtp);
router.post(
  "/verify-email-otp",
  protect,
  [body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits")],
  validate,
  verifyEmailOtp
);


export default router;
