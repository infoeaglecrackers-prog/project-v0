# 🎨 Visual Component Map
## Fireworks E-Commerce - UI Component Hierarchy

---

## 📱 Screen-by-Screen Component Breakdown

### **1. Home Page** (`HomePage.jsx`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                          <Navbar />                                 │    │
│  │  ┌──────┐  Search  [Categories ▼]  Cart(3)  Wishlist(5)  Profile  │    │
│  │  │ LOGO │                                                            │    │
│  │  └──────┘                                                            │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                       HERO SECTION                                  │    │
│  │  ┌──────────────────────────────────────────────────────────────┐  │    │
│  │  │                                                               │  │    │
│  │  │  🎆  BIG DIWALI SALE  🎆                                     │  │    │
│  │  │                                                               │  │    │
│  │  │  Up to 50% OFF on All Fireworks!                            │  │    │
│  │  │                                                               │  │    │
│  │  │  [ Shop Now ]                                                │  │    │
│  │  │                                                               │  │    │
│  │  └──────────────────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                    CATEGORIES SECTION                               │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │    │
│  │  │  [Icon]  │  │  [Icon]  │  │  [Icon]  │  │  [Icon]  │           │    │
│  │  │ Sparklers│  │  Rockets │  │  Bombs   │  │  Flower  │           │    │
│  │  │          │  │          │  │          │  │   Pots   │           │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                   FEATURED PRODUCTS                                 │    │
│  │                                                                      │    │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐  │    │
│  │  │  <ProductCard />                                              │  │    │
│  │  │  ┌────────┐ │  │  ┌────────┐ │  │  ┌────────┐ │  │  ┌────────┐│  │  │
│  │  │  │ Image  │ │  │  │ Image  │ │  │  │ Image  │ │  │  │ Image  ││  │  │
│  │  │  │        │ │  │  │        │ │  │  │        │ │  │  │        ││  │  │
│  │  │  └────────┘ │  │  └────────┘ │  │  └────────┘ │  │  └────────┘│  │  │
│  │  │  Name       │  │  Name       │  │  Name       │  │  Name      │  │  │
│  │  │  ⭐⭐⭐⭐⭐  │  │  ⭐⭐⭐⭐    │  │  ⭐⭐⭐⭐⭐  │  │  ⭐⭐⭐⭐   │  │  │
│  │  │  ₹299  ₹499│  │  ₹399  ₹599│  │  ₹199  ₹299│  │  ₹599 ₹799│  │  │
│  │  │  [Add Cart]│  │  [Add Cart]│  │  [Add Cart]│  │  [Add Cart]│  │  │
│  │  │  ♡         │  │  ♡         │  │  ♡         │  │  ♡        │  │  │
│  │  └────────────┘  └────────────┘  └────────────┘  └────────────┘  │    │
│  │                                                                      │    │
│  │  [← Previous]                               [Next →]               │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                   BEST SELLERS                                      │    │
│  │  (Similar grid as Featured Products)                               │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                   TESTIMONIALS                                      │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │ "Amazing quality! Fast delivery!"                            │   │    │
│  │  │ ⭐⭐⭐⭐⭐  - John Doe                                        │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                          <Footer />                                 │    │
│  │  About | Contact | FAQs | Terms | Privacy | Social Icons           │    │
│  │  © 2026 Fireworks Shop                                             │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Components Used:**
- `<Navbar />`
- `<HeroSection />`
- `<CategoryCard />` (x4+)
- `<ProductCard />` (x8+)
- `<TestimonialCard />` (x3+)
- `<Footer />`

---

