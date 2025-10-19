# 🔐 Clerk Authentication Routing - Complete Reference

> **Copy this exact logic for your Fleet Management app**

---

## 📁 File Structure

```
src/
├── main.jsx                              # ⭐ Entry point - wraps entire app
├── App.jsx                               # ⭐ Route definitions
├── .env                                  # ⭐ Clerk API keys
├── config/
│   └── clerk.js                          # ⭐ Clerk config & permissions
├── components/
│   └── auth/
│       ├── ClerkProvider.jsx             # ⭐ Wrapper component
│       ├── ProtectedRoute.jsx            # Protected route wrapper
│       ├── UserButton.jsx                # User menu component
│       └── OrganizationSwitcher.jsx      # Org switcher component
└── pages/
    └── auth/
        ├── SignInPage.jsx                # ⭐ Sign in UI
        ├── SignUpPage.jsx                # ⭐ Sign up UI
        ├── OnboardingPage.jsx            # ⭐ User onboarding
        ├── CreateOrganizationPage.jsx    # Create org
        └── OrganizationProfilePage.jsx   # Org settings
```

---

## 🎯 Step 1: Entry Point (main.jsx)

**File:** `src/main.jsx`

```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from './components/auth/ClerkProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider>
      <App />
    </ClerkProvider>
  </StrictMode>,
)
```

