import mongoose, { Document, Schema, Model } from "mongoose";

export interface IPromo extends Document {
  code: string;
  discountPercent: number;
  isActive: boolean;
  expiresAt?: Date;
  minOrderValue: number;
  usageLimit?: number;
  usedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PromoSchema = new Schema<IPromo>(
  {
    code: {
      type: String,
      required: [true, "Promo code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: [3, "Code must be at least 3 characters"],
      maxlength: [20, "Code cannot exceed 20 characters"],
    },
    discountPercent: {
      type: Number,
      required: [true, "Discount percent is required"],
      min: [1, "Discount must be at least 1%"],
      max: [90, "Discount cannot exceed 90%"],
    },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date },
    minOrderValue: { type: Number, default: 0, min: 0 },
    usageLimit: { type: Number, min: 1 },
    usedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PromoSchema.index({ code: 1 });

const Promo: Model<IPromo> = mongoose.model<IPromo>("Promo", PromoSchema);
export default Promo;
