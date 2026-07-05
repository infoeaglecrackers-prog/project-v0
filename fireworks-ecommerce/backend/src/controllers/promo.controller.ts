import { Request, Response, NextFunction } from "express";
import Promo from "../models/Promo";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import { resolvePromoDiscount } from "../utils/applyPromo";

// ─── Validate Promo (any logged-in user, at checkout) ─────────────────────────
export const validatePromo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code, orderValue } = req.body as { code: string; orderValue: number };
    if (!code) return next(new AppError("Promo code is required.", 400));

    const { promo, discountAmount } = await resolvePromoDiscount(code, Number(orderValue) || 0);

    res.status(200).json({
      success: true,
      data: {
        code: promo!.code,
        discountPercent: promo!.discountPercent,
        discountAmount,
      },
    });
  }
);

// ─── Get All Promos (admin) ────────────────────────────────────────────────────
export const getPromos = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const promos = await Promo.find().sort("-createdAt");
    res.status(200).json({ success: true, data: { promos } });
  }
);

// ─── Create Promo (admin) ──────────────────────────────────────────────────────
export const createPromo = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { code, discountPercent, isActive, expiresAt, minOrderValue, usageLimit } = req.body;

    const promo = await Promo.create({
      code,
      discountPercent,
      isActive: isActive ?? true,
      expiresAt: expiresAt || undefined,
      minOrderValue: minOrderValue || 0,
      usageLimit: usageLimit || undefined,
    });

    res.status(201).json({
      success: true,
      message: "Promo code created successfully",
      data: { promo },
    });
  }
);

// ─── Update Promo (admin) ──────────────────────────────────────────────────────
export const updatePromo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const promo = await Promo.findById(req.params.id);
    if (!promo) return next(new AppError("Promo code not found.", 404));

    const updated = await Promo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Promo code updated successfully",
      data: { promo: updated },
    });
  }
);

// ─── Delete Promo (admin) ──────────────────────────────────────────────────────
export const deletePromo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const promo = await Promo.findById(req.params.id);
    if (!promo) return next(new AppError("Promo code not found.", 404));

    await promo.deleteOne();
    res.status(200).json({ success: true, message: "Promo code deleted successfully" });
  }
);
