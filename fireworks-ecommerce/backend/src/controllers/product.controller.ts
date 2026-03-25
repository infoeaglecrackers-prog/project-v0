import { Request, Response, NextFunction } from "express";
import streamifier from "streamifier";
import Product from "../models/Product";
import cloudinary from "../config/cloudinary";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import ApiFeatures from "../utils/apiFeatures";

const PRODUCTS_PER_PAGE = 12;

// ─── Get All Products ─────────────────────────────────────────────────────────
export const getProducts = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const baseQuery = Product.find({ isActive: true }).populate("category", "name slug");
    const features = new ApiFeatures(baseQuery, req.query)
      .search()
      .filter()
      .sort()
      .paginate(PRODUCTS_PER_PAGE);

    const [products, total] = await Promise.all([
      features.query,
      Product.countDocuments({ isActive: true }),
    ]);

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: { products },
      pagination: {
        currentPage: Number(req.query.page) || 1,
        totalPages: Math.ceil(total / PRODUCTS_PER_PAGE),
        totalProducts: total,
        limit: PRODUCTS_PER_PAGE,
      },
    });
  }
);

// ─── Get Featured Products ───────────────────────────────────────────────────
export const getFeaturedProducts = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const limit = Number(req.query.limit) || 8;
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate("category", "name slug")
      .limit(limit)
      .sort("-createdAt");
    res.status(200).json({ success: true, data: { products } });
  }
);

// ─── Get Best Sellers ─────────────────────────────────────────────────────────
export const getBestSellers = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const limit = Number(req.query.limit) || 8;
    const products = await Product.find({ isActive: true })
      .populate("category", "name slug")
      .sort("-sold")
      .limit(limit);
    res.status(200).json({ success: true, data: { products } });
  }
);

// ─── Get Single Product ───────────────────────────────────────────────────────
export const getProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id).populate("category", "name slug");
    if (!product) return next(new AppError("Product not found.", 404));
    res.status(200).json({ success: true, data: { product } });
  }
);

// ─── Create Product ───────────────────────────────────────────────────────────
export const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return next(new AppError("At least one product image is required.", 400));
    }

    // Upload all images to Cloudinary
    const uploadPromises = files.map(
      (file) =>
        new Promise<{ public_id: string; url: string }>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "fireworks/products" },
            (error, result) => {
              if (error || !result) return reject(error);
              resolve({ public_id: result.public_id, url: result.secure_url });
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        })
    );

    const images = await Promise.all(uploadPromises);

    // Parse tags if sent as comma-separated string
    const tags = req.body.tags
      ? req.body.tags.split(",").map((t: string) => t.trim())
      : [];

    const product = await Product.create({ ...req.body, images, tags });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { product },
    });
  }
);

// ─── Update Product ───────────────────────────────────────────────────────────
export const updateProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new AppError("Product not found.", 404));

    if (req.body.tags && typeof req.body.tags === "string") {
      req.body.tags = req.body.tags.split(",").map((t: string) => t.trim());
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("category", "name slug");

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: { product: updated },
    });
  }
);

// ─── Delete Product ───────────────────────────────────────────────────────────
export const deleteProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new AppError("Product not found.", 404));

    // Delete all images from Cloudinary
    await Promise.all(
      product.images.map((img) => cloudinary.uploader.destroy(img.public_id))
    );

    await product.deleteOne();
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  }
);

// ─── Upload Product Images ────────────────────────────────────────────────────
export const uploadProductImages = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new AppError("Product not found.", 404));

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return next(new AppError("Please upload at least one image.", 400));
    }

    if (product.images.length + files.length > 5) {
      return next(new AppError("A product can have a maximum of 5 images.", 400));
    }

    const uploadPromises = files.map(
      (file) =>
        new Promise<{ public_id: string; url: string }>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "fireworks/products" },
            (error, result) => {
              if (error || !result) return reject(error);
              resolve({ public_id: result.public_id, url: result.secure_url });
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        })
    );

    const newImages = await Promise.all(uploadPromises);
    product.images.push(...newImages);
    await product.save();

    res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      data: { images: newImages },
    });
  }
);

// ─── Delete Product Image ─────────────────────────────────────────────────────
export const deleteProductImage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new AppError("Product not found.", 404));

    const imgIndex = product.images.findIndex(
      (img) => img.public_id === req.params.imgId
    );
    if (imgIndex === -1) return next(new AppError("Image not found.", 404));

    await cloudinary.uploader.destroy(req.params.imgId);
    product.images.splice(imgIndex, 1);
    await product.save();

    res.status(200).json({ success: true, message: "Image deleted successfully" });
  }
);
