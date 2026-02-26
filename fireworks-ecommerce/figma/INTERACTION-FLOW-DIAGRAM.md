# 🎨 Interactive Component Flow Diagram
## Fireworks E-Commerce - User Journey & Interactions

---

## 🔄 Complete User Journey Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY FLOWCHART                               │
└─────────────────────────────────────────────────────────────────────────────┘

                              START
                                │
                                ↓
                    ┌───────────────────────┐
                    │   Landing on Home     │
                    │      (HomePage)       │
                    └───────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    ↓                       ↓
         ┌──────────────────┐    ┌──────────────────┐
         │  Browse by       │    │  Search Product  │
         │  Category        │    │                  │
         └──────────────────┘    └──────────────────┘
                    │                       │
                    └───────────┬───────────┘
                                ↓
                    ┌───────────────────────┐
                    │  Product List Page    │
                    │  (ProductListPage)    │
                    └───────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    ↓                       ↓
         ┌──────────────────┐    ┌──────────────────┐
         │  Apply Filters   │    │  Click on Product│
         │  (Price, Rating) │    │      Card        │
         └──────────────────┘    └──────────────────┘
                                            │
                                            ↓
                                ┌───────────────────────┐
                                │  Product Detail Page  │
                                │ (ProductDetailPage)   │
                                └───────────────────────┘
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    ↓                       ↓                       ↓
         ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
         │  Add to Wishlist │    │  Add to Cart     │    │  Buy Now         │
         └──────────────────┘    └──────────────────┘    └──────────────────┘
                    │                       │                       │
                    │                       └───────────┬───────────┘
                    │                                   ↓
                    │                       ┌───────────────────────┐
                    │                       │     Cart Page         │
                    │                       │     (CartPage)        │
                    │                       └───────────────────────┘
                    │                                   │
                    │                       ┌───────────┴───────────┐
                    │                       ↓                       ↓
                    │            ┌──────────────────┐    ┌──────────────────┐
                    │            │  Update Quantity │    │  Remove Item     │
                    │            └──────────────────┘    └──────────────────┘
                    │                       │
                    │                       ↓
                    │            ┌───────────────────────┐
                    │            │  Apply Coupon Code    │
                    │            └───────────────────────┘
                    │                       │
                    │                       ↓
                    │        ┌──────────────────────────────┐
                    │        │  Is User Authenticated?      │
                    │        └──────────────────────────────┘
                    │                       │
                    │            ┌──────────┴──────────┐
                    │            ↓                     ↓
                    │         ┌──────┐           ┌──────────┐
                    │         │ Yes  │           │    No    │
                    │         └──────┘           └──────────┘
                    │            │                     │
                    │            │                     ↓
                    │            │          ┌────────────────────┐
                    │            │          │  Redirect to Login │
                    │            │          │    (LoginPage)     │
                    │            │          └────────────────────┘
                    │            │                     │
                    │            │          ┌──────────┴──────────┐
                    │            │          ↓                     ↓
                    │            │   ┌─────────────┐      ┌─────────────┐
                    │            │   │    Login    │      │  Register   │
                    │            │   └─────────────┘      └─────────────┘
                    │            │          │                     │
                    │            │          └──────────┬──────────┘
                    │            │                     │
                    │            └─────────────────────┘
                    │                       ↓
                    │            ┌───────────────────────┐
                    │            │   Checkout Page       │
                    │            │   (CheckoutPage)      │
                    │            └───────────────────────┘
                    │                       │
                    │            ┌──────────┴──────────┐
                    │            ↓                     ↓
                    │   ┌─────────────────┐    ┌─────────────────┐
                    │   │ Select Address  │    │  Add New Address│
                    │   └─────────────────┘    └─────────────────┘
                    │                       │
                    │                       ↓
                    │            ┌───────────────────────┐
                    │            │  Choose Payment Method│
                    │            └───────────────────────┘
                    │                       │
                    │            ┌──────────┴──────────┐
                    │            ↓                     ↓
                    │     ┌────────────┐      ┌────────────────┐
                    │     │    COD     │      │  Online Payment│
                    │     └────────────┘      └────────────────┘
                    │                       │
                    │                       ↓
                    │            ┌───────────────────────┐
                    │            │   Review Order        │
                    │            └───────────────────────┘
                    │                       │
                    │                       ↓
                    │            ┌───────────────────────┐
                    │            │   Place Order         │
                    │            └───────────────────────┘
                    │                       │
                    │                       ↓
                    │            ┌───────────────────────┐
                    │            │  Order Confirmation   │
                    │            │  (OrderDetailPage)    │
                    │            └───────────────────────┘
                    │                       │
                    │            ┌──────────┴──────────┐
                    │            ↓                     ↓
                    │   ┌─────────────────┐    ┌─────────────────┐
                    │   │  Track Order    │    │  View Orders    │
                    │   └─────────────────┘    │  (OrdersPage)   │
                    │                          └─────────────────┘
                    │
                    ↓
         ┌───────────────────────┐
         │   Wishlist Page       │
         │   (WishlistPage)      │
         └───────────────────────┘
                    │
         ┌──────────┴──────────┐
         ↓                     ↓
