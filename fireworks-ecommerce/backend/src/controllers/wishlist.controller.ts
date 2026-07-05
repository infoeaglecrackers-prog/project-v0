import { Request, Response, NextFunction } from "express";
import Wishlist from "../models/Wishlist";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import { Types } from "mongoose";

// ─── Get Wishlist ─────────────────────────────────────────────────────────────
export const getWishlist = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const wishlist = await Wishlist.findOne({ user: req.user!._id }).populate(
      "products",
      "name price discountPrice images ratings stock isActive"
    );
    res.status(200).json({
      success: true,
      data: { wishlist: wishlist || { products: [] } },
    });
  }
);

// ─── Toggle Wishlist (Add / Remove) ──────────────────────────────────────────
export const toggleWishlist = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { productId } = req.params;
    const userId = req.user!._id;

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    const productObjectId = new Types.ObjectId(productId);
    const isWishlisted = wishlist.products.some(
      (id) => id.toString() === productId
    );

    let message: string;
    if (isWishlisted) {
      wishlist.products = wishlist.products.filter(
        (id) => id.toString() !== productId
      );
      message = "Removed from wishlist";
    } else {
      wishlist.products.push(productObjectId);
      message = "Added to wishlist";
    }

    await wishlist.save();
    const populated = await Wishlist.findById(wishlist._id).populate(
      "products",
      "name price discountPrice images ratings stock"
    );

    res.status(200).json({
      success: true,
      message,
      data: { isWishlisted: !isWishlisted, wishlist: populated },
    });
  }
);
