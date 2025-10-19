# How to Add Sample Data to Your Database

## Step 1: Find Your Organization ID

Run this query in Supabase SQL Editor to see if you have an organization:

```sql
SELECT id, name, created_by FROM organizations;
```

If you don't see any results, you need to create an organization first through your app's onboarding flow.

## Step 2: Run the Sample Data Migration

Go to your Supabase Dashboard:
1. Click on "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy the contents of `supabase/migrations/004_sample_data.sql`
4. Paste it into the editor
5. Click "Run" or press Cmd+Enter

**Important**: The migration uses sample IDs. It's safe to run multiple times because of `ON CONFLICT DO NOTHING`.

## Step 3: Verify Data Was Added

Run these queries to check:

```sql
-- Check properties
SELECT COUNT(*) as property_count FROM properties;

-- Check units
SELECT COUNT(*) as unit_count FROM units;

-- Check leases
SELECT COUNT(*) as lease_count FROM leases;

-- Check maintenance requests
SELECT COUNT(*) as maintenance_count FROM maintenance_requests;
```

## Alternative: Quick Test Data

If you just want to test quickly without running migrations, use this simpler approach:

### 1. Create ONE property directly in Supabase SQL Editor:

```sql
-- Insert a test property (replace YOUR_ORG_ID with your actual organization UUID)
INSERT INTO properties (organization_id, name, address, city, state, zip_code, property_type, units_count)
VALUES (
  'YOUR_ORG_ID'::uuid,  -- Replace with your actual org ID
  'Test Property',
  '123 Test St',
  'Test City',
  'OH',
  '12345',
  'apartment',
  4
);
```

### 2. Get the property ID that was just created:

```sql
SELECT id, name FROM properties ORDER BY created_at DESC LIMIT 1;
```

### 3. Add units to that property:

```sql
-- Replace PROPERTY_ID with the ID from step 2
INSERT INTO units (property_id, unit_number, bedrooms, bathrooms, rent_amount, status)
VALUES 
  ('PROPERTY_ID'::uuid, '101', 2, 1.0, 1200.00, 'occupied'),
  ('PROPERTY_ID'::uuid, '102', 2, 1.0, 1200.00, 'vacant'),
  ('PROPERTY_ID'::uuid, '201', 1, 1.0, 950.00, 'occupied'),
  ('PROPERTY_ID'::uuid, '202', 1, 1.0, 950.00, 'vacant');
```

## Troubleshooting

### Error: "violates foreign key constraint"
This means you need to create an organization first. The app should do this automatically when you first sign up.

### Error: "permission denied for table"
Make sure you're logged in and have proper RLS policies. Run this to check:

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('properties', 'units', 'leases');
```

### Properties page still shows mock data
1. Check browser console for detailed error messages
2. Make sure you're logged in with Clerk
3. Verify your user exists in the `users` table:
   ```sql
   SELECT id, clerk_id, email FROM users;
   ```

## Next Steps

Once you have data in the database:
1. Refresh your Properties page
2. You should see real data instead of the mock data
3. The summary cards will calculate from actual database records
4. Test sorting and filtering

## Need More Help?

If you're still seeing errors:
1. Copy the exact error message from the browser console
2. Check which table is causing the issue
3. Verify that table has data with the queries above
4. Make sure your Clerk user is properly synced to the `users` table
