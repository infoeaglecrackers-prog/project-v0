# 🔌 Complete Backend API Reference
## Fireworks & Crackers E-Commerce — MERN Stack

**Base URL:** `https://api.yourfireworksstore.com/api`

**Auth Header (Private/Admin routes):** `Authorization: Bearer <access_token>`

**Content-Type:** `application/json` (unless uploading files → `multipart/form-data`)

---

## 📑 Table of Contents

1. [Auth Routes](#1-auth-routes-apiauth)
2. [User Routes](#2-user-routes-apiusers)
3. [Product Routes](#3-product-routes-apiproducts)
4. [Category Routes](#4-category-routes-apicategories)
5. [Cart Routes](#5-cart-routes-apicart)
6. [Wishlist Routes](#6-wishlist-routes-apiwishlist)
7. [Order Routes](#7-order-routes-apiorders)
8. [Payment Routes](#8-payment-routes-apipayment)
9. [Review Routes](#9-review-routes-apireviews)
10. [Address Routes](#10-address-routes-apiaddresses)
11. [Admin Routes](#11-admin-routes-apiadmin)
12. [Standard Response Format](#12-standard-response-format)
13. [HTTP Status Codes](#13-http-status-codes)
14. [Error Codes Reference](#14-error-codes-reference)

---

## 1. Auth Routes `/api/auth`

### 1.1 Register New User

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `POST`                    |
| **Endpoint** | `/api/auth/register`      |
| **Access**   | Public                    |

**Request Body:**
```json
{
  "name": "Ravi Kumar",
  "email": "ravi@example.com",
  "password": "MyPass@123",
  "phone": "9876543210"
}
```

| Field      | Type   | Required | Validation                          |
|------------|--------|----------|-------------------------------------|
| `name`     | String | ✅ Yes   | Min 2, Max 50 chars                 |
| `email`    | String | ✅ Yes   | Valid email, unique                 |
| `password` | String | ✅ Yes   | Min 8 chars, must include letter+number |
| `phone`    | String | ❌ No    | 10-digit Indian mobile number       |

**Success Response `201 Created`:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "_id": "64abc123...",
      "name": "Ravi Kumar",
      "email": "ravi@example.com",
      "phone": "9876543210",
      "role": "user",
      "avatar": { "url": "https://cdn.../default-avatar.png" },
      "createdAt": "2026-02-27T10:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

> 🍪 `refreshToken` is set as an `httpOnly` cookie (expires in 7 days).

**Error Responses:**

| Status | Message                          | Cause                        |
|--------|----------------------------------|------------------------------|
| `400`  | `"Email already registered"`     | Duplicate email              |
| `400`  | `"Validation error: ..."`        | Invalid input fields         |

---

### 1.2 Login User

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `POST`                    |
| **Endpoint** | `/api/auth/login`         |
| **Access**   | Public                    |

**Request Body:**
```json
{
  "email": "ravi@example.com",
  "password": "MyPass@123"
}
```

| Field      | Type   | Required | Validation            |
|------------|--------|----------|-----------------------|
| `email`    | String | ✅ Yes   | Valid email format    |
| `password` | String | ✅ Yes   | Non-empty             |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "64abc123...",
      "name": "Ravi Kumar",
      "email": "ravi@example.com",
      "role": "user",
      "avatar": { "url": "https://cdn.../avatar.jpg" }
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

> 🍪 `refreshToken` is set as an `httpOnly` cookie.

**Error Responses:**

| Status | Message                          | Cause                     |
|--------|----------------------------------|---------------------------|
| `401`  | `"Invalid email or password"`    | Wrong credentials         |
| `400`  | `"Please provide email and password"` | Missing fields       |

---

### 1.3 Logout User

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `POST`                    |
| **Endpoint** | `/api/auth/logout`        |
| **Access**   | Private (Bearer Token)    |

**Request Body:** None

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

> 🍪 `refreshToken` cookie is cleared on the server.

---

### 1.4 Refresh Access Token

| Field        | Value                          |
|--------------|--------------------------------|
| **Method**   | `POST`                         |
| **Endpoint** | `/api/auth/refresh-token`      |
| **Access**   | Public (requires refresh cookie) |

**Request Body:** None

> 📌 The `refreshToken` is read automatically from the `httpOnly` cookie.

**Success Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

| Status | Message                            | Cause                       |
|--------|------------------------------------|-----------------------------|
| `401`  | `"Refresh token not found"`        | Cookie missing              |
| `401`  | `"Invalid or expired refresh token"` | Token tampered/expired    |

---

### 1.5 Forgot Password

| Field        | Value                          |
|--------------|--------------------------------|
| **Method**   | `POST`                         |
| **Endpoint** | `/api/auth/forgot-password`    |
| **Access**   | Public                         |

**Request Body:**
```json
{
  "email": "ravi@example.com"
}
```

| Field   | Type   | Required | Validation         |
|---------|--------|----------|--------------------|
| `email` | String | ✅ Yes   | Valid email format |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "Password reset link sent to ravi@example.com"
}
```

> 📧 A reset link is emailed: `https://yourstore.com/reset-password/<token>` (expires in 15 minutes)

**Error Responses:**

| Status | Message                    | Cause                |
|--------|----------------------------|----------------------|
| `404`  | `"User not found"`         | Email not registered |
| `500`  | `"Email could not be sent"`| SMTP error           |

---

### 1.6 Reset Password

| Field        | Value                                  |
|--------------|----------------------------------------|
| **Method**   | `PUT`                                  |
| **Endpoint** | `/api/auth/reset-password/:token`      |
| **Access**   | Public                                 |

**Path Parameters:**

| Param   | Type   | Required | Description                           |
|---------|--------|----------|---------------------------------------|
| `token` | String | ✅ Yes   | Password reset token from email link  |

**Request Body:**
```json
{
  "password": "NewPass@456",
  "confirmPassword": "NewPass@456"
}
```

| Field             | Type   | Required | Validation                       |
|-------------------|--------|----------|----------------------------------|
| `password`        | String | ✅ Yes   | Min 8 chars, letter+number       |
| `confirmPassword` | String | ✅ Yes   | Must match `password`            |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "Password reset successful. Please login.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

| Status | Message                            | Cause                  |
|--------|------------------------------------|------------------------|
| `400`  | `"Passwords do not match"`         | Mismatched inputs      |
| `400`  | `"Reset token is invalid or has expired"` | Bad/expired token |

---

### 1.7 Get Current User

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `GET`                     |
| **Endpoint** | `/api/auth/me`            |
| **Access**   | Private (Bearer Token)    |

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:** None

**Success Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64abc123...",
      "name": "Ravi Kumar",
      "email": "ravi@example.com",
      "phone": "9876543210",
      "role": "user",
      "avatar": {
        "public_id": "fireworks/avatars/xyz",
        "url": "https://res.cloudinary.com/..."
      },
      "isVerified": true,
      "createdAt": "2026-02-27T10:00:00.000Z"
    }
  }
}
```

---

## 2. User Routes `/api/users`

### 2.1 Get User Profile

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `GET`                     |
| **Endpoint** | `/api/users/profile`      |
| **Access**   | Private (Bearer Token)    |

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64abc123...",
      "name": "Ravi Kumar",
      "email": "ravi@example.com",
      "phone": "9876543210",
      "role": "user",
      "avatar": { "url": "https://res.cloudinary.com/..." },
      "createdAt": "2026-02-27T10:00:00.000Z",
      "updatedAt": "2026-02-27T12:00:00.000Z"
    }
  }
}
```

---

### 2.2 Update Profile

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `PUT`                     |
| **Endpoint** | `/api/users/profile`      |
| **Access**   | Private (Bearer Token)    |

**Request Body:**
```json
{
  "name": "Ravi Kumar Updated",
  "phone": "9123456789"
}
```

| Field   | Type   | Required | Validation              |
|---------|--------|----------|-------------------------|
| `name`  | String | ❌ No    | Min 2, Max 50 chars     |
| `phone` | String | ❌ No    | 10-digit mobile number  |

> 📌 Email cannot be changed via this endpoint.

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "_id": "64abc123...",
      "name": "Ravi Kumar Updated",
      "phone": "9123456789",
      "email": "ravi@example.com"
    }
  }
}
```

---

### 2.3 Change Password

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `PUT`                     |
| **Endpoint** | `/api/users/password`     |
| **Access**   | Private (Bearer Token)    |

**Request Body:**
```json
{
  "currentPassword": "OldPass@123",
  "newPassword": "NewPass@456",
  "confirmPassword": "NewPass@456"
}
```

| Field             | Type   | Required | Validation                  |
|-------------------|--------|----------|-----------------------------|
| `currentPassword` | String | ✅ Yes   | Must match stored password  |
| `newPassword`     | String | ✅ Yes   | Min 8 chars, letter+number  |
| `confirmPassword` | String | ✅ Yes   | Must match `newPassword`    |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Responses:**

| Status | Message                            | Cause                    |
|--------|------------------------------------|--------------------------|
| `401`  | `"Current password is incorrect"`  | Wrong current password   |
| `400`  | `"Passwords do not match"`         | Mismatch in new passwords|

---

### 2.4 Upload Avatar

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `POST`                    |
| **Endpoint** | `/api/users/avatar`       |
| **Access**   | Private (Bearer Token)    |
| **Content-Type** | `multipart/form-data` |

**Request Form-Data:**

| Field    | Type | Required | Validation                        |
|----------|------|----------|-----------------------------------|
| `avatar` | File | ✅ Yes   | JPEG/PNG/WEBP, max 2MB            |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "avatar": {
      "public_id": "fireworks/avatars/user_64abc123",
      "url": "https://res.cloudinary.com/yourcloud/image/upload/fireworks/avatars/user_64abc123.jpg"
    }
  }
}
```

---

## 3. Product Routes `/api/products`

### 3.1 Get All Products

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `GET`                     |
| **Endpoint** | `/api/products`           |
| **Access**   | Public                    |

**Query Parameters:**

| Param            | Type    | Required | Description                                       | Example                      |
|------------------|---------|----------|---------------------------------------------------|------------------------------|
| `keyword`        | String  | ❌ No    | Full-text search on name, description, tags       | `?keyword=sparkler`          |
| `category`       | String  | ❌ No    | MongoDB ObjectId of category                      | `?category=64abc123`         |
| `price[gte]`     | Number  | ❌ No    | Minimum price filter                              | `?price[gte]=100`            |
| `price[lte]`     | Number  | ❌ No    | Maximum price filter                              | `?price[lte]=5000`           |
| `ratings[gte]`   | Number  | ❌ No    | Minimum ratings filter (1–5)                      | `?ratings[gte]=4`            |
| `brand`          | String  | ❌ No    | Brand name filter                                 | `?brand=Standard`            |
| `isFeatured`     | Boolean | ❌ No    | Filter featured products only                     | `?isFeatured=true`           |
| `isActive`       | Boolean | ❌ No    | Filter active/inactive products (admin use)       | `?isActive=true`             |
| `sort`           | String  | ❌ No    | Sort field (prefix `-` for descending)            | `?sort=-price` or `?sort=price` |
| `page`           | Number  | ❌ No    | Page number (default: 1)                          | `?page=2`                    |
| `limit`          | Number  | ❌ No    | Results per page (default: 12, max: 50)           | `?limit=20`                  |

**Sort Options:**

| Value        | Description           |
|--------------|-----------------------|
| `-price`     | Price: High to Low    |
| `price`      | Price: Low to High    |
| `-createdAt` | Newest first (default)|
| `createdAt`  | Oldest first          |
| `-ratings`   | Highest rated first   |
| `-sold`      | Best sellers first    |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": {
    "products": [
      {
        "_id": "64abc123...",
        "name": "Golden Sparklers Pack",
        "price": 499,
        "discountPrice": 349,
        "discountPercent": 30,
        "gst": 18,
        "stock": 150,
        "sold": 320,
        "sku": "SP-GOLD-001",
        "category": { "_id": "64xyz...", "name": "Sparklers", "slug": "sparklers" },
        "brand": "Standard Fireworks",
        "images": [
          { "public_id": "fireworks/prod/img1", "url": "https://res.cloudinary.com/..." }
        ],
        "ratings": 4.5,
        "numReviews": 128,
        "isFeatured": true,
        "isActive": true,
        "tags": ["diwali", "sparklers", "gold"],
        "createdAt": "2026-01-15T10:00:00.000Z"
      }
    ]
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalProducts": 120,
    "limit": 12
  }
}
```

---

### 3.2 Get Single Product

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `GET`                     |
| **Endpoint** | `/api/products/:id`       |
| **Access**   | Public                    |

**Path Parameters:**

| Param | Type   | Required | Description           |
|-------|--------|----------|-----------------------|
| `id`  | String | ✅ Yes   | MongoDB ObjectId of product |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "product": {
      "_id": "64abc123...",
      "name": "Golden Sparklers Pack",
      "description": "Premium gold sparklers for Diwali celebrations...",
      "safetyInstructions": "Keep away from children. Use in open area only.",
      "price": 499,
      "discountPrice": 349,
      "discountPercent": 30,
      "gst": 18,
      "stock": 150,
      "sold": 320,
      "sku": "SP-GOLD-001",
      "category": { "_id": "64xyz...", "name": "Sparklers", "slug": "sparklers" },
      "brand": "Standard Fireworks",
      "images": [
        { "public_id": "fireworks/prod/img1", "url": "https://res.cloudinary.com/..." },
        { "public_id": "fireworks/prod/img2", "url": "https://res.cloudinary.com/..." }
      ],
      "ratings": 4.5,
      "numReviews": 128,
      "isFeatured": true,
      "isActive": true,
      "tags": ["diwali", "sparklers", "gold"],
      "weight": "200g",
      "dimensions": "30cm x 5cm",
      "createdAt": "2026-01-15T10:00:00.000Z"
    }
  }
}
```

**Error Responses:**

| Status | Message                    | Cause               |
|--------|----------------------------|---------------------|
| `404`  | `"Product not found"`      | Invalid/missing ID  |
| `400`  | `"Invalid product ID"`     | Malformed ObjectId  |

---

### 3.3 Get Featured Products

| Field        | Value                         |
|--------------|-------------------------------|
| **Method**   | `GET`                         |
| **Endpoint** | `/api/products/featured`      |
| **Access**   | Public                        |

**Query Parameters:**

| Param   | Type   | Required | Description                      | Default |
|---------|--------|----------|----------------------------------|---------|
| `limit` | Number | ❌ No    | Number of featured products      | `8`     |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "products": [ /* Array of featured product objects */ ]
  }
}
```

---

### 3.4 Get Best Sellers

| Field        | Value                          |
|--------------|--------------------------------|
| **Method**   | `GET`                          |
| **Endpoint** | `/api/products/bestsellers`    |
| **Access**   | Public                         |

**Query Parameters:**

| Param   | Type   | Required | Description                     | Default |
|---------|--------|----------|---------------------------------|---------|
| `limit` | Number | ❌ No    | Number of best seller products  | `8`     |

> 📌 Sorted by `sold` count descending.

**Success Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "products": [ /* Array of best-selling product objects */ ]
  }
}
```

---

### 3.5 Create Product

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `POST`                    |
| **Endpoint** | `/api/products`           |
| **Access**   | Admin                     |

**Request Headers:**
```
Authorization: Bearer <admin_access_token>
Content-Type: multipart/form-data
```

**Request Form-Data:**

| Field                | Type     | Required | Validation                              |
|----------------------|----------|----------|-----------------------------------------|
| `name`               | String   | ✅ Yes   | Min 2, Max 100 chars, unique            |
| `description`        | String   | ✅ Yes   | Min 10 chars                            |
| `safetyInstructions` | String   | ❌ No    | Safety instructions text                |
| `price`              | Number   | ✅ Yes   | Positive number                         |
| `discountPrice`      | Number   | ❌ No    | Must be less than `price`               |
| `discountPercent`    | Number   | ❌ No    | 0–99                                    |
| `gst`                | Number   | ❌ No    | GST percentage (default: 18)            |
| `stock`              | Number   | ✅ Yes   | Non-negative integer                    |
| `sku`                | String   | ❌ No    | Unique SKU code                         |
| `category`           | String   | ✅ Yes   | Valid MongoDB ObjectId of category      |
| `brand`              | String   | ❌ No    | Brand name                              |
| `isFeatured`         | Boolean  | ❌ No    | Default: `false`                        |
| `tags`               | String   | ❌ No    | Comma-separated: `"diwali,sparklers"`   |
| `weight`             | String   | ❌ No    | e.g. `"200g"`                           |
| `dimensions`         | String   | ❌ No    | e.g. `"30cm x 5cm"`                     |
| `images`             | File[]   | ✅ Yes   | 1–5 images, JPEG/PNG/WEBP, max 2MB each |

**Success Response `201 Created`:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "product": {
      "_id": "64abc123...",
      "name": "Golden Sparklers Pack",
      "sku": "SP-GOLD-001",
      "price": 499,
      "stock": 150,
      "images": [ { "public_id": "...", "url": "..." } ],
      "createdAt": "2026-02-27T10:00:00.000Z"
    }
  }
}
```

---

### 3.6 Update Product

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `PUT`                     |
| **Endpoint** | `/api/products/:id`       |
| **Access**   | Admin                     |

**Path Parameters:**

| Param | Type   | Required | Description                |
|-------|--------|----------|----------------------------|
| `id`  | String | ✅ Yes   | MongoDB ObjectId of product|

**Request Body (JSON — for non-image updates):**
```json
{
  "name": "Golden Sparklers Pack — Updated",
  "price": 450,
  "discountPrice": 320,
  "discountPercent": 29,
  "stock": 200,
  "isFeatured": true,
  "description": "Updated description text...",
  "safetyInstructions": "Handle with care.",
  "brand": "Standard Fireworks",
  "tags": ["diwali", "gold", "premium"],
  "weight": "250g",
  "isActive": true
}
```

> 📌 All fields are optional. Only provided fields will be updated.

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "product": { /* Updated product object */ }
  }
}
```

---

### 3.7 Delete Product

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `DELETE`                  |
| **Endpoint** | `/api/products/:id`       |
| **Access**   | Admin                     |

**Path Parameters:**

| Param | Type   | Required | Description                |
|-------|--------|----------|----------------------------|
| `id`  | String | ✅ Yes   | MongoDB ObjectId of product|

> ⚠️ This performs a **soft delete** — sets `isActive: false`. Hard delete removes all images from Cloudinary.

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### 3.8 Upload Product Images

| Field        | Value                             |
|--------------|-----------------------------------|
| **Method**   | `POST`                            |
| **Endpoint** | `/api/products/:id/images`        |
| **Access**   | Admin                             |
| **Content-Type** | `multipart/form-data`         |

**Path Parameters:**

| Param | Type   | Required | Description                |
|-------|--------|----------|----------------------------|
| `id`  | String | ✅ Yes   | MongoDB ObjectId of product|

**Request Form-Data:**

| Field    | Type   | Required | Validation                          |
|----------|--------|----------|-------------------------------------|
| `images` | File[] | ✅ Yes   | 1–5 images, JPEG/PNG/WEBP, max 2MB each |

> 📌 New images are appended to existing product images (max 5 total).

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "Images uploaded successfully",
  "data": {
    "images": [
      { "public_id": "fireworks/prod/img3", "url": "https://res.cloudinary.com/..." }
    ]
  }
}
```

---

### 3.9 Delete Product Image

| Field        | Value                                        |
|--------------|----------------------------------------------|
| **Method**   | `DELETE`                                     |
| **Endpoint** | `/api/products/:id/images/:imgId`            |
| **Access**   | Admin                                        |

**Path Parameters:**

| Param   | Type   | Required | Description                          |
|---------|--------|----------|--------------------------------------|
| `id`    | String | ✅ Yes   | MongoDB ObjectId of product          |
| `imgId` | String | ✅ Yes   | Cloudinary `public_id` of the image  |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

> 📌 Image is deleted from Cloudinary and removed from the product's `images` array.

---

## 4. Category Routes `/api/categories`

### 4.1 Get All Categories

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `GET`                     |
| **Endpoint** | `/api/categories`         |
| **Access**   | Public                    |

**Query Parameters:**

| Param        | Type    | Required | Description                         |
|--------------|---------|----------|-------------------------------------|
| `isActive`   | Boolean | ❌ No    | Filter active categories only       |
| `parent`     | String  | ❌ No    | Get subcategories of a parent ID    |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "_id": "64xyz001...",
        "name": "Sparklers",
        "slug": "sparklers",
        "description": "All types of sparklers",
        "image": { "url": "https://res.cloudinary.com/..." },
        "parentCategory": null,
        "isActive": true,
        "sortOrder": 1
      },
      {
        "_id": "64xyz002...",
        "name": "Aerial Shots",
        "slug": "aerial-shots",
        "parentCategory": null,
        "sortOrder": 2
      }
    ]
  }
}
```

