# 📋 Project Summary
## Fireworks & Crackers E-Commerce — MERN Stack

---

## 📁 Repository Structure

```
fireworks-ecommerce/
├── README.md                          ← Project overview & quick start
├── HLD.md                             ← High Level Design (architecture, modules, data flow)
├── LLD.md                             ← Low Level Design (components, Redux, code patterns)
├── WORKFLOW.md                        ← Full flow: Figma → Dev → Deploy → Domain → Go Live
├── architecture/
│   ├── database-schema.md             ← MongoDB collections & Mongoose schemas
│   ├── api-design.md                  ← All REST API endpoints (60+ routes)
│   └── folder-structure.md            ← Frontend & Backend folder structure
└── deployment/
    ├── deployment-guide.md            ← MongoDB Atlas, Cloudinary, Render, Vercel setup
    └── domain-setup.md                ← Domain, Cloudflare CDN, DNS, SSL setup
```

---

## 🚀 Tech Stack at a Glance

| Layer         | Technology                              |
|---------------|-----------------------------------------|
| Frontend      | React.js (Vite) + Redux Toolkit + Tailwind CSS |
| Backend       | Node.js + Express.js                    |
| Database      | MongoDB Atlas (Cloud)                   |
| Auth          | JWT (Access + Refresh Token)            |
| Payment       | Razorpay                                |
| Image Storage | Cloudinary                              |
| Email         | Nodemailer (Gmail SMTP)                 |
| Frontend Host | Vercel                                  |
| Backend Host  | Render / Railway                        |
| CDN + DNS     | Cloudflare                              |
| Domain        | Namecheap / GoDaddy                     |

---

## 🗂️ Frontend Folder Summary

```
frontend/src/
├── assets/          → Images, icons
├── components/
│   ├── layout/      → Navbar, Footer, ProtectedRoute, AdminLayout
│   ├── common/      → Loader, Pagination, Modal, StarRating, Badge
│   ├── product/     → ProductCard, FilterSidebar, ImageGallery, ReviewCard
│   ├── cart/        → CartItem, CartSummary, EmptyCart
│   ├── checkout/    → AddressForm, PaymentOptions, OrderReview
│   ├── order/       → OrderCard, OrderTimeline, OrderItemList
│   └── admin/       → DashboardStats, RevenueChart, ProductForm, Tables
├── pages/
│   ├── (public)     → Home, ProductList, ProductDetail, Login, Register
│   ├── (private)    → Cart, Checkout, Orders, Profile, Wishlist
│   └── admin/       → Dashboard, Products, Orders, Users, Categories
├── store/slices/    → authSlice, productSlice, cartSlice, wishlistSlice, orderSlice
├── services/        → api.js (Axios), authService, productService, orderService
├── hooks/           → useAuth, useCart, useDebounce, useLocalStorage
└── utils/           → formatCurrency, formatDate, validateForm, constants
```

---

## 🗂️ Backend Folder Summary

```
backend/
├── config/          → db.js (MongoDB), cloudinary.js
├── models/          → User, Product, Category, Order, Cart, Wishlist, Review, Address
├── routes/          → auth, user, product, category, cart, wishlist, order, payment, review, address, admin
├── controllers/     → Business logic for all routes
├── middlewares/     → auth (JWT), admin (RBAC), error, upload (Multer), validate, rateLimiter
├── utils/           → generateToken, sendEmail, razorpay, apiFeatures, catchAsync, AppError
└── templates/       → Email HTML templates (order, shipping, delivery, reset)
```

---

## 🗄️ Database Collections

| Collection  | Key Fields                                      |
|-------------|-------------------------------------------------|
| users       | name, email, password, role, avatar, refreshToken |
| products    | name, price, discountPrice, stock, category, images, ratings |
| categories  | name, slug, image, parentCategory               |
| orders      | user, orderItems, shippingAddress, paymentInfo, orderStatus |
| cart        | user, items[ {product, quantity, price} ]       |
| wishlist    | user, products[]                                |
| reviews     | user, product, rating, comment, isVerifiedPurchase |
| addresses   | user, fullName, phone, city, state, pincode, isDefault |

---

## 🔌 API Routes Summary

| Module      | Base Path        | # Endpoints |
|-------------|------------------|-------------|
| Auth        | /api/auth        | 7           |
| Users       | /api/users       | 4           |
| Products    | /api/products    | 10          |
| Categories  | /api/categories  | 5           |
| Cart        | /api/cart        | 5           |
| Wishlist    | /api/wishlist    | 2           |
| Orders      | /api/orders      | 5           |
| Payment     | /api/payment     | 3           |
| Reviews     | /api/reviews     | 4           |
| Addresses   | /api/addresses   | 5           |
| Admin       | /api/admin       | 10          |
| **Total**   |                  | **60+**     |

---

## 🗺️ Development Phases

| Phase | Task                         | Est. Time  |
|-------|------------------------------|------------|
| 1     | Figma Design (all pages)     | 1–2 weeks  |
| 2     | Backend API Development      | 2–3 weeks  |
| 3     | Frontend Development (React) | 3–4 weeks  |
| 4     | Integration & Testing        | 1–2 weeks  |
| 5     | Deployment (Atlas+Render+Vercel) | 2–3 days |
| 6     | Domain + Cloudflare + DNS    | 1 day      |
| 7     | Go Live & Monitor            | Ongoing    |

---

## 🌐 Production URLs (after deployment)

```
Website:     https://www.eaglecrackers.com
Admin Panel: https://www.eaglecrackers.com/admin
REST API:    https://api.eaglecrackers.com/api
Database:    MongoDB Atlas (Cloud)
Images CDN:  Cloudinary
```

---

## 📌 Quick Reference Links

| Document           | File                                      |
|--------------------|-------------------------------------------|
| Architecture       | [HLD.md](HLD.md)                          |
| Components & Code  | [LLD.md](LLD.md)                          |
| Database Schema    | [architecture/database-schema.md](architecture/database-schema.md) |
| API Endpoints      | [architecture/api-design.md](architecture/api-design.md) |
| Folder Structure   | [architecture/folder-structure.md](architecture/folder-structure.md) |
| Full Workflow      | [WORKFLOW.md](WORKFLOW.md)                |
| Deployment Steps   | [deployment/deployment-guide.md](deployment/deployment-guide.md) |
| Domain & DNS       | [deployment/domain-setup.md](deployment/domain-setup.md) |
