# Dashboard 400 Errors - Root Cause & Fix

## Problem Identified

The 400 errors are caused by **querying columns that don't exist** in the actual database schema:

### Schema Reality (SETUP_SUPABASE_SIMPLE.sql)
```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY,
  organization_id TEXT,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  status TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
  -- NO metadata column!
);

CREATE TABLE leases (
  id UUID PRIMARY KEY,
  organization_id TEXT,
  property_id UUID,
  unit_id UUID,
  tenant_id UUID,
  lease_start_date DATE,
  lease_end_date DATE,
  rent_amount DECIMAL,
  deposit_amount DECIMAL,
  payment_due_day INTEGER,
  status TEXT,
  lease_terms TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
  -- NO metadata column!
);
```

### What We Were Querying (WRONG)
```javascript
// ❌ This fails with 400 error
.select('id, status, metadata, property_id')  // metadata doesn't exist!

// ❌ This fails with 400 error  
.select('id, first_name, last_name, email, metadata')  // metadata doesn't exist!
```

## Solution

Remove all `metadata` column references and use actual columns:

```javascript
// ✅ Correct query for leases
.select('id, status, lease_terms, property_id, unit_id, tenant_id')

// ✅ Correct query for tenants
.select('id, first_name, last_name, email, status')
```

## Other Issues Fixed

1. **Page Reload**: Added sessionStorage caching for selected month
2. **Maintenance Query**: Already correct (maintenance_requests table has status column)
3. **Occupancy Calculation**: Fixed circle rendering with proper stroke-dashoffset
4. **Error Logging**: Added detailed JSON error logging to debug issues

## Next Steps

Implement a working dashboard version that:
- Only queries existing columns
- Handles missing data gracefully
- Uses lease_terms (JSONB) for additional lease data
- Properly calculates unsigned leases without metadata
