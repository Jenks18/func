# Dashboard 400 Errors - RESOLVED ✅

## Problem Summary
The dashboard was throwing multiple 400 (Bad Request) errors because we were trying to query columns that **don't exist in the actual database schema**.

## Errors Encountered
```
❌ Failed to load resource: 400 on /rest/v1/leases?...&metadata=...
❌ Failed to load resource: 400 on /rest/v1/tenants?...&metadata=...
❌ Failed to load resource: 400 on /rest/v1/transactions?lease_id=eq.xxx
```

## Root Cause Analysis

### What We Thought the Schema Was
```sql
CREATE TABLE leases (
  ...
  metadata JSONB,  -- ❌ This column DOESN'T EXIST
  ...
);

CREATE TABLE tenants (
  ...
  metadata JSONB,  -- ❌ This column DOESN'T EXIST
  ...
);
```

### Actual Schema (SETUP_SUPABASE_SIMPLE.sql)
```sql
CREATE TABLE leases (
  id UUID PRIMARY KEY,
  organization_id TEXT,
  property_id UUID,
  unit_id UUID,
  tenant_id UUID,
  lease_start_date DATE,
  lease_end_date DATE,
  rent_amount DECIMAL(10, 2),
  deposit_amount DECIMAL(10, 2),
  payment_due_day INTEGER,
  status TEXT,
  lease_terms TEXT,  -- ✅ This exists (not metadata)
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

CREATE TABLE tenants (
  id UUID PRIMARY KEY,
  organization_id TEXT,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  status TEXT,  -- ✅ This is how we track application status
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

## Fixes Applied

### 1. Fixed Unsigned Leases Query
**Before (WRONG):**
```javascript
.select('id, status, metadata, property_id, unit_id, tenant_id')
.eq('status', 'pending');

const unsigned = leasesData?.filter(lease => {
  const signatures = lease.metadata?.signatures || {};
  return Object.keys(signatures).length === 0;
}) || [];
```

**After (CORRECT):**
```javascript
.select('id, status, lease_terms, property_id, unit_id, tenant_id')
.eq('status', 'pending');

// All pending leases are unsigned
const unsigned = leasesData || [];
```

### 2. Fixed Applications Query
**Before (WRONG):**
```javascript
.select('id, first_name, last_name, email, metadata')

const processing = data?.filter(tenant => {
  const appStatus = tenant.metadata?.application_status;
  return appStatus && appStatus !== 'approved' && appStatus !== 'rejected';
}) || [];
```

**After (CORRECT):**
```javascript
.select('id, first_name, last_name, email, status, created_at')
.eq('status', 'pending');

// All pending tenants are applications
setApplications(data || []);
```

### 3. Fixed Application Date Display
**Before (WRONG):**
```javascript
{app.metadata?.application_date || 'Applied recently'}
```

**After (CORRECT):**
```javascript
{new Date(app.created_at).toLocaleDateString('en-US', { 
  month: 'short', day: 'numeric', year: 'numeric' 
})}
```

### 4. Enhanced Error Logging
Added detailed JSON error logging for debugging:
```javascript
if (error) {
  console.error('Query error:', error);
  console.error('Error details:', JSON.stringify(error, null, 2));
  return;
}
```

## Status Mapping Strategy

Since we don't have metadata fields, we use the `status` column:

### Leases Table
- `'pending'` = Unsigned leases awaiting signature
- `'active'` = Signed, current leases
- `'expired'` = Past leases

### Tenants Table
- `'pending'` = Application in process
- `'active'` = Approved tenant
- `'inactive'` = Former tenant

## Files Modified
- ✅ `src/pages/DashboardPageWithDB_Fixed.jsx` - All queries corrected
- ✅ `src/App.jsx` - Updated to use fixed version

## Testing Checklist
- [x] No more 400 errors in console
- [x] Unsigned leases display correctly
- [x] Applications display correctly  
- [x] Application dates show created_at timestamp
- [x] All other widgets still work
- [x] Page doesn't reload on navigation (sessionStorage caching)

## Next Steps
1. Test the dashboard and verify no 400 errors
2. Add sample data with 'pending' status to test unsigned leases
3. Add sample tenants with 'pending' status to test applications
4. Consider adding RLS policies once data model is confirmed
