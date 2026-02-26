# 🎨 Frontend Architecture Block Diagram
## Fireworks E-Commerce Platform

---

## 📊 High-Level Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           FIREWORKS E-COMMERCE FRONTEND                          │
│                                                                                   │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                            USER INTERFACE LAYER                            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │   Landing    │  │   Products   │  │     Cart     │  │   Checkout   │  │  │
│  │  │     Page     │  │   Catalog    │  │   & Orders   │  │   & Payment  │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │     User     │  │   Wishlist   │  │    Admin     │  │     Auth     │  │  │
│  │  │   Profile    │  │  & Reviews   │  │  Dashboard   │  │   & Login    │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                         │                                         │
│                                         ↓                                         │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                          COMPONENT LAYER                                   │  │
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                │  │
│  │  │    Layout     │  │    Common     │  │   Business    │                │  │
│  │  │  Components   │  │  Components   │  │  Components   │                │  │
│  │  │  • Navbar     │  │  • Loader     │  │  • ProductCard│                │  │
│  │  │  • Footer     │  │  • Modal      │  │  • CartItem   │                │  │
│  │  │  • Sidebar    │  │  • Pagination │  │  • OrderCard  │                │  │
│  │  └───────────────┘  └───────────────┘  └───────────────┘                │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                         │                                         │
│                                         ↓                                         │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                       STATE MANAGEMENT LAYER (Redux)                       │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │     Auth     │  │   Product    │  │     Cart     │  │    Order     │  │  │
│  │  │    Slice     │  │    Slice     │  │    Slice     │  │    Slice     │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                    │  │
│  │  │   Wishlist   │  │    Admin     │  │      UI      │                    │  │
│  │  │    Slice     │  │    Slice     │  │    Slice     │                    │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘                    │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                         │                                         │
│                                         ↓                                         │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                         SERVICE/API LAYER                                  │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │  authService │  │productService│  │  cartService │  │ orderService │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  │  │
│  │  ┌──────────────┐  ┌──────────────┐                                       │  │
│  │  │paymentService│  │ adminService │                                       │  │
│  │  └──────────────┘  └──────────────┘                                       │  │
│  │                                                                             │  │
│  │                    ↓  Axios Instance (with interceptors)                   │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                         │                                         │
│                                         ↓                                         │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                          BACKEND API LAYER                                 │  │
│  │                      (Node.js + Express + MongoDB)                         │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Detailed Component Architecture

