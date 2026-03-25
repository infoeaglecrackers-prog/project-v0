import { Request, Response, NextFunction } from "express";
import streamifier from "streamifier";
import Review from "../models/Review";
import Order from "../models/Order";
import cloudinary from "../config/cloudinary";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";

const REVIEWS_PER_PAGE = 10;

// ─── Get Reviews for Product ──────────────────────────────────────────────────
export const getProductReviews = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { productId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || REVIEWS_PER_PAGE;
    const skip = (page - 1) * limit;

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (req.query.sort === "top-rated") sortOption = { rating: -1 };
    if (req.query.sort === "helpful") sortOption = { helpfulVotes: -1 };

    const [reviews, total] = await Promise.all([
      Review.find({ product: productId })
        .populate("user", "name avatar")
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      Review.countDocuments({ product: productId }),
    ]);

    // Rating breakdown
    const breakdown = await Review.aggregate([
      { $match: { product: require("mongoose").Types.ObjectId.createFromHexString(productId) } },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
    ]);
    const ratingMap: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    breakdown.forEach((b) => { ratingMap[b._id] = b.count; });

    const avgRating = total > 0
      ? Object.entries(ratingMap).reduce((sum, [k, v]) => sum + Number(k) * v, 0) / total
      : 0;

    res.status(200).json({
      success: true,
      data: {
        reviews,
        ratingSummary: {
          average: Math.round(avgRating * 10) / 10,
          total,
          breakdown: ratingMap,
        },
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        limit,
      },
    });
  }
);

// ─── Add Review ───────────────────────────────────────────────────────────────
export const addReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    const { rating, title, comment } = req.body;

    const existing = await Review.findOne({ user: req.user!._id, product: productId });
    if (existing) {
      return next(new AppError("You have already reviewed this product.", 400));
    }

    // Check verified purchase
    const deliveredOrder = await Order.findOne({
      user: req.user!._id,
      orderStatus: "Delivered",
      "orderItems.product": productId,
    });

    // Upload review images if any
    let imageUrls: string[] = [];
    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      const files = req.files as Express.Multer.File[];
      const uploads = files.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "fireworks/reviews" },
              (error, result) => {
                if (error || !result) return reject(error);
                resolve(result.secure_url);
              }
            );
            streamifier.createReadStream(file.buffer).pipe(stream);
          })
      );
      imageUrls = await Promise.all(uploads);
    }

    const review = await Review.create({
      user: req.user!._id,
      product: productId,
      rating,
      title,
      comment,
      images: imageUrls,
      isVerifiedPurchase: !!deliveredOrder,
    });

    const populated = await Review.findById(review._id).populate("user", "name avatar");

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: { review: populated },
    });
  }
);

// ─── Update Review ────────────────────────────────────────────────────────────
export const updateReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const review = await Review.findById(req.params.id);
    if (!review) return next(new AppError("Review not found.", 404));
    if (review.user.toString() !== req.user!._id.toString()) {
      return next(new AppError("Not authorized to update this review.", 403));
    }

    const { rating, title, comment } = req.body;
    if (rating) review.rating = rating;
    if (title) review.title = title;
    if (comment) review.comment = comment;
    await review.save();

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: { review },
    });
  }
);

// ─── Delete Review ────────────────────────────────────────────────────────────
export const deleteReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const review = await Review.findById(req.params.id);
    if (!review) return next(new AppError("Review not found.", 404));

    if (
      review.user.toString() !== req.user!._id.toString() &&
      req.user!.role !== "admin"
    ) {
      return next(new AppError("Not authorized to delete this review.", 403));
    }

    await review.deleteOne();
    res.status(200).json({ success: true, message: "Review deleted successfully" });
  }
);
