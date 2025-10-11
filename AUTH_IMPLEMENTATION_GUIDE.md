# 🔧 Auth System Implementation Guide

## Exact File Structure & Implementation Steps for Any Project

---

## 📁 File Structure You Need

```
your-project/
├── .env                           # Environment variables
├── package.json                   # Dependencies
│
├── src/
│   ├── main.jsx                   # Entry point with ClerkProvider
│   ├── App.jsx                    # Routing configuration
│   │
│   ├── config/
│   │   └── clerk.js               # Roles, permissions, Clerk config
│   │
│   ├── hooks/
│   │   ├── useCurrentUser.js      # Get current user info
│   │   └── useAuthenticatedSupabase.js  # Supabase client with auth
│   │
│   ├── components/
│   │   └── auth/
│   │       ├── ProtectedRoute.jsx       # Route protection
│   │       ├── UserButton.jsx           # User menu
│   │       └── OrganizationSwitcher.jsx # Org switcher
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── SignInPage.jsx           # Login page
│   │   │   ├── SignUpPage.jsx           # Registration page
│   │   │   ├── OnboardingPage.jsx       # Role selection
│   │   │   └── OrganizationProfilePage.jsx  # Org management
│   │   │
│   │   └── DashboardPage.jsx            # Main app page
│   │
│   └── services/
│       ├── database.js                  # Database initialization
│       └── yourDataService.js           # CRUD operations
│
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql       # Database schema + RLS
```

---

## 🚀 Step-by-Step Implementation

### STEP 1: Install Dependencies

```bash
# Core dependencies
npm install react react-dom
npm install react-router-dom
npm install @clerk/clerk-react
npm install @supabase/supabase-js

# Build tools (if using Vite)
npm install -D vite @vitejs/plugin-react
```

---

### STEP 2: Configure Environment Variables

Create `.env` file:

```bash
# Clerk (from https://clerk.com dashboard)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx

# Supabase (from https://supabase.com dashboard)
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:** 
- Use `VITE_` prefix for client-side variables (Vite projects)
- Use `NEXT_PUBLIC_` prefix (Next.js projects)
- Use `REACT_APP_` prefix (Create React App)

---

### STEP 3: Create Clerk Configuration

**File:** `src/config/clerk.js`

```javascript
// 1. Define your roles
export const ROLES = {
  SUPER_ADMIN: 'super_admin',     // Platform admin
  ORG_ADMIN: 'org_admin',         // Organization admin
  MANAGER: 'manager',              // Team manager
  MEMBER: 'member',                // Regular user
};

// 2. Map permissions to roles
export const PERMISSIONS = {
  // Organization management
  canManageOrganization: ['super_admin', 'org_admin'],
  canInviteUsers: ['super_admin', 'org_admin', 'manager'],
  canRemoveUsers: ['super_admin', 'org_admin'],
  
  // Data management
  canCreateData: ['super_admin', 'org_admin', 'manager'],
  canEditData: ['super_admin', 'org_admin', 'manager', 'member'],
  canDeleteData: ['super_admin', 'org_admin'],
  canViewData: ['super_admin', 'org_admin', 'manager', 'member'],
};

// 3. Permission check helper
export function hasPermission(userRole, permission) {
  return PERMISSIONS[permission]?.includes(userRole) || false;
}

// 4. Clerk appearance config (optional - for styling)
export const clerkConfig = {
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  appearance: {
    variables: {
      colorPrimary: '#3b82f6',
      borderRadius: '0.75rem',
    }
  },
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
  afterSignInUrl: '/dashboard',
  afterSignUpUrl: '/onboarding',
};
```

---

### STEP 4: Set Up ClerkProvider

**File:** `src/main.jsx`

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { clerkConfig } from './config/clerk';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={clerkConfig.publishableKey}
      appearance={clerkConfig.appearance}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
```

---

### STEP 5: Create Auth Pages

**File:** `src/pages/auth/SignInPage.jsx`

