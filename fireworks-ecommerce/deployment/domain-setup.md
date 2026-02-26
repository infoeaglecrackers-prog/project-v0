# 🌐 Domain & DNS Setup Guide
## Fireworks & Crackers E-Commerce

---

## 1. Buying a Domain (Namecheap — Recommended)

```
1. Go to: https://namecheap.com
2. Search for your domain: crackersbazaar.com
3. Add to cart
4. Checkout:
   - Enable WhoisGuard (free privacy protection) ✅
   - Auto-renew: ON ✅
   - Duration: 1 year (₹900–₹1200 approx)
5. Pay and complete purchase
6. Go to Domain List → Manage → Nameservers
```

**India-specific .in domains (cheaper):**
- `crackersbazaar.in` (~₹500/yr)
- `fireworksstore.in`
- `buycrackers.in`

---

## 2. Setup Cloudflare (Free CDN + SSL + DNS)

### Why Cloudflare?
- ✅ Free SSL certificate (HTTPS)
- ✅ Global CDN (faster load times)
- ✅ DDoS protection
- ✅ DNS management with fast propagation
- ✅ Free plan is sufficient

### Steps:
```
1. Go to: https://cloudflare.com → Sign up (free)
2. Add a Site → Enter: crackersbazaar.com
3. Select Free Plan
4. Cloudflare scans and imports your existing DNS records
5. Review records → Continue
6. Cloudflare provides 2 nameservers:
   - gina.ns.cloudflare.com
   - jake.ns.cloudflare.com
   (These are unique to your account)

7. Go back to Namecheap:
   Domain List → Manage → Nameservers
   Select: Custom DNS
   Add both Cloudflare nameservers

8. Click the green ✅ checkmark to save
9. Back in Cloudflare → Click "Done, check nameservers"
10. Wait 15 minutes to 24 hours for propagation
```

---

## 3. DNS Records Configuration

Once Cloudflare is active, configure DNS records:

### Frontend (Vercel)
```
In Cloudflare Dashboard → DNS → Records → Add Record:

Type:    CNAME
Name:    www
Target:  cname.vercel-dns.com
TTL:     Auto
Proxy:   ✅ Proxied (orange cloud)

Type:    A
Name:    @
Target:  76.76.21.21
TTL:     Auto
Proxy:   ✅ Proxied

Type:    CNAME
Name:    @  (or use redirect rule)
Target:  www.crackersbazaar.com
(Root domain redirect to www)
```

### Backend API (Render)
```
Type:    CNAME
Name:    api
Target:  fireworks-api.onrender.com
TTL:     Auto
Proxy:   ✅ Proxied (or DNS only for API)
```

### Email (Gmail / Google Workspace)
```
If using Gmail:
Type:    MX
Name:    @
Target:  aspmx.l.google.com
Priority: 1

Type:    TXT
Name:    @
Content: v=spf1 include:_spf.google.com ~all
```

### Final DNS Table:
| Type  | Name | Target                       | Proxy  |
|-------|------|------------------------------|--------|
| A     | @    | 76.76.21.21 (Vercel)         | ✅     |
| CNAME | www  | cname.vercel-dns.com         | ✅     |
| CNAME | api  | fireworks-api.onrender.com   | ✅     |
| MX    | @    | aspmx.l.google.com           | ❌     |
| TXT   | @    | v=spf1 include:_spf.google.com ~all | ❌ |

---

## 4. SSL Certificate Setup

### Cloudflare SSL (Recommended - Free)
```
Cloudflare Dashboard → SSL/TLS → Overview

Set encryption mode: Full (strict)
↳ This encrypts traffic between:
  - Visitor ↔ Cloudflare (using Cloudflare cert)
  - Cloudflare ↔ Your server (using origin cert)
```

### Enable HTTPS Redirect
```
Cloudflare → SSL/TLS → Edge Certificates
↓
Always Use HTTPS: ON ✅
Automatic HTTPS Rewrites: ON ✅
```

### Verify SSL
```bash
# Check SSL from terminal:
curl -I https://www.crackersbazaar.com

# Should show: HTTP/2 200 and security headers
# Check in browser: 🔒 padlock should appear
```

---

## 5. Add Custom Domain in Vercel

```
1. Vercel Dashboard → Your Project → Settings → Domains
2. Add Domain → Enter: crackersbazaar.com
3. Add Domain → Enter: www.crackersbazaar.com
4. Vercel verifies via DNS → Status: Valid ✅
5. Your site is now live at: https://www.crackersbazaar.com
```

---

## 6. Add Custom Domain in Render (API)

```
1. Render Dashboard → Your Service → Settings → Custom Domains
2. Add Custom Domain: api.crackersbazaar.com
3. Render gives you a CNAME record to add
4. Already added in Cloudflare DNS ✅
5. Render verifies → SSL auto-provisioned
6. API now at: https://api.crackersbazaar.com
```

---

## 7. Update CORS in Backend

After domain is set up, update your backend:
```javascript
// app.js
app.use(cors({
  origin: [
    "https://www.crackersbazaar.com",
    "https://crackersbazaar.com",
    process.env.NODE_ENV === "development" ? "http://localhost:5173" : ""
  ].filter(Boolean),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
```

---

## 8. Email Domain (Professional Emails)

### Option A: Free with Cloudflare Email Routing
```
Cloudflare → Email → Email Routing
Forward: orders@crackersbazaar.com → your gmail
Forward: support@crackersbazaar.com → your gmail

You receive professional emails in your Gmail inbox.
```

### Option B: Google Workspace (Paid, ₹150/user/month)
```
Get: admin@crackersbazaar.com
Send emails FROM your domain
Better for business
```

---

## 9. DNS Propagation Check

```bash
# Check if DNS has propagated:
nslookup crackersbazaar.com
dig crackersbazaar.com

# Online tools:
# https://dnschecker.org
# https://whatsmydns.net
```

---

## 10. Post-Domain Checklist

```
✅ Domain purchased and active
✅ Cloudflare added with nameservers updated
✅ DNS records configured (A, CNAME, MX)
✅ SSL enabled (Full Strict mode)
✅ HTTPS redirect enabled
✅ Custom domain added in Vercel (frontend)
✅ Custom domain added in Render (backend API)
✅ CORS updated with production domain
✅ Frontend .env updated: VITE_API_URL=https://api.crackersbazaar.com/api
✅ Backend .env updated: CLIENT_URL=https://www.crackersbazaar.com
✅ Redeployed both frontend and backend
✅ Test full flow: Register → Browse → Cart → Checkout → Payment
✅ Google Search Console domain verified
✅ SSL padlock visible in browser 🔒
```

---

## 🎆 Your Site is LIVE!

```
Frontend:   https://www.crackersbazaar.com
Admin:      https://www.crackersbazaar.com/admin
API:        https://api.crackersbazaar.com/api
Database:   MongoDB Atlas (Cloud)
Images:     Cloudinary CDN
```

**Congratulations! Your Fireworks & Crackers store is live! 🎆🎇**
