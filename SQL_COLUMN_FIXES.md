# SQL Migration Fixes - Summary

## Issues Fixed

### 1. ✅ `units_count` Column Error
**Error**: `ERROR: 42703: column "units_count" of relation "properties" does not exist`

**Fix**: Removed `units_count` from all property INSERT statements
- The column doesn't exist in the actual database schema
- It was likely removed in an earlier migration

### 2. ✅ `square_footage` Column Error  
**Error**: `ERROR: 42703: column "square_footage" of relation "units" does not exist`

**Fix**: Removed `square_footage` from all unit INSERT statements
- The column doesn't exist in your current database
- It may have been dropped in a previous migration

---

## Updated Sample Data Script

**File**: `supabase/migrations/004_sample_data.sql`

### Properties Table - Columns Used:
```sql
INSERT INTO properties (
  id, 
  organization_id, 
  name, 
  address, 
  city, 
  state, 
  zip_code, 
  property_type
  -- ❌ units_count REMOVED
)
```

### Units Table - Columns Used:
```sql
INSERT INTO units (
  id, 
  property_id, 
  unit_number, 
  bedrooms, 
  bathrooms, 
  -- ❌ square_footage REMOVED
  rent_amount, 
  deposit_amount, 
  status
)
```

---

## What This Means

Your actual database schema is different from what's in the migration files. This can happen when:

1. **Schema was modified** - Columns were dropped in a previous migration
2. **Different migration was run** - A different version of the schema is in production
3. **Manual changes** - Someone altered the database directly

---

## How to Run the Fixed Script

1. **Open Supabase Dashboard** → SQL Editor
2. **Copy the entire** `004_sample_data.sql` file
3. **Replace** `'user_sample_clerk_id'` with your actual Clerk user ID
4. **Run** the script
5. **Refresh** your app

The script should now run without errors! ✅

---

## Sample Data Included

After running the script, you'll have:

- ✅ 1 organization
- ✅ 1 admin user
- ✅ 4 properties
- ✅ 15 units
- ✅ 6 tenants
- ✅ 6 active leases
- ✅ 4 maintenance requests
- ✅ 5 transactions

---

## Next Steps

1. **Run the fixed script** in Supabase
2. **Verify no errors** in the SQL Editor
3. **Refresh your app** - you should see:
   - 4 properties in Properties page
   - 15 units across those properties
   - 6 active leases in Leases page
   - 4 maintenance requests in Maintenance page
4. **Test all features** with real data

---

## If You Still Get Errors

If you get more column errors, we need to check your actual database schema:

```sql
-- Run this in Supabase SQL Editor to see actual columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'properties'
ORDER BY ordinal_position;

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'units'
ORDER BY ordinal_position;
```

Then we can adjust the sample data script to match your exact schema.

---

## Files Modified

1. ✅ `supabase/migrations/004_sample_data.sql`
   - Removed `units_count` from properties
   - Removed `square_footage` from units
   - All other data intact

---

**Status**: ✅ **FIXED - Ready to run!**

The sample data script should now work with your actual database schema.
