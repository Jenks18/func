# 🚀 QUICK START - GET SAMPLE DATA RUNNING

## 1. Get Your Clerk User ID (2 minutes)

**Open browser console and type:**
```javascript
Clerk.user.id
```

**Copy the result** (looks like: `user_2abc123xyz...`)

---

## 2. Update SQL File (1 minute)

**Open:** `supabase/migrations/004_sample_data.sql`

**Find and Replace:**
- Find: `YOUR_ACTUAL_CLERK_USER_ID`
- Replace with: `user_YOUR_ACTUAL_ID`
- **(Appears 3 times)**

---

## 3. Run in Supabase (1 minute)

1. Open Supabase SQL Editor
2. Copy **entire** `004_sample_data.sql` file
3. Paste into SQL Editor
4. Click **"Run"**

---

## 4. Refresh Your App (30 seconds)

Navigate to `/properties` → You should see:
- ✅ Main Street Lofts
- ✅ Jefferson Ave Apartments
- ✅ Jefferson House
- ✅ Shiloh House

---

## ✅ ALL FIXES COMPLETE

### What Was Fixed:
1. **Supabase 400 Error** → Properties page query fixed (removed `rent_amount` from units)
2. **SQL Sample Data** → Updated with Clerk instructions and clear placeholders
3. **Console Warnings** → Explained (non-critical, informational only)

### Result:
- ✅ No more 400 errors
- ✅ Properties page loads correctly  
- ✅ Clear instructions to add sample data
- ✅ Ready for testing and development

---

## Console Warnings (You Can Ignore These)

**GoTrueClient Warning** → Multiple Supabase instances (fix later for production)
**Clerk Dev Keys** → Correct! Using development keys as intended
**React DevTools** → Install extension for better debugging (optional)

---

## Need Help?

See `ALL_FIXES_APPLIED.md` for complete details!
