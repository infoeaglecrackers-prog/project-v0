# 🚀 Deployment Guide
## Fireworks & Crackers E-Commerce — Step-by-Step Deployment

---

## 1. Pre-Deployment Checklist

```
Backend:
✅ All .env variables defined
✅ CORS configured with production frontend URL
✅ Helmet.js security headers added
✅ Rate limiting enabled
✅ MongoDB Atlas connection string ready
✅ Cloudinary credentials ready
✅ Razorpay live keys ready
✅ Email SMTP configured
✅ node server.js runs without errors locally
✅ NODE_ENV=production in env
✅ .env is in .gitignore

Frontend:
✅ API base URL points to production backend
✅ Razorpay key set to live key
✅ npm run build runs without errors
✅ All routes working (no broken links)
✅ Console errors resolved
✅ Images loading from Cloudinary
```

---

## 2. MongoDB Atlas Setup (Database)

```bash
# 1. Go to: https://cloud.mongodb.com
# 2. Create Organization → Create Project → Build a Cluster

# Free tier settings:
# - Provider: AWS
# - Region: Mumbai (ap-south-1)  ← Best for India
# - Cluster Name: FireworksCluster

# 3. Create Database User
# Security → Database Access → Add New Database User
# Username: fireworks_admin
# Password: generate strong password
# Role: Atlas admin

# 4. Whitelist IP
# Security → Network Access → Add IP Address → 0.0.0.0/0

# 5. Get connection string
# Database → Connect → Connect your application → Node.js
# Copy: mongodb+srv://fireworks_admin:<password>@cluster0.xxxxx.mongodb.net/fireworks_db
```

---

## 3. Cloudinary Setup (Image Storage)

```bash
# 1. Sign up: https://cloudinary.com/users/register/free
# 2. Dashboard → Account Details:
#    Cloud Name: your-cloud-name
#    API Key: 123456789012345
#    API Secret: abcdefghijklmnopqrstuvwxyz

# 3. Settings → Upload → Add upload preset
#    Preset name: fireworks_products
#    Signing Mode: Unsigned (for client uploads) or Signed (server only)
#    Folder: fireworks/products

# Add to .env:
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## 4. Razorpay Setup (Payment Gateway)

```bash
# 1. Sign up: https://dashboard.razorpay.com/signup
# 2. Complete KYC (PAN, Aadhaar, Bank details)
# 3. Go to Settings → API Keys
# 4. Generate Test Keys first (for testing):
#    Key ID: rzp_test_xxxxxxxxxxxx
#    Key Secret: xxxxxxxxxxxxxxxxxx
# 5. After KYC approval, generate Live keys

# Add to .env:
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxx

# For testing use: rzp_test_xxxx
```

---

## 5. Backend Deployment on Render.com

### Option A: Render.com (Free)
```bash
# 1. Go to: https://render.com → Sign up with GitHub
# 2. New → Web Service
# 3. Connect GitHub → Select your repository
# 4. Fill in settings:

Name:            fireworks-api
Region:          Singapore (closest to India)
Branch:          main
Root Directory:  backend
Runtime:         Node
Build Command:   npm install
Start Command:   node server.js
Plan:            Free

# 5. Add Environment Variables (one by one):
NODE_ENV           = production
PORT               = 5000
MONGO_URI          = mongodb+srv://...
JWT_SECRET         = your_super_secret_key_here
JWT_EXPIRE         = 15m
JWT_REFRESH_SECRET = your_refresh_secret
JWT_REFRESH_EXPIRE = 7d
CLOUDINARY_CLOUD_NAME = ...
CLOUDINARY_API_KEY    = ...
CLOUDINARY_API_SECRET = ...
RAZORPAY_KEY_ID    = rzp_live_xxx
RAZORPAY_KEY_SECRET = xxx
SMTP_HOST          = smtp.gmail.com
SMTP_PORT          = 587
SMTP_EMAIL         = youremail@gmail.com
SMTP_PASSWORD      = your_app_password
FROM_EMAIL         = noreply@crackersbazaar.com
FROM_NAME          = Crackers Bazaar
CLIENT_URL         = https://www.crackersbazaar.com

# 6. Deploy → Wait for build to finish
# 7. Your API will be at: https://fireworks-api.onrender.com
```

### Option B: Railway.app
```bash
# 1. Go to: https://railway.app → Login with GitHub
# 2. New Project → Deploy from GitHub repo
# 3. Select repository → Configure service
# 4. Set Root Directory: /backend
# 5. Add same environment variables
# 6. Railway auto-detects Node.js and deploys
```

---

## 6. Frontend Deployment on Vercel

```bash
# 1. Go to: https://vercel.com → Sign up with GitHub
# 2. Add New → Project → Import from GitHub
# 3. Select your repository

# Configuration:
Framework Preset:   Vite
Root Directory:     frontend
Build Command:      npm run build
Output Directory:   dist
Install Command:    npm install

# 4. Environment Variables:
VITE_API_URL           = https://api.crackersbazaar.com/api
VITE_RAZORPAY_KEY      = rzp_live_xxxxxxxxxxxx
VITE_CLOUDINARY_NAME   = your-cloud-name

# 5. Deploy → Wait for build
# 6. Your site: https://fireworks-store.vercel.app

# 7. Later, add custom domain in:
# Project → Settings → Domains → Add: www.crackersbazaar.com
```

---

## 7. CI/CD with GitHub Actions (Auto Deploy)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Trigger Render Deploy
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install & Build
        run: |
          cd frontend
          npm ci
          npm run build
      # Vercel auto-deploys on git push if connected
```

> **How it works:** Every `git push` to `main` branch automatically triggers redeploy on both Render and Vercel.

---

## 8. Production Performance Tips

```
✅ Enable gzip compression in Express:
   npm install compression
   app.use(compression())

✅ Add caching headers for static assets
✅ Use MongoDB indexes for frequent queries
✅ Lazy load images in React (loading="lazy")
✅ Code splitting in React (React.lazy + Suspense)
✅ Minimize bundle size (analyze with vite-bundle-visualizer)
✅ Use Cloudflare for CDN caching
✅ Implement Redis for session/cart caching (Phase 2)
```

---

> ➡️ See [domain-setup.md](domain-setup.md) for domain purchase and DNS configuration.
