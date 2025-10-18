# GET YOUR CLERK USER ID - SIMPLE METHOD

## Why We Need It

Your Clerk API keys authenticate your **app**, but we need your personal **user ID** to:
- Link sample data to your account in the database
- Create organizations owned by you
- Set up test users correctly

## Two Easy Methods

### METHOD 1: Use the Helper Component (Easiest)

**1. Add to any page (e.g., DashboardPage.jsx):**
```jsx
import ClerkUserIdDisplay from '../components/ClerkUserIdDisplay';

// Inside your component JSX, add:
<ClerkUserIdDisplay />
```

**2. Sign in to your app**

**3. You'll see a blue box with your ID**
- Click "Copy to Clipboard" button
- OR copy from the console (check browser console)

**4. Update SQL file:**
- Open `supabase/migrations/004_sample_data.sql`
- Replace `YOUR_ACTUAL_CLERK_USER_ID` (3 times)
- Save

**5. Remove the component when done**

---

### METHOD 2: Browser Console (Quick)

**1. Sign in to your app**

**2. Open browser console** (F12 or right-click → Inspect)

**3. Type this:**
```javascript
Clerk.user.id
```

**4. Press Enter**

**5. Copy the ID** (looks like: `user_2abc123xyz...`)

**6. Update SQL file** (same as above)

---

## After You Get the ID

**Update the SQL file:**
```bash
# Open: supabase/migrations/004_sample_data.sql
# Find: YOUR_ACTUAL_CLERK_USER_ID (appears 3 times)
# Replace with: user_YOUR_ACTUAL_ID
```

**Run in Supabase:**
1. Open Supabase SQL Editor
2. Copy entire `004_sample_data.sql`
3. Paste and run
4. Verify: `SELECT * FROM properties;`

---

## Then Push to GitHub

Once everything is working, we'll push all changes:
```bash
git add .
git commit -m "Fix: Supabase 400 error, add empty states, update sample data SQL"
git push origin main
```

---

## Your Clerk Keys (For Reference)

You provided these (they're correct for development):
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_d2lsbGluZy1tYWxsYXJkLTk0LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_UM5luHVKExnOpuAn0uFGEwJOpypwHevTtvI7N4JwAe
```

These are your **app authentication keys** (perfect!)

But we also need your **personal user ID** from Clerk (different thing).
