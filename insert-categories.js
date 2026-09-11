// MongoDB Script: Insert Categories
// Usage: mongosh your-db-name < insert-categories.js

const slugify = (text) =>
  text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

const categories = [
  { name: "SOUND CRACKERS", description: "SOUND CRACKERS" },
  { name: "BIJILI CRACKERS", description: "BIJILI CRACKERS" },
  { name: "DELUXE ELECTRIC CRACKERS", description: "DELUXE ELECTRIC CRACKERS" },
  { name: "BOMBS", description: "BOMBS" },
  { name: "GROUND CHAKKAR", description: "GROUND CHAKKAR" },
  { name: "FLOWER POTS", description: "FLOWER POTS" },
  { name: "SPECIAL FLOWER POTS", description: "SPECIAL FLOWER POTS" },
  { name: "TWINKLING STAR", description: "TWINKLING STAR" },
  { name: "MINI COLOUR FOUNTAIN", description: "MINI COLOUR FOUNTAIN" },
  { name: "CRACKLING FOUNTAIN", description: "CRACKLING FOUNTAIN" },
  { name: "TRI COLOUR FOUNTAIN", description: "TRI COLOUR FOUNTAIN" },
  { name: "PEACOCK SERIES", description: "PEACOCK SERIES" },
  { name: "FANCY CRACKERS", description: "FANCY CRACKERS" },
  { name: "MINI SKY SHOT", description: "MINI SKY SHOT" },
  { name: "SKY SHOT", description: "SKY SHOT" },
  { name: "MULTI COLOUR SHOT", description: "MULTI COLOUR SHOT" },
  { name: "SPARKLERS", description: "SPARKLERS" },
  { name: "FESTIVAL GARLAND", description: "FESTIVAL GARLAND" },
  { name: "PAPER BOMB", description: "PAPER BOMB" },
  { name: "KIDS CRACKERS", description: "KIDS CRACKERS" },
  { name: "ROCKETS", description: "ROCKETS" },
  { name: "GIFT BOX", description: "GIFT BOX" },
  { name: "COMBO BOX", description: "COMBO BOX" },
].map((cat, index) => ({
  ...cat,
  slug: slugify(cat.name),
  isActive: true,
  sortOrder: index,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

// Clean up any stale documents with null or missing slug before inserting
db.categories.deleteMany({ $or: [{ slug: null }, { slug: { $exists: false } }] });

// Insert categories
const result = db.categories.insertMany(categories, { ordered: false });
console.log(`✓ Inserted ${Object.keys(result.insertedIds).length} categories`);

// Verify
const count = db.categories.countDocuments();
console.log(`✓ Total categories in database: ${count}`);

// List all
const allCats = db.categories.find({}, { name: 1 }).toArray();
console.log("\nCategories:");
allCats.forEach((c, i) => console.log(`  ${i+1}. ${c.name}`));