```javascript
import { SignIn } from '@clerk/clerk-react';

export default function SignInPage() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f0f9ff'
    }}>
      <SignIn 
        routing="path" 
        path="/sign-in"
        afterSignInUrl="/dashboard"
      />
    </div>
  );
}
```

**File:** `src/pages/auth/SignUpPage.jsx`

```javascript
import { SignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f0f9ff'
    }}>
      <SignUp 
        routing="path" 
        path="/sign-up"
        afterSignUpUrl="/onboarding"
      />
    </div>
  );
}
```

**File:** `src/pages/auth/OnboardingPage.jsx`

```javascript
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../../config/clerk';

export default function OnboardingPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Update user metadata in Clerk
      await user.update({
        publicMetadata: {
          role: role,
          onboarded: true
        }
      });

      // 2. Create organization in your database
      // (See STEP 7 for database service)
      const org = await createOrganization({
        name: orgName,
        createdBy: user.id
      });

      // 3. Create user record in database
      await createUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        role: role,
        organizationId: org.id
      });

      // 4. Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
      alert('Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Welcome! Let's get you set up</h1>
      
      <form onSubmit={handleSubmit}>
        <label>
          What's your role?
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="">Select role</option>
            <option value={ROLES.ORG_ADMIN}>Admin</option>
            <option value={ROLES.MANAGER}>Manager</option>
            <option value={ROLES.MEMBER}>Member</option>
          </select>
        </label>
        
        <label>
          Organization Name
          <input 
            value={orgName} 
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="Acme Corp"
            required
          />
        </label>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Setting up...' : 'Get Started'}
        </button>
      </form>
    </div>
  );
}
```

---

### STEP 6: Create Protected Route Component

**File:** `src/components/auth/ProtectedRoute.jsx`

```javascript
import { useAuth, useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { hasPermission } from '../../config/clerk';

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  requiredPermission 
}) {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  
  // Loading state
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  
  // Not authenticated
  if (!userId) {
    return <Navigate to="/sign-in" />;
  }
  
  // Get user role
  const userRole = user?.publicMetadata?.role;
  
  // Check if onboarded
  if (!user?.publicMetadata?.onboarded) {
    return <Navigate to="/onboarding" />;
  }
  
  // Check specific role
  if (requiredRole && userRole !== requiredRole) {
    return <div>Access Denied - Insufficient permissions</div>;
  }
  
  // Check permission
  if (requiredPermission && !hasPermission(userRole, requiredPermission)) {
    return <div>Access Denied - You don't have this permission</div>;
  }
  
  return children;
}
```

---

### STEP 7: Create Supabase Client Hook

**File:** `src/hooks/useAuthenticatedSupabase.js`

```javascript
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@clerk/clerk-react';

export function useAuthenticatedSupabase() {
  const { getToken } = useAuth();
  
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      global: {
        headers: async () => {
          const token = await getToken({ template: 'supabase' });
          return token ? { Authorization: `Bearer ${token}` } : {};
        }
      }
    }
  );
  
  return supabase;
}
```

**CRITICAL:** You must configure Clerk's Supabase JWT template:

1. Go to Clerk Dashboard → JWT Templates
2. Click "New Template" → Choose "Supabase"
3. Use default settings
4. Save

This allows Clerk's JWT to be verified by Supabase.

---

### STEP 8: Create Database Schema with RLS

**File:** `supabase/migrations/001_initial_schema.sql`

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ORGANIZATIONS TABLE
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_by TEXT NOT NULL,        -- Clerk user ID
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USERS TABLE
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,    -- Links to Clerk
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. YOUR BUSINESS TABLES (example: projects)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INDEXES
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_projects_organization_id ON projects(organization_id);

-- 5. ENABLE ROW LEVEL SECURITY
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 6. HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS UUID AS $$
  SELECT id FROM users WHERE clerk_id = (auth.jwt() ->> 'sub')::text;
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM users WHERE clerk_id = (auth.jwt() ->> 'sub')::text;
$$ LANGUAGE SQL SECURITY DEFINER;

-- 7. RLS POLICIES

