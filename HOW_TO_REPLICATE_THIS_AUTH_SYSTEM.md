# 🔐 How to Replicate This Auth System in Any Project

## A Step-by-Step Guide to Building Multi-Tenant Auth with Clerk + Supabase

---

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Tech Stack Choices](#tech-stack-choices)
3. [Step-by-Step Implementation](#step-by-step-implementation)
4. [Core Concepts](#core-concepts)
5. [Code Patterns](#code-patterns)
6. [Deployment Checklist](#deployment-checklist)

---

## 🏗️ Architecture Overview

### The 3-Layer Auth System

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR APPLICATION                         │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 1: AUTHENTICATION (Clerk)                            │
│  ────────────────────────────────────                       │
│  • User sign-up/sign-in                                     │
│  • Email/password, social OAuth, phone verification         │
│  • Session management                                       │
│  • JWT tokens                                               │
│  • Organization management (multi-tenant groups)            │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 2: AUTHORIZATION (Your App Logic)                    │
│  ────────────────────────────────────                       │
│  • Role definitions (admin, manager, user, etc.)            │
│  • Permission mapping (who can do what)                     │
│  • Frontend UI hiding/showing based on role                 │
│  • API route protection                                     │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 3: DATA SECURITY (Supabase RLS)                      │
│  ────────────────────────────────────                       │
│  • Row Level Security policies                              │
│  • Organization-based data isolation                        │
│  • Database-enforced access control                         │
│  • Cannot bypass even if frontend is hacked                 │
└─────────────────────────────────────────────────────────────┘
```

### Why This Stack?

| Service | Purpose | Alternative Options |
|---------|---------|-------------------|
| **Clerk** | Authentication + Organizations | Auth0, Firebase Auth, Supabase Auth |
| **Supabase** | Database + RLS | PostgreSQL, Neon, PlanetScale |
| **React Router** | Client-side routing | Next.js App Router, Remix |
| **Vite** | Build tool | Next.js, Create React App |

---

## 🎯 Tech Stack Choices

### Why Clerk for Authentication?

✅ **Pros:**
- Built-in organization management (multi-tenant out of the box)
- Beautiful pre-built UI components
- Handles email verification, password reset, 2FA
- Social OAuth (Google, GitHub, etc.) with 2 clicks
- Phone verification built-in
- JWT tokens automatically managed
- Free tier: 10,000 monthly active users

❌ **Cons:**
- Monthly cost after free tier
- Less control over auth UI (unless you build custom)
- Vendor lock-in (but data is portable via API)

**When to use Clerk:**
- You need organizations/teams/workspaces
- You want beautiful auth UI fast
- You don't want to manage auth security yourself
- B2B SaaS applications

**Alternatives:**
- **Supabase Auth**: Free, open source, but no built-in organizations
- **Firebase Auth**: Great for Google ecosystem, no organizations
- **Auth0**: More enterprise features, more expensive
- **Roll your own**: Full control, but security is your responsibility

---

### Why Supabase for Database?

✅ **Pros:**
- PostgreSQL (mature, powerful, widely used)
- Row Level Security (RLS) built-in
- Real-time subscriptions
- Auto-generated REST API
- Free tier: 500MB database, 2GB bandwidth
- Great developer experience

❌ **Cons:**
- Learning curve for RLS policies
- Less flexible than raw PostgreSQL for complex queries

**When to use Supabase:**
- You need multi-tenant data isolation
- You want database-level security
- Real-time features are useful
- You like PostgreSQL

**Alternatives:**
- **PlanetScale**: MySQL, great scalability, no RLS
- **Neon**: Serverless PostgreSQL, similar to Supabase
- **MongoDB**: NoSQL, different security model
- **Firebase Firestore**: NoSQL, security rules instead of RLS

---

## 📝 Step-by-Step Implementation

### PHASE 1: Set Up Clerk (Authentication)

#### Step 1.1: Create Clerk Account
```bash
1. Go to https://clerk.com
2. Sign up for free account
3. Create new application
4. Choose authentication methods:
   - ✅ Email/Password
   - ✅ Google OAuth (optional)
   - ✅ Phone verification (optional)
5. Enable Organizations feature (for multi-tenant)
```

#### Step 1.2: Get Your API Keys
```bash
# From Clerk Dashboard > API Keys
PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
SECRET_KEY=sk_test_xxxxxxxxxxxxx
```

#### Step 1.3: Install Clerk in Your Project
```bash
npm install @clerk/clerk-react
```

#### Step 1.4: Wrap Your App with ClerkProvider
```javascript
// main.jsx or index.jsx
import { ClerkProvider } from '@clerk/clerk-react';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
```

#### Step 1.5: Create Auth Pages
```javascript
// pages/auth/SignInPage.jsx
import { SignIn } from '@clerk/clerk-react';

export default function SignInPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
      <SignIn 
        routing="path" 
        path="/sign-in"
        afterSignInUrl="/dashboard"
      />
    </div>
  );
}

// pages/auth/SignUpPage.jsx
import { SignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
      <SignUp 
        routing="path" 
        path="/sign-up"
        afterSignUpUrl="/onboarding"
      />
    </div>
  );
}
```

#### Step 1.6: Set Up Routing
```javascript
// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <SignedIn>
              <DashboardPage />
            </SignedIn>
          }
        />
        
        {/* Default redirect */}
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <Navigate to="/dashboard" />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
```

---

### PHASE 2: Add Role-Based Authorization

#### Step 2.1: Define Your Roles
```javascript
// config/roles.js
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ORG_ADMIN: 'org_admin',
  MANAGER: 'manager',
  MEMBER: 'member',
};

