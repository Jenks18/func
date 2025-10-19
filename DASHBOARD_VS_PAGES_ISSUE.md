# Dashboard Shows Data But Individual Pages Don't - ROOT CAUSE

## Problem Summary
The **Dashboard** is correctly querying the database and showing real data, but when you click to navigate to:
- **Income Page** → Shows empty (no transactions displayed)
- **Maintenance Page** → Shows empty (no maintenance requests displayed)  
- **Occupancy/Properties Page** → Shows empty (no properties/units displayed)

## Root Cause Analysis

### Dashboard (DashboardPageWithDB_Fixed.jsx)
✅ **WORKS CORRECTLY** - Queries database with Supabase:
```javascript
// Fetches from transactions table
const { data: transactions } = await supabase
  .from('transactions')
  .select('*')
  .eq('organization_id', organizationId);

// Fetches from maintenance_requests table
const { data } = await supabase
  .from('maintenance_requests')
  .select('status')
  .eq('organization_id', organizationId);
```

### Income Page (IncomePageNew.jsx)
❌ **HARDCODED EMPTY DATA** - Line 90:
```javascript
// Empty income data for clean multi-tenant install
const incomeData = {};
```

**Problem:** The page has commented-out database fetch logic (lines 36-82) and just returns an empty object. It was intentionally set up as a blank slate for new installations.

### Maintenance Page (MaintenancePageUpdated.jsx)
❌ **UNKNOWN** - Need to check if it's using:
- Mock data service (`dataService`)
- Hardcoded empty data
- Needs database integration

### Properties/Occupancy Page
❌ **UNKNOWN** - Need to check data source

## Solution Required

Need to update all three pages to:

1. **Import Supabase client**
2. **Import Clerk useUser hook**  
3. **Fetch organization_id from users table**
4. **Query actual database tables:**
   - Income → `transactions` table
   - Maintenance → `maintenance_requests` table
   - Properties → `properties` + `units` + `leases` tables
5. **Transform data into the format expected by the UI**
6. **Handle loading states**
7. **Handle empty states**

## Files That Need Fixing

### 1. IncomePageNew.jsx
- Current: `const incomeData = {};` (line 90)
- Needs: Fetch from `transactions` table grouped by property/lease
- Transform to invoice format with payments

### 2. MaintenancePageUpdated.jsx  
- Current: Unknown (need to check)
- Needs: Fetch from `maintenance_requests` table
- Filter by organization_id and status

### 3. PropertiesPageRedesigned.jsx
- Current: Unknown (need to check)
- Needs: Fetch from `properties`, `units`, `leases` tables
- Calculate occupancy percentages

## Next Steps

1. Check MaintenancePage and PropertiesPage implementations
2. Create database-integrated versions of all three pages
3. Update App.jsx to use the new versions
4. Test navigation from dashboard to ensure data appears
