# 🔬 Low Level Design (LLD)
## Fireworks & Crackers E-Commerce — MERN Stack

---

## 1. React Component Tree

```
<App>
 ├── <BrowserRouter>
 │    ├── <Navbar />                   ← Logo, Search, Cart Icon, Login/Profile
 │    ├── <Routes>
 │    │    ├── "/" → <HomePage />
 │    │    │    ├── <HeroBanner />     ← Slider with festive offers
 │    │    │    ├── <CategoryGrid />   ← Icons: Sparklers, Aerial, Ground...
 │    │    │    ├── <FeaturedProducts />
 │    │    │    ├── <OfferBanner />
 │    │    │    ├── <BestSellers />
 │    │    │    └── <NewsletterSignup />
 │    │    │
 │    │    ├── "/products" → <ProductListPage />
 │    │    │    ├── <FilterSidebar />  ← Category, Price, Brand, Rating
 │    │    │    ├── <SortDropdown />
 │    │    │    ├── <ProductGrid />
 │    │    │    │    └── <ProductCard /> (repeated)
 │    │    │    └── <Pagination />
 │    │    │
 │    │    ├── "/products/:id" → <ProductDetailPage />
 │    │    │    ├── <ImageGallery />
 │    │    │    ├── <ProductInfo />    ← Name, Price, Discount, Stock
 │    │    │    ├── <QuantitySelector />
 │    │    │    ├── <AddToCartBtn />
 │    │    │    ├── <WishlistBtn />
 │    │    │    ├── <ProductTabs />    ← Description, Safety, Reviews
 │    │    │    └── <RelatedProducts />
 │    │    │
 │    │    ├── "/cart" → <CartPage />
 │    │    │    ├── <CartItemList />
 │    │    │    │    └── <CartItem /> (repeated)
 │    │    │    └── <OrderSummary />
 │    │    │
 │    │    ├── "/checkout" → <CheckoutPage /> [Protected]
 │    │    │    ├── <AddressForm />
 │    │    │    ├── <AddressList />
 │    │    │    ├── <PaymentOptions />
 │    │    │    └── <OrderReview />
 │    │    │
 │    │    ├── "/orders" → <OrdersPage /> [Protected]
 │    │    │    └── <OrderCard /> (repeated)
 │    │    │
 │    │    ├── "/orders/:id" → <OrderDetailPage /> [Protected]
 │    │    │    ├── <OrderTimeline />
 │    │    │    ├── <OrderItemList />
 │    │    │    └── <InvoiceDownload />
 │    │    │
 │    │    ├── "/profile" → <ProfilePage /> [Protected]
 │    │    │    ├── <PersonalInfo />
 │    │    │    ├── <AddressManager />
 │    │    │    └── <ChangePassword />
 │    │    │
 │    │    ├── "/wishlist" → <WishlistPage /> [Protected]
 │    │    │
 │    │    ├── "/login" → <LoginPage />
 │    │    ├── "/register" → <RegisterPage />
 │    │    ├── "/forgot-password" → <ForgotPasswordPage />
 │    │    │
 │    │    └── "/admin/*" → <AdminLayout /> [Admin Only]
 │    │         ├── <AdminDashboard />
 │    │         ├── <AdminProducts />
 │    │         ├── <AdminOrders />
 │    │         ├── <AdminUsers />
 │    │         └── <AdminCategories />
 │    │
 │    └── <Footer />
```

---

## 2. Redux Store Structure

```javascript
store/
├── slices/
│   ├── authSlice.js
│   │    State: { user, token, isLoggedIn, loading, error }
│   │    Actions: login, logout, register, loadUser
│   │
│   ├── productSlice.js
│   │    State: { products[], product, loading, error, filters, pagination }
│   │    Actions: fetchProducts, fetchProduct, setFilters
│   │
│   ├── cartSlice.js
│   │    State: { items[], totalItems, totalPrice, loading }
│   │    Actions: addToCart, removeFromCart, updateQty, clearCart, syncCart
│   │
│   ├── wishlistSlice.js
│   │    State: { items[] }
│   │    Actions: addToWishlist, removeFromWishlist
│   │
│   ├── orderSlice.js
│   │    State: { orders[], order, loading, error }
│   │    Actions: placeOrder, fetchOrders, fetchOrderById
│   │
│   └── adminSlice.js
│        State: { stats, users[], orders[], products[] }
│        Actions: fetchDashboardStats, manageProducts, manageOrders
```

---

## 3. Backend Folder Structure (Express.js)

```
backend/
├── server.js                  ← Entry point
├── config/
│   ├── db.js                  ← MongoDB connection
│   └── cloudinary.js          ← Cloudinary config
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Order.js
│   ├── Cart.js
│   ├── Wishlist.js
│   ├── Review.js
│   └── Address.js
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── product.routes.js
│   ├── category.routes.js
│   ├── cart.routes.js
│   ├── wishlist.routes.js
│   ├── order.routes.js
│   ├── payment.routes.js
│   └── admin.routes.js
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── product.controller.js
│   ├── category.controller.js
│   ├── cart.controller.js
│   ├── wishlist.controller.js
│   ├── order.controller.js
│   ├── payment.controller.js
│   └── admin.controller.js
├── middlewares/
│   ├── auth.middleware.js      ← JWT verification
│   ├── admin.middleware.js     ← Admin role check
│   ├── error.middleware.js     ← Global error handler
│   ├── upload.middleware.js    ← Multer + Cloudinary
│   └── validate.middleware.js ← Input validation
├── utils/
│   ├── generateToken.js
│   ├── sendEmail.js
│   ├── razorpay.js
│   └── apiFeatures.js         ← Search, filter, pagination
└── .env
```

