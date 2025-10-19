# ✅ SUPABASE LEASES INTEGRATION - COMPLETE SETUP

## 🎯 Problem Solved

**Issue:** Application was trying to connect to `demo.supabase.co` (non-existent demo URL)

**Root Cause:** `.env` file had duplicate Supabase configuration with demo values overriding real values

**Solution:** 
1. ✅ Removed duplicate demo URLs from `.env`
2. ✅ Created complete SQL schema for all required tables
3. ✅ Restarted dev server to use correct configuration

---

## 📦 What Was Created

### 1. **SETUP_SUPABASE_LEASES.sql** (Complete Database Schema)
- Creates 5 tables: `properties`, `units`, `tenants`, `leases`, `files`
- Adds all necessary indexes for performance
- Enables Row Level Security (RLS) on all tables
- Creates RLS policies for organization-based data isolation
- Includes optional sample data for testing

### 2. **QUICK_SETUP_GUIDE.md** (Step-by-Step Instructions)
- How to run the SQL in Supabase
- How to get your Clerk organization ID
- Troubleshooting common issues
- Testing checklist

### 3. **Fixed .env File**
- Removed duplicate demo configuration
- Now correctly points to: `https://epyybtyguntyamvgpbuz.supabase.co`

---

## 🚀 Next Steps (DO THIS NOW!)

### Step 1: Run SQL in Supabase (5 minutes)

1. **Open Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/epyybtyguntyamvgpbuz
   ```

2. **Go to SQL Editor:**
   - Click "SQL Editor" in left sidebar
   - Click "+ New Query"

3. **Copy & Paste:**
   - Open `SETUP_SUPABASE_LEASES.sql`
   - Copy entire contents
   - Paste into SQL Editor

4. **Get Your Organization ID:**
   
   **Option A - From Your App (Easiest):**
   ```javascript
   // Open browser console on http://localhost:5174
   // Run:
   console.log(localStorage.getItem('clerk-db-jwt'));
   // Or in React app:
   import { useOrganization } from '@clerk/clerk-react';
   const { organization } = useOrganization();
   console.log(organization.id); // This is what you need!
   ```

   **Option B - From Clerk Dashboard:**
   - Go to https://dashboard.clerk.com
   - Select your app
   - Go to "Organizations" tab
   - Copy the organization ID

5. **Replace Placeholder:**
   - Find `'YOUR_ORG_ID_HERE'` in the SQL (appears 4 times)
   - Replace with your actual organization ID
   - Example: `'org_2X1Y3Z4A5B6C7D8E9F'`

6. **Run the SQL:**
   - Click "Run" or press Ctrl+Enter (Cmd+Enter on Mac)
   - Wait for success message

7. **Verify:**
   - Check "Table Editor" in Supabase
   - Should see: properties, units, tenants, leases, files

### Step 2: Test the Application (2 minutes)

1. **Open Your App:**
   ```
   http://localhost:5174
   ```

2. **Navigate to Leases Page:**
   - Click "Leases & Files" in sidebar

3. **Check Console:**
   - Open browser DevTools (F12)
   - Check console - should see:
     ```
     ✅ No more "ERR_NAME_NOT_RESOLVED" errors
     ✅ No more "demo.supabase.co" errors
     ```

4. **Expected Behavior:**
   - Loading indicator shows briefly
   - Either:
     - Leases table displays (if you ran sample data)
     - Empty state shows (if no leases exist)

### Step 3: Create a Test Lease (3 minutes)

1. **Click "+ New Lease" button**

2. **Fill Out Wizard:**
   - **Step 1:** Select a property (or create one first in Properties page)
   - **Step 2:** Choose "Fixed Term" or "Month-to-Month"
   - **Step 3:** Set start date (today or future)
   - **Step 4:** Enter security deposit (e.g., $2500)
   - **Step 5:** Enter rent ($1500) and payment details
   - **Step 6:** Add tenant info
   - **Step 7:** Configure sharing
   - **Step 8:** Review

3. **Click "Finalize"**

4. **Verify:**
   - Success alert appears
   - Wizard closes
   - New lease appears in table
   - Refresh page - lease still there (persisted in DB!)

---

## 🔍 What to Look For

### ✅ Success Indicators:
- No `ERR_NAME_NOT_RESOLVED` errors in console
- Supabase URL shows as `epyybtyguntyamvgpbuz.supabase.co`
- Leases page loads without errors
- Can view leases in split-screen panel
- Can create new leases that save to database

### ❌ Potential Issues:

**Issue:** "Multiple GoTrueClient instances detected"
- **Impact:** Just a warning, doesn't break functionality
- **Cause:** Supabase client instantiated multiple times
- **Fix:** Can be ignored for now

**Issue:** "Clerk has been loaded with development keys"
- **Impact:** Just a warning for development mode
- **Action:** Normal for development, ignore

**Issue:** "Permission denied" when fetching leases
- **Cause:** RLS policies not matching organization_id
- **Fix:** 
  1. Check your JWT includes `organization_id` in metadata
  2. Verify you replaced `YOUR_ORG_ID_HERE` in SQL
  3. Check Clerk organization is properly configured

**Issue:** Tables not found
- **Cause:** SQL script didn't run successfully
- **Fix:** Re-run the SQL script, check for errors in Supabase logs

---

## 📊 Database Structure

```
┌─────────────┐
│ properties  │
│ - id        │
│ - name      │
│ - address   │
└──────┬──────┘
       │
       │ references
       ↓
