# Products & Categories Setup Guide - COMPLETE

## 📊 Overview

This guide explains how to insert all Aditi Crackers products and categories into MongoDB.

**Data Source**: `Aditi_Crackers_Price_List_2026.xlsx`

**Total Data**:
- ✅ **23 Categories** (all extracted from Excel headers)
- ✅ **133 Products** with English names only (Tamil ignored)
- ✅ **Default Stock**: 10,000 units for all products
- ✅ **Pricing**: Actual price + Quoted/Discount price

---

## 1. Database Setup: Insert Categories & Products

### Step 1: Insert Categories First

```bash
mongosh your-database-name < insert-categories.js
```

**Expected Output**:
```
✓ Inserted 23 categories
✓ Total categories in database: 23

Categories:
  1. SOUND CRACKERS
  2. BIJILI CRACKERS
  3. DELUXE ELECTRIC CRACKERS
  4. BOMBS
  5. GROUND CHAKKAR
  6. FLOWER POTS
  7. SPECIAL FLOWER POTS
  8. TWINKLING STAR
  9. MINI COLOUR FOUNTAIN
  10. CRACKLING FOUNTAIN
  11. TRI COLOUR FOUNTAIN
  12. PEACOCK SERIES
  13. FANCY CRACKERS
  14. MINI SKY SHOT
  15. SKY SHOT
  16. MULTI COLOUR SHOT
  17. SPARKLERS
  18. FESTIVAL GARLAND
  19. PAPER BOMB
  20. KIDS CRACKERS
  21. ROCKETS
  22. GIFT BOX
  23. COMBO BOX
```

### Step 2: Insert Products

```bash
mongosh your-database-name < insert-products.js
```

**Expected Output**:
```
✓ Inserted 133 products
✓ Total products in database: 133

Products by Category:
  SOUND CRACKERS: 7 products
  BIJILI CRACKERS: 3 products
  DELUXE ELECTRIC CRACKERS: 3 products
  BOMBS: 5 products
  GROUND CHAKKAR: 6 products
  FLOWER POTS: 6 products
  SPECIAL FLOWER POTS: 1 product
  TWINKLING STAR: 2 products
  MINI COLOUR FOUNTAIN: 7 products
  CRACKLING FOUNTAIN: 3 products
  TRI COLOUR FOUNTAIN: 2 products
  PEACOCK SERIES: 3 products
  FANCY CRACKERS: 7 products
  MINI SKY SHOT: 3 products
  SKY SHOT: 12 products
  MULTI COLOUR SHOT: 15 products
  SPARKLERS: 17 products
  FESTIVAL GARLAND: 9 products
  PAPER BOMB: 3 products
  KIDS CRACKERS: 6 products
  ROCKETS: 5 products
  GIFT BOX: 5 products
  COMBO BOX: 3 products
```

---

## 2. All 23 Categories

| # | Category | Product Count |
|---|----------|---------------|
| 1 | SOUND CRACKERS | 7 |
| 2 | BIJILI CRACKERS | 3 |
| 3 | DELUXE ELECTRIC CRACKERS | 3 |
| 4 | BOMBS | 5 |
| 5 | GROUND CHAKKAR | 6 |
| 6 | FLOWER POTS | 6 |
| 7 | SPECIAL FLOWER POTS | 1 |
| 8 | TWINKLING STAR | 2 |
| 9 | MINI COLOUR FOUNTAIN | 7 |
| 10 | CRACKLING FOUNTAIN | 3 |
| 11 | TRI COLOUR FOUNTAIN | 2 |
| 12 | PEACOCK SERIES | 3 |
| 13 | FANCY CRACKERS | 7 |
| 14 | MINI SKY SHOT | 3 |
| 15 | SKY SHOT | 12 |
| 16 | MULTI COLOUR SHOT | 15 |
| 17 | SPARKLERS | 17 |
| 18 | FESTIVAL GARLAND | 9 |
| 19 | PAPER BOMB | 3 |
| 20 | KIDS CRACKERS | 6 |
| 21 | ROCKETS | 5 |
| 22 | GIFT BOX | 5 |
| 23 | COMBO BOX | 3 |
| **TOTAL** | | **133** |

---

## 3. Product Structure

Each product in the database has:

