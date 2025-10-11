# ⚡ 5-Minute Supabase Setup

## Step 1: Create Supabase Project (2 minutes)

1. **Go to:** https://supabase.com
2. **Click:** "Start your project" (or "Sign In" if you have an account)
3. **Sign in with GitHub** (easiest option)
4. **Click:** "New Project"
5. **Fill in:**
   - Name: `jumbajot` (or whatever you want)
   - Database Password: Use a strong password (SAVE THIS!)
   - Region: Choose closest to you (e.g., "US West" if you're in California)
6. **Click:** "Create new project"
7. **Wait ~2 minutes** for project to be created (grab a coffee ☕)

---

## Step 2: Get Your Credentials (1 minute)

Once your project is ready:

1. **Click:** Settings (gear icon on left sidebar)
2. **Click:** "API"
3. **Copy these two values:**

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ....(very long key)
```

---

## Step 3: Add Credentials to .env (30 seconds)

Open your `.env` file and add these lines:

```bash
# Clerk (already there)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_d2lsbGluZy1tYWxsYXJkLTk0LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_UM5luHVKExnOpuAn0uFGEwJOpypwHevTtvI7N4JwAe

# Supabase (ADD THESE)
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....your-actual-key
```

**Replace the xxx values with YOUR actual values from Step 2!**

---

## Step 4: Create Database Tables (2 minutes)

1. **In Supabase Dashboard**, click "SQL Editor" (left sidebar)
2. **Click:** "New Query"
3. **Copy ALL content** from this file:
   ```
   /Users/iannjenga/Documents/GitHub/func/supabase/migrations/001_initial_schema.sql
   ```
4. **Paste it** into the SQL editor
5. **Click:** "RUN" (bottom right)
6. **You should see:** "Success. No rows returned"

That's it! 🎉

---

## Step 5: Restart Dev Server (10 seconds)

```bash
# In terminal, stop the server (Ctrl+C if running)
# Then restart:
npm run dev
```

---

## Step 6: Test It! (30 seconds)

1. Go to `http://localhost:5173`
2. Sign up with a test account
3. Complete onboarding
4. You should see the dashboard! ✅

---

## What If Something Goes Wrong?

### Error: "relation 'organizations' does not exist"
→ You didn't run the SQL migration (Step 4)
→ Go back and run it

### Error: "Invalid API key"
→ Check your `.env` file
→ Make sure you copied the FULL key (it's very long!)

### Still blank dashboard?
→ Open browser DevTools (F12)
→ Check Console tab for errors
→ Copy the error and I'll help you fix it

---

## That's It!

After these 5 steps, your app will:
- ✅ Have a working database
- ✅ Store organizations and users
- ✅ Support multi-tenant data isolation
- ✅ Show the full dashboard with sidebar

**Total time: ~5 minutes** ⏱️