┌─────────────┐      ┌──────────────┐
│   units     │      │   tenants    │
│ - id        │      │ - id         │
│ - property  │      │ - first_name │
│ - unit_num  │      │ - last_name  │
└──────┬──────┘      └──────┬───────┘
       │                    │
       └────────┬───────────┘
                │ both reference
                ↓
         ┌─────────────┐
         │   leases    │ ← Main table
         │ - id        │
         │ - property  │
         │ - unit      │
         │ - tenant    │
         │ - dates     │
         │ - amounts   │
         └──────┬──────┘
                │
                │ references
                ↓
         ┌─────────────┐
         │    files    │
         │ - id        │
         │ - lease_id  │
         │ - file_url  │
         └─────────────┘
```

---

## 🎉 Success Criteria

After completing setup, you should have:

- [x] Dev server running on http://localhost:5174
- [ ] 5 tables created in Supabase
- [ ] RLS policies active and working
- [ ] Leases page loads without errors
- [ ] Can view existing leases (if any)
- [ ] Can create new leases via wizard
- [ ] Leases persist in database
- [ ] Split-screen detail panel works
- [ ] Data isolated by organization

---

## 📝 Files Reference

| File | Purpose | Location |
|------|---------|----------|
| `.env` | Fixed config | Root directory |
| `SETUP_SUPABASE_LEASES.sql` | Database schema | Root directory |
| `QUICK_SETUP_GUIDE.md` | Instructions | Root directory |
| `SUPABASE_LEASES_INTEGRATION.md` | Technical docs | Root directory |
| `src/services/supabaseLeaseService.js` | Database operations | src/services/ |
| `src/pages/LeasesFilesPageNew.jsx` | UI component | src/pages/ |

---

## 🆘 Need Help?

1. **Check Browser Console** - Most errors show up here
2. **Check Supabase Logs** - Dashboard → Logs
3. **Check Network Tab** - See actual API requests
4. **Verify Environment** - Run in console:
   ```javascript
   console.log({
     supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
     clerkKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
   });
   ```

---

**Current Status:** 
- ✅ Configuration fixed
- ✅ Dev server restarted (running on port 5174)
- ⏳ Waiting for you to run SQL in Supabase
- ⏳ Ready to test!

**Next Action:** Go to Supabase and run the SQL script! 🚀