### **2. Product List Page** (`ProductListPage.jsx`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  <Navbar />                                                                  │
├───────────────────┬──────────────────────────────────────────────────────────┤
│                   │                                                          │
│  <FilterSidebar/> │              <ProductGrid />                            │
│                   │                                                          │
│  ┌──────────────┐ │  ┌──────────────────────────────────────────────────┐  │
│  │ FILTERS      │ │  │  Showing 24 of 120 products    [Sort by: ▼]     │  │
│  ├──────────────┤ │  └──────────────────────────────────────────────────┘  │
│  │              │ │                                                          │
│  │ Categories   │ │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                  │
│  │ ☐ Sparklers  │ │  │Product│ │Product│ │Product│ │Product│                │
│  │ ☑ Rockets    │ │  │ Card  │ │ Card  │ │ Card  │ │ Card  │                │
│  │ ☐ Bombs      │ │  │   1   │ │   2   │ │   3   │ │   4   │                │
│  │              │ │  └──────┘ └──────┘ └──────┘ └──────┘                  │
│  │ Price Range  │ │                                                          │
│  │ [====|=====] │ │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                  │
│  │ ₹100 - ₹5000 │ │  │Product│ │Product│ │Product│ │Product│                │
│  │              │ │  │ Card  │ │ Card  │ │ Card  │ │ Card  │                │
│  │ Rating       │ │  │   5   │ │   6   │ │   7   │ │   8   │                │
│  │ ⭐ 4 & above │ │  └──────┘ └──────┘ └──────┘ └──────┘                  │
│  │ ⭐ 3 & above │ │                                                          │
│  │              │ │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                  │
│  │ Brand        │ │  │Product│ │Product│ │Product│ │Product│                │
│  │ ☐ Brand A    │ │  │ Card  │ │ Card  │ │ Card  │ │ Card  │                │
│  │ ☐ Brand B    │ │  │   9   │ │  10   │ │  11   │ │  12   │                │
│  │              │ │  └──────┘ └──────┘ └──────┘ └──────┘                  │
│  │ Discount     │ │                                                          │
│  │ ☐ 50% & more │ │                                                          │
│  │ ☐ 40% & more │ │  <Pagination />                                         │
│  │              │ │  [← Prev]  [1] [2] [3] ... [10]  [Next →]              │
│  │ [Clear All]  │ │                                                          │
│  └──────────────┘ │                                                          │
│                   │                                                          │
└───────────────────┴──────────────────────────────────────────────────────────┘
│  <Footer />                                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Components Used:**
- `<Navbar />`
- `<FilterSidebar />` (with checkboxes, sliders)
- `<ProductGrid />` (contains multiple `<ProductCard />`)
- `<SortDropdown />`
- `<Pagination />`
- `<Footer />`

---

