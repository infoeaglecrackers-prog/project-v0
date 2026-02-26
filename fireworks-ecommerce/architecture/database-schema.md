# 🗄️ Database Schema — MongoDB Collections
## Fireworks & Crackers E-Commerce

---

## 1. Users Collection

```javascript
// models/User.js
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 8, select: false },
    phone: { type: String },
    avatar: {
      public_id: { type: String },
      url: { type: String, default: "https://cdn.../default-avatar.png" },
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    refreshToken: { type: String, select: false },
  },
  { timestamps: true }
);
```

---

## 2. Products Collection

```javascript
// models/Product.js
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    safetyInstructions: { type: String },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    discountPercent: { type: Number },
    gst: { type: Number, default: 18 },          // GST %
    stock: { type: Number, required: true, default: 0 },
    sold: { type: Number, default: 0 },
    sku: { type: String, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: String },
    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    tags: [String],                               // ["diwali", "sparklers"]
    weight: { type: String },                     // "200g"
    dimensions: { type: String },
  },
  { timestamps: true }
);

// Index for search
ProductSchema.index({ name: "text", description: "text", tags: "text" });
```

---

## 3. Categories Collection

```javascript
// models/Category.js
const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },  // "Sparklers"
    slug: { type: String, required: true, unique: true },  // "sparklers"
    description: { type: String },
    image: {
      public_id: String,
      url: String,
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);
```

**Example Categories:**
| Category       | Sub Category               |
|----------------|----------------------------|
| Ground Crackers| Flower Pots, Chakkar, Bijli|
| Aerial Shots   | Single Shot, Multi Shot    |
| Sparklers      | Color, Gold, Silver        |
| Gift Boxes     | Deluxe Box, Economy Box    |
| Rockets        | Whistling, Color Rockets   |
| Sound Crackers | Atom Bomb, Laxmi Bomb      |

---

## 4. Orders Collection

```javascript
// models/Order.js
const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: String,
        image: String,
        price: Number,
        quantity: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      fullName: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: "India" },
    },
    paymentInfo: {
      method: { type: String, enum: ["razorpay", "cod"], required: true },
      razorpay_order_id: String,
      razorpay_payment_id: String,
      razorpay_signature: String,
      status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending",
      },
      paidAt: Date,
    },
    itemsPrice: { type: Number, required: true },
    taxAmount: { type: Number, required: true },       // GST
    shippingPrice: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"],
      default: "Pending",
    },
    statusHistory: [
      {
        status: String,
        updatedAt: { type: Date, default: Date.now },
        note: String,
      },
    ],
    trackingNumber: String,
    deliveredAt: Date,
    cancelledAt: Date,
    cancelReason: String,
    invoiceUrl: String,
  },
  { timestamps: true }
);
```

---

## 5. Cart Collection

```javascript
// models/Cart.js
const CartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1, min: 1 },
        price: Number,            // snapshot price at time of adding
      },
    ],
    totalItems: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);
```

---

## 6. Wishlist Collection

```javascript
// models/Wishlist.js
const WishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    products: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    ],
  },
  { timestamps: true }
);
```

---

## 7. Reviews Collection

```javascript
// models/Review.js
const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String },
    comment: { type: String, required: true },
    images: [String],                              // Uploaded review images
    isVerifiedPurchase: { type: Boolean, default: false },
    helpfulVotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// One review per user per product
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });
```

---

## 8. Addresses Collection

```javascript
// models/Address.js
const AddressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" },
    isDefault: { type: Boolean, default: false },
    type: { type: String, enum: ["home", "work", "other"], default: "home" },
  },
  { timestamps: true }
);
```

---

## 9. Collection Relationships

```
Users ──────────────────────► Orders (1 user → many orders)
Users ──────────────────────► Cart   (1 user → 1 cart)
Users ──────────────────────► Wishlist (1 user → 1 wishlist)
Users ──────────────────────► Reviews (1 user → many reviews)
Users ──────────────────────► Addresses (1 user → many addresses)
Products ───────────────────► Category (many products → 1 category)
Products ───────────────────► Reviews  (1 product → many reviews)
Orders ─────────────────────► Products (many products per order)
```

---

> ➡️ See [api-design.md](api-design.md) for complete REST API reference.
