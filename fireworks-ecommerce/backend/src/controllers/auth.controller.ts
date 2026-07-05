import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken";
import sendEmail from "../utils/sendEmail";
import { resetPasswordTemplate, otpVerificationTemplate } from "../templates/email.templates";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const BRAND = process.env.FROM_NAME || "Eagle Crackers";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ─── Register ────────────────────────────────────────────────────────────────
export const register = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { name, email, password, phone } = req.body;

    const user = await User.create({ name, email, password, phone });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;

    // Send email verification OTP — non-blocking, user can resend from the app
    const otp = user.getEmailOtp();
    await user.save({ validateBeforeSave: false });
    try {
      await sendEmail({
        to: user.email,
        subject: `Verify Your Email — ${BRAND}`,
        html: otpVerificationTemplate(user.name, otp),
      });
    } catch (err) {
      console.error("OTP email failed:", err);
    }

    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          isVerified: user.isVerified,
          phoneVerified: user.phoneVerified,
          createdAt: user.createdAt,
        },
        accessToken,
      },
    });
  }
);

// ─── Send / Resend Email OTP ──────────────────────────────────────────────────
export const sendEmailOtp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user!._id);
    if (!user) return next(new AppError("User not found.", 404));
    if (user.isVerified) {
      return next(new AppError("Email is already verified.", 400));
    }

    const otp = user.getEmailOtp();
    await user.save({ validateBeforeSave: false });

    try {
      await sendEmail({
        to: user.email,
        subject: `Verify Your Email — ${BRAND}`,
        html: otpVerificationTemplate(user.name, otp),
      });
    } catch (err) {
      console.error("OTP email failed:", err);
      return next(new AppError("Could not send OTP email. Try again later.", 500));
    }

    res.status(200).json({ success: true, message: `OTP sent to ${user.email}` });
  }
);

// ─── Verify Email OTP ─────────────────────────────────────────────────────────
export const verifyEmailOtp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { otp } = req.body as { otp: string };
    if (!otp) return next(new AppError("OTP is required.", 400));

    const user = await User.findById(req.user!._id).select("+emailOtp +emailOtpExpire");
    if (!user) return next(new AppError("User not found.", 404));
    if (user.isVerified) {
      return next(new AppError("Email is already verified.", 400));
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    if (
      !user.emailOtp ||
      user.emailOtp !== hashedOtp ||
      !user.emailOtpExpire ||
      user.emailOtpExpire < new Date()
    ) {
      return next(new AppError("OTP is invalid or has expired.", 400));
    }

    user.isVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, message: "Email verified successfully." });
  }
);

// ─── Login ───────────────────────────────────────────────────────────────────
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide email and password.", 400));
    }

    const user = await User.findOne({ email }).select("+password +refreshToken");
    if (!user) {
      return next(new AppError("Invalid email or password.", 401));
    }
    if (!user.password) {
      return next(new AppError("This account uses Google Sign-In. Please continue with Google.", 400));
    }
    if (!(await user.comparePassword(password))) {
      return next(new AppError("Invalid email or password.", 401));
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        accessToken,
      },
    });
  }
);

// ─── Google Sign-In (ID token from Google Identity Services) ─────────────────
export const googleAuth = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { credential } = req.body as { credential: string };
    if (!credential) {
      return next(new AppError("Google credential is required.", 400));
    }
    if (!process.env.GOOGLE_CLIENT_ID) {
      return next(new AppError("Google Sign-In is not configured on the server.", 500));
    }

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch {
      return next(new AppError("Invalid Google credential.", 401));
    }

    if (!payload?.email || !payload.email_verified) {
      return next(new AppError("Google account has no verified email.", 401));
    }

    type UserDoc = InstanceType<typeof User>;
    let user = (await User.findOne({ googleId: payload.sub }).select("+refreshToken")) as UserDoc | null;

    if (!user) {
      // No account linked to this Google ID yet — check if the email is already
      // registered locally, and link accounts instead of creating a duplicate.
      user = (await User.findOne({ email: payload.email }).select("+refreshToken")) as UserDoc | null;
      if (user) {
        user.googleId = payload.sub;
        if (!user.isVerified) user.isVerified = true;
      } else {
        user = new User({
          name: payload.name || payload.email.split("@")[0],
          email: payload.email,
          googleId: payload.sub,
          authProvider: "google",
          isVerified: true,
          avatar: payload.picture ? { url: payload.picture } : undefined,
        });
      }
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      message: "Signed in with Google",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          isVerified: user.isVerified,
          phoneVerified: user.phoneVerified,
          createdAt: user.createdAt,
        },
        accessToken,
      },
    });
  }
);

// ─── Logout ──────────────────────────────────────────────────────────────────
export const logout = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const user = await User.findById(req.user!._id).select("+refreshToken");
    if (user) {
      user.refreshToken = undefined;
      await user.save({ validateBeforeSave: false });
    }

    res.clearCookie("refreshToken");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  }
);

// ─── Refresh Token ────────────────────────────────────────────────────────────
export const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return next(new AppError("Refresh token not found.", 401));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string
    ) as { id: string };

    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== token) {
      return next(new AppError("Invalid or expired refresh token.", 401));
    }

    const accessToken = generateAccessToken(user._id);
    res.status(200).json({ success: true, data: { accessToken } });
  }
);

// ─── Forgot Password ─────────────────────────────────────────────────────────
export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError("User not found with that email.", 404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: `Password Reset Request — ${BRAND}`,
        html: resetPasswordTemplate(user.name, resetUrl),
      });

      res.status(200).json({
        success: true,
        message: `Password reset link sent to ${user.email}`,
      });
    } catch {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new AppError("Email could not be sent. Try again later.", 500));
    }
  }
);

// ─── Reset Password ──────────────────────────────────────────────────────────
export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return next(new AppError("Passwords do not match.", 400));
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError("Reset token is invalid or has expired.", 400));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const accessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      message: "Password reset successful. Please login.",
      data: { accessToken },
    });
  }
);

// ─── Get Current User ────────────────────────────────────────────────────────
export const getMe = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const user = await User.findById(req.user!._id);
    res.status(200).json({ success: true, data: { user } });
  }
);

