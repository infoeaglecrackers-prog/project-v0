import mongoose, { Document, Schema, Model, Types } from "mongoose";

export type AddressType = "home" | "work" | "other";

export interface IAddress extends Document {
  user: Types.ObjectId;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
  type: AddressType;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      match: [/^[6-9]\d{9}$/, "Please provide a valid 10-digit mobile number"],
    },
    addressLine1: {
      type: String,
      required: [true, "Address line 1 is required"],
      trim: true,
    },
    addressLine2: { type: String, trim: true },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      match: [/^\d{6}$/, "Please provide a valid 6-digit pincode"],
    },
    country: { type: String, default: "India" },
    isDefault: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ["home", "work", "other"],
      default: "home",
    },
  },
  { timestamps: true }
);

AddressSchema.index({ user: 1 });

const Address: Model<IAddress> = mongoose.model<IAddress>(
  "Address",
  AddressSchema
);
export default Address;