┌─────────────────┐    ┌─────────────────┐
│  Move to Cart   │    │  Remove Item    │
└─────────────────┘    └─────────────────┘
```

---

## 🎯 Feature-Specific Flow Diagrams

### **1. Authentication Flow**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AUTHENTICATION FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

User Clicks "Login"
       │
       ↓
┌────────────────┐
│   Login Page   │
└────────────────┘
       │
       ↓
User Enters Email & Password
       │
       ↓
Clicks "Login" Button
       │
       ↓
dispatch(login({email, password}))
       │
       ↓
API Call: POST /api/auth/login
       │
  ┌────┴────┐
  ↓         ↓
Success   Failed
  │         │
  ↓         ↓
Receive   Error
Token     Message
  │         │
  ↓         ↓
Store in  Show Toast
Redux &   "Invalid
LocalSt.  Credentials"
  │
  ↓
Redirect to
Intended Page
or Home
  │
  ↓
Show Success
Toast

─────────────────────────────────────────────────────────────────────────────

REGISTER FLOW:

User Clicks "Register"
       │
       ↓
┌────────────────┐
│ Register Page  │
└────────────────┘
       │
       ↓
User Fills Form
(Name, Email, Password, etc.)
       │
       ↓
Clicks "Register" Button
       │
       ↓
Client-side Validation
       │
  ┌────┴────┐
  ↓         ↓
Valid    Invalid
  │         │
  ↓         ↓
dispatch( Show
register()  Error
  │       Messages
  ↓
API Call: POST /api/auth/register
  │
  ┌────┴────┐
  ↓         ↓
Success   Failed
  │         │
  ↓         ↓
Auto     Show
Login    Error
  │      Toast
  ↓
Redirect
to Home
  │
  ↓
Show Welcome
Toast

─────────────────────────────────────────────────────────────────────────────

FORGOT PASSWORD FLOW:

User Clicks "Forgot Password?"
       │
       ↓
┌──────────────────────┐
│ Forgot Password Page │
└──────────────────────┘
       │
       ↓
User Enters Email
       │
       ↓
Clicks "Send Reset Link"
       │
       ↓
API Call: POST /api/auth/forgot-password
       │
       ↓
Backend Sends Email with Reset Link
       │
       ↓
Show Success: "Check your email"
       │
       ↓
User Clicks Link in Email
       │
       ↓
┌──────────────────────┐
│ Reset Password Page  │
│ (with token in URL)  │
└──────────────────────┘
       │
       ↓
User Enters New Password
       │
       ↓
Clicks "Reset Password"
       │
       ↓
API Call: POST /api/auth/reset-password
       │
  ┌────┴────┐
  ↓         ↓
Success   Failed
  │         │
  ↓         ↓
Redirect  Show
to Login  Error
  │
  ↓
Show Success Toast
```

---

### **2. Cart & Wishlist Management Flow**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CART & WISHLIST FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────┘

ADD TO CART:
─────────────
User on Product Detail Page
       │
       ↓
Clicks "Add to Cart"
       │
       ↓
dispatch(addToCart(product))
       │
       ↓
Redux: cartSlice updates
• Add item to cart.items[]
• Update cart.count
• Calculate cart.total
       │
       ↓