### **3. Product Detail Page** (`ProductDetailPage.jsx`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  <Navbar />                                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  <Breadcrumbs />  Home > Rockets > 5000 Ladi                                │
│                                                                              │
├────────────────────────────┬─────────────────────────────────────────────────┤
│                            │                                                 │
│  <ProductImageGallery />   │       <ProductInfo />                          │
│                            │                                                 │
│  ┌──────────────────────┐ │  5000 Ladi Super Rocket                        │
│  │                      │ │  ⭐⭐⭐⭐⭐ (245 reviews)                        │
│  │    MAIN IMAGE        │ │                                                 │
│  │                      │ │  ₹2,499  ₹3,999  (38% OFF)                     │
│  │                      │ │                                                 │
│  │                      │ │  In Stock: 45 left                             │
│  └──────────────────────┘ │                                                 │
│                            │  Color: Red                                    │
│  ┌────┐ ┌────┐ ┌────┐    │  [Red] [Blue] [Green]                          │
│  │Img1│ │Img2│ │Img3│    │                                                 │
│  └────┘ └────┘ └────┘    │  Quantity: [-] [1] [+]                         │
│                            │                                                 │
│                            │  [🛒 Add to Cart]  [♡ Wishlist]               │
│                            │  [⚡ Buy Now]                                  │
│                            │                                                 │
│                            │  Delivery: Free on orders above ₹500          │
│                            │  Expected: 3-5 days                            │
│                            │                                                 │
└────────────────────────────┴─────────────────────────────────────────────────┤
│                                                                              │
│  <ProductTabs />                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │  [Description] [Specifications] [Reviews (245)]                     │    │
│  ├────────────────────────────────────────────────────────────────────┤    │
│  │                                                                      │    │
│  │  High-quality 5000-wala ladi rocket with multiple colors and       │    │
│  │  loud sound effects. Perfect for Diwali celebrations...            │    │
│  │                                                                      │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  <Reviews />                                                                 │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │  <ReviewCard />                                                      │    │
│  │  ┌──────────────────────────────────────────────────────────────┐  │    │
│  │  │  👤 John Doe        ⭐⭐⭐⭐⭐                               │  │    │
│  │  │  "Excellent quality! Kids loved it!"                         │  │    │
│  │  │  Was this helpful? [👍 15] [👎 0]                           │  │    │
│  │  └──────────────────────────────────────────────────────────────┘  │    │
│  │  (More review cards...)                                             │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  <RelatedProducts />                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │  You May Also Like                                                  │    │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                              │    │
│  │  │Product│ │Product│ │Product│ │Product│                              │    │
│  │  │ Card  │ │ Card  │ │ Card  │ │ Card  │                              │    │
│  │  └──────┘ └──────┘ └──────┘ └──────┘                              │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  <Footer />                                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Components Used:**
- `<Navbar />`
- `<Breadcrumbs />`
- `<ProductImageGallery />`
- `<ProductInfo />`
- `<ProductTabs />`
- `<ReviewCard />` (multiple)
- `<RelatedProducts />` (carousel with `<ProductCard />`)
- `<Footer />`

---

### **4. Cart Page** (`CartPage.jsx`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  <Navbar />                                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Shopping Cart (3 items)                                                    │
│                                                                              │
├──────────────────────────────────────────┬───────────────────────────────────┤
│                                          │                                   │
│  CART ITEMS                              │   <CartSummary />                │
│                                          │                                   │
│  ┌────────────────────────────────────┐ │  ┌─────────────────────────────┐ │
│  │  <CartItem />                      │ │  │ Order Summary            │ │ │
│  │  ┌────┐                            │ │  ├─────────────────────────────┤ │
│  │  │Img │ 5000 Ladi Rocket          │ │  │ Subtotal (3 items): ₹6,297 │ │
│  │  │    │ Color: Red                 │ │  │ Discount:          -₹1,500 │ │
│  │  └────┘ Qty: [-] [2] [+]          │ │  │ Delivery:              FREE │ │
│  │          ₹2,499                    │ │  │                             │ │
│  │          [Remove] [Save for Later]│ │  │ ─────────────────────────── │ │
│  └────────────────────────────────────┘ │  │ Total:             ₹4,797  │ │
│                                          │  └─────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │                                   │
│  │  <CartItem />                      │ │  ┌─────────────────────────────┐ │
│  │  ┌────┐                            │ │  │ Coupon Code                │ │
│  │  │Img │ Sparklers 10 Pack         │ │  │ [Enter code]  [Apply]      │ │
│  │  │    │ Qty: [-] [5] [+]          │ │  └─────────────────────────────┘ │
│  │  └────┘ ₹199                       │ │                                   │
│  │          [Remove] [Save for Later]│ │  [🛒 Proceed to Checkout]         │
│  └────────────────────────────────────┘ │                                   │
│                                          │  [← Continue Shopping]            │
│  ┌────────────────────────────────────┐ │                                   │
│  │  <CartItem />                      │ │                                   │
│  │  (Similar structure)               │ │                                   │
│  └────────────────────────────────────┘ │                                   │
│                                          │                                   │
└──────────────────────────────────────────┴───────────────────────────────────┤
│  <Footer />                                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Components Used:**
- `<Navbar />`
- `<CartItem />` (x3+)
- `<CartSummary />`
- `<CouponInput />`
- `<Footer />`

---