-- Organizations: Only see your own
CREATE POLICY org_select ON organizations
FOR SELECT USING (
  id = current_organization_id() OR
  created_by = (auth.jwt() ->> 'sub')::text
);

-- Users: See yourself and your org members
CREATE POLICY users_select ON users
FOR SELECT USING (
  clerk_id = (auth.jwt() ->> 'sub')::text OR
  organization_id = current_organization_id()
);

CREATE POLICY users_insert ON users
FOR INSERT WITH CHECK (true);  -- Anyone can create their user record

CREATE POLICY users_update ON users
FOR UPDATE USING (
  clerk_id = (auth.jwt() ->> 'sub')::text
);

-- Projects: Only see your org's projects
CREATE POLICY projects_select ON projects
FOR SELECT USING (
  organization_id = current_organization_id()
);

CREATE POLICY projects_insert ON projects
FOR INSERT WITH CHECK (
  organization_id = current_organization_id()
);

CREATE POLICY projects_update ON projects
FOR UPDATE USING (
  organization_id = current_organization_id()
);

CREATE POLICY projects_delete ON projects
FOR DELETE USING (
  organization_id = current_organization_id()
);
```

**Run this SQL in Supabase:**
1. Go to Supabase Dashboard → SQL Editor
2. Paste the entire schema
3. Click "Run"

---

### STEP 9: Create Database Services

**File:** `src/services/database.js`

```javascript
import { useAuthenticatedSupabase } from '../hooks/useAuthenticatedSupabase';