---

### 4.2 Get Single Category

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `GET`                     |
| **Endpoint** | `/api/categories/:id`     |
| **Access**   | Public                    |

**Path Parameters:**

| Param | Type   | Required | Description                  |
|-------|--------|----------|------------------------------|
| `id`  | String | ✅ Yes   | MongoDB ObjectId of category |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "category": {
      "_id": "64xyz001...",
      "name": "Sparklers",
      "slug": "sparklers",
      "description": "All types of sparklers for festive occasions",
      "image": { "public_id": "fireworks/cat/sparklers", "url": "https://res.cloudinary.com/..." },
      "parentCategory": null,
      "isActive": true,
      "sortOrder": 1,
      "createdAt": "2026-01-10T08:00:00.000Z"
    }
  }
}
```

---

### 4.3 Create Category

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `POST`                    |
| **Endpoint** | `/api/categories`         |
| **Access**   | Admin                     |
| **Content-Type** | `multipart/form-data` |

**Request Form-Data:**

| Field            | Type    | Required | Validation                         |
|------------------|---------|----------|------------------------------------|
| `name`           | String  | ✅ Yes   | Unique, min 2 chars                |
| `slug`           | String  | ❌ No    | Auto-generated from name if empty  |
| `description`    | String  | ❌ No    | Category description               |
| `image`          | File    | ❌ No    | JPEG/PNG/WEBP, max 2MB             |
| `parentCategory` | String  | ❌ No    | MongoDB ObjectId of parent category|
| `isActive`       | Boolean | ❌ No    | Default: `true`                    |
| `sortOrder`      | Number  | ❌ No    | Display order (default: 0)         |

**Success Response `201 Created`:**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "category": {
      "_id": "64xyz003...",
      "name": "Ground Crackers",
      "slug": "ground-crackers",
      "isActive": true,
      "sortOrder": 3
    }
  }
}
```

