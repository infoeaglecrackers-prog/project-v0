import { Request, Response, NextFunction } from "express";
import streamifier from "streamifier";
import User from "../models/User";
import cloudinary from "../config/cloudinary";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";

// ─── Get Profile ─────────────────────────────────────────────────────────────
export const getProfile = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const user = await User.findById(req.user!._id);
    res.status(200).json({ success: true, data: { user } });
  }
);

// ─── Update Profile ───────────────────────────────────────────────────────────
export const updateProfile = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { name, phone },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user },
    });
  }
);

// ─── Change Password ──────────────────────────────────────────────────────────
export const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return next(new AppError("Passwords do not match.", 400));
    }

    const user = await User.findById(req.user!._id).select("+password");
    if (!user || !(await user.comparePassword(currentPassword))) {
      return next(new AppError("Current password is incorrect.", 401));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully" });
  }
);

// ─── Upload Avatar ────────────────────────────────────────────────────────────
export const uploadAvatar = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next(new AppError("Please upload an image.", 400));
    }

    const user = await User.findById(req.user!._id);
    if (!user) return next(new AppError("User not found.", 404));

    // Delete old avatar from Cloudinary
    if (user.avatar?.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    // Upload new avatar via stream
    const result = await new Promise<{ public_id: string; secure_url: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "fireworks/avatars", transformation: [{ width: 300, height: 300, crop: "fill" }] },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result as { public_id: string; secure_url: string });
          }
        );
        streamifier.createReadStream(req.file!.buffer).pipe(stream);
      }
    );

    user.avatar = { public_id: result.public_id, url: result.secure_url };
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      data: { avatar: user.avatar },
    });
  }
);