### **5. Checkout Page** (`CheckoutPage.jsx`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  <Navbar />                                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Checkout                                                                    │
│                                                                              │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐                                       │
│  │  1  │──│  2  │──│  3  │──│  4  │  (Stepper)                             │
│  └─────┘  └─────┘  └─────┘  └─────┘                                       │
│  Address  Payment  Review   Done                                            │
│                                                                              │
├──────────────────────────────────────────┬───────────────────────────────────┤
│                                          │                                   │
│  STEP 1: Delivery Address                │   ORDER SUMMARY                  │
│                                          │                                   │
│  <AddressList />                         │  ┌─────────────────────────────┐ │
│  ┌────────────────────────────────────┐ │  │ 3 items            ₹4,797  │ │
│  │  ☑ John Doe                        │ │  ├─────────────────────────────┤ │
│  │     123 Main St, Apt 4B            │ │  │ • 5000 Ladi Rocket (x2)    │ │
│  │     New York, NY 10001             │ │  │   ₹2,499                    │ │
│  │     [Edit] [Delete]                │ │  │ • Sparklers 10 Pack (x5)   │ │
│  └────────────────────────────────────┘ │  │   ₹199                      │ │
│                                          │  │ • Flower Pot (x1)           │ │
│  ┌────────────────────────────────────┐ │  │   ₹599                      │ │
│  │  ☐ Jane Smith                      │ │  └─────────────────────────────┘ │
│  │     456 Oak Ave                    │ │                                   │
│  │     Los Angeles, CA 90001          │ │  Delivery: FREE                  │
│  │     [Edit] [Delete]                │ │  Total: ₹4,797                   │
│  └────────────────────────────────────┘ │                                   │
│                                          │                                   │
│  [+ Add New Address]                    │                                   │
│                                          │                                   │
│  <AddressForm />                         │                                   │
│  ┌────────────────────────────────────┐ │                                   │
│  │  [Full Name]                       │ │                                   │
│  │  [Phone Number]                    │ │                                   │
│  │  [Pincode]                         │ │                                   │
│  │  [Address Line 1]                  │ │                                   │
│  │  [Address Line 2]                  │ │                                   │
│  │  [City]          [State]           │ │                                   │
│  │  ☐ Make this default address       │ │                                   │
│  │  [Cancel]  [Save Address]          │ │                                   │
│  └────────────────────────────────────┘ │                                   │
│                                          │                                   │
│                          [Continue →]    │                                   │
│                                          │                                   │
└──────────────────────────────────────────┴───────────────────────────────────┤
│  <Footer />                                                                  │
└─────────────────────────────────────────────────────────────────────────────┘

STEP 2: Payment Options
┌─────────────────────────────────────────────────────────────────────────────┐
│  <PaymentOptions />                                                          │
│                                                                              │
│  ┌────────────────────────────────────────┐                                 │
│  │  ☑ Cash on Delivery (COD)              │                                 │
│  │     Pay when you receive the product   │                                 │
│  └────────────────────────────────────────┘                                 │
│                                                                              │
│  ┌────────────────────────────────────────┐                                 │
│  │  ☐ Card Payment                        │                                 │
│  │     Credit / Debit / ATM Card          │                                 │
│  │     [Card Number]                      │                                 │
│  │     [MM/YY]  [CVV]                     │                                 │
│  └────────────────────────────────────────┘                                 │
│                                                                              │
│  ┌────────────────────────────────────────┐                                 │
│  │  ☐ UPI                                 │                                 │
│  │     [Enter UPI ID]                     │                                 │
│  └────────────────────────────────────────┘                                 │
│                                                                              │
│  ┌────────────────────────────────────────┐                                 │
│  │  ☐ Wallet (Paytm, PhonePe, etc.)      │                                 │
│  └────────────────────────────────────────┘                                 │
│                                                                              │
│                          [Continue →]                                        │
└─────────────────────────────────────────────────────────────────────────────┘

