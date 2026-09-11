#!/usr/bin/env node

/**
 * Converter: Transform old droppoints format to new schema format
 * Reads insert-droppoints.js and creates corrected data for MongoDB
 */

const fs = require("fs");
const path = require("path");

try {
  // Read the original script
  const scriptPath = path.join(__dirname, "insert-droppoints.js");
  const content = fs.readFileSync(scriptPath, "utf-8");

  // Extract the droppoints array
  const match = content.match(/const droppoints = \[([\s\S]*?)\];/);
  if (!match) {
    console.error("❌ Could not find droppoints array in insert-droppoints.js");
    process.exit(1);
  }

  // Parse the array entries
  const arrayContent = match[1];
  const entries = arrayContent
    .split(/},\s*{/)
    .map((entry, idx) => {
      if (idx === 0) entry = entry.substring(1); // Remove leading {
      if (idx === arrayContent.split(/},\s*{/).length - 1) entry = entry.slice(0, -1); // Remove trailing }
      return "{" + entry + "}";
    });

  // Transform each entry
  const transformedData = entries.map((entry, idx) => {
    try {
      // Parse the object string
      const obj = eval("(" + entry + ")");

      return {
        state: obj.state || "",
        district: obj.district || null,
        name: obj.name || "",
        addressLine1: obj.addressLine1 || obj.name || "",
        addressLine2: obj.landmark || undefined,
        city: obj.city || "",
        pincode: obj.pincode && obj.pincode.trim() ? obj.pincode : "000000",
        contactPhone: obj.phone || "",
        workingHours: "Mon–Sat, 9 AM – 6 PM",
        isActive: true,
      };
    } catch (e) {
      console.warn(`⚠️  Could not parse entry ${idx}: ${e.message}`);
      return null;
    }
  }).filter(Boolean);

  // Write to a new file
  const outputPath = path.join(__dirname, "droppoints-converted.json");
  fs.writeFileSync(outputPath, JSON.stringify(transformedData, null, 2));

  console.log(`✓ Converted ${transformedData.length} droppoints`);
  console.log(`✓ Saved to: ${outputPath}`);
  console.log("\nNow run: node insert-from-json.js");

} catch (error) {
  console.error("❌ Error:", error.message);
  process.exit(1);
}