---

### 4.4 Update Category

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `PUT`                     |
| **Endpoint** | `/api/categories/:id`     |
| **Access**   | Admin                     |

**Path Parameters:**

| Param | Type   | Required | Description                  |
|-------|--------|----------|------------------------------|
| `id`  | String | ✅ Yes   | MongoDB ObjectId of category |

**Request Body:**
```json
{
  "name": "Ground Crackers Updated",
  "description": "Updated description",
  "isActive": true,
  "sortOrder": 2
}
```

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "category": { /* Updated category object */ }
  }
}
```

---

### 4.5 Delete Category

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `DELETE`                  |
| **Endpoint** | `/api/categories/:id`     |
| **Access**   | Admin                     |

**Path Parameters:**

| Param | Type   | Required | Description                  |
|-------|--------|----------|------------------------------|
| `id`  | String | ✅ Yes   | MongoDB ObjectId of category |

> ⚠️ Cannot delete a category that has products assigned to it. Reassign products first.

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

**Error Responses:**

| Status | Message                                           | Cause                     |
|--------|---------------------------------------------------|---------------------------|
| `400`  | `"Cannot delete category with existing products"` | Products are still linked |

---

## 5. Cart Routes `/api/cart`

### 5.1 Get User Cart

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `GET`                     |
| **Endpoint** | `/api/cart`               |
| **Access**   | Private (Bearer Token)    |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "cart": {
      "_id": "64cart123...",
      "user": "64abc123...",
      "items": [
        {
          "product": {
            "_id": "64abc999...",
            "name": "Golden Sparklers Pack",
            "price": 499,
            "discountPrice": 349,
            "stock": 150,
            "images": [{ "url": "https://res.cloudinary.com/..." }]
          },
          "quantity": 2,
          "price": 349
        }
      ],
      "totalItems": 2,
      "totalPrice": 698
    }
  }
}
```

