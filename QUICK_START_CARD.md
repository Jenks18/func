# 🚀 QUICK START - Supabase Leases Integration

## ✅ What's Fixed
- ✅ Updated `.env` with correct Supabase project: `ptwgxoamojvbbezysgnq`
- ✅ Created simplified SQL setup (no RLS for testing)
- ✅ Dev server restarted with new credentials

---

## 📋 DO THIS NOW (5 minutes)

### Step 1: Run SQL in Supabase

1. **Open Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/ptwgxoamojvbbezysgnq
   ```

2. **Go to SQL Editor:**
   - Click "SQL Editor" in left sidebar
   - Click "+ New Query"

3. **Copy & Run SQL:**
   - Open file: `SETUP_SUPABASE_SIMPLE.sql`
   - Copy ALL contents
   - Paste into SQL Editor
   - Click **"Run"** (or Ctrl+Enter)

4. **Verify Success:**
   You should see output showing:
   ```
   ✅ 5 tables created (properties, units, tenants, leases, files)
   ✅ Sample data: 1 property, 3 units, 2 tenants, 2 leases
   ✅ RLS disabled (for testing)
   ```

### Step 2: Test the App

1. **Open App:**
   ```
   http://localhost:5174
   ```

2. **Go to Leases Page:**
   - Click "Leases & Files" in sidebar

3. **Expected Result:**
   - ✅ No more errors in console
   - ✅ Loading indicator shows briefly
   - ✅ **2 sample leases appear in table:**
     - Main Street Lofts | 101 | Active | $1,200
     - Main Street Lofts | 201 | Active | $1,500

4. **Test Split-Screen:**
   - Click on any lease row
   - Detail panel slides in from right
   - Shows property info, tenant, etc.

### Step 3: Create a Test Lease

1. Click **"+ New Lease"** button
2. Fill out wizard (property, dates, rent, tenant)
3. Click **"Finalize"**
4. New lease appears in table immediately!

---

## 🎯 Current Status

| Item | Status |
|------|--------|
| Supabase URL | ✅ ptwgxoamojvbbezysgnq.supabase.co |
| Tables Created | ⏳ Run SQL script |
| Dev Server | ✅ Running on port 5174 |
| Sample Data | ⏳ Will load after SQL |

---

## 🔧 What's Different from Before?

### Old Project:
```
❌ epyybtyguntyamvgpbuz.supabase.co (old)
```

### New Project:
```
✅ ptwgxoamojvbbezysgnq.supabase.co (current)
```

### Simplified for Testing:
- ✅ No RLS policies (easier to test)
- ✅ TEXT organization_id (simpler)
- ✅ Sample data included
- ✅ Cleaner error messages

---

## 📝 Files to Use

1. **SETUP_SUPABASE_SIMPLE.sql** ← Run this in Supabase SQL Editor
2. **.env** ← Already updated with correct credentials

---

## ⚠️ Troubleshooting

**Still see 400 errors?**
- Tables don't exist yet - run the SQL script!

**"Multiple GoTrueClient instances" warning?**
- ✅ FIXED! Singleton pattern implemented
- Should NOT see this anymore

**"Clerk development keys" warning?**
- ℹ️ Normal for development, not an error
- Just informational - safe to ignore

**No leases showing?**
- Make sure SQL script ran successfully
- Check Supabase Table Editor for data
- Check browser console for specific errors

---

## 🎉 Success Looks Like:

```
Console:
✅ LeasesFilesPageNew rendering
✅ No fetch errors
✅ 2 leases loaded

UI:
✅ Table shows 2 sample leases
✅ Can click rows to view details
✅ Can create new leases
✅ Data persists in database
```

---

**Next Action:** Run `SETUP_SUPABASE_SIMPLE.sql` in Supabase now! 🚀

The dev server is already running on http://localhost:5174 and waiting for you!
