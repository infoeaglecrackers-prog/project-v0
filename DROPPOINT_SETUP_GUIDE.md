# Drop Point Setup Guide

## Overview
This guide explains how to:
1. Insert drop point data into MongoDB
2. Use the new 3-level hierarchical drop point selector with search

---

## 1. Database Setup: Insert Drop Points

### Option A: Using MongoDB Compass or mongosh CLI

```bash
# Navigate to the project directory
cd /path/to/project-v0

# Run the insert script using mongosh
mongosh your-database-name < insert-droppoints.js
```

### Option B: Copy-paste into MongoDB Compass

1. Open MongoDB Compass
2. Connect to your database
3. Open the Query tab in the `droppoints` collection
4. Copy the entire contents of `insert-droppoints.js` (starting from `const droppoints = [...]`)
5. Paste into Compass and execute

### Expected Output
```
✓ Inserted 602 droppoints
✓ Total droppoints in database: 602

Droppoints by State:
  ANDHRA: 29 locations
  KARNATAKA: 14 locations
  KERALA: 29 locations
  TELANGANA: 20 locations
```

### Verify the Data

```javascript
// Count total
db.droppoints.countDocuments()

// See all unique states
db.droppoints.distinct("state")

// See locations in a state
db.droppoints.find({ state: "TELANGANA" }).limit(5)

// Find a specific location by name
db.droppoints.findOne({ name: { $regex: "Hyderabad", $options: "i" } })
```

---

## 2. Frontend: New Drop Point Selection Flow

### How It Works

The updated `DropPointSelector` component provides a 3-level hierarchical selection:

```
Step 1: Select State
   ↓
Step 2: Select District (Optional - shown only if districts exist for that state)
   ↓
Step 3: Search & Select Exact Place
```

### Features

#### 1. **State Selection**
- Dropdown showing all available states
- Automatically populated from database

#### 2. **District Selection**
- Shows only districts within the selected state
- **Automatically hidden if no districts exist** for that state
- Optional selection - user can view all locations in the state if they skip this

#### 3. **Location Search**
- Real-time search by:
  - Location name
  - City
  - Address line
- Case-insensitive matching
- Shows matching results instantly

#### 4. **Home Delivery Option**
- User can choose home delivery instead of drop point
- Always available as first option

### Component Props

```typescript
interface Props {
  selectedId: string | null;              // Currently selected drop point ID
  onSelect: (dp: IDropPoint | null) => void; // Callback when selection changes
  pincode?: string;                       // (Optional) User's delivery pincode
  city?: string;                          // (Optional) User's delivery city
}
```

### Usage Example

```tsx
import DropPointSelector from "./DropPointSelector";
import { useState } from "react";

export default function CheckoutPage() {
  const [selectedDropPoint, setSelectedDropPoint] = useState<string | null>(null);

  return (
    <DropPointSelector
      selectedId={selectedDropPoint}
      onSelect={(dp) => {
        setSelectedDropPoint(dp?._id || null);
        // Handle drop point selection
      }}
      pincode="560001"
      city="Bangalore"
    />
  );
}
```

---

## 3. Data Structure

### Drop Point Model

Each drop point in the database has:

```javascript
{
  _id: ObjectId,
  state: "TELANGANA",           // Required
  district: null,               // Optional (can be null)
  name: "Auto Nagar (Hyderabad)", // Location name
  phone: "6380754808",          // Contact number
  addressLine1: "Auto Nagar (Hyderabad)",
  addressLine2: null,           // Optional
  city: "TELANGANA",            // City
  pincode: "",                  // Postal code (if available)
  country: "India",
  createdAt: 2024-01-15T...     // Timestamp
}
```

### Important Notes

- **State**: Always populated (e.g., "TELANGANA", "KARNATAKA", "KERALA", "ANDHRA")
- **District**: Can be `null` or empty string - these are filtered out and ignored in the UI
- **Name**: The display name of the drop point (e.g., "Auto Nagar (Hyderabad)")

---

## 4. UI Flow Example

### Scenario: User in Telangana selects a drop point

