import { Request, Response, NextFunction } from "express";
import Address from "../models/Address";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";

// ─── Get All Addresses ────────────────────────────────────────────────────────
export const getAddresses = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const addresses = await Address.find({ user: req.user!._id }).sort("-isDefault");
    res.status(200).json({ success: true, data: { addresses } });
  }
);

// ─── Add Address ──────────────────────────────────────────────────────────────
export const addAddress = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { isDefault } = req.body;

    if (isDefault) {
      await Address.updateMany({ user: req.user!._id }, { isDefault: false });
    }

    const address = await Address.create({ ...req.body, user: req.user!._id });

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: { address },
    });
  }
);

// ─── Update Address ───────────────────────────────────────────────────────────
export const updateAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user!._id,
    });
    if (!address) return next(new AppError("Address not found.", 404));

    if (req.body.isDefault) {
      await Address.updateMany({ user: req.user!._id }, { isDefault: false });
    }

    const updated = await Address.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: { address: updated },
    });
  }
);

// ─── Delete Address ───────────────────────────────────────────────────────────
export const deleteAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user!._id,
    });
    if (!address) return next(new AppError("Address not found.", 404));
    res.status(200).json({ success: true, message: "Address deleted successfully" });
  }
);

// ─── Set Default Address ──────────────────────────────────────────────────────
export const setDefaultAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user!._id,
    });
    if (!address) return next(new AppError("Address not found.", 404));

    await Address.updateMany({ user: req.user!._id }, { isDefault: false });
    address.isDefault = true;
    await address.save();

    res.status(200).json({
      success: true,
      message: "Default address updated",
      data: { address },
    });
  }
);