```javascript
{
  _id: ObjectId,
  name: "2½\" Kuruvi Crackers",      // English name only
  price: 40,                          // Actual price (₹)
  discountPrice: 8,                   // Quoted/discount price (₹)
  category: ObjectId,                 // Reference to category
  stock: 10000,                       // Default quantity
  sold: 0,                            // Initially 0
  images: [],                         // Empty (can be added later)
  description: "",                    // Empty (can be added later)
  specifications: [],                 // Empty (can be added later)
  rating: 0,                          // Initially 0
  numReviews: 0,                      // Initially 0
  reviews: [],                        // Empty array
  isFeatured: false,                  // NOT featured by default
  isActive: true,                     // Active by default
  createdAt: ISODate(...)             // Timestamp
}
```

---

## 4. Key Features

✅ **English Names Only**: Tamil text automatically filtered out  
✅ **Accurate Pricing**: Actual price vs. Quoted/Discount price from Excel  
✅ **Default Stock**: 10,000 units for all products  
✅ **Not Featured**: `isFeatured: false` (can be updated later)  
✅ **Category Links**: Products properly linked to categories via ObjectId  
✅ **All Active**: `isActive: true` (ready to sell)  
✅ **23 Distinct Categories**: All properly organized  

---

## 5. Sample Products by Category

**SOUND CRACKERS** (7 products):
- 2½" Kuruvi Crackers - ₹40
- 3½" Lakshmi Crackers - ₹90
- 4" Lakshmi Crackers - ₹140

**SPARKLERS** (17 products):
- Largest category with 17 different sparkler types

**SKY SHOT** (12 products):
- Second largest with 12 sky shot variants

**MULTI COLOUR SHOT** (15 products):
- Multi-color shot series with 15 products

**FESTIVAL GARLAND** (9 products):
- Festival-specific products

**GIFT BOX & COMBO BOX** (8 products total):
- Pre-packaged gift sets and combo boxes

---

## 6. Verification

### Count total products
```javascript
db.products.countDocuments()
// Returns: 133
```

### Count total categories
```javascript
db.categories.countDocuments()
// Returns: 23
```

### See products by category
```javascript
db.products.aggregate([
  { $group: { _id: "$category", count: { $sum: 1 } } },
  { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "cat" } },
  { $unwind: "$cat" },
  { $sort: { "cat.name": 1 } }
])
```

### Get all categories
```javascript
db.categories.find({}, { name: 1 }).sort({ name: 1 }).pretty()
```

### Find products in a specific category
```javascript
const category = db.categories.findOne({ name: "SPARKLERS" });
db.products.find({ category: category._id })
```

---

## 7. Pricing Information

### Price Structure

Each product has TWO prices:
1. **price**: Actual selling price (in Rupees)
2. **discountPrice**: Quoted/discount price

**Example**:
- Product: "2½\" Kuruvi Crackers"
- Actual Price (price): ₹40
- Quoted Price (discountPrice): ₹8

### Price Statistics
- **Total Products**: 133
- **Average Price**: ~₹300-400
- **Price Range**: ₹8 - ₹1,215

---

## 8. Manual Edits (if needed)

### Set a product as featured
```javascript
db.products.updateOne(
  { name: "Sparkler Mix" },
  { $set: { isFeatured: true } }
)
```

### Set products as best sellers
```javascript
db.products.updateMany(
  { category: ObjectId("...") },
  { $set: { sold: 100 } }
)
```

### Add images to products
```javascript
db.products.updateOne(
  { _id: ObjectId("...") },
  { $set: { images: [ { url: "https://...", alt: "Product image" } ] } }
)
```

### Update stock for a category
```javascript
db.products.updateMany(
  { category: ObjectId("...") },
  { $set: { stock: 5000 } }
)
```

---

## 9. Quick Start Checklist

- [ ] Run: `mongosh your-db-name < insert-categories.js`
- [ ] Verify: `db.categories.countDocuments()` → 23
- [ ] Run: `mongosh your-db-name < insert-products.js`
- [ ] Verify: `db.products.countDocuments()` → 133
- [ ] Test: View products in frontend
- [ ] Done! 🎉

---

## 10. Summary

| Item | Value |
|------|-------|
| Categories | 23 |
| Products | 133 |
| Default Stock | 10,000 per product |
| Featured | 0 (all false) |
| Best Sellers | 0 (not set) |
| Pricing | Actual + Discount |
| Language | English only |
| Status | All active |

---

**Ready to deploy!** All 133 products across 23 categories with accurate pricing are now in your database. 🚀
