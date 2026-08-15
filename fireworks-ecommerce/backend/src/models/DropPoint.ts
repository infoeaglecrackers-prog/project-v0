import mongoose, { Document, Schema, Model } from "mongoose";

export interface IDropPoint extends Document {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  contactPhone?: string;
  workingHours?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DropPointSchema = new Schema<IDropPoint>(
  {
    name: { type: String, required: [true, "Drop point name is required"], trim: true },
    addressLine1: { type: String, required: [true, "Address line 1 is required"] },
    addressLine2: { type: String },
    city: { type: String, required: [true, "City is required"] },
    state: { type: String, required: [true, "State is required"] },
    pincode: { type: String, required: [true, "Pincode is required"] },
    landmark: { type: String },
    contactPhone: { type: String },
    workingHours: { type: String, default: "Mon–Sat, 9 AM – 6 PM" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const DropPoint: Model<IDropPoint> = mongoose.model<IDropPoint>("DropPoint", DropPointSchema);
export default DropPoint;