Sync to LocalStorage
       │
       ↓
Update Cart Badge in Navbar
       │
       ↓
Show Toast: "Added to cart!"
       │
       ↓
User continues shopping
   or goes to Cart Page


UPDATE QUANTITY IN CART:
────────────────────────
User in Cart Page
       │
       ↓
Clicks [-] or [+] button
       │
       ↓
dispatch(updateQuantity({id, qty}))
       │
       ↓
Redux: Update item.quantity
       │
       ↓
Recalculate cart.total
       │
       ↓
Update UI immediately
       │
       ↓
Sync to LocalStorage


REMOVE FROM CART:
─────────────────
User Clicks "Remove"
       │
       ↓
Show Confirmation Modal
"Are you sure?"
       │
  ┌────┴────┐
  ↓         ↓
Confirm   Cancel
  │         │
  ↓         ↓
dispatch( Close
removeItem Modal
  │
  ↓
Redux: Filter out item
       │
       ↓
Update cart.count & total
       │
       ↓
Show Toast: "Item removed"


APPLY COUPON:
─────────────
User Enters Coupon Code
       │
       ↓
Clicks "Apply"
       │
       ↓
dispatch(applyCoupon(code))
       │
       ↓
API Call: POST /api/cart/apply-coupon
       │
  ┌────┴────┐
  ↓         ↓
Valid    Invalid
  │         │
  ↓         ↓
Update   Show
discount  Error
amount   Toast
  │
  ↓
Recalculate
total
  │
  ↓
Show Success
Toast


ADD TO WISHLIST:
────────────────
User Clicks ♡ icon
       │
       ↓
Check if authenticated
       │
  ┌────┴────┐
  ↓         ↓
 Yes       No
  │         │
  ↓         ↓
dispatch( Redirect
addToWish to Login
  │
  ↓
Redux: Add to wishlist.items[]
       │
       ↓
Update Wishlist Badge
       │
       ↓
Change ♡ to ♥ (filled)
       │
       ↓
Show Toast: "Added to wishlist"
       │
       ↓
Sync to Backend
(API Call: POST /api/wishlist)


MOVE WISHLIST TO CART:
──────────────────────
User in Wishlist Page
       │
       ↓
Clicks "Move to Cart"
       │
       ↓
dispatch(moveToCart(item))
       │
       ↓
Redux:
• Remove from wishlist
• Add to cart
       │
       ↓
Update both badges
       │
       ↓
Show Toast: "Moved to cart"
```

---

### **3. Order Placement & Tracking Flow**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ORDER PLACEMENT FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

User in Cart Page
       │
       ↓
Clicks "Proceed to Checkout"
       │
       ↓
Check Authentication
       │
  ┌────┴────┐
  ↓         ↓
 Yes       No
  │         │
  ↓         ↓
Navigate  Redirect
Checkout  to Login
Page       │
  │        └──────→ After Login → Back to Checkout
  │
  ↓
┌─────────────────────────┐
│ STEP 1: Select Address  │
└─────────────────────────┘
       │
  ┌────┴────┐
  ↓         ↓
Has      No
Address  Address
  │         │
  ↓         ↓
Show     Show
List     Form
  │         │
  └────┬────┘
       ↓
Select or Add Address
       │
       ↓
Clicks "Continue"
       │
       ↓
┌──────────────────────────┐
│ STEP 2: Payment Method   │
└──────────────────────────┘
       │
  ┌────┴────┬────────┬────────┐
  ↓         ↓        ↓        ↓
 COD      Card      UPI    Wallet
  │         │        │        │
  └────┬────┴────┬───┴────────┘
       ↓         ↓
    Select   Enter
    COD      Details
       │         │
       └────┬────┘
            ↓
    Clicks "Continue"
            ↓
┌──────────────────────────┐
│ STEP 3: Review Order     │
└──────────────────────────┘
       │
       ↓
Shows:
• Address
• Payment Method
• Order Items
• Total Amount
       │
       ↓
User Reviews Everything
       │
       ↓
Checks "I agree to T&C"
       │
       ↓
Clicks "Place Order"
       │
       ↓
dispatch(createOrder(orderData))
       │
       ↓
Show Loader
       │
       ↓
API Call: POST /api/orders
       │
       ↓
Backend:
• Create order in DB
• Update product stock
• If online payment → Initiate payment gateway
       │
  ┌────┴────┐
  ↓         ↓
Success  Failed
  │         │
  ↓         ↓
Receive  Show
Order ID  Error
  │       Toast
  ↓
Clear Cart
(Redux & LocalStorage)
  │
  ↓
Redirect to Order Confirmation
  │
  ↓
┌──────────────────────────┐
│ Order Confirmation Page  │
└──────────────────────────┘
       │
       ↓
Shows:
• Order ID
• Success Message
• Order Details
• Expected Delivery Date
       │
       ↓
Options:
• Track Order
• Download Invoice
• Continue Shopping

─────────────────────────────────────────────────────────────────────────────

ORDER TRACKING FLOW:
────────────────────

User in Orders Page
       │
       ↓
Clicks "Track Order"
       │
       ↓
Navigate to Order Detail Page
       │
       ↓
dispatch(fetchOrderById(orderId))
       │
       ↓
API Call: GET /api/orders/:id
       │
       ↓
Receive Order Details + Timeline
       │
       ↓
Show Order Timeline:
┌──────────────────────────┐
│ ✓ Order Placed           │
│   Jan 20, 10:00 AM       │
│                          │
│ ✓ Order Confirmed        │
│   Jan 20, 11:30 AM       │
│                          │
│ ⏳ Shipped                │
│   Jan 21, 09:00 AM       │
│                          │
│ ⏳ Out for Delivery       │
│   Expected: Jan 23       │
│                          │
│ ○ Delivered              │
│                          │
└──────────────────────────┘


CANCEL ORDER FLOW:
──────────────────

User Clicks "Cancel Order"
       │
       ↓
Check Order Status
       │
  ┌────┴────┐
  ↓         ↓
Can      Cannot
Cancel   Cancel
  │         │
  ↓         ↓
Show     Show
Confirm  Error:
Modal    "Already
  │      Shipped"
  ↓
User Confirms
       │
       ↓
dispatch(cancelOrder(orderId))
       │
       ↓
API Call: PATCH /api/orders/:id/cancel
       │
       ↓
Backend:
• Update order status
• Restore product stock
• Process refund (if paid online)
       │
       ↓
Update Order Status in UI
       │
       ↓
Show Success Toast
```

---

### **4. Admin Product Management Flow**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ADMIN PRODUCT MANAGEMENT FLOW                             │
└─────────────────────────────────────────────────────────────────────────────┘

ADD PRODUCT:
────────────

Admin in Admin Products Page
       │
       ↓
Clicks "Add New Product"
       │
       ↓
Navigate to Add Product Page
       │
       ↓
┌──────────────────────────┐
│    Product Form          │
│  • Name                  │
│  • Description           │
│  • Price                 │
│  • Category              │
│  • Stock                 │
│  • Images (upload)       │
│  • Brand                 │
│  • Features              │
└──────────────────────────┘
       │
       ↓
Admin Fills Form
       │
       ↓
Selects Images to Upload
       │
       ↓
Clicks "Add Product"
       │
       ↓
Client-side Validation
       │
  ┌────┴────┐
  ↓         ↓
Valid    Invalid
  │         │
  ↓         ↓
Upload   Show
Images   Error
to       Messages
Cloudinary
  │
  ↓
Get Image URLs
  │
  ↓
dispatch(addProduct(formData))
  │
  ↓
API Call: POST /api/admin/products
  │
  ↓
Backend:
• Validate data
• Save to MongoDB
• Return product ID
  │
  ┌────┴────┐
  ↓         ↓
Success  Failed
  │         │
  ↓         ↓
Show     Show
Success  Error
Toast    Toast
  │
  ↓
Redirect to Products List
  │
  ↓
New Product Appears in List


EDIT PRODUCT:
─────────────

Admin Clicks "Edit" on Product
       │
       ↓
Navigate to Edit Product Page
       │
       ↓
dispatch(fetchProductById(id))
       │
       ↓
API Call: GET /api/products/:id
       │
       ↓
Pre-fill Form with Existing Data
       │
       ↓
Admin Makes Changes
       │
       ↓
Clicks "Update Product"
       │
       ↓
If new images → Upload to Cloudinary
       │
       ↓
dispatch(updateProduct(id, formData))
       │
       ↓
API Call: PATCH /api/admin/products/:id
       │
       ↓
Backend Updates Product
       │
       ↓
Show Success Toast
       │
       ↓
Redirect to Products List


DELETE PRODUCT:
───────────────

Admin Clicks "Delete" on Product
       │
       ↓
Show Confirmation Modal
"Are you sure you want to delete this product?"
       │
  ┌────┴────┐
  ↓         ↓
Confirm   Cancel
  │         │
  ↓         ↓
dispatch( Close
deleteProd Modal
  │
  ↓
API Call: DELETE /api/admin/products/:id
  │
  ┌────┴────┐
  ↓         ↓
Success  Failed
  │         │
  ↓         ↓
Remove   Show
from     Error
List     Toast
  │
  ↓
Show Success Toast


MANAGE STOCK:
─────────────

Admin Views Product List
       │
       ↓
Sees Stock Indicator:
• In Stock (Green)
• Low Stock (Orange)
• Out of Stock (Red)
       │
       ↓
Clicks "Update Stock"
       │
       ↓
Show Stock Update Modal
       │
       ↓
Enters New Stock Value
       │
       ↓
dispatch(updateStock(id, stock))
       │
       ↓
API Call: PATCH /api/admin/products/:id/stock
       │
       ↓
Backend Updates Stock
       │
       ↓
UI Updates Immediately
       │
       ↓
Show Success Toast
```

---

### **5. Search & Filter Flow**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SEARCH & FILTER FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

SEARCH:
───────

User Types in Search Bar (Navbar)
       │
       ↓
useDebounce(searchTerm, 500ms)
       │
       ↓
After 500ms of no typing
       │
       ↓
dispatch(searchProducts(searchTerm))
       │
       ↓
API Call: GET /api/products?search=term
       │
       ↓
Backend:
• Search in name, description, category
• Return matching products
       │
       ↓
Update Redux: products[]
       │
       ↓
Show Search Results Page
       │
       ↓
If no results → Show "No products found"


FILTER:
───────

User in Product List Page
       │
       ↓
Clicks on Filter Option
(e.g., Category, Price Range)
       │
       ↓
┌──────────────────────────┐
│   FilterSidebar          │
│                          │
│ Categories:              │
│ ☑ Rockets                │
│ ☐ Sparklers              │
│                          │
│ Price Range:             │
│ [====|=====]             │
│ ₹100 - ₹5000             │
│                          │
│ Rating:                  │
│ ⭐ 4 & above             │
│                          │
│ Discount:                │
│ ☐ 50% & more             │
│                          │
│ [Clear All]              │
└──────────────────────────┘
       │
       ↓
User Selects Filters
       │
       ↓
dispatch(applyFilters(filterObj))
       │
       ↓
Build Query Parameters:
?category=rockets&minPrice=100&maxPrice=5000&rating=4
       │
       ↓
API Call: GET /api/products?...
       │
       ↓
Backend Filters Products
       │
       ↓
Return Filtered Results
       │
       ↓
Update Product Grid
       │
       ↓
Show Count: "Showing 24 of 120 products"


SORT:
─────

User Clicks Sort Dropdown
       │
       ↓
┌──────────────────────────┐
│  Sort By:                │
│  ○ Relevance (default)   │
│  ○ Price: Low to High    │
│  ○ Price: High to Low    │
│  ○ Rating: High to Low   │
│  ○ Newest First          │
└──────────────────────────┘
       │
       ↓
User Selects Sort Option
       │
       ↓
dispatch(sortProducts(sortBy))
       │
       ↓
Update Query: ?sort=price_asc
       │
       ↓
API Call: GET /api/products?sort=...
       │
       ↓
Backend Sorts Results
       │
       ↓
Update Product Grid
       │
       ↓
Products Rearrange


PAGINATION:
───────────

User Scrolls to Bottom
       │
       ↓
Sees Pagination Component
┌──────────────────────────┐
│ [← Prev] [1] [2] [3] ... │
│ [10] [Next →]            │
└──────────────────────────┘
       │
       ↓
Clicks Page Number (e.g., 2)
       │
       ↓
dispatch(fetchProducts(page=2))
       │
       ↓
Update Query: ?page=2&limit=24
       │
       ↓
API Call: GET /api/products?page=2&limit=24
       │
       ↓
Backend Returns Page 2 Products
       │
       ↓
Update Product Grid
       │
       ↓
Scroll to Top of Page
```

---

## 🎨 State Management Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      REDUX STATE MANAGEMENT FLOW                             │
└─────────────────────────────────────────────────────────────────────────────┘

USER ACTION (e.g., Click "Add to Cart")
       │
       ↓
EVENT HANDLER (handleAddToCart)
       │
       ↓
DISPATCH ACTION
dispatch(addToCart(product))
       │
       ↓
┌────────────────────────────┐
│   REDUX MIDDLEWARE         │
│   (Thunk / Saga)           │
└────────────────────────────┘
       │
  ┌────┴────┐
  ↓         ↓
Sync     Async
Action   Action
  │         │
  │         ↓
  │    dispatch(pending)
  │         │
  │         ↓
  │    API CALL
  │         │
  │    ┌────┴────┐
  │    ↓         ↓
  │ Success   Failed
  │    │         │
  │    ↓         ↓
  │ dispatch dispatch
  │ (fulfilled)(rejected)
  │    │         │
  └────┴─────────┘
       │
       ↓
┌────────────────────────────┐
│   REDUCER                  │
│   (Pure Function)          │
│   • Takes current state    │
│   • Takes action           │
│   • Returns new state      │
└────────────────────────────┘
       │
       ↓
┌────────────────────────────┐
│   REDUX STORE              │
│   (Updated State)          │
└────────────────────────────┘
       │
       ↓
COMPONENT SUBSCRIBED (useSelector)
       │
       ↓
COMPONENT RE-RENDERS
       │
       ↓
UI UPDATES (Shows new data)
       │
       ↓
USER SEES UPDATED INTERFACE
```

---

## 🔐 Authorization Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AUTHORIZATION FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────┘

User Attempts to Access Protected Route
       │
       ↓
<ProtectedRoute> Component Renders
       │
       ↓
Check if User is Authenticated
(Check Redux: auth.isAuth)
       │
  ┌────┴────┐
  ↓         ↓
 Yes       No
  │         │
  ↓         ↓
Check    Redirect
Role     to Login
  │      (Save intended URL)
  │
  ├───────┬───────┐
  ↓       ↓       ↓
User   Admin  Other
  │       │       │
  ↓       ↓       ↓
Allow  Check  Deny
Access isAdmin (403)
       │
  ┌────┴────┐
  ↓         ↓
 Yes       No
  │         │
  ↓         ↓
Allow   Redirect
Admin   to Home
Panel   (Unauthorized)


JWT TOKEN FLOW:
───────────────

User Logs In
       │
       ↓
Backend Generates JWT
       │
       ↓
Token Sent to Frontend
       │
       ↓
Store in Redux + LocalStorage
       │
       ↓
Every API Request:
       │
       ↓
Axios Interceptor Adds Token
Authorization: Bearer <token>
       │
       ↓
Backend Middleware Verifies Token
       │
  ┌────┴────┐
  ↓         ↓
Valid    Invalid/
Token    Expired
  │         │
  ↓         ↓
Allow    Return
Request  401
  │
  ↓
Execute API Logic
  │
  ↓
Return Response


TOKEN EXPIRY HANDLING:
──────────────────────

API Returns 401 (Token Expired)
       │
       ↓
Axios Interceptor Catches Error
       │
       ↓
Attempt to Refresh Token
       │
       ↓
API Call: POST /api/auth/refresh
(Send refresh token)
       │
  ┌────┴────┐
  ↓         ↓
Success  Failed
  │         │
  ↓         ↓
Get New  Logout
Token    User
  │         │
  ↓         ↓
Update   Clear
Redux &  State
Storage
  │         │
  ↓         ↓
Retry    Redirect
Original to Login
Request
```

---

**Generated on**: February 26, 2026  
**Project**: Fireworks & Crackers E-Commerce Platform  
**Purpose**: Complete user journey and interaction flow reference