STEP 3: Order Review
┌─────────────────────────────────────────────────────────────────────────────┐
│  <OrderReview />                                                             │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Delivery Address                                                     │  │
│  │  John Doe, 123 Main St, Apt 4B, New York, NY 10001                   │  │
│  │  [Change]                                                             │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Payment Method: Cash on Delivery (COD)    [Change]                  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Order Items (3)                                                      │  │
│  │  • 5000 Ladi Rocket (x2) - ₹2,499                                    │  │
│  │  • Sparklers 10 Pack (x5) - ₹199                                     │  │
│  │  • Flower Pot (x1) - ₹599                                            │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Order Total: ₹4,797                                                  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ☐ I agree to Terms & Conditions                                            │
│                                                                              │
│                          [Place Order]                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Components Used:**
- `<Navbar />`
- `<Stepper />`
- `<AddressList />`
- `<AddressForm />`
- `<PaymentOptions />`
- `<OrderReview />`
- `<OrderSummary />`
- `<Footer />`

---

### **6. Orders Page** (`OrdersPage.jsx`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  <Navbar />                                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  My Orders                                                                   │
│                                                                              │
│  [All Orders] [Pending] [Delivered] [Cancelled]                             │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │  <OrderCard />                                                      │    │
│  │  ┌──────────────────────────────────────────────────────────────┐  │    │
│  │  │  Order #12345                          [Delivered ✓]         │  │    │
│  │  │  Placed on: Jan 15, 2026                                     │  │    │
│  │  │                                                               │  │    │
│  │  │  ┌────┐  5000 Ladi Rocket (x2)                              │  │    │
│  │  │  │Img │  + 2 more items                                      │  │    │
│  │  │  └────┘                                                       │  │    │
│  │  │                                                               │  │    │
│  │  │  Total: ₹4,797                                               │  │    │
│  │  │  [View Details]  [Download Invoice]  [Rate & Review]        │  │    │
│  │  └──────────────────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │  <OrderCard />                                                      │    │
│  │  ┌──────────────────────────────────────────────────────────────┐  │    │
│  │  │  Order #12344                          [Shipped 📦]          │  │    │
│  │  │  Placed on: Jan 20, 2026                                     │  │    │
│  │  │  Expected delivery: Jan 25, 2026                             │  │    │
│  │  │                                                               │  │    │
│  │  │  ┌────┐  Sparklers 10 Pack (x5)                             │  │    │
│  │  │  │Img │  + 1 more item                                       │  │    │
│  │  │  └────┘                                                       │  │    │
│  │  │                                                               │  │    │
│  │  │  Total: ₹1,295                                               │  │    │
│  │  │  [Track Order]  [View Details]  [Cancel Order]              │  │    │
│  │  └──────────────────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  (More order cards...)                                                      │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  <Footer />                                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Components Used:**
- `<Navbar />`
- `<Tabs />` (All, Pending, Delivered, Cancelled)
- `<OrderCard />` (multiple)
- `<Footer />`

---

