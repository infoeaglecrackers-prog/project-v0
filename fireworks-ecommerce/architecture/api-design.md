# 🔌 REST API Design
## Fireworks & Crackers E-Commerce — All Endpoints

**Base URL:** `https://api.yourfireworksstore.com/api`

**Auth Header:** `Authorization: Bearer <access_token>`

---

## 1. Auth Routes `/api/auth`

| Method | Endpoint                  | Description                | Auth     |
|--------|---------------------------|----------------------------|----------|
| POST   | `/auth/register`          | Register new user          | Public   |
| POST   | `/auth/login`             | Login user                 | Public   |
| POST   | `/auth/logout`            | Logout (clear refresh)     | Private  |
| POST   | `/auth/refresh-token`     | Get new access token       | Public   |
| POST   | `/auth/forgot-password`   | Send reset email           | Public   |
| PUT    | `/auth/reset-password/:token` | Reset password         | Public   |
| GET    | `/auth/me`                | Get logged in user         | Private  |

---

## 2. User Routes `/api/users`

| Method | Endpoint                  | Description                | Auth     |
|--------|---------------------------|----------------------------|----------|
| GET    | `/users/profile`          | Get user profile           | Private  |
| PUT    | `/users/profile`          | Update profile             | Private  |
| PUT    | `/users/password`         | Change password            | Private  |
| POST   | `/users/avatar`           | Upload profile picture     | Private  |

---

## 3. Product Routes `/api/products`

| Method | Endpoint                  | Description                | Auth     |
|--------|---------------------------|----------------------------|----------|
| GET    | `/products`               | Get all products (filter/sort/paginate) | Public |
| GET    | `/products/:id`           | Get single product         | Public   |
| GET    | `/products/featured`      | Get featured products      | Public   |
| GET    | `/products/bestsellers`   | Get best sellers           | Public   |
| POST   | `/products`               | Create product             | Admin    |
| PUT    | `/products/:id`           | Update product             | Admin    |
| DELETE | `/products/:id`           | Delete product             | Admin    |
| POST   | `/products/:id/images`    | Upload product images      | Admin    |
| DELETE | `/products/:id/images/:imgId` | Delete product image   | Admin    |

**Query Parameters for GET /products:**
```
?keyword=sparkler
?category=<categoryId>
?price[gte]=100&price[lte]=5000
?ratings[gte]=4
?sort=-price          (desc price)
?sort=price           (asc price)
?sort=-createdAt      (newest)
?page=1&limit=12
?isFeatured=true
```

---

## 4. Category Routes `/api/categories`

| Method | Endpoint                  | Description                | Auth     |
|--------|---------------------------|----------------------------|----------|
| GET    | `/categories`             | Get all categories         | Public   |
| GET    | `/categories/:id`         | Get single category        | Public   |
| POST   | `/categories`             | Create category            | Admin    |
| PUT    | `/categories/:id`         | Update category            | Admin    |
| DELETE | `/categories/:id`         | Delete category            | Admin    |

---

## 5. Cart Routes `/api/cart`

| Method | Endpoint                  | Description                | Auth     |
|--------|---------------------------|----------------------------|----------|
| GET    | `/cart`                   | Get user's cart            | Private  |
| POST   | `/cart`                   | Add item to cart           | Private  |
| PUT    | `/cart/:productId`        | Update quantity            | Private  |
| DELETE | `/cart/:productId`        | Remove item from cart      | Private  |
| DELETE | `/cart`                   | Clear entire cart          | Private  |

**POST /cart body:**
```json
{
  "productId": "64abc...",
  "quantity": 2
}
```

---

## 6. Wishlist Routes `/api/wishlist`

| Method | Endpoint                  | Description                | Auth     |
|--------|---------------------------|----------------------------|----------|
| GET    | `/wishlist`               | Get user's wishlist        | Private  |
| POST   | `/wishlist/:productId`    | Add/Remove toggle          | Private  |

---

## 7. Order Routes `/api/orders`

| Method | Endpoint                  | Description                | Auth     |
|--------|---------------------------|----------------------------|----------|
| POST   | `/orders`                 | Place new order            | Private  |
| GET    | `/orders`                 | Get my orders              | Private  |
| GET    | `/orders/:id`             | Get order detail           | Private  |
| PUT    | `/orders/:id/cancel`      | Cancel order               | Private  |
| GET    | `/orders/:id/invoice`     | Download invoice PDF       | Private  |

**POST /orders body:**
```json
{
  "shippingAddress": {
    "fullName": "Ravi Kumar",
    "phone": "9876543210",
    "addressLine1": "12, MG Road",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600001"
  },
  "paymentMethod": "razorpay",
  "items": [
    { "productId": "64abc...", "quantity": 3 }
  ]
}
```

---

## 8. Payment Routes `/api/payment`

| Method | Endpoint                        | Description              | Auth    |
|--------|---------------------------------|--------------------------|---------|
| POST   | `/payment/create-order`         | Create Razorpay order    | Private |
| POST   | `/payment/verify`               | Verify payment signature | Private |
| POST   | `/payment/webhook`              | Razorpay webhook         | Public  |

**POST /payment/create-order body:**
```json
{ "amount": 34900 }   // Amount in paise (₹349 = 34900)
```

**POST /payment/verify body:**
```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "sig_xxx",
  "orderId": "64abc..."
}
```

---

## 9. Review Routes `/api/reviews`

| Method | Endpoint                  | Description                | Auth     |
|--------|---------------------------|----------------------------|----------|
| GET    | `/reviews/product/:productId` | Get reviews for product | Public   |
| POST   | `/reviews/product/:productId` | Add review             | Private  |
| PUT    | `/reviews/:id`            | Update own review          | Private  |
| DELETE | `/reviews/:id`            | Delete review              | Private  |

---

## 10. Address Routes `/api/addresses`

| Method | Endpoint                  | Description                | Auth     |
|--------|---------------------------|----------------------------|----------|
| GET    | `/addresses`              | Get all addresses          | Private  |
| POST   | `/addresses`              | Add new address            | Private  |
| PUT    | `/addresses/:id`          | Update address             | Private  |
| DELETE | `/addresses/:id`          | Delete address             | Private  |
| PUT    | `/addresses/:id/default`  | Set as default             | Private  |

---

## 11. Admin Routes `/api/admin`

| Method | Endpoint                         | Description              | Auth  |
|--------|----------------------------------|--------------------------|-------|
| GET    | `/admin/dashboard`               | Dashboard stats          | Admin |
| GET    | `/admin/orders`                  | All orders               | Admin |
| GET    | `/admin/orders/:id`              | Order detail             | Admin |
| PUT    | `/admin/orders/:id/status`       | Update order status      | Admin |
| GET    | `/admin/users`                   | All users                | Admin |
| GET    | `/admin/users/:id`               | User detail              | Admin |
| PUT    | `/admin/users/:id/role`          | Change user role         | Admin |
| DELETE | `/admin/users/:id`               | Delete user              | Admin |
| GET    | `/admin/products/low-stock`      | Low stock products       | Admin |
| GET    | `/admin/revenue`                 | Revenue analytics        | Admin |

---

## 12. Standard API Response Format

**Success:**
```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": { ... },
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalProducts": 120,
    "limit": 12
  }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

> ➡️ See [folder-structure.md](folder-structure.md) for complete codebase structure.
