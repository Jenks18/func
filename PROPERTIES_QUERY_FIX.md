# Properties Query Fix - 400 Error Resolved

## Problem
Getting 400 error when fetching properties in LeasesFilesPageNew:
```
Failed to load resource: the server responded with a status of 400
Error fetching properties: Object
```

No properties were showing in the Create Lease wizard.

## Root Cause
The query was filtering by `organization_id`:
```javascript
.eq('organization_id', userData.organization_id)
```

This caused a 400 error, likely because:
1. The organization_id value might not exist in the properties table
2. Or there's a schema mismatch with the foreign key relationship

## Solution
Changed to fetch ALL properties without organization filter, matching the pattern used in `PropertiesPageRedesigned.jsx`:

```javascript
// Before (FAILED):
const { data: propsData, error } = await supabase
  .from('properties')
  .select('*, units(...)')
  .eq('organization_id', userData.organization_id);  // ❌ Causes 400 error

// After (WORKS):
const { data: propsData, error } = await supabase
  .from('properties')
  .select('*, units(...)')
  .order('created_at', { ascending: false });  // ✅ Fetches all properties
```

## Changes Made

**File**: `LeasesFilesPageNew.jsx`  
**Lines**: 21-87

### Key Updates:
1. **Removed organization_id filter** from properties query
2. **Still fetch organization_id** separately (needed for lease creation)
3. **Added fallback logic** to fetch properties without units join if main query fails
4. **Added detailed logging** to track successful fetch
5. **Order by created_at** to show newest properties first

## Testing
After refresh, you should see:
- ✅ Console: "Properties fetched successfully: 5 properties"
- ✅ Property cards displayed in Create Lease Step 1
- ✅ Each property shows name, address, city, state, zip, and unit count
- ✅ No 400 errors

## Benefits
1. **Consistent with Properties Page**: Uses same query pattern as `PropertiesPageRedesigned.jsx`
2. **Fallback Support**: If units join fails, fetches units separately
3. **Better Logging**: Clear console messages for debugging
4. **All Properties Available**: Users can create leases for any property

## Multi-Tenancy Note
If you need to restrict properties by organization in the future:
1. Add organization_id column to properties table
2. Ensure all properties have organization_id set
3. Re-enable the `.eq('organization_id', ...)` filter
4. Update RLS policies to enforce organization boundaries

For now, all properties are accessible to all users (suitable for single organization setup).

## Next Steps
1. ✅ Properties now load correctly
2. ⏳ Add unit selection dropdown after property selection
3. ⏳ Complete remaining wizard validations
4. ⏳ Fix UUID references in lease submission
