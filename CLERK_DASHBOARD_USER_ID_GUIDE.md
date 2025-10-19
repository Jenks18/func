# GET CLERK USER ID FROM DASHBOARD - VISUAL GUIDE 📱

## Quick Steps (2 minutes)

### Step 1: Open Clerk Dashboard
🔗 https://dashboard.clerk.com

---

### Step 2: Select Your Application
Look for the app using your publishable key:
```
pk_test_d2lsbGluZy1tYWxsYXJkLTk0LmNsZXJrLmFjY291bnRzLmRldiQ
```

It should be named something like your app name.

---

### Step 3: Navigate to Users
In the left sidebar, click:
```
👥 Users
```

---

### Step 4: Find Your Account
You'll see a list of users. Find yourself by:
- Your email address
- Your name
- Recent sign-in

---

### Step 5: Open User Details
Click on your user row to open the details panel/page.

---

### Step 6: Copy Your User ID
At the top of the user details, you'll see:

```
User ID: user_2abc123xyz...
```

**Click the copy icon** next to it, or manually select and copy the ID.

---

## What the User ID Looks Like

✅ **Correct format:**
```
user_2abc123xyz...
user_2nPsXYZ4567ABC...
user_2k3L9mN1oP2qR3...
```

❌ **Not these:**
```
pk_test_... (this is your publishable key)
sk_test_... (this is your secret key)
org_... (this is an organization ID)
```

---

## Now Update Your SQL File

### Step 1: Open the file
```
supabase/migrations/004_sample_data.sql
```

### Step 2: Find this text (appears 3 times)
```sql
YOUR_ACTUAL_CLERK_USER_ID
```

### Step 3: Replace with your copied ID
For example, if your ID is `user_2abc123xyz`, you'll change:

**BEFORE:**
```sql
created_by, plan)
SELECT 
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Sample Property Management Co',
  'YOUR_ACTUAL_CLERK_USER_ID',
  'pro'
```

**AFTER:**
```sql
created_by, plan)
SELECT 
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Sample Property Management Co',
  'user_2abc123xyz',
  'pro'
```

Do this for all 3 occurrences in the file.

---

## Run in Supabase

### Step 1: Open Supabase SQL Editor
Go to your Supabase project → SQL Editor

### Step 2: Copy entire SQL file
Open `004_sample_data.sql` and copy everything (Cmd+A, Cmd+C)

### Step 3: Paste and run
Paste into Supabase SQL Editor and click "Run"

### Step 4: Verify
Run this query:
```sql
SELECT * FROM properties;
```

You should see 4 properties:
- Main Street Lofts
- Jefferson Ave Apartments
- Jefferson House
- Shiloh House

---

## Troubleshooting

### Can't find your user in Clerk Dashboard?
1. Make sure you've signed into your app at least once
2. Check you're looking at the correct Clerk application
3. Try clicking "Sign up" in your app to create your user

### User ID not starting with "user_"?
- You might have copied the organization ID (starts with `org_`)
- Go back to Users → Click your user → Look for "User ID" specifically

### Still stuck?
Use the helper component method (METHOD 2 in GET_CLERK_USER_ID.md)

---

## Quick Reference

**Clerk Dashboard:** https://dashboard.clerk.com
**Your App Keys:**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_d2lsbGluZy1tYWxsYXJkLTk0LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_UM5luHVKExnOpuAn0uFGEwJOpypwHevTtvI7N4JwAe
```

**SQL File to Update:**
```
supabase/migrations/004_sample_data.sql
```

**Replace this text (3 times):**
```
YOUR_ACTUAL_CLERK_USER_ID
```

**With your User ID (format):**
```
user_2abc123xyz...
```

---

## After Running SQL

Navigate to your app:
- `/properties` → See 4 sample properties
- `/maintenance` → See 4 sample maintenance requests  
- `/income` → See sample transactions
- `/leases` → See 6 sample leases

Everything will be linked to your Clerk user account! 🎉