### 1. **Pages Layer** (Route-Level Components)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                               PAGES / ROUTES                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PUBLIC ROUTES                          PROTECTED ROUTES                    │
│  ┌─────────────────────┐               ┌─────────────────────┐            │
│  │  HomePage           │               │  ProfilePage        │            │
│  │  • Hero Banner      │               │  • User Info        │            │
│  │  • Featured Products│               │  • Edit Profile     │            │
│  │  • Categories       │               │  • Change Password  │            │
│  │  • Testimonials     │               └─────────────────────┘            │
│  └─────────────────────┘                                                    │
│                                         ┌─────────────────────┐            │
│  ┌─────────────────────┐               │  CartPage           │            │
│  │  ProductListPage    │               │  • Cart Items       │            │
│  │  • Filters          │               │  • Cart Summary     │            │
│  │  • Sort Options     │               │  • Apply Coupon     │            │
│  │  • Product Grid     │               └─────────────────────┘            │
│  │  • Pagination       │                                                    │
│  └─────────────────────┘               ┌─────────────────────┐            │
│                                         │  CheckoutPage       │            │
│  ┌─────────────────────┐               │  • Address Form     │            │
│  │  ProductDetailPage  │               │  • Payment Options  │            │
│  │  • Image Gallery    │               │  • Order Review     │            │
│  │  • Product Info     │               └─────────────────────┘            │
│  │  • Reviews          │                                                    │
│  │  • Related Products │               ┌─────────────────────┐            │
│  └─────────────────────┘               │  OrdersPage         │            │
│                                         │  • Order History    │            │
│  AUTH ROUTES                            │  • Order Details    │            │
│  ┌─────────────────────┐               │  • Track Order      │            │
│  │  LoginPage          │               └─────────────────────┘            │
│  │  RegisterPage       │                                                    │
│  │  ForgotPasswordPage │               ┌─────────────────────┐            │
│  │  ResetPasswordPage  │               │  WishlistPage       │            │
│  └─────────────────────┘               │  • Wishlist Items   │            │
│                                         │  • Add to Cart      │            │
│                                         └─────────────────────┘            │
│                                                                              │
│  ADMIN ROUTES (Protected + Role Check)                                      │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐│
│  │  AdminDashboard     │  │  AdminProducts      │  │  AdminOrders        ││
│  │  • Stats Cards      │  │  • Product List     │  │  • Order List       ││
│  │  • Revenue Chart    │  │  • Add/Edit Product │  │  • Order Details    ││
│  │  • Recent Orders    │  │  • Delete Product   │  │  • Update Status    ││
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘│
│                                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐                         │
│  │  AdminUsers         │  │  AdminCategories    │                         │
│  │  • User List        │  │  • Category List    │                         │
│  │  • User Details     │  │  • Add/Edit Category│                         │
│  │  • Block/Unblock    │  │  • Delete Category  │                         │
│  └─────────────────────┘  └─────────────────────┘                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 2. **Components Layer** (Reusable UI Components)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           COMPONENT ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LAYOUT COMPONENTS              COMMON COMPONENTS                           │
│  ┌────────────────────┐         ┌────────────────────┐                     │
│  │  Navbar            │         │  Loader            │                     │
│  │  • Logo            │         │  • Spinner         │                     │
│  │  • Search Bar      │         │  • Skeleton        │                     │
│  │  • Nav Links       │         │  • Progress Bar    │                     │
│  │  • Cart Badge      │         └────────────────────┘                     │
│  │  • User Dropdown   │                                                     │
│  └────────────────────┘         ┌────────────────────┐                     │
│           │                      │  Modal             │                     │
│           ↓                      │  • Overlay         │                     │
│  ┌────────────────────┐         │  • Close Button    │                     │
│  │  Footer            │         │  • Content Area    │                     │
│  │  • Quick Links     │         └────────────────────┘                     │
│  │  • Social Media    │                                                     │
│  │  • Newsletter      │         ┌────────────────────┐                     │
│  │  • Copyright       │         │  Pagination        │                     │
│  └────────────────────┘         │  • Page Numbers    │                     │
│                                  │  • Next/Prev       │                     │
│  ┌────────────────────┐         └────────────────────┘                     │
│  │  AdminLayout       │                                                     │
│  │  • Sidebar Menu    │         ┌────────────────────┐                     │
│  │  • Top Bar         │         │  ErrorBoundary     │                     │
│  │  • Content Area    │         │  • Error Display   │                     │
│  └────────────────────┘         │  • Retry Button    │                     │
│                                  └────────────────────┘                     │
│  ┌────────────────────┐                                                     │
│  │  ProtectedRoute    │         ┌────────────────────┐                     │
│  │  • Auth Check      │         │  StarRating        │                     │
│  │  • Role Check      │         │  • Stars Display   │                     │
│  │  • Redirect Logic  │         │  • Clickable       │                     │
│  └────────────────────┘         └────────────────────┘                     │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PRODUCT COMPONENTS             CART COMPONENTS                             │
│  ┌────────────────────┐         ┌────────────────────┐                     │
│  │  ProductCard       │         │  CartItem          │                     │
│  │  • Image           │         │  • Product Image   │                     │
│  │  • Name            │         │  • Quantity Select │                     │
│  │  • Price           │         │  • Price           │                     │
│  │  • Rating          │         │  • Remove Button   │                     │
│  │  • Add to Cart Btn │         └────────────────────┘                     │
│  │  • Wishlist Icon   │                                                     │
│  └────────────────────┘         ┌────────────────────┐                     │
│           │                      │  CartSummary       │                     │
│           ↓                      │  • Subtotal        │                     │
│  ┌────────────────────┐         │  • Discount        │                     │
│  │  ProductGrid       │         │  • Tax             │                     │
│  │  • Grid Layout     │         │  • Total           │                     │
│  │  • Product Cards[] │         │  • Checkout Button │                     │
│  └────────────────────┘         └────────────────────┘                     │
│                                                                              │
│  ┌────────────────────┐         ┌────────────────────┐                     │
│  │ProductImageGallery │         │  EmptyCart         │                     │
│  │  • Main Image      │         │  • Empty Icon      │                     │
│  │  • Thumbnails      │         │  • Message         │                     │
│  │  • Zoom            │         │  • Shop Now Button │                     │
│  └────────────────────┘         └────────────────────┘                     │
│                                                                              │
│  ┌────────────────────┐         CHECKOUT COMPONENTS                         │
│  │  ProductInfo       │         ┌────────────────────┐                     │
│  │  • Name            │         │  AddressForm       │                     │
│  │  • Price           │         │  • Form Fields     │                     │
│  │  • Stock Status    │         │  • Validation      │                     │
│  │  • Description     │         │  • Save Address    │                     │
│  │  • Quantity Select │         └────────────────────┘                     │
│  └────────────────────┘                                                     │
│                                  ┌────────────────────┐                     │
│  ┌────────────────────┐         │  AddressList       │                     │
│  │  FilterSidebar     │         │  • Address Cards   │                     │
│  │  • Category Filter │         │  • Select Address  │                     │
│  │  • Price Range     │         │  • Edit/Delete     │                     │
│  │  • Rating Filter   │         └────────────────────┘                     │
│  │  • Brand Filter    │                                                     │
│  └────────────────────┘         ┌────────────────────┐                     │
│                                  │  PaymentOptions    │                     │
│  ┌────────────────────┐         │  • COD             │                     │
│  │  ReviewCard        │         │  • Card Payment    │                     │
│  │  • User Avatar     │         │  • UPI             │                     │
│  │  • Rating          │         │  • Wallet          │                     │
│  │  • Comment         │         └────────────────────┘                     │
│  │  • Date            │                                                     │
│  └────────────────────┘         ┌────────────────────┐                     │
│                                  │  OrderReview       │                     │
│  ┌────────────────────┐         │  • Items Summary   │                     │
│  │  RelatedProducts   │         │  • Address         │                     │
│  │  • Product Cards[] │         │  • Payment Method  │                     │
│  │  • Carousel        │         │  • Total           │                     │
│  └────────────────────┘         └────────────────────┘                     │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ORDER COMPONENTS               ADMIN COMPONENTS                            │
│  ┌────────────────────┐         ┌────────────────────┐                     │
│  │  OrderCard         │         │  DashboardStats    │                     │
│  │  • Order ID        │         │  • Total Revenue   │                     │
│  │  • Status Badge    │         │  • Total Orders    │                     │
│  │  • Items Count     │         │  • Total Users     │                     │
│  │  • Total Amount    │         │  • Total Products  │                     │
│  │  • View Details    │         └────────────────────┘                     │
│  └────────────────────┘                                                     │
│                                  ┌────────────────────┐                     │
│  ┌────────────────────┐         │  RevenueChart      │                     │
│  │  OrderTimeline     │         │  • Line Chart      │                     │
│  │  • Order Placed    │         │  • Bar Chart       │                     │
│  │  • Processing      │         │  • Date Range      │                     │
│  │  • Shipped         │         └────────────────────┘                     │
│  │  • Delivered       │                                                     │
│  └────────────────────┘         ┌────────────────────┐                     │
│                                  │  ProductForm       │                     │
│  ┌────────────────────┐         │  • Name/Price      │                     │
│  │  OrderItemList     │         │  • Description     │                     │
│  │  • Product Items[] │         │  • Category        │                     │
│  │  • Quantity        │         │  • Images Upload   │                     │
│  │  • Price           │         │  • Stock           │                     │
│  └────────────────────┘         └────────────────────┘                     │
│                                                                              │
│                                  ┌────────────────────┐                     │
│                                  │  OrderTable        │                     │
│                                  │  • Data Grid       │                     │
│                                  │  • Status Update   │                     │
│                                  │  • Actions         │                     │
│                                  └────────────────────┘                     │
│                                                                              │
│                                  ┌────────────────────┐                     │
│                                  │  UserTable         │                     │
│                                  │  • User List       │                     │
│                                  │  • Search/Filter   │                     │
│                                  │  • Block/Unblock   │                     │
│                                  └────────────────────┘                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 3. **State Management Architecture** (Redux Toolkit)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         REDUX STORE ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                          ┌──────────────────┐                               │
│                          │   Redux Store    │                               │
│                          │  (Centralized)   │                               │
│                          └────────┬─────────┘                               │
│                                   │                                          │
│          ┌────────────────────────┼────────────────────────┐                │
│          │                        │                        │                │
│          ↓                        ↓                        ↓                │
│  ┌──────────────┐        ┌──────────────┐        ┌──────────────┐         │
│  │  authSlice   │        │ productSlice │        │  cartSlice   │         │
│  ├──────────────┤        ├──────────────┤        ├──────────────┤         │
│  │ State:       │        │ State:       │        │ State:       │         │
│  │ • user       │        │ • products[] │        │ • items[]    │         │
│  │ • token      │        │ • loading    │        │ • total      │         │
│  │ • isAuth     │        │ • error      │        │ • count      │         │
│  │ • loading    │        │ • filters    │        │ • discount   │         │
│  ├──────────────┤        │ • pagination │        ├──────────────┤         │
│  │ Actions:     │        ├──────────────┤        │ Actions:     │         │
│  │ • login      │        │ Actions:     │        │ • addItem    │         │
│  │ • register   │        │ • fetchAll   │        │ • removeItem │         │
│  │ • logout     │        │ • fetchById  │        │ • updateQty  │         │
│  │ • updateUser │        │ • filter     │        │ • clearCart  │         │
│  │ • refresh    │        │ • sort       │        │ • applyCoupon│         │
│  └──────────────┘        └──────────────┘        └──────────────┘         │
│          │                        │                        │                │
│          ↓                        ↓                        ↓                │
│  ┌──────────────┐        ┌──────────────┐        ┌──────────────┐         │
│  │ wishlistSlice│        │  orderSlice  │        │  adminSlice  │         │
│  ├──────────────┤        ├──────────────┤        ├──────────────┤         │
│  │ State:       │        │ State:       │        │ State:       │         │
│  │ • items[]    │        │ • orders[]   │        │ • stats      │         │
│  │ • count      │        │ • current    │        │ • users[]    │         │
│  ├──────────────┤        │ • loading    │        │ • orders[]   │         │
│  │ Actions:     │        ├──────────────┤        │ • products[] │         │
│  │ • addToWish  │        │ Actions:     │        ├──────────────┤         │
│  │ • removeItem │        │ • create     │        │ Actions:     │         │
│  │ • clearWish  │        │ • fetchAll   │        │ • getStats   │         │
│  │ • moveToCart │        │ • fetchById  │        │ • getUsers   │         │
│  └──────────────┘        │ • cancel     │        │ • blockUser  │         │
│                          │ • track      │        │ • getOrders  │         │
│                          └──────────────┘        │ • updateOrder│         │
│                                                   └──────────────┘         │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                      MIDDLEWARE & INTERCEPTORS                        │  │
│  │  • Redux Thunk (Async Actions)                                        │  │
│  │  • Redux DevTools Extension                                           │  │
│  │  • LocalStorage Sync (Cart, Wishlist)                                 │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 4. **Service Layer Architecture** (API Communication)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SERVICE/API LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                    ┌────────────────────────────┐                           │
│                    │   Axios Instance (api.js)  │                           │
│                    │  • Base URL Configuration  │                           │
│                    │  • Request Interceptor     │                           │
│                    │  • Response Interceptor    │                           │
│                    │  • Error Handler           │                           │
│                    │  • JWT Token Injection     │                           │
│                    └────────────┬───────────────┘                           │
│                                 │                                            │
│     ┌───────────────────────────┼───────────────────────────┐              │
│     │                           │                           │              │
│     ↓                           ↓                           ↓              │
│  ┌──────────────┐       ┌──────────────┐         ┌──────────────┐         │
│  │ authService  │       │productService│         │ cartService  │         │
│  ├──────────────┤       ├──────────────┤         ├──────────────┤         │
│  │ login()      │       │ getAll()     │         │ getCart()    │         │
│  │ register()   │       │ getById()    │         │ addItem()    │         │
│  │ logout()     │       │ search()     │         │ removeItem() │         │
│  │ forgotPwd()  │       │ filter()     │         │ updateQty()  │         │
│  │ resetPwd()   │       │ getReviews() │         │ clearCart()  │         │
│  │ refreshToken│       │ addReview()  │         │ applyCoupon()│         │
│  └──────────────┘       └──────────────┘         └──────────────┘         │
│                                                                              │
│     ┌───────────────────────────┼───────────────────────────┐              │
│     ↓                           ↓                           ↓              │
│  ┌──────────────┐       ┌──────────────┐         ┌──────────────┐         │
│  │orderService  │       │paymentService│         │ adminService │         │
│  ├──────────────┤       ├──────────────┤         ├──────────────┤         │
│  │ createOrder()│       │ initPayment()│         │ getStats()   │         │
│  │ getOrders()  │       │ verifyPayment│         │ getUsers()   │         │
│  │ getOrderById │       │ razorpay()   │         │ blockUser()  │         │
│  │ cancelOrder()│       │ stripe()     │         │ getOrders()  │         │
│  │ trackOrder() │       └──────────────┘         │ updateOrder()│         │
│  └──────────────┘                                 │ getProducts()│         │
│                                                    │ addProduct() │         │
│  ┌──────────────┐                                 │ updateProduct│         │
│  │wishlistSvc   │                                 │ deleteProduct│         │
│  ├──────────────┤                                 └──────────────┘         │
│  │ getWishlist()│                                                           │
│  │ addItem()    │                                                           │
│  │ removeItem() │                                                           │
│  │ clearWish()  │                                                           │
│  └──────────────┘                                                           │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                     API ENDPOINTS MAPPING                             │  │
│  │  • /api/auth/...       → authService                                  │  │
│  │  • /api/products/...   → productService                               │  │
│  │  • /api/cart/...       → cartService                                  │  │
│  │  • /api/orders/...     → orderService                                 │  │
│  │  • /api/payment/...    → paymentService                               │  │
│  │  • /api/wishlist/...   → wishlistService                              │  │
│  │  • /api/admin/...      → adminService                                 │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 5. **Routing Architecture**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ROUTING ARCHITECTURE                                │
│                         (React Router v6)                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                            ┌────────────┐                                   │
│                            │  App.jsx   │                                   │
│                            │  (Router)  │                                   │
│                            └─────┬──────┘                                   │
│                                  │                                           │
│              ┌───────────────────┼───────────────────┐                      │
│              │                   │                   │                      │
│              ↓                   ↓                   ↓                      │
│     ┌────────────────┐  ┌────────────────┐  ┌────────────────┐            │
│     │ PUBLIC ROUTES  │  │ PROTECTED      │  │ ADMIN ROUTES   │            │
│     │                │  │ ROUTES (Auth)  │  │ (Auth + Role)  │            │
│     └────────────────┘  └────────────────┘  └────────────────┘            │
│              │                   │                   │                      │
│              │                   │                   │                      │
│  ┌───────────┴──────────┐       │       ┌───────────┴──────────┐          │
│  │                      │       │       │                      │          │
│  ↓                      ↓       ↓       ↓                      ↓          │
│  /                    /products /cart   /admin              /admin/users   │
│  HomePage          ProductList CartPage AdminDashboard     AdminUsers      │
│                                         ↓                      ↓            │
│  /products/:id     /products/:cat  /checkout /admin/products /admin/orders│
│  ProductDetail     FilteredList    Checkout  AdminProducts  AdminOrders    │
│                                         ↓                      ↓            │
│  /login            /search         /orders /admin/products/add             │
│  LoginPage         SearchResults   Orders  AddProduct      /admin/orders/:id│
│                                         ↓                   OrderDetail     │
│  /register         /about          /orders/:id                             │
│  RegisterPage      AboutPage       OrderDetail /admin/products/edit/:id    │
│                                         ↓       EditProduct                 │
│  /forgot-password  /contact        /profile                                │
│  ForgotPassword    ContactPage     Profile  /admin/categories              │
│                                         ↓    AdminCategories                │
│  /reset-password/:token             /wishlist                              │
│  ResetPassword                      Wishlist                               │
│                                                                              │
│  /*  →  NotFoundPage (404)                                                  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                     ROUTE GUARDS/MIDDLEWARE                           │  │
│  │  • ProtectedRoute Component                                           │  │
│  │    → Checks authentication                                            │  │
│  │    → Redirects to /login if not authenticated                         │  │
│  │                                                                        │  │
│  │  • AdminRoute Component                                               │  │
│  │    → Checks authentication + admin role                               │  │
│  │    → Redirects to /login or / if unauthorized                         │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 6. **Custom Hooks Architecture**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CUSTOM HOOKS LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐   │
│  │   useAuth()      │     │   useCart()      │     │  useDebounce()   │   │
│  ├──────────────────┤     ├──────────────────┤     ├──────────────────┤   │
│  │ Returns:         │     │ Returns:         │     │ Input: value, ms │   │
│  │ • user           │     │ • items          │     │ Returns:         │   │
│  │ • isAuth         │     │ • count          │     │ • debouncedValue │   │
│  │ • loading        │     │ • total          │     │                  │   │
│  │ • login()        │     │ • addToCart()    │     │ Use Case:        │   │
│  │ • logout()       │     │ • removeItem()   │     │ • Search input   │   │
│  │ • register()     │     │ • updateQty()    │     │ • Filter changes │   │
│  └──────────────────┘     │ • clearCart()    │     └──────────────────┘   │
│                            └──────────────────┘                             │
│                                                                              │
│  ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐   │
│  │useLocalStorage() │     │   useWishlist()  │     │  useOrders()     │   │
│  ├──────────────────┤     ├──────────────────┤     ├──────────────────┤   │
│  │ Input: key, init │     │ Returns:         │     │ Returns:         │   │
│  │ Returns:         │     │ • items          │     │ • orders         │   │
│  │ • value          │     │ • count          │     │ • current        │   │
│  │ • setValue()     │     │ • addToWish()    │     │ • createOrder()  │   │
│  │ • removeValue()  │     │ • removeItem()   │     │ • fetchOrders()  │   │
│  │                  │     │ • moveToCart()   │     │ • trackOrder()   │   │
│  │ Use Case:        │     └──────────────────┘     └──────────────────┘   │
│  │ • Theme toggle   │                                                       │
│  │ • User prefs     │     ┌──────────────────┐     ┌──────────────────┐   │
│  └──────────────────┘     │  useProduct()    │     │  useAdmin()      │   │
│                            ├──────────────────┤     ├──────────────────┤   │
│  ┌──────────────────┐     │ Returns:         │     │ Returns:         │   │
│  │  useToast()      │     │ • products       │     │ • stats          │   │
│  ├──────────────────┤     │ • loading        │     │ • users          │   │
│  │ Returns:         │     │ • filters        │     │ • orders         │   │
│  │ • showToast()    │     │ • fetchAll()     │     │ • getStats()     │   │
│  │   • success      │     │ • fetchById()    │     │ • getUsers()     │   │
│  │   • error        │     │ • applyFilter()  │     │ • updateOrder()  │   │
│  │   • info         │     └──────────────────┘     └──────────────────┘   │
│  │   • warning      │                                                       │
│  └──────────────────┘     ┌──────────────────┐                             │
│                            │ useInfiniteScroll│                             │
│  ┌──────────────────┐     ├──────────────────┤                             │
│  │ useMediaQuery()  │     │ Input: callback  │                             │
│  ├──────────────────┤     │ Returns:         │                             │
│  │ Input: query     │     │ • loading        │                             │
│  │ Returns:         │     │ • hasMore        │                             │
│  │ • matches        │     │ • ref (observer) │                             │
│  │                  │     └──────────────────┘                             │
│  │ Use Case:        │                                                       │
│  │ • Responsive UI  │     ┌──────────────────┐                             │
│  └──────────────────┘     │  useClickOutside │                             │
│                            ├──────────────────┤                             │
│                            │ Input: ref, cb   │                             │
│                            │ Use Case:        │                             │
│                            │ • Close modal    │                             │
│                            │ • Close dropdown │                             │
│                            └──────────────────┘                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 7. **Data Flow Architecture**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATA FLOW DIAGRAM                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  USER INTERACTION                                                            │
│        ↓                                                                     │
│  ┌──────────────┐                                                           │
│  │  UI/Component│  (e.g., Click "Add to Cart")                             │
│  └──────┬───────┘                                                           │
│         │                                                                    │
│         ↓                                                                    │
│  ┌──────────────┐                                                           │
│  │ Event Handler│  (e.g., handleAddToCart)                                 │
│  └──────┬───────┘                                                           │
│         │                                                                    │
│         ↓                                                                    │
│  ┌──────────────┐                                                           │
│  │ Redux Action │  (e.g., dispatch(addToCart(product)))                    │
│  │  (Dispatch)  │                                                           │
│  └──────┬───────┘                                                           │
│         │                                                                    │
│         ├─────────────┬─────────────┐                                       │
│         │             │             │                                       │
│         ↓             ↓             ↓                                       │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                             │
│  │   Sync     │ │   Async    │ │  Thunk /   │                             │
│  │  Action    │ │   Action   │ │   Saga     │                             │
│  └─────┬──────┘ └─────┬──────┘ └─────┬──────┘                             │
│        │              │              │                                      │
│        ↓              ↓              ↓                                      │
│  ┌──────────────────────────────────────┐                                  │
│  │         Redux Reducer                │                                  │
│  │  (Update state immutably)            │                                  │
│  └──────────────┬───────────────────────┘                                  │
│                 │                                                            │
│                 ↓                                                            │
│  ┌──────────────────────────────────────┐                                  │
│  │         Redux Store                  │                                  │
│  │  (Single source of truth)            │                                  │
│  └──────────────┬───────────────────────┘                                  │
│                 │                                                            │
│                 ↓                                                            │
│  ┌──────────────────────────────────────┐                                  │
│  │      useSelector() / Connect         │                                  │
│  │  (Component subscribes to state)     │                                  │
│  └──────────────┬───────────────────────┘                                  │
│                 │                                                            │
│                 ↓                                                            │
│  ┌──────────────────────────────────────┐                                  │
│  │      Component Re-renders            │                                  │
│  │  (UI updates with new data)          │                                  │
│  └──────────────────────────────────────┘                                  │
│                                                                              │
│  ═════════════════════════════════════════════════════════════════════════ │
│                                                                              │
│  ASYNC FLOW (API Call)                                                      │
│        ↓                                                                     │
│  ┌──────────────┐                                                           │
│  │ User Action  │  (e.g., Fetch Products)                                  │
│  └──────┬───────┘                                                           │
│         │                                                                    │
│         ↓                                                                    │
│  ┌──────────────┐                                                           │
│  │dispatch(thunk│  (e.g., fetchProducts())                                 │
│  └──────┬───────┘                                                           │
│         │                                                                    │
│         ↓                                                                    │
│  ┌──────────────┐                                                           │
│  │ dispatch(    │  (loading: true)                                         │
│  │  pending)    │                                                           │
│  └──────┬───────┘                                                           │
│         │                                                                    │
│         ↓                                                                    │
│  ┌──────────────┐                                                           │
│  │ API Service  │  (e.g., productService.getAll())                         │
│  └──────┬───────┘                                                           │
│         │                                                                    │
│         ├─────────────┬─────────────┐                                       │
│         ↓             ↓             ↓                                       │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                             │
│  │  Success   │ │   Error    │ │  Network   │                             │
│  │  Response  │ │  Response  │ │   Error    │                             │
│  └─────┬──────┘ └─────┬──────┘ └─────┬──────┘                             │
│        │              │              │                                      │
│        ↓              ↓              ↓                                      │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                             │
│  │ dispatch(  │ │ dispatch(  │ │ dispatch(  │                             │
│  │ fulfilled) │ │ rejected)  │ │ rejected)  │                             │
│  └─────┬──────┘ └─────┬──────┘ └─────┬──────┘                             │
│        │              │              │                                      │
│        └──────────────┴──────────────┘                                      │
│                       │                                                      │
│                       ↓                                                      │
│  ┌──────────────────────────────────────┐                                  │
│  │         Redux Reducer                │                                  │
│  │  (Update state based on result)      │                                  │
│  └──────────────┬───────────────────────┘                                  │
│                 │                                                            │
│                 ↓                                                            │
│  ┌──────────────────────────────────────┐                                  │
│  │      Component Re-renders            │                                  │
│  │  (Show data or error message)        │                                  │
│  └──────────────────────────────────────┘                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Summary: Key Architecture Principles

### ✅ Component-Based Architecture
- **Atomic Design**: Break UI into smallest reusable pieces
- **Single Responsibility**: Each component has one clear purpose
- **Composition Over Inheritance**: Build complex UIs from simple components

### ✅ State Management
- **Centralized State**: Redux store as single source of truth
- **Predictable Updates**: Actions → Reducers → State
- **Async Handling**: Redux Thunk for side effects

### ✅ Separation of Concerns
- **Pages**: Route-level components (containers)
- **Components**: Reusable UI pieces (presentational)
- **Services**: API communication logic
- **Utils**: Helper functions and constants
- **Hooks**: Reusable stateful logic

### ✅ Data Flow
- **Unidirectional**: User → Action → Reducer → Store → Component
- **Immutable Updates**: Never mutate state directly
- **Predictable**: Same input = same output

### ✅ Code Organization
- **Feature-Based**: Group related files together
- **Modular**: Easy to test, maintain, and scale
- **DRY Principle**: Don't Repeat Yourself

---

## 📝 Next Steps

1. **Implement Component Library**: Start with common components (Button, Input, Card, etc.)
2. **Set Up Redux Store**: Configure slices and middleware
3. **Create API Services**: Implement axios instance and service layers
4. **Build Pages**: Start with HomePage, then ProductList, ProductDetail
5. **Add Authentication**: Implement login/register flows
6. **Implement Features**: Cart, Wishlist, Checkout, Orders
7. **Admin Panel**: Dashboard and CRUD operations
8. **Testing**: Unit tests for components, integration tests for flows
9. **Optimization**: Code splitting, lazy loading, memoization
10. **Deployment**: Build and deploy to production

---

**Generated on**: February 26, 2026
**Project**: Fireworks & Crackers E-Commerce Platform
**Stack**: MERN (MongoDB, Express.js, React.js, Node.js)
