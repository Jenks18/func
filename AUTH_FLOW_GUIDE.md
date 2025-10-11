# JumbaJot Authentication Flow Guide

## 🎯 Complete User Journey

### 1. **Sign Up** (`/sign-up`)

#### Available Methods:
- ✅ **Google OAuth** (Recommended - One-click signup)
- ✅ **Email + Password**
- ✅ **Phone Number + SMS** 
- ✅ **Username + Password**

#### Phone Number Info:
- **Status**: Optional but **highly recommended**
- **Benefits**:
  - Account recovery
  - Two-factor authentication (2FA)
  - Important notifications
  - Enhanced security
- **Note**: You can skip phone verification and add it later in settings

#### What Happens:
1. User selects signup method (Google, Email, Phone, or Username)
2. Enters required information
3. If phone/email selected: Verification code sent
4. User verifies code (or skips if phone is optional)
5. **Automatically redirected to** → `/onboarding`

---

### 2. **Onboarding** (`/onboarding`)

#### Step 1: Role Selection
Choose your role:

| Role | Icon | Description | Creates Org? |
|------|------|-------------|--------------|
| **Property Owner** | ⌂ | I own rental properties | ✅ Yes |
| **Property Manager** | ☰ | I manage properties for others | ✅ Yes |
| **Maintenance** | ⚒ | I handle property maintenance | ✅ Yes |
| **Tenant** | ◯ | I rent a property | ❌ No |

#### Step 2: Organization Setup (Skip for Tenants)
- Enter organization name (e.g., "Smith Property Management")
- This creates your workspace for managing properties

#### What Happens Behind the Scenes:
1. Updates Clerk user metadata with role
2. Creates organization in Supabase (if not tenant)
3. Creates user profile in Supabase
4. Sets `onboarded: true` flag
5. **Redirects to** → `/dashboard`

#### Error Handling:
- If onboarding fails, error message displays at top
- Logs errors to console for debugging
- Can retry by clicking button again

---

### 3. **Dashboard** (`/dashboard`)

You've successfully set up your account! 🎉

#### Available Features:
- View all your properties
- Manage tenants
- Track income & expenses
- Handle maintenance requests
- And more...

---

## 🔄 Navigation Flow

```
/sign-up
   ↓
[Complete signup & verification]
   ↓
/onboarding
   ↓
[Select role]
   ↓
[Create organization (if not tenant)]
   ↓
/dashboard ✅
```

---

## 🔒 Route Protection

### Public Routes (No login required):
- `/sign-in`
- `/sign-up`

### Protected Routes (Must be signed in):
- `/onboarding` - First-time setup
- `/dashboard` - Main app
- `/properties` - Property management
- `/tenants` - Tenant management
- `/leases` - Lease management
- `/income` - Income tracking
- `/expenses` - Expense tracking
- `/settings` - User settings
- `/organization` - Organization management
- `/create-organization` - Create new organization

### Redirect Logic:
- **Not signed in** → Redirected to `/sign-in`
- **Signed in but not onboarded** → Should go to `/onboarding`
- **Signed in and onboarded** → Can access all protected routes

---

## 🐛 Troubleshooting

### Issue: "Stuck at onboarding, doesn't redirect to dashboard"

**Possible Causes:**
1. **Supabase not set up** - Database tables don't exist
2. **Network error** - Failed to create organization/user
3. **Missing Supabase credentials** - Check `.env` file

**Solutions:**

#### Check Console Logs:
Open browser DevTools (F12) → Console tab → Look for:
```
Starting onboarding...
Updated Clerk metadata
Created organization: [org-id]
Created user profile
Navigating to dashboard...
```

If you see errors, note what step failed.

#### Verify Supabase Setup:
1. Do you have a Supabase project?
2. Have you run the migration SQL (`supabase/migrations/001_initial_schema.sql`)?
3. Are credentials in `.env` correct?

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### Manual Fix:
If stuck, you can:
1. Sign out (click user avatar → Sign out)
2. Sign in again
3. Should redirect to onboarding automatically

---

### Issue: "Phone verification never completes"

**Solution:**
- Phone number is **optional**
- Look for a "Skip" or "Continue without phone" button
- You can add phone later in Settings

---

### Issue: "Can't access dashboard after onboarding"

**Possible Causes:**
1. Browser cache
2. Redirect didn't trigger
3. Route protection issue

**Solutions:**
1. Manually navigate to: `http://localhost:5173/dashboard`
2. Hard refresh: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
3. Check browser console for errors

---

## ⚙️ Configuration

### Clerk Settings (Required):
1. ✅ Organizations enabled
2. ✅ Google OAuth enabled
3. ✅ Email/password enabled
4. ✅ Phone optional (not required)
5. ✅ Username optional

### Supabase Setup (Required):
1. Create Supabase project
2. Run migration SQL to create tables
3. Enable Row Level Security (RLS)
4. Add credentials to `.env`

---

## 📱 Mobile Support

- **Screen width ≤ 1024px** → Automatically uses `AppMobile` component
- Mobile has its own auth flow and navigation
- Same authentication works across desktop and mobile

---

## 🎨 Blue Theme

All auth pages use JumbaJot's blue color scheme:
- Primary: `#3b82f6`
- Text: `#1e40af`
- Secondary: `#60a5fa`
- Borders: `#bfdbfe`
- Background: `#f0f9ff` → `#e0f2fe` → `#bae6fd` gradient

---

## 🔑 Environment Variables

Required in `.env`:
```bash
# Clerk
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase (Get these after creating your project)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## ✅ Testing Checklist

- [ ] Sign up with Google
- [ ] Sign up with Email
- [ ] Skip phone number (verify it's optional)
- [ ] Complete onboarding as Property Owner
- [ ] Create organization
- [ ] Redirected to dashboard successfully
- [ ] Can navigate between pages
- [ ] Can sign out
- [ ] Can sign back in
- [ ] Onboarding skipped on second login (already onboarded)

---

## 🆘 Need Help?

### Check Console Logs:
Browser DevTools → Console → Look for errors

### Check Network Tab:
Browser DevTools → Network → Check for failed API calls

### Common Errors:

**"Failed to create organization"**
→ Supabase not set up or credentials wrong

**"Failed to create user profile"**
→ Database tables don't exist - run migration

**"Redirect loop"**
→ Clear browser cache and cookies

---

## 📝 Next Steps After Setup

1. **Add Supabase credentials** to `.env`
2. **Run database migration** in Supabase SQL editor
3. **Test complete flow** from signup to dashboard
4. **Invite team members** (if org admin/owner)
5. **Start adding properties!**

---

*Last Updated: October 11, 2025*
