import { Request, Response, NextFunction } from "express";
import streamifier from "streamifier";
import Category from "../models/Category";
import Product from "../models/Product";
import cloudinary from "../config/cloudinary";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";

const slugify = (text: string): string =>
  text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

// ─── Get All Categories ───────────────────────────────────────────────────────
export const getCategories = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const filter: Record<string, unknown> = {};
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === "true";
    if (req.query.parent) filter.parentCategory = req.query.parent;

    const categories = await Category.find(filter).sort({ sortOrder: 1 });
    res.status(200).json({ success: true, data: { categories } });
  }
);

// ─── Get Single Category ──────────────────────────────────────────────────────
export const getCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new AppError("Category not found.", 404));
    res.status(200).json({ success: true, data: { category } });
  }
);

// ─── Create Category ──────────────────────────────────────────────────────────
export const createCategory = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { name, description, parentCategory, isActive, sortOrder } = req.body;
    const slug = req.body.slug || slugify(name);

    let image: { public_id?: string; url?: string } = {};
    if (req.file) {
      const result = await new Promise<{ public_id: string; secure_url: string }>(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "fireworks/categories" },
            (error, result) => {
              if (error || !result) return reject(error);
              resolve(result as { public_id: string; secure_url: string });
            }
          );
          streamifier.createReadStream(req.file!.buffer).pipe(stream);
        }
      );
      image = { public_id: result.public_id, url: result.secure_url };
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image,
      parentCategory: parentCategory || null,
      isActive: isActive ?? true,
      sortOrder: sortOrder || 0,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: { category },
    });
  }
);

// ─── Update Category ──────────────────────────────────────────────────────────
export const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new AppError("Category not found.", 404));

    if (req.body.name && !req.body.slug) {
      req.body.slug = slugify(req.body.name);
    }

    if (req.file) {
      if (category.image?.public_id) {
        await cloudinary.uploader.destroy(category.image.public_id);
      }
      const result = await new Promise<{ public_id: string; secure_url: string }>(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "fireworks/categories" },
            (error, result) => {
              if (error || !result) return reject(error);
              resolve(result as { public_id: string; secure_url: string });
            }
          );
          streamifier.createReadStream(req.file!.buffer).pipe(stream);
        }
      );
      req.body.image = { public_id: result.public_id, url: result.secure_url };
    }

    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: { category: updated },
    });
  }
);

// ─── Delete Category ──────────────────────────────────────────────────────────
export const deleteCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new AppError("Category not found.", 404));

    const productCount = await Product.countDocuments({ category: req.params.id });
    if (productCount > 0) {
      return next(
        new AppError(
          `Cannot delete category with ${productCount} existing product(s). Reassign them first.`,
          400
        )
      );
    }

    if (category.image?.public_id) {
      await cloudinary.uploader.destroy(category.image.public_id);
    }

    await category.deleteOne();
    res.status(200).json({ success: true, message: "Category deleted successfully" });
  }
);
