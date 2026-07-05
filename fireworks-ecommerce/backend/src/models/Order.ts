import mongoose, { Document, Schema, Model, Types } from "mongoose";

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod = "razorpay" | "cod";

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface IPaymentInfo {
  method: PaymentMethod;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  status: PaymentStatus;
  paidAt?: Date;
}

export interface IStatusHistory {
  status: OrderStatus;
  updatedAt: Date;
  note?: string;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentInfo: IPaymentInfo;
  itemsPrice: number;
  promoCode?: string;
  discountAmount: number;
  taxAmount: number;
  shippingPrice: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  statusHistory: IStatusHistory[];
  trackingNumber?: string;
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  invoiceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    orderItems: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: "India" },
    },
    paymentInfo: {
      method: {
        type: String,
        enum: ["razorpay", "cod"],
        required: [true, "Payment method is required"],
      },
      razorpay_order_id: { type: String },
      razorpay_payment_id: { type: String },
      razorpay_signature: { type: String },
      status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending",
      },
      paidAt: { type: Date },
    },
    itemsPrice: { type: Number, required: true },
    promoCode: { type: String },
    discountAmount: { type: Number, default: 0 },
    taxAmount: { type: Number, required: true },
    shippingPrice: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"],
      default: "Pending",
    },
    statusHistory: [
      {
        status: { type: String },
        updatedAt: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
    trackingNumber: { type: String },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
    cancelReason: { type: String },
    invoiceUrl: { type: String },
  },
  { timestamps: true }
);

OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ orderStatus: 1 });

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", OrderSchema);
export default Order;