### **7. Admin Dashboard** (`AdminDashboard.jsx`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  <Navbar />                                                                  │
├────────────────┬────────────────────────────────────────────────────────────┤
│                │                                                            │
│  <AdminSidebar>│              DASHBOARD                                     │
│                │                                                            │
│  ┌──────────┐ │  <DashboardStats />                                        │
│  │ Dashboard│ │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ │
│  │ Products │ │  │📦 Orders  │ │💰 Revenue │ │👥 Users   │ │🛒 Products│ │
│  │ Orders   │ │  │   1,234   │ │  ₹5.2L    │ │   5,678   │ │    890    │ │
│  │ Users    │ │  │  +12%     │ │  +15%     │ │  +8%      │ │  +5%      │ │
│  │ Categories│ │  └───────────┘ └───────────┘ └───────────┘ └───────────┘ │
│  │ Settings │ │                                                            │
│  └──────────┘ │  <RevenueChart />                                          │
│                │  ┌──────────────────────────────────────────────────────┐ │
│                │  │                                                       │ │
│                │  │       Revenue Chart (Line/Bar)                       │ │
│                │  │       [Last 7 days] [Last 30 days] [Last year]      │ │
│                │  │                                                       │ │
│                │  │       (Chart visualization)                          │ │
│                │  │                                                       │ │
│                │  └──────────────────────────────────────────────────────┘ │
│                │                                                            │
│                │  Recent Orders                                             │
│                │  <OrderTable />                                            │
│                │  ┌──────────────────────────────────────────────────────┐ │
│                │  │ Order ID | Customer | Date    | Total  | Status     │ │
│                │  ├──────────────────────────────────────────────────────┤ │
│                │  │ #12345   | John Doe | Jan 20  | ₹4,797 | [Pending]  │ │
│                │  │ #12344   | Jane S.  | Jan 19  | ₹1,295 | [Shipped]  │ │
│                │  │ #12343   | Bob J.   | Jan 18  | ₹3,500 | [Delivered]│ │
│                │  │ ...                                                   │ │
│                │  └──────────────────────────────────────────────────────┘ │
│                │                                                            │
└────────────────┴────────────────────────────────────────────────────────────┤
│  <Footer />                                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Components Used:**
- `<Navbar />`
- `<AdminSidebar />`
- `<DashboardStats />` (4x stat cards)
- `<RevenueChart />`
- `<OrderTable />`
- `<Footer />`

---

## 🎯 Component Dependency Tree

```
App.jsx
│
├── <Router>
│   │
│   ├── Public Routes
│   │   ├── HomePage
│   │   │   ├── Navbar
│   │   │   ├── HeroSection
│   │   │   ├── CategorySection
│   │   │   │   └── CategoryCard (x4+)
│   │   │   ├── FeaturedProducts
│   │   │   │   ├── ProductGrid
│   │   │   │   │   └── ProductCard (x8+)
│   │   │   │   └── ProductCarousel
│   │   │   ├── BestSellers
│   │   │   ├── Testimonials
│   │   │   │   └── TestimonialCard (x3+)
│   │   │   └── Footer
│   │   │
│   │   ├── ProductListPage
│   │   │   ├── Navbar
│   │   │   ├── FilterSidebar
│   │   │   ├── ProductGrid
│   │   │   │   └── ProductCard (xN)
│   │   │   ├── SortDropdown
│   │   │   ├── Pagination
│   │   │   └── Footer
│   │   │
│   │   ├── ProductDetailPage
│   │   │   ├── Navbar
│   │   │   ├── Breadcrumbs
│   │   │   ├── ProductImageGallery
│   │   │   ├── ProductInfo
│   │   │   ├── ProductTabs
│   │   │   ├── ReviewSection
│   │   │   │   └── ReviewCard (xN)
│   │   │   ├── RelatedProducts
│   │   │   │   └── ProductCard (xN)
│   │   │   └── Footer
│   │   │
│   │   ├── LoginPage
│   │   │   ├── Navbar
│   │   │   ├── LoginForm
│   │   │   └── Footer
│   │   │
│   │   └── RegisterPage
│   │       ├── Navbar
│   │       ├── RegisterForm
│   │       └── Footer
│   │
│   ├── Protected Routes (Require Authentication)
│   │   ├── CartPage
│   │   │   ├── Navbar
│   │   │   ├── CartItem (xN)
│   │   │   ├── CartSummary
│   │   │   ├── CouponInput
│   │   │   └── Footer
│   │   │
│   │   ├── CheckoutPage
│   │   │   ├── Navbar
│   │   │   ├── Stepper
│   │   │   ├── AddressList
│   │   │   │   └── AddressCard (xN)
│   │   │   ├── AddressForm
│   │   │   ├── PaymentOptions
│   │   │   ├── OrderReview
│   │   │   ├── OrderSummary
│   │   │   └── Footer
│   │   │
│   │   ├── OrdersPage
│   │   │   ├── Navbar
│   │   │   ├── Tabs
│   │   │   ├── OrderCard (xN)
│   │   │   └── Footer
│   │   │
│   │   ├── OrderDetailPage
│   │   │   ├── Navbar
│   │   │   ├── OrderTimeline
│   │   │   ├── OrderItemList
│   │   │   └── Footer
│   │   │
│   │   ├── ProfilePage
│   │   │   ├── Navbar
│   │   │   ├── ProfileInfo
│   │   │   ├── EditProfileForm
│   │   │   └── Footer
│   │   │
│   │   └── WishlistPage
│   │       ├── Navbar
│   │       ├── ProductCard (xN)
│   │       └── Footer
│   │
│   └── Admin Routes (Require Authentication + Admin Role)
│       ├── AdminDashboard
│       │   ├── Navbar
│       │   ├── AdminSidebar
│       │   ├── DashboardStats
│       │   ├── RevenueChart
│       │   ├── OrderTable
│       │   └── Footer
│       │
│       ├── AdminProducts
│       │   ├── Navbar
│       │   ├── AdminSidebar
│       │   ├── ProductTable
│       │   ├── SearchBar
│       │   └── Footer
│       │
│       ├── AdminAddProduct
│       │   ├── Navbar
│       │   ├── AdminSidebar
│       │   ├── ProductForm
│       │   └── Footer
│       │
│       ├── AdminOrders
│       │   ├── Navbar
│       │   ├── AdminSidebar
│       │   ├── OrderTable
│       │   └── Footer
│       │
│       └── AdminUsers
│           ├── Navbar
│           ├── AdminSidebar
│           ├── UserTable
│           └── Footer
│
└── Global Components (Used Across Routes)
    ├── Navbar
    │   ├── Logo
    │   ├── SearchBar
    │   ├── NavLinks
    │   ├── CartBadge
    │   └── UserDropdown
    │
    ├── Footer
    │   ├── QuickLinks
    │   ├── SocialMedia
    │   └── Newsletter
    │
    ├── Loader
    ├── ErrorBoundary
    ├── Modal
    ├── Toast
    └── ProtectedRoute
```

