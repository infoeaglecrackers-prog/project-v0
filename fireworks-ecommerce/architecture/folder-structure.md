# 📁 Complete Folder Structure
## Fireworks & Crackers E-Commerce — MERN Stack

---

## Frontend (React.js)

```
frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── robots.txt
│
├── src/
│   ├── index.js                      ← Entry point
│   ├── App.js                        ← Routes setup
│   │
│   ├── assets/
│   │   ├── images/
│   │   │   ├── logo.png
│   │   │   ├── hero-banner.jpg
│   │   │   └── placeholder.png
│   │   └── icons/
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── common/
│   │   │   ├── Loader.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── StarRating.jsx
│   │   │   ├── ImageCarousel.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Badge.jsx
│   │   │   └── ConfirmDialog.jsx
│   │   │
│   │   ├── product/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductImageGallery.jsx
│   │   │   ├── ProductInfo.jsx
│   │   │   ├── ProductTabs.jsx
│   │   │   ├── RelatedProducts.jsx
│   │   │   ├── FilterSidebar.jsx
│   │   │   ├── SortDropdown.jsx
│   │   │   └── ReviewCard.jsx
│   │   │
│   │   ├── cart/
│   │   │   ├── CartItem.jsx
│   │   │   ├── CartSummary.jsx
│   │   │   └── EmptyCart.jsx
│   │   │
│   │   ├── checkout/
│   │   │   ├── AddressForm.jsx
│   │   │   ├── AddressList.jsx
│   │   │   ├── PaymentOptions.jsx
│   │   │   └── OrderReview.jsx
│   │   │
│   │   ├── order/
│   │   │   ├── OrderCard.jsx
│   │   │   ├── OrderTimeline.jsx
│   │   │   └── OrderItemList.jsx
│   │   │
│   │   └── admin/
│   │       ├── DashboardStats.jsx
│   │       ├── RevenueChart.jsx
│   │       ├── ProductForm.jsx
│   │       ├── OrderTable.jsx
│   │       └── UserTable.jsx
│   │
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ProductListPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── OrderDetailPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── WishlistPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── ResetPasswordPage.jsx
│   │   ├── NotFoundPage.jsx
│   │   │
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminProducts.jsx
│   │       ├── AdminAddProduct.jsx
│   │       ├── AdminEditProduct.jsx
│   │       ├── AdminOrders.jsx
│   │       ├── AdminOrderDetail.jsx
│   │       ├── AdminUsers.jsx
│   │       └── AdminCategories.jsx
│   │
│   ├── store/
│   │   ├── index.js                  ← Redux store config
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── productSlice.js
│   │       ├── cartSlice.js
│   │       ├── wishlistSlice.js
│   │       ├── orderSlice.js
│   │       └── adminSlice.js
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   ├── useDebounce.js
│   │   └── useLocalStorage.js
│   │
│   ├── services/
│   │   ├── api.js                    ← Axios instance + interceptors
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── cartService.js
│   │   ├── orderService.js
│   │   └── paymentService.js
│   │
│   ├── utils/
│   │   ├── formatCurrency.js
│   │   ├── formatDate.js
│   │   ├── validateForm.js
│   │   └── constants.js
│   │
│   └── styles/
│       ├── index.css                 ← Tailwind base
│       └── custom.css
│
├── .env
├── .env.example
├── package.json
├── tailwind.config.js
└── vite.config.js                    (or react-scripts if CRA)
```

---

## Backend (Node.js + Express.js)

```
backend/
├── server.js                         ← Express app entry
├── app.js                            ← App config (middleware, routes)
│
├── config/
│   ├── db.js                         ← MongoDB Atlas connection
│   └── cloudinary.js                 ← Cloudinary init
│
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Order.js
│   ├── Cart.js
│   ├── Wishlist.js
│   ├── Review.js
│   └── Address.js
│
├── routes/
│   ├── index.js                      ← Combine all routes
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── product.routes.js
│   ├── category.routes.js
│   ├── cart.routes.js
│   ├── wishlist.routes.js
│   ├── order.routes.js
│   ├── payment.routes.js
│   ├── review.routes.js
│   ├── address.routes.js
│   └── admin.routes.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── product.controller.js
│   ├── category.controller.js
│   ├── cart.controller.js
│   ├── wishlist.controller.js
│   ├── order.controller.js
│   ├── payment.controller.js
│   ├── review.controller.js
│   ├── address.controller.js
│   └── admin.controller.js
│
├── middlewares/
│   ├── auth.middleware.js            ← JWT check
│   ├── admin.middleware.js           ← Admin role check
│   ├── error.middleware.js           ← Global error handler
│   ├── upload.middleware.js          ← Multer + Cloudinary
│   ├── validate.middleware.js        ← Input validation
│   └── rateLimiter.middleware.js     ← express-rate-limit
│
├── utils/
│   ├── generateToken.js
│   ├── sendEmail.js
│   ├── razorpay.js
│   ├── apiFeatures.js               ← Search/Filter/Paginate
│   ├── catchAsync.js                ← Async error wrapper
│   └── AppError.js                  ← Custom error class
│
├── templates/
│   ├── orderConfirmEmail.html
│   ├── shippingEmail.html
│   ├── deliveryEmail.html
│   └── resetPasswordEmail.html
│
├── .env
├── .env.example
├── .gitignore
└── package.json
```

---

## Root (Monorepo or Separate Repos)

```
fireworks-store/
├── frontend/         ← React App
├── backend/          ← Node/Express API
├── .gitignore
└── README.md
```

---

## Package.json Scripts

### Frontend
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Backend
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node seeder.js"
  }
}
```

---

> ➡️ See [../WORKFLOW.md](../WORKFLOW.md) for the complete Figma → Dev → Deployment → Domain workflow.
