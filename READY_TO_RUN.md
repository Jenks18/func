# 🚀 READY TO RUN - SQL FILE UPDATED!

## ✅ Your Clerk User ID is Now in the SQL File

**Your Clerk User ID:** `user_33vib6sN3jWakVJvXaFHBDmGHPg`

**File Updated:** `supabase/migrations/004_sample_data.sql`

All 3 occurrences of `YOUR_ACTUAL_CLERK_USER_ID` have been replaced!

---

## Run in Supabase (2 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New query"**

### Step 2: Copy the SQL File
Open the file and copy everything:
```
supabase/migrations/004_sample_data.sql
```

Or run this in terminal to copy to clipboard:
```bash
cat supabase/migrations/004_sample_data.sql | pbcopy
```

### Step 3: Paste and Run
1. Paste into the SQL Editor
2. Click **"Run"** button (or press Cmd+Enter)
3. Wait for completion (~2-3 seconds)

### Step 4: Verify Success
You should see at the bottom:
```
Sample data migration complete!
```

---

## Verify Your Data

Run these queries in Supabase SQL Editor:

**Check Organizations:**
```sql
SELECT * FROM organizations;
```
Expected: 1 organization (Sample Property Management Co)

**Check Users:**
```sql
SELECT * FROM users;
```
Expected: 1 user linked to your Clerk ID

**Check Properties:**
```sql
SELECT * FROM properties;
```
Expected: 4 properties
- Main Street Lofts
- Jefferson Ave Apartments
- Jefferson House
- Shiloh House

**Check Units:**
```sql
SELECT * FROM units;
```
Expected: 15 units across all properties

**Check Leases:**
```sql
SELECT * FROM leases;
```
Expected: 6 active leases

**Check Maintenance Requests:**
```sql
SELECT * FROM maintenance_requests;
```
Expected: 4 maintenance requests

**Check Transactions:**
```sql
SELECT * FROM transactions;
```
Expected: 5 transactions (3 income, 2 expenses)

---

## Test Your App

After running the SQL, navigate to:

### 1. Properties Page
**URL:** http://localhost:5174/properties

**Expected:**
- ✅ No 400 errors
- ✅ 4 properties displayed
- ✅ Unit counts showing
- ✅ Summary cards with real data

### 2. Maintenance Page
**URL:** http://localhost:5174/maintenance

**Expected:**
- ✅ 4 maintenance requests
- ✅ Different statuses (open, in_progress)
- ✅ Linked to properties

### 3. Leases Page
**URL:** http://localhost:5174/leases

**Expected:**
- ✅ 6 leases displayed
- ✅ Linked to tenants and units
- ✅ Rent amounts showing

### 4. Income Page
**URL:** http://localhost:5174/income

**Expected:**
- ✅ Transactions showing
- ✅ Grouped by property
- ✅ Income and expenses

---

## If Something Goes Wrong

### Error: "duplicate key value violates unique constraint"
**Solution:** Data already exists. Run this to clear and retry:
```sql
DELETE FROM transactions;
DELETE FROM maintenance_requests;
DELETE FROM leases;
DELETE FROM tenants;
DELETE FROM units;
DELETE FROM properties;
DELETE FROM users WHERE clerk_id = 'user_33vib6sN3jWakVJvXaFHBDmGHPg';
DELETE FROM organizations WHERE created_by = 'user_33vib6sN3jWakVJvXaFHBDmGHPg';
```
Then run the sample data script again.

### Error: Column doesn't exist
**Solution:** Run the schema fix migration first:
```sql
-- Copy and run: supabase/005_add_missing_lease_columns.sql
```
Then run the sample data script.

### No errors but no data showing
**Check:**
1. Are you signed in with the same Clerk account?
2. Check organization_id matches in the database
3. Run the verification queries above

---

## Success Checklist

Once you've run the SQL and tested:

- [ ] SQL ran without errors
- [ ] Properties page shows 4 properties
- [ ] No console errors
- [ ] Maintenance requests visible
- [ ] Leases display correctly
- [ ] Income transactions showing

---

## Next: Push Updated SQL to GitHub (Optional)

If you want to save your SQL with your Clerk ID:

```bash
git add supabase/migrations/004_sample_data.sql
git commit -m "Update sample data with Clerk user ID"
git push origin main
```

**Note:** This will put your Clerk user ID in GitHub. If this is a public repo, you might want to keep it local only.

---

## Your Sample Data Summary

**What you're about to create:**
- 1 Organization (Sample Property Management Co)
- 1 User (linked to your Clerk account)
- 4 Properties across Ohio
- 15 Units (mix of occupied and available)
- 6 Tenants
- 6 Active Leases
- 4 Maintenance Requests (various priorities)
- 5 Transactions (rent payments and expenses)

**All linked to your Clerk User ID:** `user_33vib6sN3jWakVJvXaFHBDmGHPg`

---

## Ready to Run! 🎯

Copy the SQL file contents and paste into Supabase SQL Editor!

Let me know if you hit any errors! 🚀
