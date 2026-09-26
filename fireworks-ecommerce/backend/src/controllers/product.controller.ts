import { Request, Response, NextFunction } from "express";
import streamifier from "streamifier";
import Product from "../models/Product";
import cloudinary from "../config/cloudinary";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";
import ApiFeatures from "../utils/apiFeatures";
import { invalidateProductCache } from "../utils/cache";

const PRODUCTS_PER_PAGE = 12;

type ProductImageInput = {
  public_id: string;
  url: string;
  alt: string;
};

const parseJsonField = <T>(value: unknown, fallback: T): T => {
  if (typeof value !== "string" || !value.trim()) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const normalizeImageAltTexts = (value: unknown, count: number, fallbackName: string): string[] => {
  const parsed = Array.isArray(value)
    ? value
    : parseJsonField<unknown[]>(value, []);

  return Array.from({ length: count }, (_, index) => {
    const raw = typeof parsed[index] === "string" ? parsed[index] : "";
    const alt = raw.trim();
    return alt || `${fallbackName} image ${index + 1}`;
  });
};

const normalizeExistingImages = (
  currentImages: ProductImageInput[],
  value: unknown,
  fallbackName: string
): ProductImageInput[] => {
  const parsed = parseJsonField<Array<Partial<ProductImageInput>>>(value, []);
  if (!parsed.length) return currentImages;

  const altByPublicId = new Map(
    parsed
      .filter((image) => typeof image.public_id === "string")
      .map((image) => [image.public_id as string, (image.alt || "").trim()])
  );

  return currentImages.map((image, index) => ({
    ...image,
    alt: altByPublicId.get(image.public_id) || image.alt || `${fallbackName} image ${index + 1}`,
  }));
};

// If a discount % is given without an explicit original price, derive the
// original price from it so the existing price-vs-originalPrice discount
// badge (ProductCard/ProductDetailPage) reflects it automatically.
const applyDiscountPercent = (body: Record<string, unknown>) => {
  const price = Number(body.price);
  const discountPriceRaw = body.discountPrice ?? body.originalPrice;

  if (discountPriceRaw !== undefined && discountPriceRaw !== null && discountPriceRaw !== "") {
    const discountPrice = Number(discountPriceRaw);
    if (discountPrice > price && price > 0) {
      // MRP (discountPrice) is higher than Selling Price (price)
      body.discountPercent = Math.max(0, Math.round(((discountPrice - price) / discountPrice) * 100));
    } else {
      // Selling price >= discount price (or no valid discount) -> clear discount percent/price
      body.discountPercent = 0;
    }
    body.discountPrice = discountPrice;
    return;
  }

  // If no discountPrice/originalPrice was passed or empty, reset discountPercent to 0 or leave undefined
  if (body.discountPercent !== undefined) {
    const dp = Number(body.discountPercent);
    if (isNaN(dp) || dp < 0) {
      body.discountPercent = 0;
    }
  }
};

// ─── Get All Products ─────────────────────────────────────────────────────────
export const getProducts = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const limitQuery = req.query.limit !== undefined ? Number(req.query.limit) : PRODUCTS_PER_PAGE;
    const isUnlimited = limitQuery === 0 || limitQuery >= 10000;
    const pageSize = isUnlimited ? 10000 : limitQuery;

    const baseQuery = Product.find({ isActive: true }).populate("category", "name slug sortOrder");
    const features = new ApiFeatures(baseQuery, req.query)
      .search()
      .filter()
      .sort()
      .paginate(pageSize);

    const [products, total] = await Promise.all([
      features.query,
      Product.countDocuments({ isActive: true }),
    ]);

    // No JS re-sort here — ApiFeatures.sort() already sorts by price ascending
    // at the DB level by default (or by the explicit ?sort= param when given).

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: { products },
      pagination: {
        currentPage: Number(req.query.page) || 1,
        totalPages: Math.ceil(total / pageSize) || 1,
        totalProducts: total,
        limit: pageSize,
      },
    });
  }
);

// ─── Get Featured Products ───────────────────────────────────────────────────
export const getFeaturedProducts = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const limit = Number(req.query.limit) || 8;
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate("category", "name slug sortOrder")
      .limit(limit);
    
    // Sort by category sortOrder
    products.sort((a, b) => {
      const aCatOrder = (a.category as any)?.sortOrder ?? 999;
      const bCatOrder = (b.category as any)?.sortOrder ?? 999;
      if (aCatOrder !== bCatOrder) {
        return aCatOrder - bCatOrder;
      }
      return (a.name || "").localeCompare(b.name || "");
    });
    
    res.status(200).json({ success: true, data: { products } });
  }
);

