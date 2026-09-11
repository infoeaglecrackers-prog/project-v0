# Pick Up Point Setup Guide

## What Changed
✅ Renamed "Parcel Drop Point" to "Pick Up Point"  
✅ Removed home delivery option  
✅ Implemented nested dropdowns: State → District → Place  
✅ Added `district` field to DropPoint model  

## Database Population Steps

### Step 1: Convert Existing Data (if you already have data)
This converts your existing `insert-droppoints.js` to the correct format:

```bash
cd /path/to/project-v0
node convert-droppoints.js
```

This creates `droppoints-converted.json` with 602 locations properly formatted.

### Step 2: Insert into MongoDB

```bash
node insert-from-json.js
```

You should see output like:
```
✓ Connected to MongoDB
🗑️  Cleared 0 existing droppoints
✓ Inserted 602 droppoints
✓ Total droppoints in database: 602

📍 Droppoints by State:
   Andhra: 79 locations
   Karnataka: 54 locations
   [...]
```

## Troubleshooting

### "MongoDB connection failed"
Make sure MongoDB is running:
```bash
# macOS with Homebrew
brew services start mongodb-community

# Or manually
mongod
```

### "No states available" in the dropdown
This means either:
1. Droppoints haven't been inserted yet → Run the insert scripts above
2. API is not returning data → Check browser console for errors
3. Check that `isActive: true` for droppoints in database

### Test the API manually
```bash
curl http://localhost:5000/api/drop-points
```

Should return something like:
```json
{
  "success": true,
  "data": {
    "dropPoints": [
      {
        "_id": "...",
        "state": "Telangana",
        "district": null,
        "name": "Auto Nagar (Hyderabad)",
        ...
      }
    ]
  }
}
```

## Component Usage

### Frontend Component
The `DropPointSelector` component is used in the checkout flow:

```tsx
<DropPointSelector
  selectedId={selectedDropPoint?._id || null}
  onSelect={setSelectedDropPoint}
/>
```

It now shows:
1. **State Dropdown** - Required, filters locations by state
2. **District Dropdown** - Optional, appears only if districts exist for the state
3. **Pick Up Location Dropdown** - Required, shows all locations matching state/district
4. **Selection Summary** - Shows full address and phone number of selected location

### User Experience Flow
```
1. User selects State (e.g., "Telangana")
2. District dropdown appears if available (can skip)
3. Pick Up Location dropdown loads with available locations
4. User selects a location
5. Selection displays with full address and contact info
```

## Database Model

### DropPoint Schema
```typescript
{
  state: string;           // "Telangana", "Andhra", etc.
  district?: string;       // Optional district within state
  name: string;           // Location name (e.g., "Hyderabad Main")
  addressLine1: string;   // Street address
  addressLine2?: string;  // Additional address details
  city: string;          // City name
  pincode: string;       // 6-digit postal code
  contactPhone?: string; // Contact number
  workingHours?: string; // Operating hours
  isActive: boolean;     // Must be true to show in checkout
}
```

## API Endpoints

### Public API
```
GET /api/drop-points
```
Returns all active drop points, grouped by state and city.

Query params (optional):
- `pincode` - Filter by pincode
- `city` - Filter by city

### Admin API
```
GET /api/drop-points/all      # Get all including inactive
POST /api/drop-points         # Create new
PUT /api/drop-points/:id      # Update
DELETE /api/drop-points/:id   # Delete
```

## Notes
- Home delivery is completely removed; users must select a pick-up point
- All 602 locations are organized by State and District
- Districts can be null for some states; the optional district dropdown handles this
- The component uses simple HTML select dropdowns (no autocomplete/search) for better mobile UX