---

### 5.2 Add Item to Cart

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `POST`                    |
| **Endpoint** | `/api/cart`               |
| **Access**   | Private (Bearer Token)    |

**Request Body:**
```json
{
  "productId": "64abc999...",
  "quantity": 2
}
```

| Field       | Type   | Required | Validation                         |
|-------------|--------|----------|------------------------------------|
| `productId` | String | ✅ Yes   | Valid MongoDB ObjectId of product  |
| `quantity`  | Number | ✅ Yes   | Positive integer (≥ 1)             |

> 📌 If product already in cart, quantity is **added** to existing. Validates against current stock.

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "cart": { /* Updated cart object */ }
  }
}
```

**Error Responses:**

| Status | Message                               | Cause               |
|--------|---------------------------------------|---------------------|
| `404`  | `"Product not found"`                 | Invalid product ID  |
| `400`  | `"Insufficient stock. Only X left."`  | Stock exceeded      |

---

### 5.3 Update Cart Item Quantity

| Field        | Value                          |
|--------------|--------------------------------|
| **Method**   | `PUT`                          |
| **Endpoint** | `/api/cart/:productId`         |
| **Access**   | Private (Bearer Token)         |

**Path Parameters:**

| Param       | Type   | Required | Description               |
|-------------|--------|----------|---------------------------|
| `productId` | String | ✅ Yes   | MongoDB ObjectId of product |

**Request Body:**
```json
{
  "quantity": 4
}
```

| Field      | Type   | Required | Validation          |
|------------|--------|----------|---------------------|
| `quantity` | Number | ✅ Yes   | Positive integer ≥ 1|

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "Cart updated",
  "data": {
    "cart": { /* Updated cart object */ }
  }
}
```

---

### 5.4 Remove Item from Cart

| Field        | Value                          |
|--------------|--------------------------------|
| **Method**   | `DELETE`                       |
| **Endpoint** | `/api/cart/:productId`         |
| **Access**   | Private (Bearer Token)         |

**Path Parameters:**

| Param       | Type   | Required | Description               |
|-------------|--------|----------|---------------------------|
| `productId` | String | ✅ Yes   | MongoDB ObjectId of product |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "Item removed from cart",
  "data": {
    "cart": { /* Updated cart object */ }
  }
}
```

---

### 5.5 Clear Entire Cart

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `DELETE`                  |
| **Endpoint** | `/api/cart`               |
| **Access**   | Private (Bearer Token)    |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "Cart cleared successfully",
  "data": {
    "cart": {
      "items": [],
      "totalItems": 0,
      "totalPrice": 0
    }
  }
}
```

---

## 6. Wishlist Routes `/api/wishlist`

### 6.1 Get User Wishlist

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `GET`                     |
| **Endpoint** | `/api/wishlist`           |
| **Access**   | Private (Bearer Token)    |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "wishlist": {
      "_id": "64wish123...",
      "user": "64abc123...",
      "products": [
        {
          "_id": "64abc999...",
          "name": "Golden Sparklers Pack",
          "price": 499,
          "discountPrice": 349,
          "images": [{ "url": "https://res.cloudinary.com/..." }],
          "ratings": 4.5,
          "stock": 150
        }
      ]
    }
  }
}
```

---

### 6.2 Toggle Wishlist (Add / Remove)

| Field        | Value                             |
|--------------|-----------------------------------|
| **Method**   | `POST`                            |
| **Endpoint** | `/api/wishlist/:productId`        |
| **Access**   | Private (Bearer Token)            |

**Path Parameters:**

| Param       | Type   | Required | Description                |
|-------------|--------|----------|----------------------------|
| `productId` | String | ✅ Yes   | MongoDB ObjectId of product|

**Request Body:** None

> 📌 **Toggle behavior:** If product is already in wishlist → removes it. If not → adds it.

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "Added to wishlist",
  "data": {
    "isWishlisted": true,
    "wishlist": { /* Updated wishlist object */ }
  }
}
```

or when removed:
```json
{
  "success": true,
  "message": "Removed from wishlist",
  "data": {
    "isWishlisted": false,
    "wishlist": { /* Updated wishlist object */ }
  }
}
```

---

## 7. Order Routes `/api/orders`

### 7.1 Place New Order

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `POST`                    |
| **Endpoint** | `/api/orders`             |
| **Access**   | Private (Bearer Token)    |

**Request Body:**
```json
{
  "shippingAddress": {
    "fullName": "Ravi Kumar",
    "phone": "9876543210",
    "addressLine1": "12, MG Road",
    "addressLine2": "Near Central Park",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600001",
    "country": "India"
  },
  "paymentMethod": "razorpay",
  "items": [
    { "productId": "64abc999...", "quantity": 3 },
    { "productId": "64abc888...", "quantity": 1 }
  ]
}
```

| Field                            | Type     | Required | Validation                          |
|----------------------------------|----------|----------|-------------------------------------|
| `shippingAddress`                | Object   | ✅ Yes   | Complete address object             |
| `shippingAddress.fullName`       | String   | ✅ Yes   | Non-empty                           |
| `shippingAddress.phone`          | String   | ✅ Yes   | 10-digit mobile number              |
| `shippingAddress.addressLine1`   | String   | ✅ Yes   | Non-empty                           |
| `shippingAddress.addressLine2`   | String   | ❌ No    | Optional second address line        |
| `shippingAddress.city`           | String   | ✅ Yes   | Non-empty                           |
| `shippingAddress.state`          | String   | ✅ Yes   | Non-empty                           |
| `shippingAddress.pincode`        | String   | ✅ Yes   | 6-digit Indian pincode              |
| `shippingAddress.country`        | String   | ❌ No    | Default: `"India"`                  |
| `paymentMethod`                  | String   | ✅ Yes   | `"razorpay"` or `"cod"`             |
| `items`                          | Array    | ✅ Yes   | At least 1 item                     |
| `items[].productId`              | String   | ✅ Yes   | Valid MongoDB ObjectId              |
| `items[].quantity`               | Number   | ✅ Yes   | Positive integer ≥ 1                |

> 📌 For `razorpay`, first call `/api/payment/create-order`, complete payment, then call `/api/payment/verify` which internally creates the order. For `cod`, directly call this endpoint.

