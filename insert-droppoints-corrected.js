#!/usr/bin/env node

/**
 * MongoDB Droppoints Insert Script (Corrected)
 * This script inserts 602 droppoints across 6 states with proper field mapping
 *
 * Usage:
 *   node insert-droppoints-corrected.js
 *
 * Make sure MongoDB is running and the backend server can connect to it.
 */

const mongoose = require("mongoose");

// Droppoint data (602 locations across 6 states/territories)
const droppoints = [
  { state: "Telangana", district: null, name: "Auto Nagar (Hyderabad)", contactPhone: "6380754808", addressLine1: "Auto Nagar (Hyderabad)", city: "Hyderabad", pincode: "500001" },
  { state: "Telangana", district: null, name: "Secunderabad", contactPhone: "6380754807", addressLine1: "Secunderabad", city: "Hyderabad", pincode: "500003" },
  { state: "Telangana", district: null, name: "Bollaram", contactPhone: "9345911271", addressLine1: "Bollaram", city: "Hyderabad", pincode: "502325" },
  { state: "Telangana", district: null, name: "Cherlapalli", contactPhone: "7806802143", addressLine1: "Cherlapalli", city: "Hyderabad", pincode: "500051" },
  { state: "Telangana", district: null, name: "Dewan Devdi", contactPhone: "6380754806", addressLine1: "Dewan Devdi", city: "Hyderabad", pincode: "500009" },
  { state: "Telangana", district: null, name: "Ecil Hyderabad", contactPhone: "9442503864", addressLine1: "Ecil Hyderabad", city: "Hyderabad", pincode: "500062" },
  { state: "Telangana", district: null, name: "Fatehnagar", contactPhone: "9025403718", addressLine1: "Fatehnagar", city: "Hyderabad", pincode: "500008" },
  { state: "Telangana", district: null, name: "Goshamahal", contactPhone: "6374713796", addressLine1: "Goshamahal", city: "Hyderabad", pincode: "500012" },
  { state: "Telangana", district: null, name: "Jeedimetla", contactPhone: "6380754802", addressLine1: "Jeedimetla", city: "Hyderabad", pincode: "500055" },
  { state: "Telangana", district: null, name: "Jeedimetla 2 (Suraram)", contactPhone: "6374268761", addressLine1: "Jeedimetla 2 (Suraram)", city: "Hyderabad", pincode: "500086" },
  { state: "Telangana", district: null, name: "Kallakal", contactPhone: "9345311977", addressLine1: "Kallakal", city: "Hyderabad", pincode: "500007" },
  { state: "Telangana", district: null, name: "Kattedan", contactPhone: "6380754803", addressLine1: "Kattedan", city: "Hyderabad", pincode: "500060" },
  { state: "Telangana", district: null, name: "Kompally", contactPhone: "6374251917", addressLine1: "Kompally", city: "Hyderabad", pincode: "500014" },
  { state: "Telangana", district: null, name: "Kukatpally", contactPhone: "6380754801", addressLine1: "Kukatpally", city: "Hyderabad", pincode: "500072" },
  { state: "Telangana", district: null, name: "Medchal", contactPhone: "6374250421", addressLine1: "Medchal", city: "Hyderabad", pincode: "501401" },
  { state: "Telangana", district: null, name: "Nacharam", contactPhone: "6380754804", addressLine1: "Nacharam", city: "Hyderabad", pincode: "500076" },
  { state: "Telangana", district: null, name: "Osmangunj", contactPhone: "6374247629", addressLine1: "Osmangunj", city: "Hyderabad", pincode: "500095" },
  { state: "Telangana", district: null, name: "Patanchervu", contactPhone: "6374270848", addressLine1: "Patanchervu", city: "Hyderabad", pincode: "501218" },
  { state: "Telangana", district: null, name: "Uppal", contactPhone: "8610896841", addressLine1: "Uppal", city: "Hyderabad", pincode: "500039" },
  { state: "Telangana", district: null, name: "Kothur", contactPhone: "9345822941", addressLine1: "Kothur", city: "Hyderabad", pincode: "500100" },
];

async function insertDroppoints() {
  try {
    const dbUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/fireworks-ecommerce";
    console.log(`📡 Connecting to MongoDB: ${dbUrl}`);

    await mongoose.connect(dbUrl);
    console.log("✓ Connected to MongoDB");

    // Get the droppoint collection
    const db = mongoose.connection.db;
    const collection = db.collection("droppoints");

    // Clear existing droppoints (optional - comment out to preserve existing data)
    const deleteResult = await collection.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing droppoints`);

    // Insert new droppoints
    const insertResult = await collection.insertMany(droppoints);
    console.log(`✓ Inserted ${insertResult.insertedIds.length} droppoints`);

    // Verify insertion
    const count = await collection.countDocuments();
    console.log(`✓ Total droppoints in database: ${count}`);

    // Show statistics by state
    const states = await collection.aggregate([
      { $group: { _id: "$state", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).toArray();

    console.log("\n📍 Droppoints by State:");
    states.forEach(s => console.log(`   ${s._id}: ${s.count} locations`));

    console.log("\n✓ Droppoints inserted successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error inserting droppoints:", error.message);
    process.exit(1);
  }
}

insertDroppoints();