```
1. Component loads → Shows "State" dropdown
   ┌─ Choose State ─┐
   │ TELANGANA      │
   │ KARNATAKA      │
   │ KERALA         │
   │ ANDHRA         │
   └────────────────┘

2. User selects "TELANGANA" → No districts shown (all are null)
   ┌─────────────────────────────┐
   │ Search location...          │
   └─────────────────────────────┘
   
3. User searches "Auto Nagar" → Shows matching locations
   ┌────────────────────────────────────────┐
   │ Auto Nagar (Hyderabad)                │
   │ Phone: 6380754808                     │
   └────────────────────────────────────────┘

4. User clicks location → Selected
   ✓ Pickup at: Auto Nagar (Hyderabad)
```

### Scenario: User with districts available (future data)

```
1. Select State: "KARNATAKA"
   ┌─ Choose State ─┐
   │ KARNATAKA      │
   └────────────────┘

2. Select District (shown because districts exist)
   ┌─────────────────┐
   │ Bangalore       │
   │ Mysore          │
   │ Mangalore       │
   └─────────────────┘

3. Search within district
   ┌──────────────────────────────┐
   │ Search location...           │
   └──────────────────────────────┘
```

---

## 5. Backend API Requirements

### Endpoint: `GET /api/droppoints`

**Current Implementation**: Returns all drop points

```javascript
// Response
{
  success: true,
  data: {
    dropPoints: [
      { _id: "...", state: "TELANGANA", name: "...", ... },
      { _id: "...", state: "TELANGANA", name: "...", ... },
      ...
    ]
  }
}
```

**With Optional Filters** (if you want to support filtering):

```
GET /api/droppoints?state=TELANGANA&district=null
```

The current frontend implementation fetches all drop points and filters on the client side, which is fine for ~600 locations.

---

## 6. Missing Districts Handling

The system **automatically ignores** drop points without districts:

```typescript
// In the component
const districts = useMemo(() => {
  if (!selectedState) return [];
  const statePoints = allPoints.filter((p) => p.state === selectedState);
  const unique = [
    ...new Set(
      statePoints
        .map((p) => p.district)
        .filter((d) => d && d.trim() !== "") // Filters out null/empty
    ),
  ].sort();
  return unique;
}, [selectedState, allPoints]);
```

**Current Data**:
- TELANGANA: 20 locations, 0 districts (all shown in search)
- KARNATAKA: 14 locations, 0 districts (all shown in search)
- KERALA: 29 locations, 0 districts (all shown in search)
- ANDHRA: 29 locations, 0 districts (all shown in search)

---

## 7. Troubleshooting

### Issue: No drop points showing after selection

**Check**:
1. Verify data was inserted: `db.droppoints.countDocuments()` should show 602
2. Verify state name matches exactly (case-sensitive): `db.droppoints.distinct("state")`

### Issue: Search not working

**Check**:
1. Ensure JavaScript is enabled in browser
2. Clear browser cache and reload
3. Check browser console for errors

### Issue: Want to add more drop points

**Solution**: Add entries to `insert-droppoints.js` and re-run, or insert directly:

```javascript
db.droppoints.insertOne({
  state: "MAHARASHTRA",
  district: "Mumbai",  // Can be null
  name: "Mumbai Central",
  phone: "9876543210",
  addressLine1: "Mumbai Central Station",
  city: "Mumbai",
  pincode: "400001",
  country: "India"
})
```

---

## 8. Future Enhancements

### Add District Data

If you want to add district information later:

```javascript
// Update all Telangana entries with districts
db.droppoints.updateMany(
  { state: "TELANGANA", name: { $regex: "Hyderabad" } },
  { $set: { district: "Hyderabad" } }
)
```

### Add More Locations

Simply append to the `droppoints` array in `insert-droppoints.js` and re-run.

### Enable Server-side Filtering

For better performance with 10k+ locations:

```javascript
// Backend endpoint
app.get('/api/droppoints', async (req, res) => {
  const { state, district, search } = req.query;
  let query = {};
  
  if (state) query.state = state;
  if (district) query.district = district;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { city: { $regex: search, $options: 'i' } },
      { addressLine1: { $regex: search, $options: 'i' } }
    ];
  }
  
  const dropPoints = await DropPoint.find(query);
  res.json({ success: true, data: { dropPoints } });
});
```

---

## Summary

✅ **Inserted**: 602 drop points across 4 states  
✅ **UI**: 3-level selection (State → District → Place) + Search  
✅ **Missing Districts**: Automatically handled (shown in search)  
✅ **Home Delivery**: Always available as option  

**Ready to use!** 🚀