**Success Response `201 Created`:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "order": {
      "_id": "64order123...",
      "orderItems": [
        {
          "product": "64abc999...",
          "name": "Golden Sparklers Pack",
          "image": "https://res.cloudinary.com/...",
          "price": 349,
          "quantity": 3
        }
      ],
      "shippingAddress": { /* address details */ },
      "paymentInfo": {
        "method": "cod",
        "status": "pending"
      },
      "itemsPrice": 1047,
      "taxAmount": 188.46,
      "shippingPrice": 0,
      "totalAmount": 1235.46,
      "orderStatus": "Pending",
      "createdAt": "2026-02-27T10:00:00.000Z"
    }
  }
}
```

**Error Responses:**

| Status | Message                               | Cause               |
|--------|---------------------------------------|---------------------|
| `400`  | `"Insufficient stock for: <name>"`    | Stock exceeded      |
| `404`  | `"Product not found: <id>"`           | Invalid product ID  |

---

### 7.2 Get My Orders

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `GET`                     |
| **Endpoint** | `/api/orders`             |
| **Access**   | Private (Bearer Token)    |

**Query Parameters:**

| Param    | Type   | Required | Description                          | Default |
|----------|--------|----------|--------------------------------------|---------|
| `status` | String | ❌ No    | Filter by status (`Pending`, `Shipped`, etc.) | All |
| `page`   | Number | ❌ No    | Page number                          | `1`     |
| `limit`  | Number | ❌ No    | Orders per page                      | `10`    |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "_id": "64order123...",
        "orderItems": [ /* item summary */ ],
        "totalAmount": 1235.46,
        "orderStatus": "Processing",
        "paymentInfo": { "method": "razorpay", "status": "paid" },
        "createdAt": "2026-02-27T10:00:00.000Z"
      }
    ]
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalOrders": 25,
    "limit": 10
  }
}
```

---

### 7.3 Get Order Detail

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `GET`                     |
| **Endpoint** | `/api/orders/:id`         |
| **Access**   | Private (Bearer Token)    |

**Path Parameters:**

| Param | Type   | Required | Description               |
|-------|--------|----------|---------------------------|
| `id`  | String | ✅ Yes   | MongoDB ObjectId of order |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "order": {
      "_id": "64order123...",
      "user": { "_id": "64abc123...", "name": "Ravi Kumar", "email": "ravi@example.com" },
      "orderItems": [
        {
          "product": "64abc999...",
          "name": "Golden Sparklers Pack",
          "image": "https://res.cloudinary.com/...",
          "price": 349,
          "quantity": 3
        }
      ],
      "shippingAddress": {
        "fullName": "Ravi Kumar",
        "phone": "9876543210",
        "addressLine1": "12, MG Road",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "pincode": "600001"
      },
      "paymentInfo": {
        "method": "razorpay",
        "razorpay_order_id": "order_xxx",
        "razorpay_payment_id": "pay_xxx",
        "status": "paid",
        "paidAt": "2026-02-27T10:05:00.000Z"
      },
      "itemsPrice": 1047,
      "taxAmount": 188.46,
      "shippingPrice": 0,
      "totalAmount": 1235.46,
      "orderStatus": "Shipped",
      "statusHistory": [
        { "status": "Pending", "updatedAt": "2026-02-27T10:00:00.000Z" },
        { "status": "Processing", "updatedAt": "2026-02-27T12:00:00.000Z" },
        { "status": "Shipped", "updatedAt": "2026-02-28T09:00:00.000Z", "note": "Dispatched via BlueDart" }
      ],
      "trackingNumber": "BD123456789IN",
      "invoiceUrl": "https://res.cloudinary.com/.../invoice_64order123.pdf",
      "createdAt": "2026-02-27T10:00:00.000Z"
    }
  }
}
```

**Error Responses:**

| Status | Message                                      | Cause                    |
|--------|----------------------------------------------|--------------------------|
| `404`  | `"Order not found"`                          | Invalid order ID         |
| `403`  | `"Not authorized to view this order"`        | Order belongs to another user |

---

### 7.4 Cancel Order

| Field        | Value                         |
|--------------|-------------------------------|
| **Method**   | `PUT`                         |
| **Endpoint** | `/api/orders/:id/cancel`      |
| **Access**   | Private (Bearer Token)        |

**Path Parameters:**

| Param | Type   | Required | Description               |
|-------|--------|----------|---------------------------|
| `id`  | String | ✅ Yes   | MongoDB ObjectId of order |

**Request Body:**
```json
{
  "reason": "Changed my mind / Ordered by mistake"
}
```

| Field    | Type   | Required | Validation           |
|----------|--------|----------|----------------------|
| `reason` | String | ❌ No    | Cancel reason text   |

> ⚠️ Orders can only be cancelled when status is `Pending` or `Processing`. Once shipped, contact support.

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "order": {
      "_id": "64order123...",
      "orderStatus": "Cancelled",
      "cancelledAt": "2026-02-27T11:00:00.000Z",
      "cancelReason": "Changed my mind"
    }
  }
}
```

**Error Responses:**

| Status | Message                                          | Cause                   |
|--------|--------------------------------------------------|-------------------------|
| `400`  | `"Order cannot be cancelled after shipping"`     | Status is Shipped/Delivered |
| `404`  | `"Order not found"`                              | Invalid order ID        |

---

### 7.5 Download Invoice

| Field        | Value                           |
|--------------|---------------------------------|
| **Method**   | `GET`                           |
| **Endpoint** | `/api/orders/:id/invoice`       |
| **Access**   | Private (Bearer Token)          |

**Path Parameters:**

| Param | Type   | Required | Description               |
|-------|--------|----------|---------------------------|
| `id`  | String | ✅ Yes   | MongoDB ObjectId of order |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "invoiceUrl": "https://res.cloudinary.com/.../invoice_64order123.pdf"
  }
}
```

> 📌 If invoice PDF doesn't exist yet, it is generated on first request and cached to Cloudinary.

---

## 8. Payment Routes `/api/payment`

### 8.1 Create Razorpay Order

| Field        | Value                              |
|--------------|------------------------------------|
| **Method**   | `POST`                             |
| **Endpoint** | `/api/payment/create-order`        |
| **Access**   | Private (Bearer Token)             |

**Request Body:**
```json
{
  "amount": 123546
}
```

| Field    | Type   | Required | Validation                            |
|----------|--------|----------|---------------------------------------|
| `amount` | Number | ✅ Yes   | Amount in **paise** (₹1235.46 → 123546) |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "razorpayOrder": {
      "id": "order_PQRstu789xyz",
      "amount": 123546,
      "currency": "INR",
      "receipt": "receipt_64abc123"
    },
    "key": "rzp_live_xxxx"
  }
}
```

> 📌 Use `razorpayOrder.id` and `key` to open the **Razorpay Checkout** modal on the frontend.

---

### 8.2 Verify Payment

| Field        | Value                         |
|--------------|-------------------------------|
| **Method**   | `POST`                        |
| **Endpoint** | `/api/payment/verify`         |
| **Access**   | Private (Bearer Token)        |

**Request Body:**
```json
{
  "razorpay_order_id": "order_PQRstu789xyz",
  "razorpay_payment_id": "pay_ABCdef123456",
  "razorpay_signature": "c4b3a2a1...",
  "orderId": "64order123...",
  "shippingAddress": {
    "fullName": "Ravi Kumar",
    "phone": "9876543210",
    "addressLine1": "12, MG Road",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "pincode": "600001"
  },
  "items": [
    { "productId": "64abc999...", "quantity": 3 }
  ]
}
```

