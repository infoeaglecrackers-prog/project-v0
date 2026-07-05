# FIGMA DESIGN SPEC — Fireworks & Crackers E-Commerce

This document is a pixel-accurate, step-by-step Figma design specification you can follow to create the full UI in Figma (desktop + mobile). It contains colors, typography, grid, components, screen-by-screen wireframes, interactions, and asset/export rules.

---

## 1. Project & File Setup
- Figma file name: Fireworks Store — UI Kit
- Pages: 1. Design System, 2. Components, 3. Desktop Screens, 4. Mobile Screens, 5. Prototype
- Frames: Desktop (1440×1024), Tablet (1024×768), Mobile (375×812)
- Layout Grid (Desktop): 12-column grid, 24px gutter, 72px left/right margin
- Layout Grid (Mobile): 4-column grid, 16px gutter, 16px margin

---

## 2. Design System (create first)
- Colors (Tokens):
  - Primary: #FF4500 (FireOrange)
  - Primary-600 (hover): #E03F00
  - Secondary: #FFD700 (Gold)
  - Dark: #1A1A2E
  - Text: #1F2937
  - Muted/Text-60: #6B7280
  - Background: #FFF8F0
  - Success: #22C55E
  - Error: #EF4444
  - Surface: #FFFFFF
  - Divider: #E5E7EB

- Typography (Styles):
  - H1: Poppins 40 / 52 / 700
  - H2: Poppins 32 / 40 / 600
  - H3: Poppins 24 / 32 / 600
  - Body: Poppins 16 / 24 / 400
  - Small: Poppins 14 / 20 / 400
  - Buttons: Poppins 16 / 20 / 600

- Spacing scale (use consistent tokens): 4, 8, 12, 16, 24, 32, 48, 64, 96
- Elevation / Shadows:
  - Shadow-1: 0 1px 3px rgba(16,24,40,0.06)
  - Shadow-2: 0 4px 14px rgba(16,24,40,0.08)

- Icons: Use feather / heroicons style. Keep stroke 1.5–2px.

---

## 3. Components — Specification & Variants
Create components in the Components page. Set auto-layout where applicable.

1) Navbar (Desktop)
- Height: 88px
- Left: Logo (48×48)
- Center: Search bar (max-width: 640px) — input with 48px height, icon left
- Right: Icons: Wishlist, Cart (with badge), Profile (avatar)
- Sticky behavior: top, elevation Shadow-1

2) Hero Banner
- Frame: full width (edge-to-edge), height: 420px
- Left content column (max 540px): H1, Subtext, Primary CTA (Buy Now), Secondary CTA (Shop Collection)
- Right: hero image with product collage

3) Category Grid (component)
- 4 columns row on desktop, each card 160×160
- Icon + label

4) Product Card
- Card size: 280×360
- Image area: 280×220 (object-fit: cover)
- Badge (top-left): Discount/Featured
- Heart icon (top-right) for wishlist
- Body: Product name (H3), star rating, price line (original struck-through + current price + discount percent)
- Actions: Add to Cart (primary small) & Buy Now (ghost)

Variants: with/without discount, out of stock

5) Product Detail
- Left: Image gallery (main 520×520), thumbnail strip below
- Right: Title (H2), rating, price block, quantity selector, add to cart, wishlist
- Tabs: Description / Safety / Reviews

6) Cart Item
- Row with image (96×96), name, options (size/variant), qty selector, price, remove link

7) Checkout Steps
- Stepper at top with 4 steps: Cart → Address → Payment → Review
- Address card: radio for default, edit, delete
- Payment options: Razorpay card, UPI, COD

8) Buttons
- Primary: background Primary, white text, radius 8px, padding 12px 24px
- Secondary: ghost with border (Primary 1px) and text Primary
- Disabled: bg #F3F4F6, text #9CA3AF

9) Modals
- Max width 560px, padding 24px, close icon top-right

10) Admin Components (summary)
- Data table rows (checkbox, product, stock, price, actions)
- Card stats (Orders, Revenue, Users)

---

## 4. Desktop Screens (Create frames and replicate components)
Follow this order — each frame size 1440×1024.

1) Home Page
- Navbar
- Hero Banner
- Category Grid
- Featured products (carousel or grid with ProductCard)
- Offer banner
- Best sellers
- Footer with links and newsletter signup

2) Product Listing (/products)
- Left: FilterSidebar (sticky) — categories, price range slider, rating filter, tags
- Right: ProductGrid with cards, pagination bottom

3) Product Detail (/products/:id)
- Image gallery left, info right — tabs below
- Related products carousel bottom

4) Cart (/cart)
- List of CartItem rows
- Summary card on the right (totals, checkout CTA)

5) Checkout (/checkout)
- Stepper top
- Address selection / add new address form
- Payment options with Razorpay button (simulate dummy card UI in design)

6) Orders (/orders)
- Order list cards with statuses and View button

7) Admin Dashboard
- Top stats, recent orders table, low stock alerts

---

## 5. Mobile Screens (Create frames 375×812)
- Simplified navbar (hamburger + logo + cart icon)
- Hero stacked content (image above, CTA below)
- Product grid: 2 columns
- Floating cart CTA (sticky bottom)
- Checkout: single-column flow, large tap targets (44–48px)

---

## 6. Interactions & Prototyping
- Hover states for product card (elevate + show Add to Cart button)
- Click product opens product detail frame
- Add to cart: micro interaction — small flying image to cart icon (optional)
- Checkout flow: stepper transitions between frames with slide left
- Modal for login/signup (overlay 60% black, backdrop blur)

---

## 7. Assets & Export Rules
- Export product images as: 1x JPEG for Figma previews; for production export PNG/JPEG at 2x and 3x as needed.
- Icons: Export as SVG
- Favicons: 32×32 PNG + favicon.ico
- Naming convention: component/element names with BEM-like pattern: `ProductCard--featured`, `Navbar__Search`.

---

## 8. Accessibility & UX Notes
- Color contrast must be >= 4.5:1 for body text
- Buttons should have 44×44 minimum tap area on mobile
- Provide alt text placeholders for product images
- Use semantic naming in Figma layers for handoff (e.g., `btn/primary/large`)

---

## 9. Example Content (copy-ready)
- Logo text: Eagle Crackers
- Hero H1: "Celebrate with Brightest Crackers"
- Hero subtext: "Safe, certified crackers for every festival — delivered fast"
- CTA: "Shop Now"

Sample product:
- Name: Golden Sparkler Pack (20 pcs)
- Price: ₹349
- Original: ₹499 (30% off)
- Rating: 4.6 (234 reviews)
- Safety: "Keep at least 2 meters distance. Use on open ground."

---

## 10. Figma Plugins Recommended
- Content Reel (placehold realistic product names)
- Unsplash (product images)
- Iconify (icons)
- Autoflow (connect screens)
- Blush / Image Tracer (if custom illustrations)
- Figmotion (micro-interactions)

---

## 11. Handoff Notes for Developers
- Use Inspect panel to grab spacing, CSS, and export sizes.
- Provide tokens (colors, fonts) via Figma Styles so devs can map to Tailwind tokens.
- Export a CSS snippet or use the Figma Tokens plugin to produce JSON for theming.

---

If you want, I can now generate a page-by-page checklist with exact layer names and a minimal component library file you can paste into Figma frames step-by-step. Tell me whether you want: `Full page-layer names` or `Component-only library` next.
