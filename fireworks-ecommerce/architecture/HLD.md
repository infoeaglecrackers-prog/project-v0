# 🏗️ High Level Design (HLD)
## Fireworks & Crackers E-Commerce — MERN Stack

---

## 1. System Overview

The system is an **online fireworks and crackers retail platform** that allows customers to browse, select, and purchase products with secure payment integration. The admin panel manages products, orders, inventory, and users.

---

## 2. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                                 │
│                                                                     │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐         │
│   │  Customer UI │    │   Admin UI   │    │  Mobile View │         │
│   │  (React.js)  │    │  (React.js)  │    │  (Responsive)│         │
│   └──────┬───────┘    └──────┬───────┘    └──────┬───────┘         │
└──────────┼────────────────── ┼────────────────── ┼─────────────────┘
           │                   │                   │
           └───────────────────┼───────────────────┘
                               │  HTTPS Requests
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      API GATEWAY / NGINX                            │
│              (Rate Limiting, SSL Termination, Routing)              │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                               │
│                                                                     │
│   ┌──────────────────────────────────────────────────────────┐     │
│   │              Node.js + Express.js REST API               │     │
│   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │     │
│   │  │   Auth   │ │ Products │ │  Orders  │ │  Payment  │  │     │
│   │  │  Module  │ │  Module  │ │  Module  │ │  Module   │  │     │
│   │  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │     │
│   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │     │
│   │  │   Cart   │ │Wishlist  │ │  Users   │ │   Admin   │  │     │
│   │  │  Module  │ │  Module  │ │  Module  │ │  Module   │  │     │
│   │  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │     │
│   └──────────────────────────────────────────────────────────┘     │
└──────────────────┬──────────────────────┬──────────────────────────┘
                   │                      │
         ┌─────────▼──────────┐  ┌───────▼──────────────┐
         │   MongoDB Atlas    │  │  External Services   │
         │  (Primary DB)      │  │                      │
         │  ┌──────────────┐  │  │  ┌───────────────┐   │
         │  │   Users      │  │  │  │  Razorpay /   │   │
         │  │   Products   │  │  │  │   Stripe      │   │
         │  │   Orders     │  │  │  └───────────────┘   │
         │  │   Cart       │  │  │  ┌───────────────┐   │
         │  │   Categories │  │  │  │  Cloudinary   │   │
         │  │   Reviews    │  │  │  │ (Image Store) │   │
         │  └──────────────┘  │  │  └───────────────┘   │
         └────────────────────┘  │  ┌───────────────┐   │
                                 │  │  Nodemailer / │   │
                                 │  │  SendGrid     │   │
                                 │  │ (Email Notif) │   │
                                 │  └───────────────┘   │
                                 └──────────────────────┘