// ─── Get Best Sellers ─────────────────────────────────────────────────────────
export const getBestSellers = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const limit = Number(req.query.limit) || 8;
    const products = await Product.find({ isActive: true })
      .populate("category", "name slug sortOrder")
      .sort("-sold")
      .limit(limit);
    res.status(200).json({ success: true, data: { products } });
  }
);

// ─── Get Single Product ───────────────────────────────────────────────────────
export const getProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id).populate("category", "name slug sortOrder");
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
    const imageAltTexts = normalizeImageAltTexts(req.body.imageAltTexts, files.length, String(req.body.name || "Product"));

    const uploadPromises = files.map(
      (file, index) =>
        new Promise<ProductImageInput>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "fireworks/products" },
            (error, result) => {
              if (error || !result) return reject(error);
              resolve({ public_id: result.public_id, url: result.secure_url, alt: imageAltTexts[index] });
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

    applyDiscountPercent(req.body);
    const product = await Product.create({ ...req.body, images, tags });

    await invalidateProductCache();

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

    product.images = normalizeExistingImages(
      product.images.map((image) => ({
        public_id: image.public_id,
        url: image.url,
        alt: image.alt,
      })),
      req.body.existingImages,
      String(req.body.name || product.name || "Product")
    );

    if (req.body.tags && typeof req.body.tags === "string") {
      req.body.tags = req.body.tags.split(",").map((t: string) => t.trim());
    }

    // If images were uploaded in the update request, upload them to Cloudinary
    const files = req.files as Express.Multer.File[] | undefined;
    if (files && files.length > 0) {
      const imageAltTexts = normalizeImageAltTexts(req.body.imageAltTexts, files.length, String(req.body.name || product.name || "Product"));
      const uploadPromises = files.map(
        (file, index) =>
          new Promise<ProductImageInput>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "fireworks/products" },
              (error, result) => {
                if (error || !result) return reject(error);
                resolve({ public_id: result.public_id, url: result.secure_url, alt: imageAltTexts[index] });
              }
            );
            streamifier.createReadStream(file.buffer).pipe(stream);
          })
      );

      const newImages = await Promise.all(uploadPromises);
      product.images.push(...newImages);
    }

    // Normalize tags and discount before applying updates
    if (req.body.tags && typeof req.body.tags === "string") {
      req.body.tags = req.body.tags.split(",").map((t: string) => t.trim());
    }

    applyDiscountPercent(req.body);

    // If description is provided as an empty string, treat it as deletion (remove the field)
    if (Object.prototype.hasOwnProperty.call(req.body, "description")) {
      const desc = req.body.description;
      if (desc === "" || desc === null) {
        // remove description from the incoming body and unset on document
        // @ts-ignore
        product.description = undefined;
        delete req.body.description;
      }
    }

    // Apply any provided fields onto the document and save
    Object.keys(req.body).forEach((key) => {
      // Avoid overwriting images array from the body if present; we manage images above
      if (["images", "imageAltTexts", "existingImages"].includes(key)) return;
      // @ts-ignore
      product[key] = req.body[key];
    });

    const saved = await product.save();
    await invalidateProductCache(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: { product: await saved.populate("category", "name slug") },
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
    await invalidateProductCache(req.params.id);
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

    const imageAltTexts = normalizeImageAltTexts(req.body.imageAltTexts, files.length, product.name || "Product");

    const uploadPromises = files.map(
      (file, index) =>
        new Promise<ProductImageInput>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "fireworks/products" },
            (error, result) => {
              if (error || !result) return reject(error);
              resolve({ public_id: result.public_id, url: result.secure_url, alt: imageAltTexts[index] });
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        })
    );

    const newImages = await Promise.all(uploadPromises);
    product.images.push(...newImages);
    await product.save();
    await invalidateProductCache(req.params.id);

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

    // Express wildcard route puts everything after /images/ into req.params[0] or req.params.publicId
    const targetPublicId = req.params[0] || req.params.publicId;

    const imgIndex = product.images.findIndex(
      (img) => img.public_id === targetPublicId
    );
    if (imgIndex === -1) return next(new AppError("Image not found.", 404));

    await cloudinary.uploader.destroy(targetPublicId);
    product.images.splice(imgIndex, 1);
    await product.save();
    await invalidateProductCache(req.params.id);

    res.status(200).json({ success: true, message: "Image deleted successfully" });
  }
);