| Field                  | Type   | Required | Description                                |
|------------------------|--------|----------|--------------------------------------------|
| `razorpay_order_id`    | String | ✅ Yes   | Razorpay order ID from create-order step   |
| `razorpay_payment_id`  | String | ✅ Yes   | Payment ID from Razorpay checkout callback |
| `razorpay_signature`   | String | ✅ Yes   | HMAC SHA256 signature from Razorpay        |
| `orderId`              | String | ❌ No    | Your internal order ID (if pre-created)    |
| `shippingAddress`      | Object | ✅ Yes   | Same as in Place Order endpoint            |
| `items`                | Array  | ✅ Yes   | Same as in Place Order endpoint            |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "orderId": "64order123...",
    "paymentId": "pay_ABCdef123456"
  }
}
```

**Error Responses:**

| Status | Message                          | Cause                      |
|--------|----------------------------------|----------------------------|
| `400`  | `"Payment verification failed"`  | Signature mismatch         |
| `400`  | `"Invalid payment signature"`    | Tampered payment data      |

> 📌 On success: Order is created in DB, cart is cleared, confirmation email is sent.

---

### 8.3 Razorpay Webhook

| Field        | Value                         |
|--------------|-------------------------------|
| **Method**   | `POST`                        |
| **Endpoint** | `/api/payment/webhook`        |
| **Access**   | Public (Razorpay server only) |

**Request Headers:**
```
X-Razorpay-Signature: <webhook_signature>
```

**Request Body:** Razorpay webhook event payload (raw JSON)

```json
{
  "entity": "event",
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_ABCdef123456",
        "order_id": "order_PQRstu789xyz",
        "amount": 123546,
        "status": "captured"
      }
    }
  }
}
```

**Handled Events:**

| Event                  | Action                                       |
|------------------------|----------------------------------------------|
| `payment.captured`     | Mark order payment as `paid`                 |
| `payment.failed`       | Mark order payment as `failed`, restore stock|
| `refund.created`       | Update order status to `Refunded`            |

**Success Response `200 OK`:**
```json
{ "received": true }
```

---

## 9. Review Routes `/api/reviews`

### 9.1 Get Reviews for a Product

| Field        | Value                                    |
|--------------|------------------------------------------|
| **Method**   | `GET`                                    |
| **Endpoint** | `/api/reviews/product/:productId`        |
| **Access**   | Public                                   |

**Path Parameters:**

| Param       | Type   | Required | Description                |
|-------------|--------|----------|----------------------------|
| `productId` | String | ✅ Yes   | MongoDB ObjectId of product|

**Query Parameters:**

| Param   | Type   | Required | Description              | Default |
|---------|--------|----------|--------------------------|---------|
| `page`  | Number | ❌ No    | Page number              | `1`     |
| `limit` | Number | ❌ No    | Reviews per page         | `10`    |
| `sort`  | String | ❌ No    | `newest`, `top-rated`, `helpful` | `newest` |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "_id": "64rev001...",
        "user": { "_id": "64abc123...", "name": "Ravi Kumar", "avatar": { "url": "..." } },
        "rating": 5,
        "title": "Amazing quality!",
        "comment": "These sparklers burned for a long time and had great colour.",
        "images": [],
        "isVerifiedPurchase": true,
        "helpfulVotes": 12,
        "createdAt": "2026-01-20T10:00:00.000Z"
      }
    ],
    "ratingSummary": {
      "average": 4.5,
      "total": 128,
      "breakdown": { "5": 80, "4": 30, "3": 10, "2": 5, "1": 3 }
    }
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 13,
    "totalReviews": 128,
    "limit": 10
  }
}
```

---

### 9.2 Add Review

| Field        | Value                                    |
|--------------|------------------------------------------|
| **Method**   | `POST`                                   |
| **Endpoint** | `/api/reviews/product/:productId`        |
| **Access**   | Private (Bearer Token)                   |

**Path Parameters:**

| Param       | Type   | Required | Description                |
|-------------|--------|----------|----------------------------|
| `productId` | String | ✅ Yes   | MongoDB ObjectId of product|

**Request Body (JSON or multipart/form-data for images):**
```json
{
  "rating": 5,
  "title": "Amazing quality!",
  "comment": "These sparklers burned for a long time and had great colour."
}
```

| Field     | Type    | Required | Validation                        |
|-----------|---------|----------|-----------------------------------|
| `rating`  | Number  | ✅ Yes   | Integer 1–5                       |
| `title`   | String  | ❌ No    | Max 100 chars                     |
| `comment` | String  | ✅ Yes   | Min 10, Max 500 chars             |
| `images`  | File[]  | ❌ No    | Max 3 images, JPEG/PNG, max 2MB each |

> ⚠️ One review per user per product. Returns `400` if already reviewed.
> 📌 Sets `isVerifiedPurchase: true` automatically if user has a delivered order containing this product.

**Success Response `201 Created`:**
```json
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    "review": {
      "_id": "64rev002...",
      "rating": 5,
      "title": "Amazing quality!",
      "comment": "These sparklers burned for a long time and had great colour.",
      "isVerifiedPurchase": true,
      "createdAt": "2026-02-27T10:00:00.000Z"
    }
  }
}
```

**Error Responses:**

| Status | Message                                    | Cause                       |
|--------|--------------------------------------------|-----------------------------|
| `400`  | `"You have already reviewed this product"` | Duplicate review            |
| `404`  | `"Product not found"`                      | Invalid product ID          |

---

### 9.3 Update Review

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `PUT`                     |
| **Endpoint** | `/api/reviews/:id`        |
| **Access**   | Private (Bearer Token)    |

**Path Parameters:**

| Param | Type   | Required | Description               |
|-------|--------|----------|---------------------------|
| `id`  | String | ✅ Yes   | MongoDB ObjectId of review|

**Request Body:**
```json
{
  "rating": 4,
  "title": "Good but could be better",
  "comment": "Good quality sparklers. Packaging could be improved."
}
```

> 📌 Only the review author can update it. All fields optional.

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "Review updated successfully",
  "data": {
    "review": { /* Updated review object */ }
  }
}
```

---

### 9.4 Delete Review

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `DELETE`                  |
| **Endpoint** | `/api/reviews/:id`        |
| **Access**   | Private (Bearer Token)    |

**Path Parameters:**

| Param | Type   | Required | Description               |
|-------|--------|----------|---------------------------|
| `id`  | String | ✅ Yes   | MongoDB ObjectId of review|

> 📌 Review author or Admin can delete. Product's `ratings` and `numReviews` are recalculated.

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

---

## 10. Address Routes `/api/addresses`

### 10.1 Get All Addresses

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `GET`                     |
| **Endpoint** | `/api/addresses`          |
| **Access**   | Private (Bearer Token)    |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "addresses": [
      {
        "_id": "64addr001...",
        "fullName": "Ravi Kumar",
        "phone": "9876543210",
        "addressLine1": "12, MG Road",
        "addressLine2": "Near Central Park",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "pincode": "600001",
        "country": "India",
        "isDefault": true,
        "type": "home"
      }
    ]
  }
}
```

---

### 10.2 Add New Address

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `POST`                    |
| **Endpoint** | `/api/addresses`          |
| **Access**   | Private (Bearer Token)    |

**Request Body:**
```json
{
  "fullName": "Ravi Kumar",
  "phone": "9876543210",
  "addressLine1": "12, MG Road",
  "addressLine2": "Near Central Park",
  "city": "Chennai",
  "state": "Tamil Nadu",
  "pincode": "600001",
  "country": "India",
  "type": "home",
  "isDefault": true
}
```

| Field          | Type    | Required | Validation                          |
|----------------|---------|----------|-------------------------------------|
| `fullName`     | String  | ✅ Yes   | Non-empty, max 100 chars            |
| `phone`        | String  | ✅ Yes   | 10-digit mobile number              |
| `addressLine1` | String  | ✅ Yes   | Non-empty                           |
| `addressLine2` | String  | ❌ No    | Optional                            |
| `city`         | String  | ✅ Yes   | Non-empty                           |
| `state`        | String  | ✅ Yes   | Non-empty                           |
| `pincode`      | String  | ✅ Yes   | 6-digit Indian pincode              |
| `country`      | String  | ❌ No    | Default: `"India"`                  |
| `type`         | String  | ❌ No    | `"home"` / `"work"` / `"other"` (default: `"home"`) |
| `isDefault`    | Boolean | ❌ No    | Set as default address (default: `false`) |

> 📌 If `isDefault: true`, any previously default address is unset.

