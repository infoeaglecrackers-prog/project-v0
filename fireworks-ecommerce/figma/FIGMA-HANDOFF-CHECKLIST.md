# FIGMA HANDOFF CHECKLIST

Quick checklist to finish the Figma file and hand it to developers.

1. Design System
   - [ ] Create Color Styles for all tokens
   - [ ] Create Text Styles for all typography tokens
   - [ ] Create Effect Styles for shadows
   - [ ] Create Grid Styles (Desktop/Mobile)

2. Components
   - [ ] Build reusable components with variants (Button, Input, ProductCard, Navbar)
   - [ ] Use Auto Layout for responsive behavior
   - [ ] Name components with folder-like naming (`btn/primary/large`)
   - [ ] Add descriptions to components with usage notes

3. Screens
   - [ ] Build all desktop frames using the 12-column grid
   - [ ] Build mobile frames (375×812) with correct spacing
   - [ ] Link prototype transitions for main flows (browse → product → cart → checkout)

4. Assets & Exports
   - [ ] Tag icons as SVG and export
   - [ ] Export hero and product images as 1x for Figma; prepare 2x/3x for dev
   - [ ] Generate favicon files

5. Plugins & Tokens
   - [ ] Install Figma Tokens plugin and export tokens JSON
   - [ ] Use Unsplash plugin for placeholder images
   - [ ] Use Content Reel for copy placeholders

6. Developer Handoff
   - [ ] Set file permissions: Editors (designers), Viewers (devs)
   - [ ] Create a `Handoff` page with important links and environment variables
   - [ ] Share prototype link with developers and include `FIGMA-DESIGN-SPEC.md`

---

Quick copy/paste commands for devs:

- Colors (Tailwind tokens) example:
```
--color-primary: #FF4500;
--color-secondary: #FFD700;
```

- Example export settings for images: `JPEG`, quality 80, export sizes: `1x` (for figma), `2x` and `3x` for production.

---

If you'd like, I can now generate a step-by-step script you can follow in Figma to build the `ProductCard` and `Navbar` components (with exact layer names and auto-layout settings). Which component should I create the step-by-step recipe for first? (ProductCard / Navbar / ProductDetail / Checkout)