**Key Points:**
- ✅ Import custom `ClerkProvider` wrapper (not Clerk's directly)
- ✅ Wrap entire app at the ROOT level
- ✅ `ClerkProvider` handles all auth configuration

---

## 🔧 Step 2: ClerkProvider Wrapper (ClerkProvider.jsx)

**File:** `src/components/auth/ClerkProvider.jsx`

```javascript
import { ClerkProvider as BaseClerkProvider } from '@clerk/clerk-react';
import { clerkConfig } from '../../config/clerk';

export function ClerkProvider({ children }) {
  // Error handling if API key is missing
  if (!clerkConfig.publishableKey) {
    console.error('Missing Clerk Publishable Key');
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '16px',
          border: '1px solid #bfdbfe',
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#1e40af', marginBottom: '16px' }}>
            Configuration Required
          </h2>
          <p style={{ color: '#60a5fa' }}>
            Missing Clerk Publishable Key. Add VITE_CLERK_PUBLISHABLE_KEY to .env
          </p>
        </div>
      </div>
    );
  }

  return (
    <BaseClerkProvider 
      publishableKey={clerkConfig.publishableKey}
      appearance={clerkConfig.appearance}
      routing="path"                      // ⭐ Critical: Use path-based routing
      signInUrl="/sign-in"                // ⭐ Where to redirect for sign in
      signUpUrl="/sign-up"                // ⭐ Where to redirect for sign up
      afterSignInUrl="/onboarding"        // ⭐ Where to go after signing in
      afterSignUpUrl="/onboarding"        // ⭐ Where to go after signing up
    >
      {children}
    </BaseClerkProvider>
  );
}
```

**Critical Props Explained:**

| Prop | Value | Why |
|------|-------|-----|
| `routing` | `"path"` | Uses React Router paths (not hash) |
| `signInUrl` | `"/sign-in"` | Route for sign-in page |
| `signUpUrl` | `"/sign-up"` | Route for sign-up page |
| `afterSignInUrl` | `"/onboarding"` | Redirect after successful login |
| `afterSignUpUrl` | `"/onboarding"` | Redirect after registration |

---

## ⚙️ Step 3: Clerk Configuration (clerk.js)

**File:** `src/config/clerk.js`

```javascript
export const clerkConfig = {
  // 🔑 API Key from Clerk dashboard
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  
  // 🎨 Appearance customization (blue theme)
  appearance: {
    variables: {
      colorPrimary: '#3b82f6',
      colorText: '#1e40af',
      colorTextSecondary: '#60a5fa',
      colorBackground: '#ffffff',
      colorInputBackground: '#f0f9ff',
      borderRadius: '0.75rem',
    },
    elements: {
      card: 'shadow-lg border border-[#bfdbfe]',
      headerTitle: 'text-[#1e40af]',
      formButtonPrimary: 'bg-[#3b82f6] hover:bg-[#2563eb]',
    }
  },
  
  // 🔗 URL configuration
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
  afterSignInUrl: '/dashboard',
  afterSignUpUrl: '/onboarding',
};

// 👤 Role definitions (PROPERTY MANAGEMENT)
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ORG_ADMIN: 'org_admin',
  PROPERTY_OWNER: 'property_owner',
  PROPERTY_MANAGER: 'manager',
  MAINTENANCE: 'maintenance',
  TENANT: 'tenant'
};

// 👤 Role definitions (FLEET MANAGEMENT - adapt these!)
export const FLEET_ROLES = {
  PLATFORM_ADMIN: 'platform_admin',
  FLEET_ADMIN: 'fleet_admin',
  FLEET_MANAGER: 'fleet_manager',
  DRIVER: 'driver',
  ACCOUNTANT: 'accountant',
  DISPATCHER: 'dispatcher',
};

// 🔐 Permissions
export const PERMISSIONS = {
  canCreateProperty: ['super_admin', 'org_admin', 'property_owner'],
  canEditProperty: ['super_admin', 'org_admin', 'property_owner', 'manager'],
  canViewFinancials: ['super_admin', 'org_admin', 'property_owner', 'manager'],
  canManageUsers: ['super_admin', 'org_admin', 'property_owner', 'manager'],
};

// 🔐 Fleet Permissions (adapt these!)
export const FLEET_PERMISSIONS = {
  canAddVehicle: ['platform_admin', 'fleet_admin', 'fleet_manager'],
  canRecordFuelPurchase: ['platform_admin', 'fleet_admin', 'fleet_manager', 'driver'],
  canApprovePurchase: ['platform_admin', 'fleet_admin', 'fleet_manager'],
  canViewAllTransactions: ['platform_admin', 'fleet_admin', 'fleet_manager', 'accountant'],
};

export function hasPermission(userRole, permission) {
  return PERMISSIONS[permission]?.includes(userRole) || false;
}
```

---

## 🌐 Step 4: Route Definitions (App.jsx)

**File:** `src/App.jsx`

```javascript
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

// Auth Pages
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';
import OnboardingPage from './pages/auth/OnboardingPage';

// App Pages
import DashboardPage from './pages/DashboardPage';
import PropertiesPage from './pages/PropertiesPage';
import TenantsPage from './pages/TenantsPage';
import UsersPage from './pages/UsersPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==========================================
            PUBLIC ROUTES (Anyone can access)
            ========================================== */}
        
        {/* Sign In Route */}
        <Route 
          path="/sign-in/*" 
          element={
            <>
              {/* If NOT signed in, show sign-in page */}
              <SignedOut>
                <SignInPage />
              </SignedOut>
              
              {/* If already signed in, redirect to onboarding */}
              <SignedIn>
                <Navigate to="/onboarding" replace />
              </SignedIn>
            </>
          } 
        />
        
        {/* Sign Up Route */}
        <Route 
          path="/sign-up/*" 
          element={
            <>
              {/* If NOT signed in, show sign-up page */}
              <SignedOut>
                <SignUpPage />
              </SignedOut>
              
              {/* If already signed in, redirect to onboarding */}
              <SignedIn>
                <Navigate to="/onboarding" replace />
              </SignedIn>
            </>
          } 
        />
        
        {/* ==========================================
            PROTECTED ROUTES (Must be signed in)
            ========================================== */}
        
        {/* Onboarding (first-time setup) */}
        <Route
          path="/onboarding"
          element={
            <>
              {/* If NOT signed in, redirect to sign-in */}
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
              
              {/* If signed in, show onboarding */}
              <SignedIn>
                <OnboardingPage />
              </SignedIn>
            </>
          }
        />
        
        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
              <SignedIn>
                <DashboardPage />
              </SignedIn>
            </>
          }
        />
        
        {/* Properties */}
        <Route
          path="/properties"
          element={
            <>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
              <SignedIn>
                <PropertiesPage />
              </SignedIn>
            </>
          }
        />
        
        {/* Tenants */}
        <Route
          path="/tenants"
          element={
            <>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
              <SignedIn>
                <TenantsPage />
              </SignedIn>
            </>
          }
        />
        
        {/* Users Management */}
        <Route
          path="/users"
          element={
            <>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
              <SignedIn>
                <UsersPage />
              </SignedIn>
            </>
          }
        />
        
        {/* ==========================================
            DEFAULT ROUTES
            ========================================== */}
        
        {/* Root path */}
        <Route 
          path="/" 
          element={
            <>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
              <SignedIn>
                <Navigate to="/dashboard" replace />
              </SignedIn>
            </>
          } 
        />
        
        {/* Catch-all (404) */}
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
}
```

**Pattern for Every Protected Route:**

```javascript
<Route
  path="/your-page"
  element={
    <>
      <SignedOut>
        <Navigate to="/sign-in" replace />
      </SignedOut>
      <SignedIn>
        <YourPage />
      </SignedIn>
    </>
  }
/>
```

---

## 🔐 Step 5: Sign In Page

**File:** `src/pages/auth/SignInPage.jsx`

```javascript
import { SignIn } from '@clerk/clerk-react';

export default function SignInPage() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        
        {/* Your branding/logo here */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ color: '#1e40af', fontSize: '32px' }}>
            JumbaJot
          </h1>
          <p style={{ color: '#60a5fa' }}>
            Property Management Made Simple
          </p>
        </div>
        
        {/* Clerk's sign-in component */}
        <SignIn 
          routing="path"                    // ⭐ Must match ClerkProvider
          path="/sign-in"                   // ⭐ Current path
          signUpUrl="/sign-up"              // ⭐ Link to sign up
          afterSignInUrl="/onboarding"      // ⭐ Where to go after success
          redirectUrl="/onboarding"         // ⭐ Alternative redirect
        />
      </div>
    </div>
  );
}
```

---

## 📝 Step 6: Sign Up Page

**File:** `src/pages/auth/SignUpPage.jsx`

```javascript
import { SignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        
        {/* Your branding/logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ color: '#1e40af', fontSize: '32px' }}>
            JumbaJot
          </h1>
          <p style={{ color: '#60a5fa' }}>
            Start managing your properties today
          </p>
        </div>
        
        {/* Clerk's sign-up component */}
        <SignUp 
          routing="path"                    // ⭐ Must match ClerkProvider
          path="/sign-up"                   // ⭐ Current path
          signInUrl="/sign-in"              // ⭐ Link to sign in
          afterSignUpUrl="/onboarding"      // ⭐ Where to go after success
          redirectUrl="/onboarding"         // ⭐ Alternative redirect
        />
      </div>
    </div>
  );
}
```

---

## 🎓 Step 7: Onboarding Page

**File:** `src/pages/auth/OnboardingPage.jsx`

```javascript
import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticatedSupabase } from '../../hooks/useAuthenticatedSupabase';
import { ROLES } from '../../config/clerk';

export default function OnboardingPage() {
  const { user } = useUser();                    // ⭐ Get current user
  const { getToken } = useAuth();                // ⭐ Get auth token
  const navigate = useNavigate();
  const { supabase } = useAuthenticatedSupabase();
  
  const [role, setRole] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [loading, setLoading] = useState(false);

  // ⭐ Check if already onboarded
  useEffect(() => {
    if (user?.unsafeMetadata?.onboarded) {
      console.log('Already onboarded, redirecting...');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ⭐ 1. Save role to Clerk metadata
      await user.update({
        unsafeMetadata: {
          role: role,
          onboarded: true
        }
      });

      // ⭐ 2. Create organization in Supabase
      const { data: orgData } = await supabase
        .from('organizations')            // For fleet: 'fleet_companies'
        .insert({
          name: organizationName,
          created_by: user.id
        })
        .select()
        .single();

      // ⭐ 3. Create user record in Supabase
      await supabase
        .from('users')                    // For fleet: 'fleet_users'
        .insert({
          clerk_id: user.id,
          email: user.primaryEmailAddress.emailAddress,
          first_name: user.firstName,
          last_name: user.lastName,
          role: role,
          organization_id: orgData.id
        });

      // ⭐ 4. Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#1e40af', marginBottom: '32px' }}>
        Welcome! Let's get started
      </h1>
      
      <form onSubmit={handleSubmit}>
        {/* Organization Name */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#1e40af' }}>
            Organization Name
          </label>
          <input 
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            placeholder="ABC Property Management"
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
            }}
          />
        </div>
        
        {/* Role Selection */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#1e40af' }}>
            Your Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
            }}
          >
            <option value="">Select your role</option>
            <option value={ROLES.PROPERTY_OWNER}>Property Owner</option>
            <option value={ROLES.PROPERTY_MANAGER}>Property Manager</option>
            <option value={ROLES.TENANT}>Tenant</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Setting up...' : 'Complete Setup'}
        </button>
      </form>
    </div>
  );
}
```

---

## 🔑 Step 8: Environment Variables (.env)

**File:** `.env`

```bash
# ⭐ Clerk API Keys (get from dashboard.clerk.com)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# ⭐ Supabase Keys (get from supabase.com/dashboard)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# App URLs
VITE_APP_URL=http://localhost:5173
```

**Where to get keys:**
1. **Clerk:** https://dashboard.clerk.com → Your App → API Keys
2. **Supabase:** https://supabase.com/dashboard → Your Project → Settings → API

---

## 🎯 How the Auth Flow Works

### User Journey:

```
1. User visits your app
   ↓
2. App.jsx checks: Are they signed in?
   ├─ NO → Redirect to /sign-in
   └─ YES → Continue
   ↓
3. User fills sign-in form (handled by Clerk)
   ↓
4. Clerk validates credentials
   ↓
5. afterSignInUrl="/onboarding" kicks in
   ↓
6. OnboardingPage checks: Already onboarded?
   ├─ YES → Redirect to /dashboard
   └─ NO → Show onboarding form
   ↓
7. User selects role & creates organization
   ↓
8. Data saved to:
   ├─ Clerk (role in unsafeMetadata)
   └─ Supabase (organization + user record)
   ↓
9. Redirect to /dashboard
   ↓
10. User is fully authenticated & onboarded! ✅
```

---

## 🔐 Using Auth in Components

### Get Current User:

```javascript
import { useUser } from '@clerk/clerk-react';

export default function MyComponent() {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded) return <div>Loading...</div>;
  
  const userRole = user?.unsafeMetadata?.role;
  
  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <p>Your role: {userRole}</p>
    </div>
  );
}
```

### Check Permissions:

```javascript
import { useUser } from '@clerk/clerk-react';
import { hasPermission } from '../config/clerk';

export default function PropertiesPage() {
  const { user } = useUser();
  const userRole = user?.unsafeMetadata?.role;
  
  const canCreate = hasPermission(userRole, 'canCreateProperty');
  
  return (
    <div>
      <h1>Properties</h1>
      {canCreate && (
        <button>+ Add Property</button>
      )}
    </div>
  );
}
```

### Sign Out:

```javascript
import { useClerk } from '@clerk/clerk-react';

export default function UserMenu() {
  const { signOut } = useClerk();
  
  return (
    <button onClick={() => signOut()}>
      Sign Out
    </button>
  );
}
```

---

## 🚀 Adapting for Fleet Management

### Changes to Make:

1. **Update `ROLES` in `clerk.js`:**
   ```javascript
   export const FLEET_ROLES = {
     PLATFORM_ADMIN: 'platform_admin',
     FLEET_ADMIN: 'fleet_admin',
     FLEET_MANAGER: 'fleet_manager',
     DRIVER: 'driver',
     ACCOUNTANT: 'accountant',
   };
   ```

2. **Update `PERMISSIONS` in `clerk.js`:**
   ```javascript
   export const FLEET_PERMISSIONS = {
     canAddVehicle: ['platform_admin', 'fleet_admin', 'fleet_manager'],
     canRecordFuel: ['platform_admin', 'fleet_admin', 'driver'],
     canApproveFuel: ['platform_admin', 'fleet_admin', 'fleet_manager'],
   };
   ```

3. **Update Supabase table names in `OnboardingPage.jsx`:**
   ```javascript
   // Change:
   .from('organizations')
   // To:
   .from('fleet_companies')
   
   // Change:
   .from('users')
   // To:
   .from('fleet_users')
   ```

4. **Update branding in sign-in/sign-up pages:**
   ```javascript
   <h1>FleetFlow</h1>
   <p>Fuel Management Made Simple</p>
   ```

---

## ✅ Summary

**Files You Need:**

1. ✅ `src/main.jsx` - Entry point with ClerkProvider
2. ✅ `src/components/auth/ClerkProvider.jsx` - Clerk wrapper
3. ✅ `src/config/clerk.js` - Roles & permissions
4. ✅ `src/App.jsx` - Route definitions with SignedIn/SignedOut
5. ✅ `src/pages/auth/SignInPage.jsx` - Sign-in UI
6. ✅ `src/pages/auth/SignUpPage.jsx` - Sign-up UI
7. ✅ `src/pages/auth/OnboardingPage.jsx` - First-time setup
8. ✅ `.env` - API keys

**Key Principles:**

- ✅ Wrap entire app in `<ClerkProvider>` at `main.jsx`
- ✅ Use `routing="path"` everywhere
- ✅ Use `<SignedIn>` and `<SignedOut>` to control access
- ✅ Store role in `user.unsafeMetadata.role`
- ✅ Create organization + user in Supabase during onboarding
- ✅ Check permissions with `hasPermission(role, permission)`

**That's it! Copy this pattern exactly for your fleet app.** 🚛✨