**Success Response `201 Created`:**
```json
{
  "success": true,
  "message": "Address added successfully",
  "data": {
    "address": {
      "_id": "64addr002...",
      "fullName": "Ravi Kumar",
      "city": "Chennai",
      "isDefault": true,
      "type": "home"
    }
  }
}
```

---

### 10.3 Update Address

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `PUT`                     |
| **Endpoint** | `/api/addresses/:id`      |
| **Access**   | Private (Bearer Token)    |

**Path Parameters:**

| Param | Type   | Required | Description                |
|-------|--------|----------|----------------------------|
| `id`  | String | ✅ Yes   | MongoDB ObjectId of address|

**Request Body:** (all fields optional)
```json
{
  "addressLine1": "15, Anna Nagar",
  "city": "Chennai",
  "pincode": "600040"
}
```

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "Address updated successfully",
  "data": {
    "address": { /* Updated address object */ }
  }
}
```

---

### 10.4 Delete Address

| Field        | Value                     |
|--------------|---------------------------|
| **Method**   | `DELETE`                  |
| **Endpoint** | `/api/addresses/:id`      |
| **Access**   | Private (Bearer Token)    |

**Path Parameters:**

| Param | Type   | Required | Description                |
|-------|--------|----------|----------------------------|
| `id`  | String | ✅ Yes   | MongoDB ObjectId of address|

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

---

### 10.5 Set Default Address

| Field        | Value                              |
|--------------|------------------------------------|
| **Method**   | `PUT`                              |
| **Endpoint** | `/api/addresses/:id/default`       |
| **Access**   | Private (Bearer Token)             |

**Path Parameters:**

| Param | Type   | Required | Description                |
|-------|--------|----------|----------------------------|
| `id`  | String | ✅ Yes   | MongoDB ObjectId of address|

**Request Body:** None

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "Default address updated",
  "data": {
    "address": {
      "_id": "64addr001...",
      "isDefault": true
    }
  }
}
```

---

## 11. Admin Routes `/api/admin`

> 🛡️ All admin routes require: `Authorization: Bearer <admin_access_token>` and user `role: "admin"`.

### 11.1 Dashboard Stats

| Field        | Value                         |
|--------------|-------------------------------|
| **Method**   | `GET`                         |
| **Endpoint** | `/api/admin/dashboard`        |
| **Access**   | Admin                         |

**Query Parameters:**

| Param    | Type   | Required | Description                         |
|----------|--------|----------|-------------------------------------|
| `period` | String | ❌ No    | `today`, `week`, `month`, `year` (default: `month`) |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalRevenue": 485000,
      "totalOrders": 312,
      "totalUsers": 840,
      "totalProducts": 85,
      "pendingOrders": 24,
      "processingOrders": 18,
      "shippedOrders": 12,
      "deliveredOrders": 258,
      "cancelledOrders": 8,
      "lowStockProducts": 5,
      "revenueGrowth": 12.5,
      "ordersGrowth": 8.3
    },
    "recentOrders": [ /* last 5 orders */ ],
    "topProducts": [ /* top 5 by sold count */ ]
  }
}
```

---

### 11.2 Get All Orders (Admin)

| Field        | Value                         |
|--------------|-------------------------------|
| **Method**   | `GET`                         |
| **Endpoint** | `/api/admin/orders`           |
| **Access**   | Admin                         |

**Query Parameters:**

| Param        | Type   | Required | Description                                         | Default |
|--------------|--------|----------|-----------------------------------------------------|---------|
| `status`     | String | ❌ No    | `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`, `Refunded` | All |
| `paymentStatus` | String | ❌ No | `pending`, `paid`, `failed`, `refunded`             | All     |
| `startDate`  | String | ❌ No    | ISO date string: `"2026-01-01"`                     | —       |
| `endDate`    | String | ❌ No    | ISO date string: `"2026-02-27"`                     | —       |
| `search`     | String | ❌ No    | Search by order ID or customer name/email           | —       |
| `page`       | Number | ❌ No    | Page number                                         | `1`     |
| `limit`      | Number | ❌ No    | Orders per page                                     | `20`    |
| `sort`       | String | ❌ No    | `-createdAt`, `createdAt`, `-totalAmount`           | `-createdAt` |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "_id": "64order123...",
        "user": { "name": "Ravi Kumar", "email": "ravi@example.com" },
        "totalAmount": 1235.46,
        "orderStatus": "Processing",
        "paymentInfo": { "method": "razorpay", "status": "paid" },
        "itemsCount": 3,
        "createdAt": "2026-02-27T10:00:00.000Z"
      }
    ]
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 16,
    "totalOrders": 312,
    "limit": 20
  }
}
```

---

### 11.3 Get Order Detail (Admin)

| Field        | Value                         |
|--------------|-------------------------------|
| **Method**   | `GET`                         |
| **Endpoint** | `/api/admin/orders/:id`       |
| **Access**   | Admin                         |

**Path Parameters:**

| Param | Type   | Required | Description               |
|-------|--------|----------|---------------------------|
| `id`  | String | ✅ Yes   | MongoDB ObjectId of order |

> 📌 Returns full order detail with populated user, products, and complete status history.

**Success Response `200 OK`:** Same structure as [Get Order Detail](#73-get-order-detail) but includes full user details.

---

### 11.4 Update Order Status

| Field        | Value                                 |
|--------------|---------------------------------------|
| **Method**   | `PUT`                                 |
| **Endpoint** | `/api/admin/orders/:id/status`        |
| **Access**   | Admin                                 |

**Path Parameters:**

| Param | Type   | Required | Description               |
|-------|--------|----------|---------------------------|
| `id`  | String | ✅ Yes   | MongoDB ObjectId of order |

**Request Body:**
```json
{
  "status": "Shipped",
  "trackingNumber": "BD123456789IN",
  "note": "Dispatched via BlueDart Express"
}
```

| Field            | Type   | Required | Validation                                                             |
|------------------|--------|----------|------------------------------------------------------------------------|
| `status`         | String | ✅ Yes   | `Pending` / `Processing` / `Shipped` / `Delivered` / `Cancelled` / `Refunded` |
| `trackingNumber` | String | ❌ No    | Required when status is `Shipped`                                      |
| `note`           | String | ❌ No    | Internal note for status change                                        |

> 📌 Triggers email notification to customer on status change.

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "Order status updated to Shipped",
  "data": {
    "order": {
      "_id": "64order123...",
      "orderStatus": "Shipped",
      "trackingNumber": "BD123456789IN",
      "statusHistory": [ /* updated history */ ]
    }
  }
}
```

---

### 11.5 Get All Users (Admin)

| Field        | Value                         |
|--------------|-------------------------------|
| **Method**   | `GET`                         |
| **Endpoint** | `/api/admin/users`            |
| **Access**   | Admin                         |

**Query Parameters:**

| Param      | Type   | Required | Description                     | Default |
|------------|--------|----------|---------------------------------|---------|
| `search`   | String | ❌ No    | Search by name or email         | —       |
| `role`     | String | ❌ No    | `user` or `admin`               | All     |
| `page`     | Number | ❌ No    | Page number                     | `1`     |
| `limit`    | Number | ❌ No    | Users per page                  | `20`    |
| `sort`     | String | ❌ No    | `-createdAt`, `name`            | `-createdAt` |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "64abc123...",
        "name": "Ravi Kumar",
        "email": "ravi@example.com",
        "phone": "9876543210",
        "role": "user",
        "avatar": { "url": "https://res.cloudinary.com/..." },
        "isVerified": true,
        "createdAt": "2026-01-15T10:00:00.000Z"
      }
    ]
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 42,
    "totalUsers": 840,
    "limit": 20
  }
}
```

---

### 11.6 Get User Detail (Admin)

| Field        | Value                         |
|--------------|-------------------------------|
| **Method**   | `GET`                         |
| **Endpoint** | `/api/admin/users/:id`        |
| **Access**   | Admin                         |

**Path Parameters:**

