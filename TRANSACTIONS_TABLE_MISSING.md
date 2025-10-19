# Critical Database Issue - Transactions Table Missing

## Problem
Your Supabase database is missing the `transactions` table, which is causing all the 400 errors:

```
Error: column transactions.lease_id does not exist
```

This is because `SETUP_SUPABASE_SIMPLE.sql` only created these tables:
- ✅ properties
- ✅ units
- ✅ tenants
- ✅ leases
- ✅ files
- ❌ **transactions** (MISSING!)

## Solution Options

### Option 1: Add Transactions Table (RECOMMENDED) ✅

Run the SQL migration I created:

1. **Open Supabase Dashboard** → SQL Editor
2. **Copy and paste** the entire contents of `ADD_TRANSACTIONS_TABLE.sql`
3. **Click "Run"**
4. **Verify** it shows "Transactions table created successfully!"

This will:
- Create the transactions table with all necessary columns
- Add indexes for performance
- Insert sample transaction data
- Enable full dashboard functionality

### Option 2: Use Dashboard Without Transactions (FALLBACK)

If you want to test without transactions, I can create a simplified dashboard that:
- Shows occupancy stats only
- Displays maintenance requests
- Lists unsigned leases
- Tracks applications
- **Does NOT show** collection stats, payments, or financial data

## What's in ADD_TRANSACTIONS_TABLE.sql

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  organization_id TEXT NOT NULL,
  property_id UUID REFERENCES properties(id),
  unit_id UUID REFERENCES units(id),
  tenant_id UUID REFERENCES tenants(id),
  lease_id UUID REFERENCES leases(id),  -- ✅ This is the missing column!
  type TEXT CHECK (type IN ('income', 'expense')),
  category TEXT,
  amount DECIMAL(10, 2),
  date DATE,
  description TEXT,
  payment_method TEXT,
  reference_number TEXT,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

## After Running the Migration

Once you run `ADD_TRANSACTIONS_TABLE.sql`:
1. Refresh your dashboard
2. All 400 errors should disappear
3. Collection stats will show real data
4. Payment tracking will work
5. Occupancy with overdue will calculate correctly

## Test the Fix

After adding the table, check the console for:
- ❌ Before: "column transactions.lease_id does not exist"
- ✅ After: No 400 errors, data loads successfully

## Need Help?

If you encounter any issues running the SQL:
1. Make sure you're in the correct project
2. Check that your organization_id matches ('00000000-0000-0000-0000-000000000001')
3. Verify leases exist before inserting transactions
4. Let me know if you get any foreign key constraint errors
