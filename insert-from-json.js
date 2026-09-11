#!/usr/bin/env node

/**
 * Insert Droppoints from JSON
 * Reads droppoints-converted.json and inserts into MongoDB
 *
 * Usage:
 *   First: node convert-droppoints.js
 *   Then:  node insert-from-json.js
 */

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

async function insertDroppoints() {
  try {
    const jsonPath = path.join(__dirname, "droppoints-converted.json");

    if (!fs.existsSync(jsonPath)) {
      console.error("❌ droppoints-converted.json not found. Run convert-droppoints.js first.");
      process.exit(1);
    }

    const droppoints = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    console.log(`📋 Loaded ${droppoints.length} droppoints from JSON`);

    const dbUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/fireworks-ecommerce";
    console.log(`📡 Connecting to MongoDB: ${dbUrl}`);

    await mongoose.connect(dbUrl);
    console.log("✓ Connected to MongoDB");

    // Get the droppoint collection
    const db = mongoose.connection.db;
    const collection = db.collection("droppoints");

    // Clear existing droppoints
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

    // Show sample locations
    const samples = await collection.find().limit(3).toArray();
    console.log("\n📍 Sample locations:");
    samples.forEach(s => {
      console.log(`   • ${s.name} (${s.state}${s.district ? ` - ${s.district}` : ""})`);
    });

    console.log("\n✓ Droppoints inserted successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

insertDroppoints();
