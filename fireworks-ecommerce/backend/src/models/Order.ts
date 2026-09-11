import mongoose, { Document, Schema, Model, Types } from "mongoose";

export type OrderStatus =
  | "Pending"
  | "AwaitingPayment"
  /** Customer submitted a UTR; an admin must match it against the bank statement. */
  | "AwaitingVerification"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Refunded";

/** `submitted` = customer claims they paid, not yet confirmed by an admin. */
export type PaymentStatus = "pending" | "submitted" | "paid" | "failed" | "refunded";

/**
 * `upi` is the self-hosted deep-link/QR rail. `razorpay` and `cod` are retained
 * for historical orders and are only selectable when PAYMENTS_RAZORPAY_ENABLED
 * is set — see config/features.ts.
 */
export type PaymentMethod = "upi" | "pay_later" | "razorpay" | "cod";

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  image?: string;
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

  // ── Self-hosted UPI rail ──
  /** The VPA the payer was asked to send to, snapshotted for audit. */
  upiVpa?: string;
  /** Order reference embedded in the UPI intent (`tn`/`tr`). */
  upiRefId?: string;
  /** 12-digit bank reference the customer says they paid with. Unverified. */
  utr?: string;
  utrSubmittedAt?: Date;
  /** Admin who confirmed the credit against the bank statement. */
  verifiedBy?: Types.ObjectId;
  verifiedAt?: Date;
  /** Why an admin sent the claim back, shown to the customer. */
  rejectionReason?: string;

  // ── Legacy Razorpay fields, kept so existing orders still render invoices ──
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
  paymentDueDate?: Date;
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
        image: { type: String },
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
        enum: ["upi", "pay_later", "razorpay", "cod"],
        required: [true, "Payment method is required"],
      },
      upiVpa: { type: String },
      upiRefId: { type: String },
      utr: { type: String, trim: true },
      utrSubmittedAt: { type: Date },
      verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
      verifiedAt: { type: Date },
      rejectionReason: { type: String },
      razorpay_order_id: { type: String },
      razorpay_payment_id: { type: String },
      razorpay_signature: { type: String },
      status: {
        type: String,
        enum: ["pending", "submitted", "paid", "failed", "refunded"],
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
      enum: ["Pending", "AwaitingPayment", "AwaitingVerification", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"],
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
    paymentDueDate: { type: Date },
  },
  { timestamps: true }
);

OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ orderStatus: 1 });

// A UTR identifies exactly one real bank transfer, so it may back exactly one
// order. Without this a customer could pay once and claim the same reference
// against several orders. Sparse so the vast majority of orders (no UTR yet,
// plus every legacy Razorpay/COD order) don't collide on null.
OrderSchema.index({ "paymentInfo.utr": 1 }, { unique: true, sparse: true });

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", OrderSchema);
export default Order;
