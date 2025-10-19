# Units Schema Fix - RESOLVED

## 🐛 Problem
Getting 400 errors when fetching properties:
```
Error: column units_1.rent_amount does not exist
```

Step 2 not loading - blank screen with units dropdown empty.

---

## 🔍 Root Cause
The `units` table does NOT have a `rent_amount` column!

**Database Schema Reality**:
- `units` table: Contains only basic unit info (id, unit_number, bedrooms, bathrooms, square_feet, status)
- `leases` table: Contains rent_amount (linked to unit_id)

**What we were doing wrong**:
```javascript
// ❌ WRONG - trying to select rent_amount from units
.select(`
  *,
  units (
    id,
    unit_number,
    rent_amount,  // <-- This column doesn't exist!
    bedrooms,
    bathrooms,
    square_feet,
    status
  )
`)
```

---

## ✅ Solution

### 1. **Updated Query** (Lines 45-72)
Now fetches units AND leases, then enriches units with rent from active leases:

```javascript
// ✅ CORRECT - fetch both units and leases
const { data: propsData, error } = await supabase
  .from('properties')
  .select(`
    *,
    units (
      id,
      unit_number,
      bedrooms,
      bathrooms,
      square_feet,
      status
    ),
    leases (
      id,
      unit_id,
      rent_amount,
      status
    )
  `)
  .order('created_at', { ascending: false });

// Enrich units with rent_amount from active leases
const enrichedProperties = propsData?.map(prop => ({
  ...prop,
  units: prop.units?.map(unit => {
    const activeLease = prop.leases?.find(
      lease => lease.unit_id === unit.id && lease.status === 'active'
    );
    return {
      ...unit,
      rent_amount: activeLease?.rent_amount || null
    };
  }) || []
})) || [];

setProperties(enrichedProperties);
```

### 2. **Updated Unit Dropdown** (Line 1012)
Handle units that don't have active leases (no rent_amount):

```javascript
<option key={unit.id} value={unit.id}>
  Unit {unit.unit_number}
  {unit.rent_amount && ` - $${unit.rent_amount}/month`}  // Only show if exists
  {unit.bedrooms && ` • ${unit.bedrooms} bed`}
  {unit.bathrooms && ` • ${unit.bathrooms} bath`}
  {unit.square_feet && ` • ${unit.square_feet} sqft`}
  {unit.status && unit.status !== 'available' && ` (${unit.status})`}
</option>
```

### 3. **Removed Fallback Code**
Deleted the complex fallback logic that was trying to fetch units separately - no longer needed!

---

## 📊 What Happens Now

### For Units WITH Active Leases:
- Shows: `Unit 101 - $1500/month • 2 bed • 1 bath • 850 sqft`
- Has rent_amount from active lease

### For Units WITHOUT Active Leases (New/Vacant):
- Shows: `Unit 102 • 1 bed • 1 bath • 650 sqft`
- No rent_amount (will be set when creating the lease)

---

## ✅ Testing Checklist

1. **Step 0**: Select property ✓
2. **Step 1**: See property confirmation ✓
3. **Step 2**: 
   - Unit dropdown loads ✓
   - Shows all units with available info ✓
   - No 400 errors ✓
   - Can select a unit ✓
   - Lease term dropdown works ✓
   - Fixed/Month-to-Month cards work ✓

---

## 📝 Key Learnings

1. **Database Schema Discovery**: Always check actual table structure before querying
2. **PropertiesPageRedesigned Pattern**: Had the correct pattern all along - copied it
3. **Graceful Handling**: Unit dropdown now handles missing rent_amount gracefully
4. **Data Enrichment**: Proper pattern for joining data from multiple tables

---

## 🎯 Next Steps

Now that units are loading correctly:
1. ✅ Step 2 functional - can select unit and lease type
2. Continue to Step 3 (Lease Dates)
3. All remaining steps should work
4. Apply professional styling to Steps 4-8