| Param | Type   | Required | Description              |
|-------|--------|----------|--------------------------|
| `id`  | String | ✅ Yes   | MongoDB ObjectId of user |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64abc123...",
      "name": "Ravi Kumar",
      "email": "ravi@example.com",
      "phone": "9876543210",
      "role": "user",
      "isVerified": true,
      "createdAt": "2026-01-15T10:00:00.000Z"
    },
    "orderStats": {
      "totalOrders": 8,
      "totalSpent": 9856.32,
      "lastOrderDate": "2026-02-27T10:00:00.000Z"
    }
  }
}
```

---

### 11.7 Change User Role

| Field        | Value                              |
|--------------|------------------------------------|
| **Method**   | `PUT`                              |
| **Endpoint** | `/api/admin/users/:id/role`        |
| **Access**   | Admin                              |

**Path Parameters:**

| Param | Type   | Required | Description              |
|-------|--------|----------|--------------------------|
| `id`  | String | ✅ Yes   | MongoDB ObjectId of user |

**Request Body:**
```json
{
  "role": "admin"
}
```

| Field  | Type   | Required | Validation                |
|--------|--------|----------|---------------------------|
| `role` | String | ✅ Yes   | `"user"` or `"admin"`     |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "User role updated to admin",
  "data": {
    "user": {
      "_id": "64abc123...",
      "name": "Ravi Kumar",
      "role": "admin"
    }
  }
}
```

---

### 11.8 Delete User (Admin)

| Field        | Value                         |
|--------------|-------------------------------|
| **Method**   | `DELETE`                      |
| **Endpoint** | `/api/admin/users/:id`        |
| **Access**   | Admin                         |

**Path Parameters:**

| Param | Type   | Required | Description              |
|-------|--------|----------|--------------------------|
| `id`  | String | ✅ Yes   | MongoDB ObjectId of user |

> ⚠️ Also removes the user's cart, wishlist, and addresses. Does NOT delete orders (for audit trail).

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Responses:**

| Status | Message                              | Cause                    |
|--------|--------------------------------------|--------------------------|
| `400`  | `"Cannot delete your own account"`   | Admin deleting themselves|

---

### 11.9 Get Low Stock Products

| Field        | Value                                  |
|--------------|----------------------------------------|
| **Method**   | `GET`                                  |
| **Endpoint** | `/api/admin/products/low-stock`        |
| **Access**   | Admin                                  |

**Query Parameters:**

| Param      | Type   | Required | Description                             | Default |
|------------|--------|----------|-----------------------------------------|---------|
| `threshold`| Number | ❌ No    | Stock count threshold                   | `10`    |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "64abc777...",
        "name": "Color Rocket Pack",
        "sku": "RKT-CLR-005",
        "stock": 3,
        "category": { "name": "Rockets" },
        "images": [{ "url": "https://res.cloudinary.com/..." }]
      }
    ],
    "count": 5
  }
}
```

---

### 11.10 Revenue Analytics

| Field        | Value                         |
|--------------|-------------------------------|
| **Method**   | `GET`                         |
| **Endpoint** | `/api/admin/revenue`          |
| **Access**   | Admin                         |

**Query Parameters:**

| Param       | Type   | Required | Description                                   | Default |
|-------------|--------|----------|-----------------------------------------------|---------|
| `period`    | String | ❌ No    | `daily`, `weekly`, `monthly`, `yearly`        | `monthly` |
| `startDate` | String | ❌ No    | ISO date: `"2026-01-01"`                      | 12 months ago |
| `endDate`   | String | ❌ No    | ISO date: `"2026-02-27"`                      | Today   |

**Success Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalRevenue": 485000,
      "totalOrders": 312,
      "averageOrderValue": 1554.49
    },
    "chart": [
      { "period": "Jan 2026", "revenue": 210000, "orders": 135 },
      { "period": "Feb 2026", "revenue": 275000, "orders": 177 }
    ],
    "topCategories": [
      { "category": "Aerial Shots", "revenue": 150000, "percentage": 30.9 },
      { "category": "Gift Boxes",   "revenue": 120000, "percentage": 24.7 },
      { "category": "Sparklers",    "revenue": 98000,  "percentage": 20.2 }
    ],
    "topProducts": [
      { "_id": "64abc999...", "name": "Golden Sparklers Pack", "sold": 320, "revenue": 111680 }
    ]
  }
}
```

---

## 12. Standard Response Format

### ✅ Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 120,
    "limit": 12
  }
}
```

> 📌 `pagination` is only included for list endpoints.

### ❌ Error Response
```json
{
  "success": false,
  "message": "Error description here"
}
```

### ❌ Validation Error Response
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    { "field": "email", "message": "Please provide a valid email" },
    { "field": "password", "message": "Password must be at least 8 characters" }
  ]
}
```

---

## 13. HTTP Status Codes

| Code  | Meaning               | When Used                                         |
|-------|-----------------------|---------------------------------------------------|
| `200` | OK                    | Successful GET, PUT, DELETE, POST (no resource created) |
| `201` | Created               | Successful POST that creates a resource           |
| `400` | Bad Request           | Validation errors, business rule violations       |
| `401` | Unauthorized          | Missing or invalid token                          |
| `403` | Forbidden             | Valid token but insufficient permissions          |
| `404` | Not Found             | Resource (product, order, user) not found         |
| `409` | Conflict              | Duplicate entry (email, SKU, review)              |
| `422` | Unprocessable Entity  | Semantic validation error                         |
| `429` | Too Many Requests     | Rate limit exceeded (100 req/min per IP)          |
| `500` | Internal Server Error | Unexpected server error                           |

---

## 14. Error Codes Reference

| Error Code            | HTTP Status | Description                                     |
|-----------------------|-------------|-------------------------------------------------|
| `INVALID_TOKEN`       | `401`       | JWT token is malformed                          |
| `TOKEN_EXPIRED`       | `401`       | JWT access token has expired                    |
| `REFRESH_EXPIRED`     | `401`       | Refresh token has expired, re-login required    |
| `NOT_AUTHORIZED`      | `403`       | User does not have permission                   |
| `ADMIN_REQUIRED`      | `403`       | Admin role required for this action             |
| `RESOURCE_NOT_FOUND`  | `404`       | Requested resource does not exist               |
| `DUPLICATE_ENTRY`     | `409`       | Email, SKU, or review already exists            |
| `STOCK_INSUFFICIENT`  | `400`       | Requested quantity exceeds available stock      |
| `PAYMENT_FAILED`      | `400`       | Razorpay payment verification failed            |
| `ORDER_NOT_CANCELLABLE` | `400`     | Order status prevents cancellation              |
| `UPLOAD_FAILED`       | `500`       | Cloudinary image upload failed                  |
| `EMAIL_FAILED`        | `500`       | Nodemailer/SMTP failed to send email            |
| `RATE_LIMIT_EXCEEDED` | `429`       | Too many requests from same IP                  |

---

## Appendix: Request Headers Summary

| Header            | Value                              | Required For            |
|-------------------|------------------------------------|-------------------------|
| `Content-Type`    | `application/json`                 | POST/PUT with JSON body |
| `Content-Type`    | `multipart/form-data`              | File upload endpoints   |
| `Authorization`   | `Bearer <access_token>`            | All Private/Admin routes |
| `X-Razorpay-Signature` | `<hmac_sha256_signature>`     | Webhook endpoint        |

---

## Appendix: Environment-Specific Base URLs

| Environment | Base URL                                      |
|-------------|-----------------------------------------------|
| Development | `http://localhost:5000/api`                   |
| Staging     | `https://staging-api.yourfireworksstore.com/api` |
| Production  | `https://api.yourfireworksstore.com/api`      |

---

> 📌 For database schemas → see [database-schema.md](database-schema.md)
> 📌 For folder structure → see [folder-structure.md](folder-structure.md)
> 📌 For deployment guide → see [../deployment/deployment-guide.md](../deployment/deployment-guide.md)
