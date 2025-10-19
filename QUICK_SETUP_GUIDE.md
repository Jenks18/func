# 🚀 Quick Setup Guide - Supabase Leases Integration

## Issue Identified ✅
- **Problem:** `.env` file had duplicate Supabase URLs (demo URL overriding real URL)
- **Fixed:** Removed duplicate demo configuration
- **Result:** Now using correct Supabase URL: `https://epyybtyguntyamvgpbuz.supabase.co`

---

## Step-by-Step Setup

### 1️⃣ **Restart Your Development Server**

The `.env` file has been fixed. Restart your dev server to pick up the changes:

```bash
# Stop the current server (Ctrl+C if running)
# Then restart:
npm run dev
```

### 2️⃣ **Create Tables in Supabase**

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `epyybtyguntyamvgpbuz`
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `SETUP_SUPABASE_LEASES.sql`
6. Paste into the SQL Editor
7. **IMPORTANT:** Before running, replace `'YOUR_ORG_ID_HERE'` with your actual organization ID from Clerk

#### How to Get Your Organization ID:

**Option A - From Clerk Dashboard:**
1. Go to https://dashboard.clerk.com
2. Select your application
3. Go to "Organizations" tab
4. Copy your organization ID

**Option B - From Browser Console:**
```javascript
// Open browser console on your app
// Run this to see your org ID:
console.log(auth.jwt());
// Look for "organization_id" in the output
```

**Option C - Skip Sample Data:**
If you don't want sample data, just delete lines 277-339 (the INSERT statements) from the SQL file before running.

8. Click **Run** to execute the SQL

### 3️⃣ **Verify Tables Were Created**

After running the SQL, you should see output showing these tables were created:
- ✅ `properties`
- ✅ `units`
- ✅ `tenants`
- ✅ `leases`
- ✅ `files`

You can also check in Supabase:
1. Go to **Table Editor** in left sidebar
2. You should see all 5 tables listed

### 4️⃣ **Test the Integration**

1. Refresh your app in the browser
2. Navigate to **Leases & Files** page
3. You should see:
   - Loading indicator (briefly)
   - Either your leases displayed OR empty state if no leases exist
   - No more `ERR_NAME_NOT_RESOLVED` errors!

### 5️⃣ **Create Your First Lease**

1. Click **"+ New Lease"** button
2. Go through the wizard:
   - Select a property
   - Choose lease term (fixed/month-to-month)
   - Set dates
   - Enter security deposit
   - Set rent amount and payment details
   - Add tenant information
   - Configure rent/deposit sharing
   - Review and finalize
3. Click **"Finalize"**
4. Lease should save to Supabase and appear in table!

---

## Troubleshooting

### Still seeing `demo.supabase.co` errors?
1. Make sure you restarted the dev server after editing `.env`
2. Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)
3. Check console for the Supabase URL being used

### Tables not created?
- Make sure you replaced `'YOUR_ORG_ID_HERE'` with your actual org ID
- Or remove the INSERT statements if you don't have an org ID yet
- Check for SQL errors in the Supabase SQL Editor output

### RLS Policy Errors?
If you get "permission denied" errors:
1. Make sure your Clerk JWT includes `organization_id` in metadata
2. Check that you're logged in
3. Verify RLS policies are created (they should be from the SQL script)

### No leases showing?
- Check browser console for errors
- Verify you have leases in the database (Supabase Table Editor)
- Make sure the `organization_id` in leases matches your Clerk org ID

---

## What's Next?

Once setup is complete:
- ✅ Leases page will load data from Supabase
- ✅ Creating leases will save to database
- ✅ Data persists across page refreshes
- ✅ Split-screen detail view works with real data
- ✅ All CRUD operations functional

---

## Files Changed

1. **Fixed:** `.env` - Removed duplicate demo Supabase URLs
2. **Created:** `SETUP_SUPABASE_LEASES.sql` - Complete database schema
3. **Created:** `QUICK_SETUP_GUIDE.md` - This file!

---

## Need Help?

If you encounter issues:
1. Check browser console for specific error messages
2. Check Supabase logs (Supabase Dashboard → Logs)
3. Verify environment variables are loaded: `console.log(import.meta.env)`
4. Make sure Clerk authentication is working properly

---

**Status:** Ready to test! 🎉
