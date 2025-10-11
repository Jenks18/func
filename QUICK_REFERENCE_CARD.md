# 🎯 Auth System Quick Reference Card

## Copy-Paste This For Your Next Project

---

## 📦 1. Install Dependencies (1 minute)

```bash
npm install @clerk/clerk-react @supabase/supabase-js react-router-dom
```

---

## 🔑 2. Set Environment Variables (2 minutes)

```bash
# .env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Get keys from:
- Clerk: https://dashboard.clerk.com
- Supabase: https://app.supabase.com

---

## ⚙️ 3. Configure Clerk JWT Template (CRITICAL!)

```
1. Go to Clerk Dashboard → JWT Templates
2. Click "New Template" → Choose "Supabase"
3. Name it exactly: "supabase"
4. Save
```

**Without this, nothing will work!**

---

## 🎨 4. Wrap App with ClerkProvider (2 minutes)

```javascript
// main.jsx
import { ClerkProvider } from '@clerk/clerk-react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
```

---

## 🗂️ 5. Define Roles & Permissions (5 minutes)

```javascript
// config/clerk.js
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

---

## 🔐 6. Create Supabase Hook (3 minutes)

```javascript
// hooks/useAuthenticatedSupabase.js
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

## 🗄️ 7. Create Database Schema (10 minutes)

```sql
-- Run in Supabase SQL Editor

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- YOUR DATA TABLES (example)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS UUID AS $$
  SELECT id FROM users WHERE clerk_id = (auth.jwt() ->> 'sub')::text;
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM users WHERE clerk_id = (auth.jwt() ->> 'sub')::text;
$$ LANGUAGE SQL SECURITY DEFINER;

-- RLS POLICIES
CREATE POLICY org_select ON organizations
FOR SELECT USING (id = current_organization_id());

CREATE POLICY users_select ON users
FOR SELECT USING (
  clerk_id = (auth.jwt() ->> 'sub')::text OR
  organization_id = current_organization_id()
);

CREATE POLICY projects_select ON projects
FOR SELECT USING (organization_id = current_organization_id());

CREATE POLICY projects_insert ON projects
FOR INSERT WITH CHECK (organization_id = current_organization_id());

CREATE POLICY projects_update ON projects
FOR UPDATE USING (organization_id = current_organization_id());

CREATE POLICY projects_delete ON projects
FOR DELETE USING (organization_id = current_organization_id());
```

---

## 🛣️ 8. Set Up Routing (10 minutes)

```javascript
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
        <Route path="/" element={<><SignedIn><Navigate to="/dashboard" /></SignedIn><SignedOut><Navigate to="/sign-in" /></SignedOut></>} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 📄 9. Create Auth Pages (5 minutes each)

```javascript
// pages/auth/SignInPage.jsx
import { SignIn } from '@clerk/clerk-react';
export default function SignInPage() {
  return <div style={{display:'flex',justifyContent:'center',padding:'40px'}}><SignIn routing="path" path="/sign-in" afterSignInUrl="/dashboard" /></div>;
}

// pages/auth/SignUpPage.jsx
import { SignUp } from '@clerk/clerk-react';
export default function SignUpPage() {
  return <div style={{display:'flex',justifyContent:'center',padding:'40px'}}><SignUp routing="path" path="/sign-up" afterSignUpUrl="/onboarding" /></div>;
}
```

---

## 🎬 10. Create Onboarding Page (15 minutes)

```javascript
// pages/auth/OnboardingPage.jsx
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../../config/clerk';

export default function OnboardingPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [orgName, setOrgName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Save role to Clerk
    await user.update({
      publicMetadata: { role, onboarded: true }
    });
    
    // 2. Create org in Supabase
    const supabase = useAuthenticatedSupabase();
    const { data: org } = await supabase
      .from('organizations')
      .insert([{ name: orgName, created_by: user.id }])
      .select()
      .single();
    
    // 3. Create user in Supabase
    await supabase
      .from('users')
      .insert([{
        clerk_id: user.id,
        email: user.primaryEmailAddress.emailAddress,
        role: role,
        organization_id: org.id
      }]);
    
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={role} onChange={(e) => setRole(e.target.value)} required>
        <option value="">Select role</option>
        <option value={ROLES.ORG_ADMIN}>Admin</option>
        <option value={ROLES.MANAGER}>Manager</option>
        <option value={ROLES.MEMBER}>Member</option>
      </select>
      <input value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Organization name" required />
      <button type="submit">Get Started</button>
    </form>
  );
}
```

---

## 🛡️ 11. Create Protected Route (10 minutes)

```javascript
// components/auth/ProtectedRoute.jsx
import { useAuth, useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { hasPermission } from '../../config/clerk';

export default function ProtectedRoute({ children, requiredRole, requiredPermission }) {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  
  if (!isLoaded) return <div>Loading...</div>;
  if (!userId) return <Navigate to="/sign-in" />;
  
  const userRole = user?.publicMetadata?.role;
  
  if (requiredRole && userRole !== requiredRole) {
    return <div>Access Denied</div>;
  }
  
  if (requiredPermission && !hasPermission(userRole, requiredPermission)) {
    return <div>Access Denied</div>;
  }
  
  return children;
}
```