export const PERMISSIONS = {
  canManageOrganization: ['super_admin', 'org_admin'],
  canInviteUsers: ['super_admin', 'org_admin', 'manager'],
  canDeleteData: ['super_admin', 'org_admin'],
  canEditData: ['super_admin', 'org_admin', 'manager'],
  canViewData: ['super_admin', 'org_admin', 'manager', 'member'],
};

export function hasPermission(userRole, permission) {
  return PERMISSIONS[permission]?.includes(userRole) || false;
}
```

#### Step 2.2: Create Onboarding Flow
```javascript
// pages/auth/OnboardingPage.jsx
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export default function OnboardingPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [orgName, setOrgName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Save role to Clerk user metadata
    await user.update({
      publicMetadata: {
        role: role,
        onboarded: true
      }
    });
    
    // Create organization in your database (see Phase 3)
    await createOrganization({ name: orgName, createdBy: user.id });
    
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Welcome! Let's get you set up</h2>
      
      <label>What's your role?</label>
      <select value={role} onChange={(e) => setRole(e.target.value)} required>
        <option value="">Select role</option>
        <option value="org_admin">Admin</option>
        <option value="manager">Manager</option>
        <option value="member">Member</option>
      </select>
      
      <label>Organization Name</label>
      <input 
        value={orgName} 
        onChange={(e) => setOrgName(e.target.value)}
        placeholder="Acme Corp"
        required
      />
      
      <button type="submit">Get Started</button>
    </form>
  );
}
```

#### Step 2.3: Create Protected Route Component
```javascript
// components/auth/ProtectedRoute.jsx
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { hasPermission } from '../../config/roles';

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  requiredPermission 
}) {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  
  if (!isLoaded) return <div>Loading...</div>;
  if (!userId) return <Navigate to="/sign-in" />;
  
  const userRole = user?.publicMetadata?.role;
  
  // Check role
  if (requiredRole && userRole !== requiredRole) {
    return <div>Access Denied</div>;
  }
  
  // Check permission
  if (requiredPermission && !hasPermission(userRole, requiredPermission)) {
    return <div>Access Denied</div>;
  }
  
  return children;
}
```

#### Step 2.4: Use Protected Routes
```javascript
// App.jsx
<Route
  path="/admin"
  element={
    <ProtectedRoute requiredRole="org_admin">
      <AdminPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/settings"
  element={
    <ProtectedRoute requiredPermission="canManageOrganization">
      <SettingsPage />
    </ProtectedRoute>
  }
/>
```

---

### PHASE 3: Set Up Supabase (Database + RLS)

#### Step 3.1: Create Supabase Project
```bash
1. Go to https://supabase.com
2. Create new project
3. Wait for database to provision (~2 minutes)
4. Get your credentials:
   - Project URL: https://xxxxx.supabase.co
   - Anon/Public Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Step 3.2: Install Supabase Client
```bash
npm install @supabase/supabase-js
```

#### Step 3.3: Create Supabase Client
```javascript
// services/supabase.js
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@clerk/clerk-react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a hook to get authenticated Supabase client
export function useAuthenticatedSupabase() {
  const { getToken } = useAuth();
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: async () => {
        const token = await getToken({ template: 'supabase' });
        return token ? { Authorization: `Bearer ${token}` } : {};
      }
    }
  });
  
  return supabase;
}
```

#### Step 3.4: Design Your Database Schema
```sql
-- Step 1: Create Organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_by TEXT NOT NULL, -- Clerk user ID
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Create Users table (synced from Clerk)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Create your business tables
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_projects_organization_id ON projects(organization_id);
```

#### Step 3.5: Enable Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create helper functions to get current user info from JWT
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS UUID AS $$
  SELECT id FROM users WHERE clerk_id = (auth.jwt() ->> 'sub')::text;
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM users WHERE clerk_id = (auth.jwt() ->> 'sub')::text;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Organizations: Users can only see their own organization
CREATE POLICY org_select ON organizations
FOR SELECT USING (
  id = current_organization_id()
);

-- Users: Can see themselves and users in their organization
CREATE POLICY users_select ON users
FOR SELECT USING (
  clerk_id = (auth.jwt() ->> 'sub')::text OR
  organization_id = current_organization_id()
);

-- Projects: Can only see projects from their organization
CREATE POLICY projects_select ON projects
FOR SELECT USING (
  organization_id = current_organization_id()
);

-- Projects: Can only insert into their organization
CREATE POLICY projects_insert ON projects
FOR INSERT WITH CHECK (
  organization_id = current_organization_id()
);

-- Projects: Can only update their organization's projects
CREATE POLICY projects_update ON projects
FOR UPDATE USING (
  organization_id = current_organization_id()
);
```

---

### PHASE 4: Connect Frontend to Database

#### Step 4.1: Create Service Layer
```javascript
// services/projectService.js
import { useAuthenticatedSupabase } from './supabase';

export async function getAllProjects() {
  const supabase = useAuthenticatedSupabase();
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function createProject(projectData) {
  const supabase = useAuthenticatedSupabase();
  
  const { data, error } = await supabase
    .from('projects')
    .insert([projectData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateProject(id, updates) {
  const supabase = useAuthenticatedSupabase();
  
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteProject(id) {
  const supabase = useAuthenticatedSupabase();
  
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}
```

#### Step 4.2: Use in Components
```javascript
// pages/ProjectsPage.jsx
import { useState, useEffect } from 'react';
import { getAllProjects, createProject } from '../services/projectService';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getAllProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProjects();
  }, []);

  const handleCreate = async (projectName) => {
    await createProject({ name: projectName });
    // Refresh projects
    const data = await getAllProjects();
    setProjects(data);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Projects</h1>
      {projects.map(project => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>
  );
}
```

---

## 🎯 Core Concepts Explained

### 1. JWT Token Flow

```
USER LOGS IN
    │
    ▼
CLERK CREATES JWT TOKEN
    │
    ├─ Contains: user_id, email, org_id, etc.
    ├─ Signed with secret key
    └─ Expires after X hours
    │
    ▼
FRONTEND STORES TOKEN
    │
    ├─ Automatically stored in cookies by Clerk
    └─ Sent with every API request
    │
    ▼
SUPABASE RECEIVES REQUEST
    │
    ├─ Extracts JWT from headers
    ├─ Verifies signature with Clerk public key
    ├─ Extracts user_id from token
    └─ Runs RLS policies with user_id
    │
    ▼
DATABASE RETURNS FILTERED DATA
    │
    └─ Only data user has access to
```

### 2. Organization Isolation

```
DATABASE STATE:
┌─────────────────────────────────────────────┐
│  PROJECTS TABLE                             │
├─────┬────────────┬────────────────┬─────────┤
│ id  │ name       │ organization_id │ data   │
├─────┼────────────┼────────────────┼─────────┤
│ 1   │ Project A  │ org-123        │ ...    │
│ 2   │ Project B  │ org-123        │ ...    │
│ 3   │ Project C  │ org-456        │ ...    │
└─────┴────────────┴────────────────┴─────────┘

USER FROM ORG-123 QUERIES:
SELECT * FROM projects;

RLS POLICY AUTOMATICALLY ADDS:
WHERE organization_id = current_organization_id()

RESULT: User only sees Project A and B
🛡️ Project C is invisible to them
```

### 3. Permission Checking

```javascript
// PATTERN: Check permission before showing UI

const userRole = user?.publicMetadata?.role;

// Option 1: Conditional rendering
{hasPermission(userRole, 'canDeleteData') && (
  <button onClick={handleDelete}>Delete</button>
)}

// Option 2: Disable button
<button 
  onClick={handleDelete}
  disabled={!hasPermission(userRole, 'canDeleteData')}
>
  Delete
</button>

// Option 3: Show different UI
{hasPermission(userRole, 'canManageOrganization') ? (
  <AdminPanel />
) : (
  <ReadOnlyView />
)}
```

---

## 📦 Code Patterns to Reuse

### Pattern 1: Environment Variables
```bash
# .env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Pattern 2: User Info Hook
```javascript
// hooks/useCurrentUser.js
import { useUser } from '@clerk/clerk-react';

export function useCurrentUser() {
  const { user, isLoaded } = useUser();
  
  return {
    user,
    loading: !isLoaded,
    role: user?.publicMetadata?.role,
    organizationId: user?.publicMetadata?.organizationId,
    isAdmin: user?.publicMetadata?.role === 'org_admin',
  };
}
```

### Pattern 3: Database Service Template
```javascript
// services/baseService.js
export function createCRUDService(tableName) {
  return {
    async getAll() {
      const { data, error } = await supabase
        .from(tableName)
        .select('*');
      if (error) throw error;
      return data;
    },
    
    async getById(id) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    
    async create(item) {
      const { data, error } = await supabase
        .from(tableName)
        .insert([item])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    
    async update(id, updates) {
      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    
    async delete(id) {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      if (error) throw error;
    }
  };
}

// Usage:
const projectService = createCRUDService('projects');
const userService = createCRUDService('users');
```

---

## ✅ Deployment Checklist

### Pre-Deployment

- [ ] Environment variables set in production
- [ ] Clerk production keys configured
- [ ] Supabase production database created
- [ ] Database migrations run on production
- [ ] RLS policies tested and enabled
- [ ] Rate limiting configured (Supabase dashboard)
- [ ] CORS settings configured for your domain
- [ ] Error logging set up (Sentry, LogRocket, etc.)

### Security Checklist

- [ ] All database tables have RLS enabled
- [ ] No sensitive data in client-side code
- [ ] API keys are in environment variables, not hardcoded
- [ ] User input is validated before database insertion
- [ ] SQL injection prevention (using Supabase client, not raw SQL)
- [ ] Permission checks on all sensitive actions
- [ ] HTTPS enabled on production domain
- [ ] CSRF protection (Clerk handles this)

### Testing Checklist

- [ ] Test as each role (admin, manager, member)
- [ ] Verify users in Org A cannot see Org B's data
- [ ] Test permission boundaries (member trying admin actions)
- [ ] Test with expired JWT token
- [ ] Test organization switching
- [ ] Test invitation flow
- [ ] Load test with realistic data volume

---

## 🚀 Quick Start Template

```javascript
// main.jsx
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);

// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route path="/onboarding" element={<SignedIn><OnboardingPage /></SignedIn>} />
        <Route path="/dashboard" element={<SignedIn><DashboardPage /></SignedIn>} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

// services/supabase.js
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@clerk/clerk-react';

export function useAuthenticatedSupabase() {
  const { getToken } = useAuth();
  return createClient(
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
}
```

---

## 📚 Summary: The Golden Path

1. **Set up Clerk** → Handle authentication & organizations
2. **Define roles** → Map permissions to roles in your app
3. **Create onboarding** → Collect role during signup
4. **Set up Supabase** → Create database with proper schema
5. **Enable RLS** → Write policies for each table
6. **Connect frontend** → Use hooks to fetch/update data
7. **Add permission checks** → Hide/show UI based on role
8. **Test thoroughly** → Verify isolation between organizations
9. **Deploy** → Use production keys and enable security features

**You now have:**
- ✅ Multi-tenant authentication
- ✅ Organization management
- ✅ Role-based access control
- ✅ Database-level security
- ✅ Scalable architecture

**Copy this pattern for any SaaS project!** 🎉
