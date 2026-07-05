# 🗺️ Complete Project Workflow
## Figma → Development → Testing → Deployment → Domain → Go Live

---

## PHASE 1: 🎨 UI/UX Design in Figma

### Step 1.1 — Setup Figma Project
1. Create a free account at [figma.com](https://figma.com)
2. Create a new project: `Fireworks Store - Design`
3. Create a new file: `UI Design v1`

### Step 1.2 — Define Design System
Before designing pages, create a **Design System** (Styles & Components):
```
Design System File:
├── 🎨 Colors
│   ├── Primary:     #FF4500  (FireOrange)
│   ├── Secondary:   #FFD700  (Gold)
│   ├── Dark:        #1A1A2E  (Deep Night)
│   ├── Light BG:    #FFF8F0
│   ├── Success:     #22C55E
│   ├── Error:       #EF4444
│   └── Text:        #1F2937
│
├── 🔤 Typography
│   ├── Font: Poppins (Google Fonts)
│   ├── H1: 40px Bold
│   ├── H2: 32px SemiBold
│   ├── H3: 24px SemiBold
│   ├── Body: 16px Regular
│   └── Small: 14px Regular
│
└── 🧩 Components (Reusable)
    ├── Button (Primary, Secondary, Ghost)
    ├── Input Field
    ├── Product Card
    ├── Badge (New, Sale, Hot)
    ├── Rating Stars
    └── Navbar / Footer
```

### Step 1.3 — Create Wireframes (Low Fidelity)
Sketch rough layouts first:
- [ ] Home Page
- [ ] Product Listing Page
- [ ] Product Detail Page
- [ ] Cart Page
- [ ] Checkout Page
- [ ] Login / Register Page
- [ ] Order History Page
- [ ] Admin Dashboard

### Step 1.4 — Create High Fidelity Mockups
Apply design system to all screens with real:
- Colors, fonts, icons
- Product images (use Unsplash/Pexels for placeholders)
- Realistic content (product names, prices)

### Step 1.5 — Create Prototype
- Link all screens with click interactions
- Simulate: Home → Product → Cart → Checkout → Order Confirmed
- Share prototype link for feedback

### Step 1.6 — Figma Handoff to Dev
- Use **Figma Inspect** panel to get exact:
  - CSS values (padding, margin, colors, font sizes)
  - Asset exports (SVG icons, PNG images)
- Export all images/icons needed

**Figma Pages to Design:**
| Page             | Priority |
|------------------|----------|
| Home             | High     |
| Product List     | High     |
| Product Detail   | High     |
| Cart             | High     |
| Checkout         | High     |
| Login/Register   | High     |
| Order History    | Medium   |
| Profile          | Medium   |
| Admin Dashboard  | Medium   |
| 404 / Error      | Low      |

---

## PHASE 2: 💻 Development Setup

### Step 2.1 — Initialize Repository
```bash
# Create repo on GitHub first, then:
mkdir fireworks-store
cd fireworks-store
git init
git remote add origin https://github.com/yourusername/fireworks-store.git
```

### Step 2.2 — Frontend Setup (React + Vite)
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install

# Install dependencies
npm install axios react-router-dom @reduxjs/toolkit react-redux
npm install react-hot-toast framer-motion
npm install react-icons react-slick slick-carousel
npm install razorpay

# Dev dependencies
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 2.3 — Backend Setup (Node.js + Express)
```bash
mkdir backend && cd backend
npm init -y

# Install dependencies
npm install express mongoose dotenv cors helmet morgan
npm install bcryptjs jsonwebtoken cookie-parser
npm install multer cloudinary multer-storage-cloudinary
npm install nodemailer razorpay express-rate-limit
npm install express-validator

# Dev dependencies
npm install -D nodemon
```

### Step 2.4 — Development Order (Recommended)
```
Backend Development:
  1. Setup Express server & MongoDB connection
  2. Build User model + Auth (Register, Login, JWT)
  3. Build Category model + CRUD
  4. Build Product model + CRUD + Image upload
  5. Build Cart & Wishlist
  6. Build Order flow
  7. Integrate Razorpay payment
  8. Build Admin routes
  9. Add email notifications
  10. Test all APIs with Postman/Thunder Client

Frontend Development:
  1. Setup React Router + Redux store
  2. Build Navbar, Footer
  3. Build Login/Register pages
  4. Build Home Page
  5. Build Product List + Filters
  6. Build Product Detail page
  7. Build Cart page
  8. Build Checkout + Address
  9. Integrate Razorpay
  10. Build Order history pages
  11. Build Profile page
  12. Build Admin dashboard
```

---

## PHASE 3: 🧪 Testing

### Step 3.1 — API Testing
- Use **Postman** or **Thunder Client** (VS Code extension)
- Create collection: `Fireworks Store API`
- Test all endpoints (Auth, Products, Cart, Orders, Payment)

### Step 3.2 — Frontend Testing
- Manual testing of all user flows
- Responsive testing: Chrome DevTools (Mobile/Tablet/Desktop)
- Browser testing: Chrome, Firefox, Safari, Edge

### Step 3.3 — Checklist Before Deployment
```
✅ All API routes working correctly
✅ Authentication (login/register/logout) working
✅ Product search, filter, pagination working
✅ Cart add/remove/update working
✅ Checkout and address flow working
✅ Razorpay test payment working
✅ Order email notifications working
✅ Admin dashboard working
✅ All images loading (Cloudinary)
✅ Mobile responsive (all pages)
✅ No console errors
✅ .env files NOT committed to git
✅ Environment variables set for production
```

---

## PHASE 4: 🚀 Deployment

### Step 4.1 — Database (MongoDB Atlas)
```
1. Go to mongodb.com/atlas → Create free account
2. Create a new Cluster (Free Tier M0)
3. Choose region: Mumbai (ap-south-1) for India users
4. Create Database User (username + password)
5. Network Access → Add IP Address → Allow from anywhere (0.0.0.0/0)
6. Connect → Get connection string:
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/fireworks
7. Add to backend .env as MONGO_URI
```

### Step 4.2 — Backend Deployment (Render.com) ← Free & Easy
```
1. Go to render.com → Sign up with GitHub
2. New → Web Service
3. Connect your GitHub repo (backend folder)
4. Settings:
   - Name: fireworks-api
   - Branch: main
   - Root Directory: backend
   - Runtime: Node
   - Build Command: npm install
   - Start Command: node server.js
5. Add Environment Variables (from your .env file)
6. Deploy → Get URL: https://fireworks-api.onrender.com
```

**Alternative Backend Hosts:**
| Platform   | Free Tier | Notes                        |
|------------|-----------|------------------------------|
| Render     | ✅ Yes    | Sleeps after 15 min inactivity|
| Railway    | ✅ Yes    | $5/mo credit                 |
| Cyclic     | ✅ Yes    | Good for Node.js             |
| AWS EC2    | Paid      | Best for production          |
| DigitalOcean| Paid     | $6/mo Droplet                |

### Step 4.3 — Frontend Deployment (Vercel) ← Easiest
```
1. Go to vercel.com → Sign up with GitHub
2. Import Project → Select your GitHub repo
3. Settings:
   - Framework: Vite (auto-detected)
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: dist
4. Add Environment Variables:
   VITE_API_URL=https://fireworks-api.onrender.com/api
   VITE_RAZORPAY_KEY=rzp_live_xxxx
5. Deploy → Get URL: https://fireworks-store.vercel.app
```

**Alternative Frontend Hosts:**
| Platform  | Free Tier | Notes                 |
|-----------|-----------|-----------------------|
| Vercel    | ✅ Yes    | Best for React/Next   |
| Netlify   | ✅ Yes    | Simple drag & drop    |
| GitHub Pages | ✅ Yes | For static only      |

### Step 4.4 — Image Storage (Cloudinary)
```
1. Sign up at cloudinary.com (free 25GB)
2. Go to Dashboard → Get:
   - Cloud Name
   - API Key
   - API Secret
3. Add to backend .env
4. Create upload presets for products
```

---

## PHASE 5: 🌐 Domain Setup

### Step 5.1 — Buy a Domain
**Recommended Registrars:**
| Registrar   | Price (approx) | Notes                    |
|-------------|----------------|--------------------------|
| Namecheap   | ₹800-1200/yr   | Best value, free privacy |
| GoDaddy     | ₹1000-1500/yr  | Popular, easy UI         |
| Google Domains | ₹1000/yr    | Clean, reliable          |
| BigRock     | ₹500-900/yr    | India based              |

**Good domain name ideas:**
- `eaglecrackers.com`
- `buyfireworks.in`
- `diwalistore.in`
- `crackerzone.in`
- `sparklestore.in`

### Step 5.2 — Setup Cloudflare (Free CDN + DNS)
```
1. Sign up at cloudflare.com (Free plan)
2. Add your site → Enter domain name
3. Cloudflare scans existing DNS records
4. Change your domain's nameservers to Cloudflare's:
   - ns1.cloudflare.com
   - ns2.cloudflare.com
5. Update nameservers in your registrar (Namecheap/GoDaddy)
6. Wait 24-48 hours for propagation

Benefits of Cloudflare:
✅ Free SSL (HTTPS)
✅ Free CDN (faster loading globally)
✅ DDoS protection
✅ DNS management
```

### Step 5.3 — Point Domain to Frontend (Vercel)
```
In Vercel:
1. Go to Project → Settings → Domains
2. Add domain: www.eaglecrackers.com
3. Vercel gives you DNS records to add

In Cloudflare DNS:
Add CNAME record:
  Name:  www
  Target: cname.vercel-dns.com
  
Add A record (for root domain):
  Name:  @
  Target: 76.76.21.21 (Vercel IP)
```

### Step 5.4 — Point API Subdomain to Backend (Render)
```
In Cloudflare DNS, add CNAME record:
  Name:  api
  Target: fireworks-api.onrender.com

This gives you: https://api.eaglecrackers.com

Update frontend .env:
  VITE_API_URL=https://api.eaglecrackers.com/api

Update backend CORS:
  CLIENT_URL=https://www.eaglecrackers.com
```

### Step 5.5 — SSL Certificate
```
Cloudflare provides free SSL automatically.
Mode: Full (Strict) - encrypts traffic end to end

Verify: Visit https://www.eaglecrackers.com
You should see 🔒 padlock in browser
```

---

## PHASE 6: 🔧 Post-Launch Setup

### Step 6.1 — Google Search Console
```
1. Go to search.google.com/search-console
2. Add Property → URL prefix: https://www.eaglecrackers.com
3. Verify ownership via DNS record (Cloudflare)
4. Submit sitemap: https://www.eaglecrackers.com/sitemap.xml
```

### Step 6.2 — Google Analytics
```
1. Go to analytics.google.com
2. Create account + property
3. Get Measurement ID (G-XXXXXXXX)
4. Add to React app (react-ga4 package)
```

### Step 6.3 — Setup Monitoring
```
Free options:
- UptimeRobot (uptime.robot.com) → Get alerts if site goes down
- Render built-in logs for backend
- Vercel built-in analytics for frontend
```

### Step 6.4 — Seed Initial Data
```bash
# Run seeder to add initial products/categories
cd backend
node seeder.js --import
```

---

## PHASE 7: 📊 Ongoing Maintenance

| Task                       | Frequency   |
|----------------------------|-------------|
| Monitor uptime             | Daily       |
| Check error logs           | Daily       |
| Update product stock       | As needed   |
| Process orders             | Daily       |
| MongoDB Atlas backup       | Auto (daily)|
| Update dependencies        | Monthly     |
| Review performance metrics | Weekly      |
| Content updates (banners)  | Seasonal    |

---

## 📋 Complete Timeline Summary

```
Week 1-2:   Figma Design (all pages)
Week 3-4:   Backend Development (API + DB)
Week 5-6:   Frontend Development (React)
Week 7:     Integration (Frontend ↔ Backend)
Week 8:     Payment + Email Integration
Week 9:     Testing + Bug Fixes
Week 10:    Deployment (Atlas + Render + Vercel)
Day  1:     Domain Purchase
Day  2:     Cloudflare Setup + DNS
Day  3:     Go Live 🎆
```

---

## 🔒 Safety & Legal (Important for Crackers Store)

- [ ] Add **age verification** popup (18+)
- [ ] Add **safety instructions** on product pages
- [ ] Add **Terms & Conditions** page
- [ ] Add **Privacy Policy** page
- [ ] Add **Return & Refund Policy** page
- [ ] Add **Disclaimer** about fireworks safety
- [ ] Display **licensed seller** information
- [ ] Check local regulations for online fireworks sale
- [ ] Shipping restrictions (some states ban certain items)

---

> ✅ You're all set! Follow this guide phase by phase to build and launch your fireworks store.