---

## 💾 12. Create Data Service (10 minutes)

```javascript
// services/projectService.js
import { useAuthenticatedSupabase } from '../hooks/useAuthenticatedSupabase';

export const projectService = {
  async getAll() {
    const supabase = useAuthenticatedSupabase();
    const { data, error } = await supabase.from('projects').select('*');
    if (error) throw error;
    return data;
  },
  
  async create(project) {
    const supabase = useAuthenticatedSupabase();
    const { data, error } = await supabase.from('projects').insert([project]).select().single();
    if (error) throw error;
    return data;
  },
  
  async update(id, updates) {
    const supabase = useAuthenticatedSupabase();
    const { data, error } = await supabase.from('projects').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  
  async delete(id) {
    const supabase = useAuthenticatedSupabase();
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  }
};
```

---

## ✅ Testing Checklist

```bash
# Test 1: Sign Up & Onboarding
[ ] User can sign up
[ ] User is redirected to onboarding
[ ] Role is saved to Clerk metadata
[ ] Organization is created in database
[ ] User record is created in database
[ ] User is redirected to dashboard

# Test 2: Data Isolation
[ ] Create 2 users in different organizations
[ ] Each user creates data
[ ] User A cannot see User B's data
[ ] User B cannot see User A's data

# Test 3: Permissions
[ ] Admin can delete (hasPermission works)
[ ] Member cannot delete (blocked by permission check)
[ ] Protected route blocks unauthorized users

# Test 4: Organization Features
[ ] OrganizationSwitcher shows current org
[ ] Can invite new members
[ ] Can switch between organizations
[ ] Data updates when switching orgs
```

---

## 🐛 Common Issues & Fixes

### Issue: "RLS blocks all queries"
```sql
-- Check if user exists in database
SELECT * FROM users WHERE clerk_id = 'user_xxxxx';

-- If missing, create user during onboarding
```

### Issue: "JWT token not working"
```
1. Verify JWT template exists in Clerk
2. Verify template is named "supabase"
3. Test: const token = await getToken({ template: 'supabase' })
4. Check token is not null
```

### Issue: "Cannot see other org members"
```sql
-- Verify RLS policy allows viewing org members
CREATE POLICY users_select ON users
FOR SELECT USING (
  organization_id = current_organization_id()
);
```

---

## 🎨 Usage Patterns

### Hide UI Based on Permission
```javascript
const { user } = useUser();
const userRole = user?.publicMetadata?.role;

{hasPermission(userRole, 'canDeleteData') && (
  <button onClick={handleDelete}>Delete</button>
)}
```

### Protect Entire Route
```javascript
<Route
  path="/admin"
  element={
    <ProtectedRoute requiredRole="org_admin">
      <AdminPage />
    </ProtectedRoute>
  }
/>
```

### Get Current Organization
```javascript
import { useOrganization } from '@clerk/clerk-react';

const { organization } = useOrganization();
console.log(organization.name); // "Acme Corp"
```

---

## ⏱️ Time Estimates

| Task | Time |
|------|------|
| Install dependencies | 1 min |
| Environment variables | 2 min |
| ClerkProvider setup | 2 min |
| Roles & permissions | 5 min |
| Supabase hook | 3 min |
| Database schema | 10 min |
| Auth pages | 10 min |
| Onboarding page | 15 min |
| Protected route | 10 min |
| Data service | 10 min |
| **TOTAL** | **~1-2 hours** |

---

## 📚 Full Documentation

For detailed explanations, see:
- `HOW_TO_REPLICATE_THIS_AUTH_SYSTEM.md` - Complete guide
- `AUTH_IMPLEMENTATION_GUIDE.md` - Step-by-step with code
- `AUTH_AND_PERMISSIONS_SYSTEM.md` - Technical deep dive
- `ORG_MANAGEMENT_VISUAL_GUIDE.md` - Visual diagrams

---

## 🚀 Deploy Checklist

- [ ] Set production env variables in hosting platform
- [ ] Use Clerk production keys
- [ ] Use Supabase production database
- [ ] Run database migrations on production
- [ ] Enable RLS on all tables
- [ ] Test with production data
- [ ] Set up error monitoring (Sentry)
- [ ] Enable rate limiting

---

## 💡 Key Concepts

1. **Clerk** = Authentication (who are you?)
2. **Your App** = Authorization (what can you do?)
3. **Supabase RLS** = Data Security (what can you see?)

**The Magic:**
- User logs in → Clerk creates JWT
- JWT includes user_id and org_id
- Every database query automatically filtered by org_id
- No way to see other organization's data!

---

## ✨ You're Done!

**You now have:**
- ✅ Multi-tenant authentication
- ✅ Organization management
- ✅ Role-based permissions
- ✅ Database-level security
- ✅ Scalable architecture

**Copy this for every SaaS project!** 🎉

**Questions? Check the full guides in this repo.**
