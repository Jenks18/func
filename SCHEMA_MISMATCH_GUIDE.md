# Schema Mismatch - Action Required ⚠️

## Problem

Your actual database schema is **different** from the migration files. You're getting column errors:

1. ❌ `units_count` doesn't exist in `properties`
2. ❌ `square_footage` doesn't exist in `units`  
3. ❌ `rent_amount` doesn't exist in `units`
4. ❌ `deposit_amount` doesn't exist in `units`
5. ❌ `bedrooms` doesn't exist in `units`
6. ❌ `bathrooms` doesn't exist in `units`

## What This Means

Your `units` table has a **minimal schema** - probably just:
- `id`
- `property_id`
- `unit_number`
- `status`
- `created_at`
- `updated_at`

## Solution Options

### Option 1: Check Your Actual Schema (Recommended) ✅

1. **Open Supabase SQL Editor**
2. **Run this query**:
   ```sql
   SELECT column_name, data_type
   FROM information_schema.columns 
   WHERE table_name = 'units'
   ORDER BY ordinal_position;
   ```
3. **Copy the results** and share them with me
4. I'll create a sample data script that **exactly matches** your schema

Or use the file I created: `CHECK_YOUR_SCHEMA.sql`

---

### Option 2: Run Migration 003 First

It's possible migration `003_safe_additional_tables.sql` wasn't run yet. Try:

1. Open Supabase SQL Editor
2. Copy contents of `003_safe_additional_tables.sql`
3. Run it
4. Then run `004_sample_data.sql`

---

### Option 3: Use Minimal Sample Data (Quick Fix)

I've already updated `004_sample_data.sql` to use **only** the columns that likely exist:

```sql
INSERT INTO units (id, property_id, unit_number, status)
VALUES (...)
```

Try running the script now. If it still fails, we need Option 1.

---

## Updated Sample Data Script

**File**: `004_sample_data.sql`

**Changes Made**:
- ✅ Removed `units_count` from properties
- ✅ Removed `square_footage` from units
- ✅ Removed `rent_amount` from units
- ✅ Removed `deposit_amount` from units
- ✅ Removed `bedrooms` from units
- ✅ Removed `bathrooms` from units

**Now Using Only**:
```sql
-- Properties: id, organization_id, name, address, city, state, zip_code, property_type
-- Units: id, property_id, unit_number, status
-- Everything else: unchanged
```

---

## Try This Now

1. **Run the updated** `004_sample_data.sql` script
2. **If it works** ✅ - Great! You'll have basic sample data
3. **If it still fails** ❌ - Run `CHECK_YOUR_SCHEMA.sql` and share results

---

## Why This Happened

Possible reasons:
1. **Different migration ran** - Your database used a different schema version
2. **Manual changes** - Someone modified the database directly
3. **Migration 003 not run** - The full schema wasn't created yet
4. **Old schema** - Using an older version without those columns

---

## What You'll Get (With Minimal Schema)

After running the updated script:
- ✅ 4 properties with addresses
- ✅ 15 units with just unit numbers and status
- ✅ 6 tenants
- ✅ 6 leases
- ✅ 4 maintenance requests
- ✅ 5 transactions

**Note**: Without `rent_amount` in units, your app might not show rent calculations correctly. You may need to:
- Add those columns later
- Or store rent amounts in the `leases` table instead

---

## Next Steps

1. **Try running the updated script**
2. **If successful**: Test your app
3. **If it fails**: Check schema with `CHECK_YOUR_SCHEMA.sql`
4. **Share results**: I'll create a perfect match script

---

**Files Created**:
- ✅ `004_sample_data.sql` - Updated with minimal columns
- ✅ `CHECK_YOUR_SCHEMA.sql` - Schema inspection queries
- ✅ `SCHEMA_MISMATCH_GUIDE.md` - This file

Try it now! 🚀