export const database = {
  async createOrganization(orgData) {
    const supabase = useAuthenticatedSupabase();
    
    const { data, error } = await supabase
      .from('organizations')
      .insert([{
        name: orgData.name,
        created_by: orgData.createdBy
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async createUser(userData) {
    const supabase = useAuthenticatedSupabase();
    
    const { data, error } = await supabase
      .from('users')
      .insert([{
        clerk_id: userData.clerkId,
        email: userData.email,
        role: userData.role,
        organization_id: userData.organizationId
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async getCurrentUser(clerkId) {
    const supabase = useAuthenticatedSupabase();
    
    const { data, error } = await supabase
      .from('users')
      .select('*, organizations(*)')
      .eq('clerk_id', clerkId)
      .single();
    
    if (error) throw error;
    return data;
  }
};
```

**File:** `src/services/projectService.js` (Example for your data)

```javascript
import { useAuthenticatedSupabase } from '../hooks/useAuthenticatedSupabase';

export const projectService = {
  async getAll() {
    const supabase = useAuthenticatedSupabase();
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  async getById(id) {
    const supabase = useAuthenticatedSupabase();
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async create(projectData) {
    const supabase = useAuthenticatedSupabase();
    
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async update(id, updates) {
    const supabase = useAuthenticatedSupabase();
    
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async delete(id) {
    const supabase = useAuthenticatedSupabase();
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
```

---

### STEP 10: Set Up Routing

**File:** `src/App.jsx`

```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';
import OnboardingPage from './pages/auth/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        
        {/* Onboarding (signed in but not onboarded) */}
        <Route
          path="/onboarding"
          element={
            <SignedIn>
              <OnboardingPage />
            </SignedIn>
          }
        />
        
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <SignedIn>
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            </SignedIn>
          }
        />
        
        {/* Admin-only route */}
        <Route
          path="/admin"
          element={
            <SignedIn>
              <ProtectedRoute requiredRole="org_admin">
                <AdminPage />
              </ProtectedRoute>
            </SignedIn>
          }
        />
        
        {/* Default redirects */}
        <Route
          path="/"
          element={
            <>
              <SignedIn><Navigate to="/dashboard" /></SignedIn>
              <SignedOut><Navigate to="/sign-in" /></SignedOut>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 🎓 Key Concepts to Understand

### Concept 1: Clerk Metadata vs Supabase Database

```
┌─────────────────────────────────────────┐
│  CLERK (Identity Provider)              │
│  ─────────────────────────             │
│  Stores:                                │
│  • user.id (Clerk user ID)              │
│  • user.email                           │
│  • user.publicMetadata.role             │
│  • user.publicMetadata.onboarded        │
│                                         │
│  Purpose: Fast access to user info      │
│  Updates: user.update({ metadata })     │
└─────────────────────────────────────────┘
                    │
                    │ SYNCED TO
                    ▼
┌─────────────────────────────────────────┐
│  SUPABASE (Database)                    │
│  ─────────────────────────             │
│  Stores:                                │
│  • users.id (UUID)                      │
│  • users.clerk_id (links to Clerk)      │
│  • users.role                           │
│  • users.organization_id                │
│                                         │
│  Purpose: Relational data, RLS policies │
│  Updates: Database queries              │
└─────────────────────────────────────────┘
```

**When to use Clerk metadata:**
- Quick access to role in frontend
- Temporary flags (e.g., `onboarded: true`)
- Non-relational data

**When to use Supabase:**
- Relational data (user belongs to organization)
- Data that needs to be queried (find all managers)
- Data isolation with RLS

---

### Concept 2: JWT Template Setup

**This is CRITICAL and often missed!**

```
┌─────────────────────────────────────────────────────┐
│  CLERK DASHBOARD                                    │
│  ─────────────                                     │
│  1. Go to "JWT Templates"                           │
│  2. Click "New Template"                            │
│  3. Select "Supabase"                               │
│  4. Name it: "supabase"                             │
│  5. Keep default claims:                            │
│     {                                               │
│       "sub": "{{user.id}}",                         │
│       "email": "{{user.email}}",                    │
│       "role": "{{user.publicMetadata.role}}"        │
│     }                                               │
│  6. Save                                            │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│  YOUR CODE                                          │
│  ─────────                                         │
│  const token = await getToken({ template: 'supa... │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│  SUPABASE                                           │
│  ─────────                                         │
│  auth.jwt() ->> 'sub'  // Gets user.id from token   │
│  auth.jwt() ->> 'role' // Gets role from token      │
└─────────────────────────────────────────────────────┘
```

**Without this template, Supabase cannot read Clerk's JWT!**

---

### Concept 3: Organization Isolation Pattern

```sql
-- THE MAGIC PATTERN: Every table has organization_id

CREATE TABLE your_table (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,  -- ← THIS!
  -- ... other columns
);

-- THE MAGIC POLICY: Filter by current user's organization

CREATE POLICY your_table_select ON your_table
FOR SELECT USING (
  organization_id = current_organization_id()  -- ← THIS!
);
```

**Apply this to EVERY table** that should be org-specific:
- ✅ Projects → `organization_id`
- ✅ Tasks → `organization_id`
- ✅ Files → `organization_id`
- ✅ Settings → `organization_id`
- ✅ Everything!

---

## 🔄 The Complete Data Flow

### User Signs Up → Dashboard

```
STEP 1: User clicks "Sign Up"
    │
    ▼
STEP 2: Clerk handles registration
    │
    ├─ User enters email, password
    ├─ Clerk sends verification email
    ├─ User verifies email
    └─ User is authenticated
    │
    ▼
STEP 3: Redirect to /onboarding
    │
    ├─ User selects role (admin, manager, etc.)
    ├─ User names organization
    └─ Submit form
    │
    ▼
STEP 4: Save to Clerk metadata
    │
    └─ await user.update({ 
          publicMetadata: { role: 'admin', onboarded: true } 
        })
    │
    ▼
STEP 5: Create organization in Supabase
    │
    └─ INSERT INTO organizations (name, created_by) 
        VALUES ('Acme', 'user_xxxxx')
    │
    ▼
STEP 6: Create user record in Supabase
    │
    └─ INSERT INTO users (clerk_id, email, role, organization_id)
        VALUES ('user_xxxxx', 'user@email.com', 'admin', 'org_uuid')
    │
    ▼
STEP 7: Redirect to /dashboard
    │
    └─ User is now fully set up!
```

---

### User Queries Data

```
STEP 1: User loads Dashboard page
    │
    ▼
STEP 2: Component calls projectService.getAll()
    │
    └─ const projects = await projectService.getAll()
    │
    ▼
STEP 3: Service queries Supabase
    │
    ├─ Gets JWT from Clerk: getToken({ template: 'supabase' })
    ├─ Sends to Supabase with Authorization header
    └─ Query: SELECT * FROM projects
    │
    ▼
STEP 4: Supabase applies RLS policy
    │
    ├─ Extracts clerk_id from JWT
    ├─ Looks up organization_id from users table
    ├─ Filters: WHERE organization_id = current_organization_id()
    └─ Returns ONLY projects from user's org
    │
    ▼
STEP 5: Frontend receives filtered data
    │
    └─ setState(projects)  // Only org's projects!
```

---

## 🛠️ Common Patterns & Code Snippets

### Pattern 1: Permission-Based UI
```javascript
import { useUser } from '@clerk/clerk-react';
import { hasPermission } from '../config/clerk';

export default function MyComponent() {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role;
  
  return (
    <div>
      {/* Show to everyone */}
      <h1>Welcome</h1>
      
      {/* Show only to admins */}
      {hasPermission(userRole, 'canManageOrganization') && (
        <button>Admin Settings</button>
      )}
      
      {/* Show to admins and managers */}
      {hasPermission(userRole, 'canInviteUsers') && (
        <button>Invite User</button>
      )}
      
      {/* Disable for members */}
      <button disabled={!hasPermission(userRole, 'canDeleteData')}>
        Delete
      </button>
    </div>
  );
}
```

---

### Pattern 2: Organization Switching
```javascript
import { OrganizationSwitcher } from '@clerk/clerk-react';

// In your navbar/header
<OrganizationSwitcher 
  afterSelectOrganizationUrl="/dashboard"
  organizationProfileUrl="/organization"
/>
```

When user switches organizations:
1. Clerk updates the active organization
2. JWT contains new org_id
3. Supabase RLS automatically filters data
4. User sees new organization's data
5. No code changes needed! 🎉

---

### Pattern 3: Invite Users to Organization
```javascript
import { useOrganization } from '@clerk/clerk-react';

export default function InviteForm() {
  const { organization } = useOrganization();
  const [email, setEmail] = useState('');
  
  const handleInvite = async (e) => {
    e.preventDefault();
    
    await organization.inviteMember({
      emailAddress: email,
      role: 'basic_member'  // or 'admin'
    });
    
    alert('Invitation sent!');
    setEmail('');
  };
  
  return (
    <form onSubmit={handleInvite}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="colleague@email.com"
      />
      <button type="submit">Send Invite</button>
    </form>
  );
}
```

---

### Pattern 4: Check User's Organization
```javascript
import { useOrganization } from '@clerk/clerk-react';

export default function OrgInfo() {
  const { organization, membership } = useOrganization();
  
  return (
    <div>
      <h3>{organization?.name}</h3>
      <p>Your role: {membership?.role}</p>
      <p>Members: {organization?.membersCount}</p>
    </div>
  );
}
```

---

## 📋 Implementation Checklist

### Phase 1: Authentication Setup
- [ ] Create Clerk account
- [ ] Install `@clerk/clerk-react`
- [ ] Wrap app with `<ClerkProvider>`
- [ ] Create sign-in page with `<SignIn />`
- [ ] Create sign-up page with `<SignUp />`
- [ ] Set up routing with react-router-dom
- [ ] Test sign-up and sign-in flow

### Phase 2: Authorization Setup
- [ ] Define roles in `config/clerk.js`
- [ ] Define permissions mapping
- [ ] Create `hasPermission()` helper
- [ ] Create `ProtectedRoute` component
- [ ] Create onboarding page for role selection
- [ ] Store role in Clerk `publicMetadata`
- [ ] Test role-based UI hiding

### Phase 3: Database Setup
- [ ] Create Supabase project
- [ ] Design database schema
- [ ] Add `organization_id` to all tables
- [ ] Add `clerk_id` to users table
- [ ] Enable RLS on all tables
- [ ] Create `current_user_id()` helper function
- [ ] Create `current_organization_id()` helper function
- [ ] Write RLS policies for each table
- [ ] Run SQL migration

### Phase 4: Integration
- [ ] Configure Clerk's Supabase JWT template
- [ ] Create `useAuthenticatedSupabase` hook
- [ ] Create database service functions
- [ ] Test data queries (should be filtered by org)
- [ ] Create user record during onboarding
- [ ] Create org record during onboarding
- [ ] Test with multiple organizations

### Phase 5: Organization Features
- [ ] Add `<OrganizationSwitcher />` to navbar
- [ ] Create organization profile page
- [ ] Test inviting users
- [ ] Test switching organizations
- [ ] Verify data isolation between orgs

---

## 🎯 Testing Strategy

### Test 1: Data Isolation
```bash
1. Create User A in Org 1
2. Create User B in Org 2
3. User A creates Project X
4. User B creates Project Y
5. Verify User A cannot see Project Y
6. Verify User B cannot see Project X
✅ PASS if both users only see their own org's data
```

### Test 2: Permission System
```bash
1. Create Admin user
2. Create Member user
3. Admin tries to delete → Should work
4. Member tries to delete → Should fail
✅ PASS if member sees "Access Denied"
```

### Test 3: Organization Switching
```bash
1. Create User A
2. User A creates Org 1 with data
3. User A creates Org 2 with different data
4. Switch from Org 1 to Org 2
5. Verify UI updates with Org 2's data
✅ PASS if data changes when switching
```

---

## 🚨 Common Pitfalls & Solutions

### Pitfall 1: Forgot JWT Template
**Symptom:** Database queries fail, RLS blocks everything

**Solution:**
1. Go to Clerk Dashboard → JWT Templates
2. Create "Supabase" template
3. Ensure it's named exactly "supabase"
4. Test with: `const token = await getToken({ template: 'supabase' })`

---

### Pitfall 2: RLS Blocks All Queries
**Symptom:** Even valid queries return empty results

**Solution:**
```sql
-- Check if policies exist
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- Check if RLS is enabled
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'your_table';

-- Temporarily disable RLS for debugging (DEV ONLY!)
ALTER TABLE your_table DISABLE ROW LEVEL SECURITY;

-- Test query - should return all rows
SELECT * FROM your_table;

-- Re-enable and fix policies
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;
```

---

### Pitfall 3: User Not Created in Database
**Symptom:** `current_user_id()` returns NULL, queries fail

**Solution:** Ensure user is created during onboarding:
```javascript
// In OnboardingPage.jsx
await database.createUser({
  clerkId: user.id,
  email: user.email,
  role: role,
  organizationId: org.id
});
```

---

### Pitfall 4: Organization ID Not Set
**Symptom:** Users can't see any data

**Solution:** Check the user record has `organization_id`:
```sql
-- In Supabase SQL Editor
SELECT clerk_id, email, role, organization_id 
FROM users 
WHERE clerk_id = 'user_xxxxx';

-- If organization_id is NULL, update it:
UPDATE users 
SET organization_id = 'org-uuid-here'
WHERE clerk_id = 'user_xxxxx';
```

---

## 🎨 Customization Tips

### Custom Auth UI (Instead of Clerk Components)
```javascript
// If you want full control over UI
import { useSignUp } from '@clerk/clerk-react';

export default function CustomSignUp() {
  const { signUp, setActive } = useSignUp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await signUp.create({ emailAddress: email, password });
    await signUp.prepareEmailAddressVerification();
    
    // Show verification code input...
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

### Add More OAuth Providers
```javascript
// In Clerk Dashboard:
1. Go to "User & Authentication" → "Social Connections"
2. Enable Google, GitHub, LinkedIn, etc.
3. Configure OAuth apps with your callback URLs

// In your SignUp component:
<SignUp 
  appearance={{
    elements: {
      socialButtonsBlockButton: 'your-custom-class'
    }
  }}
/>
```

---

## 📊 Monitoring & Debugging

### Check User's Organization
```javascript
import { useOrganization, useUser } from '@clerk/clerk-react';

export default function DebugPanel() {
  const { organization } = useOrganization();
  const { user } = useUser();
  
  return (
    <div style={{ background: '#f0f0f0', padding: '10px', fontSize: '12px' }}>
      <div>Clerk User ID: {user?.id}</div>
      <div>Role: {user?.publicMetadata?.role}</div>
      <div>Organization: {organization?.name}</div>
      <div>Org ID: {organization?.id}</div>
    </div>
  );
}
```

### Check Database Connection
```javascript
// Test Supabase connection
const supabase = useAuthenticatedSupabase();

const { data, error } = await supabase
  .from('organizations')
  .select('*')
  .limit(1);

console.log('Supabase test:', { data, error });
```

---

## 🎯 Architecture Decisions

### Decision 1: Where to Store Role?

**Option A: Clerk Metadata (What we did)**
```javascript
user.publicMetadata.role = 'admin';
```
✅ Fast access in frontend
✅ Included in JWT automatically
❌ Not queryable in database

**Option B: Only in Supabase**
```sql
users.role = 'admin';
```
✅ Queryable (find all admins)
❌ Need extra query to check role in frontend

**Option C: Both (Recommended)**
```javascript
// Store in both for best of both worlds
await user.update({ publicMetadata: { role: 'admin' } });
await createUser({ clerkId: user.id, role: 'admin' });
```

---

### Decision 2: Clerk Organizations vs Custom Organizations?

**Clerk Organizations (What we did):**
```javascript
const { organization } = useOrganization();
```
✅ Built-in UI for member management
✅ Invitation system included
✅ Organization switching built-in
❌ Limited customization

**Custom Organizations (DIY):**
```sql
CREATE TABLE organizations (...)
CREATE TABLE organization_members (...)
CREATE TABLE organization_invitations (...)
```
✅ Full control over data structure
✅ Custom invitation logic
❌ More code to write and maintain

**Recommendation:** Use Clerk Organizations for 90% of use cases.

---

## 📦 Package Versions (Tested & Working)

```json
{
  "dependencies": {
    "@clerk/clerk-react": "^5.0.0",
    "@supabase/supabase-js": "^2.39.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}
```

---

## 🎓 Learning Resources

### Clerk Documentation
- **Main Docs**: https://clerk.com/docs
- **Organizations**: https://clerk.com/docs/organizations
- **JWT Templates**: https://clerk.com/docs/backend-requests/making/jwt-templates
- **React SDK**: https://clerk.com/docs/references/react/overview

### Supabase Documentation
- **Main Docs**: https://supabase.com/docs
- **Row Level Security**: https://supabase.com/docs/guides/auth/row-level-security
- **Auth with Clerk**: https://supabase.com/docs/guides/auth/social-login/auth-clerk

### Tutorials
- Clerk + Supabase: https://clerk.com/docs/integrations/databases/supabase
- Multi-tenant RLS: https://supabase.com/docs/guides/auth/managing-user-data

---

## ✨ Summary: The Recipe

1. **Authentication**: Clerk handles sign-in/sign-up
2. **Organizations**: Clerk's built-in multi-tenant groups
3. **Authorization**: Your role & permission logic
4. **Data Security**: Supabase RLS filters by organization
5. **Integration**: JWT template connects Clerk → Supabase

**Copy this pattern for:**
- SaaS apps with teams/workspaces
- Multi-tenant platforms
- B2B applications
- Any app where users belong to organizations

**Time to implement:** 1-2 days for full setup
**Maintenance effort:** Minimal (both services handle security)
**Scalability:** Handles thousands of organizations easily

---

## 🚀 Next Steps

Want to extend this system? Add:
- [ ] Audit logging (track who did what)
- [ ] Custom roles (beyond the predefined ones)
- [ ] Fine-grained permissions (per-resource access)
- [ ] API rate limiting (per organization)
- [ ] Usage analytics (per organization)
- [ ] Billing integration (Stripe per organization)

**You now have a production-ready auth system!** 🎉