```

---

## 3. Tech Stack

### Frontend
| Technology       | Purpose                          |
|------------------|----------------------------------|
| React.js 18      | UI framework                     |
| Redux Toolkit    | Global state management          |
| React Router v6  | Client-side routing              |
| Axios            | HTTP requests                    |
| Tailwind CSS     | Styling                          |
| React Hot Toast  | Notifications                    |
| Framer Motion    | Animations                       |
| Razorpay SDK     | Payment UI                       |

### Backend
| Technology       | Purpose                          |
|------------------|----------------------------------|
| Node.js          | Runtime environment              |
| Express.js       | Web framework                    |
| MongoDB Atlas    | NoSQL Database (Cloud)           |
| Mongoose         | MongoDB ODM                      |
| JWT              | Authentication tokens            |
| Bcryptjs         | Password hashing                 |
| Multer           | File uploads                     |
| Cloudinary       | Cloud image storage              |
| Nodemailer       | Email service                    |
| Razorpay SDK     | Payment processing               |
| Helmet           | Security headers                 |
| Express-rate-limit| API rate limiting               |
| Morgan           | HTTP request logger              |
| Dotenv           | Environment config               |

### DevOps & Deployment
| Technology         | Purpose                        |
|--------------------|--------------------------------|
| Vercel / Netlify   | Frontend hosting               |
| Render / Railway   | Backend hosting                |
| MongoDB Atlas      | Database hosting               |
| Cloudinary         | Media hosting                  |
| GitHub             | Version control                |
| GitHub Actions     | CI/CD pipeline                 |
| Namecheap/GoDaddy  | Domain registrar               |
| Cloudflare         | CDN + DNS + DDoS protection    |

---

## 4. User Roles & Permissions

### 🧑 Customer
- Register / Login
- Browse & Search products
- Add to Cart / Wishlist
- Place Orders
- Make Payments
- Track Orders
- Write Reviews
- Manage Profile & Addresses

### 🛡️ Admin
- Login to Admin Dashboard
- Manage Products (CRUD)
- Manage Categories
- View & Update Orders
- Manage Users
- View Analytics (Sales, Revenue)
- Manage Banners & Offers
- Handle Refunds

---

## 5. Core Modules

### 5.1 Authentication Module
- User Registration (Email + Password)
- Login with JWT (Access Token + Refresh Token)
- Forgot Password → OTP/Email reset
- Google OAuth (optional phase 2)
- Role-based access control (RBAC)

### 5.2 Product Module
- Products with categories (Ground, Aerial, Sparklers, Gift Boxes, etc.)
- Multiple images per product (Cloudinary)
- Variants (size/color/pack)
- Stock management
- Price, Discount, GST
- Search + Filter + Pagination + Sort

### 5.3 Cart & Wishlist Module
- Persistent cart (DB stored per user)
- Guest cart (localStorage)
- Quantity update, remove item
- Price calculation with taxes
- Wishlist management

### 5.4 Order Module
- Order placement
- Address selection
- Order status: Pending → Processing → Shipped → Delivered → Cancelled
- Invoice generation (PDF)
- Order history

### 5.5 Payment Module
- Razorpay / Stripe integration
- COD (Cash on Delivery) option
- Payment status tracking
- Refund handling

### 5.6 Admin Dashboard
- Overview stats (Orders, Revenue, Users)
- Inventory alerts (low stock)
- Order management with status updates
- Product CRUD
- User management

### 5.7 Notification Module
- Order confirmation email
- Shipping dispatch email
- Delivery confirmation email
- OTP email for password reset

---

## 6. Non-Functional Requirements

| Requirement      | Target                                      |
|------------------|---------------------------------------------|
| Performance      | Page load < 3 seconds                       |
| Availability     | 99.9% uptime                                |
| Scalability      | Support 10,000 concurrent users             |
| Security         | HTTPS, JWT, Rate limiting, Input validation |
| SEO              | Server-side rendering hints, meta tags      |
| Responsiveness   | Mobile, Tablet, Desktop                     |
| Accessibility    | WCAG 2.1 AA compliant                       |
| Data Backup      | MongoDB Atlas daily backups                 |

---

## 7. Security Considerations

- All passwords hashed with **bcryptjs** (salt rounds: 12)
- JWT tokens with short expiry (15 min access, 7 day refresh)
- HTTPS enforced (SSL via Cloudflare / Let's Encrypt)
- Input validation with **Joi** / **express-validator**
- XSS protection via **Helmet.js**
- MongoDB injection prevention via Mongoose
- API rate limiting (100 req/min per IP)
- CORS configured for allowed origins only
- Sensitive data never logged

---

## 8. Data Flow — Order Placement

```
User Selects Product
       │
       ▼
Add to Cart (Redux + DB sync)
       │
       ▼
Checkout Page → Select Address → Review Items
       │
       ▼
Choose Payment Method
   ├── COD → Create Order (status: Pending)
   └── Online → Razorpay Gateway
           │
           ▼
       Payment Success → Webhook → Verify → Create Order
           │
           ▼
       Email Confirmation sent to User
           │
           ▼
       Admin sees Order → Updates Status
           │
           ▼
       Shipped → Email to User
           │
           ▼
       Delivered → Email to User → Review Prompt
```

---

## 9. Deployment Architecture

```
User Browser
     │
     ▼
Cloudflare CDN (DNS + DDoS + Cache)
     │
     ├──► Vercel (React Frontend)
     │
     └──► Render/Railway (Node.js Backend)
                │
                ├──► MongoDB Atlas (Database)
                ├──► Cloudinary (Media)
                └──► Razorpay (Payments)
```

---

> ➡️ See [LLD.md](../LLD.md) for detailed low-level component and database design.
