// ─── Promo ────────────────────────────────────────────────────────────────────
export interface IPromo {
  _id: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
  expiresAt?: string;
  minOrderValue: number;
  usageLimit?: number;
  usedCount: number;
  createdAt: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────
export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: { url: string; public_id?: string };
  role: "user" | "admin";
  isVerified: boolean;
  phoneVerified?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface IPagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  limit: number;
}

export interface IUsersResponse {
  users: IUser[];
  pagination?: IPagination;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface IAuthState {
  user: IUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

// ─── Category ─────────────────────────────────────────────────────────────────
export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: { url: string };
  isActive: boolean;
  sortOrder: number;
}

// ─── Product ──────────────────────────────────────────────────────────────────
export interface IProductImage {
  public_id: string;
  url: string;
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  safetyInstructions?: string;
  price: number;
  discountPrice?: number;
  discountPercent?: number;
  /** alias kept for UI compatibility */
  originalPrice?: number;
  gst: number;
  stock: number;
  sold: number;
  sku?: string;
  category: ICategory | string;
  brand?: string;
  images: IProductImage[];
  ratings: number;
  numReviews: number;
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
  specifications?: { key: string; value: string }[];
  weight?: string;
  dimensions?: string;
  createdAt: string;
}

// ─── Review ───────────────────────────────────────────────────────────────────
export interface IReview {
  _id: string;
  user: string | { _id: string; name: string; avatar?: { url: string } };
  name: string;
  product: string;
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  createdAt?: string;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export interface ICartItem {
  product: IProduct;
  quantity: number;
  price: number;
}

export interface ICart {
  _id: string;
  user: string;
  items: ICartItem[];
  totalItems: number;
  totalPrice: number;
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────
export interface IWishlist {
  _id: string;
  user: string;
  products: IProduct[];
}

// ─── Address ──────────────────────────────────────────────────────────────────
export interface IAddress {
  _id: string;
  user: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
  type: "home" | "work" | "other";
  addressType?: "home" | "work" | "other";
}

// ─── Order ────────────────────────────────────────────────────────────────────
export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Refunded";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod = "razorpay" | "cod";

export interface IOrderItem {
  _id?: string;
  product: string | IProduct;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface IOrder {
  _id: string;
  user: string | IUser;
  orderItems: IOrderItem[];
  /** alias for orderItems used in UI */
  items: IOrderItem[];
  shippingAddress: IAddress | Omit<IAddress, "_id" | "user" | "isDefault" | "type">;
  paymentInfo: {
    method: PaymentMethod;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    status: PaymentStatus;
    paidAt?: string;
  };
  /** convenience alias */
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  itemsPrice: number;
  taxAmount: number;
  taxPrice: number;
  shippingPrice: number;
  totalAmount: number;
  orderStatus: string;
  statusHistory: { status: OrderStatus; updatedAt: string; note?: string }[];
  trackingNumber?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  createdAt: string;
}

// ─── API Response ─────────────────────────────────────────────────────────────
export interface IApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: { field: string; message: string }[];
}

export interface IPaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

// ─── Filters ──────────────────────────────────────────────────────────────────
export interface IProductFilters {
  keyword?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  ratings?: number;
  sort?: string;
  page?: number;
  limit?: number;
  inStock?: boolean;
}

// ─── Admin ────────────────────────────────────────────────────────────────────
export interface IAdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  lowStockProducts: number;
}

export interface IDashboardResponse {
  stats: IAdminStats;
  recentOrders: IOrder[];
  topProducts: IProduct[];
}