---

## 📊 Interaction Flow Diagrams

### **Add to Cart Flow**

```
User clicks "Add to Cart" on ProductCard
           ↓
handleAddToCart() function called
           ↓
dispatch(addToCart(product))
           ↓
Redux: cartSlice reducer updates state
           ↓
Cart badge updates (shows new count)
           ↓
Toast notification: "Added to cart!"
           ↓
User can continue shopping or go to cart
```

### **Checkout Flow**

```
User clicks "Proceed to Checkout" in CartPage
           ↓
Navigate to CheckoutPage
           ↓
Step 1: Select/Add Delivery Address
           ↓
Step 2: Choose Payment Method
           ↓
Step 3: Review Order
           ↓
User clicks "Place Order"
           ↓
dispatch(createOrder(orderData))
           ↓
API call to backend: POST /api/orders
           ↓
Backend processes order, saves to DB
           ↓
Response: Order ID, status
           ↓
Redirect to Order Confirmation Page
           ↓
Show success message + order details
```

---

## 🎨 Design System Reference

### **Colors**
- Primary: `#FF6B35` (Orange)
- Secondary: `#004E89` (Blue)
- Success: `#28A745` (Green)
- Warning: `#FFC107` (Yellow)
- Error: `#DC3545` (Red)
- Background: `#F8F9FA` (Light Gray)
- Text: `#212529` (Dark Gray)

### **Typography**
- Headings: `font-family: 'Poppins', sans-serif`
- Body: `font-family: 'Inter', sans-serif`
- Font Sizes: 12px, 14px, 16px, 18px, 24px, 32px, 48px

### **Spacing**
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

### **Border Radius**
- sm: 4px
- md: 8px
- lg: 12px
- xl: 16px
- full: 9999px (pill)

---

**Generated on**: February 26, 2026
**Project**: Fireworks & Crackers E-Commerce Platform
**Version**: 1.0