---

## 4. Authentication Flow (JWT)

```
[Register]
User sends: { name, email, password }
           │
           ▼
Hash password (bcrypt, salt=12)
           │
           ▼
Save User to MongoDB
           │
           ▼
Generate Access Token (15min) + Refresh Token (7days)
           │
           ▼
Send tokens in response (Access in body, Refresh in httpOnly Cookie)

─────────────────────────────────────────────

[Login]
User sends: { email, password }
           │
           ▼
Find user by email
           │
           ▼
Compare password (bcrypt.compare)
           │
           ▼
Generate new Access + Refresh Token
           │
           ▼
Return tokens

─────────────────────────────────────────────

[Protected Route]
Request hits backend
           │
           ▼
auth.middleware.js checks Authorization header
           │
           ▼
Verify JWT: jwt.verify(token, JWT_SECRET)
           │
           ▼
Attach user to req.user
           │
           ▼
Proceed to controller
```

---

## 5. Payment Flow (Razorpay)

```
Frontend                              Backend                        Razorpay
   │                                     │                              │
   │── POST /api/payment/create-order ──►│                              │
   │                                     │── Create Order (amount) ───►│
   │                                     │◄── orderId ─────────────────│
   │◄── { orderId, amount, currency } ───│                              │
   │                                     │                              │
   │── Open Razorpay Checkout ──────────────────────────────────────► │
   │◄── Payment Done (paymentId, orderId, signature) ─────────────── │
   │                                     │                              │
   │── POST /api/payment/verify ────────►│                              │
   │                               Verify HMAC Signature               │
   │                               Create Order in DB                  │
   │                               Clear Cart                          │
   │                               Send Email                          │
   │◄── { success, orderId } ────────────│                              │
```

---

## 6. Product Search, Filter & Pagination Logic

```javascript
// utils/apiFeatures.js
class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? { name: { $regex: this.queryStr.keyword, $options: "i" } }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    const removeFields = ["keyword", "page", "limit", "sort"];
    removeFields.forEach((k) => delete queryCopy[k]);

    // Handle price range: ?price[gte]=100&price[lte]=5000
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      this.query = this.query.sort(this.queryStr.sort.split(",").join(" "));
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  paginate(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}
```

---

## 7. Key UI Component Designs

### ProductCard Component
```
┌─────────────────────────────┐
│   [Product Image]           │
│   ❤️  (Wishlist icon, top-right)│
├─────────────────────────────┤
│  Product Name               │
│  ⭐⭐⭐⭐☆  (4.2)  128 reviews  │
│  ~~₹500~~  ₹349  (30% OFF) │
│  [Add to Cart]   [Buy Now]  │
└─────────────────────────────┘
```

### CartItem Component
```
┌──────────────────────────────────────────────┐
│ [Image] │ Product Name             │ ₹349     │
│         │ Category: Aerial Shots   │ [- 2 +]  │
│         │ Stock: In Stock          │ [Remove] │
└──────────────────────────────────────────────┘
```

### Order Timeline Component
```
● Order Placed       Feb 25, 2026
│
● Processing         Feb 26, 2026
│
○ Shipped            (Pending)
│
○ Delivered          (Pending)
```

---

## 8. Email Templates (Nodemailer)

| Trigger                | Template                            |
|------------------------|-------------------------------------|
| User Registration      | Welcome email with name             |
| Order Placed           | Order summary + items + total       |
| Order Shipped          | Tracking info + expected delivery   |
| Order Delivered        | Thank you + Review prompt           |
| Forgot Password        | Reset password link (OTP)           |
| Admin: Low Stock       | Product name + current stock count  |

---

## 9. Error Handling Strategy

```javascript
// middlewares/error.middleware.js
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose: Invalid ObjectId
  if (err.name === "CastError") {
    message = `Resource not found. Invalid: ${err.path}`;
    statusCode = 404;
  }

  // Mongoose: Duplicate key
  if (err.code === 11000) {
    message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    statusCode = 400;
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    message = "Invalid token. Please login again.";
    statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    message = "Token expired. Please login again.";
    statusCode = 401;
  }

  res.status(statusCode).json({ success: false, message });
};
```

---

## 10. Environment Variables (.env)

```env
# Server
PORT=5000
NODE_ENV=production

# MongoDB
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/fireworks

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxxx
RAZORPAY_KEY_SECRET=your_secret

# Email (Nodemailer / Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=youremail@gmail.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=noreply@yourstore.com
FROM_NAME=Fireworks Store

# Frontend URL (for CORS)
CLIENT_URL=https://www.yourfireworksstore.com
```

---

> ➡️ See [architecture/database-schema.md](architecture/database-schema.md) for detailed MongoDB schema.
> ➡️ See [architecture/api-design.md](architecture/api-design.md) for all API endpoints.
