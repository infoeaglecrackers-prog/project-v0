import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface IProductImage {
  public_id: string;
  url: string;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  safetyInstructions?: string;
  price: number;
  discountPrice?: number;
  discountPercent?: number;
  gst: number;
  stock: number;
  sold: number;
  sku?: string;
  category: Types.ObjectId;
  brand?: string;
  images: IProductImage[];
  ratings: number;
  numReviews: number;
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
  weight?: string;
  dimensions?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [10, "Description must be at least 10 characters"],
    },
    safetyInstructions: { type: String },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    discountPrice: {
      type: Number,
      min: [0, "Discount price cannot be negative"],
    },
    discountPercent: {
      type: Number,
      min: [0, "Discount percent cannot be negative"],
      max: [99, "Discount percent cannot exceed 99"],
    },
    gst: { type: Number, default: 18 },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    sold: { type: Number, default: 0 },
    sku: { type: String, unique: true, sparse: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    brand: { type: String, trim: true },
    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String, lowercase: true, trim: true }],
    weight: { type: String },
    dimensions: { type: String },
  },
  { timestamps: true }
);

// ─── Indexes ─────────────────────────────────────────────────────────────────
ProductSchema.index({ name: "text", description: "text", tags: "text" });
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ price: 1, ratings: -1 });
ProductSchema.index({ isFeatured: 1, isActive: 1 });
ProductSchema.index({ sold: -1 });

const Product: Model<IProduct> = mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
