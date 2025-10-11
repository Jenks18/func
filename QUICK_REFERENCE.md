# 🚀 Quick Reference Card - Authentication System

## 📝 Environment Setup

```bash
# .env file
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhxxxxx
```

## 🎯 Common Code Patterns

### Get Current User
```javascript
import { useCurrentUser } from './hooks/useCurrentUser';

const { user, role, organization, loading } = useCurrentUser();
```

### Query Database
```javascript
import { useAuthenticatedSupabase } from './hooks/useAuthenticatedSupabase';

const { supabase } = useAuthenticatedSupabase();
const { data } = await supabase.from('properties').select('*');
```

### Check Permission
```javascript
import { hasPermission } from './config/clerk';

if (hasPermission(role, 'canCreateProperty')) {
  // Show add button
}
```

### Protect Route
```javascript
import { ProtectedRoute } from './components/auth/ProtectedRoute';

<ProtectedRoute requiredPermission="canViewFinancials">
  <FinancialsPage />
</ProtectedRoute>
```

## 👥 Roles
- `super_admin` - Platform admin
- `org_admin` - Organization admin
- `property_owner` - Property owner
- `manager` - Property manager
- `maintenance` - Maintenance staff
- `tenant` - Tenant/Renter

## 🔑 Key Permissions
- `canCreateProperty`
- `canEditProperty`
- `canDeleteProperty`
- `canViewFinancials`
- `canCreateTenant`
- `canManageOrganization`

## 🗄️ Main Tables
- `organizations` - Companies
- `users` - User accounts
- `properties` - Properties
- `units` - Units
- `tenants` - Tenants
- `leases` - Leases
- `transactions` - Money in/out
- `maintenance_requests` - Tickets

## 📦 UI Components

### User Button
```javascript
import { UserButton } from './components/auth/UserButton';
<UserButton />
```

### Org Switcher
```javascript
import { OrganizationSwitcher } from './components/auth/OrganizationSwitcher';
<OrganizationSwitcher />
```

## 🔐 Security Features
✅ Row Level Security (RLS)  
✅ JWT authentication  
✅ Automatic data filtering  
✅ Organization isolation  
✅ Role-based access  

## 📚 Documentation Files
- `AUTHENTICATION_SETUP.md` - Setup guide
- `AUTHENTICATION_README.md` - Full docs
- `IMPLEMENTATION_COMPLETE.md` - Summary
- `src/examples/AuthenticationExamples.jsx` - Code examples

## 🚨 Troubleshooting

**User not found?**
→ Check onboarding completed

**Permission denied?**
→ Verify user role in database

**Data not showing?**
→ Check organization_id is set

**Sign in fails?**
→ Check Clerk publishable key

## 🎯 Next Steps
1. Get Clerk API keys
2. Get Supabase credentials
3. Run database migration
4. Test sign up/sign in
5. Build your features!

---

**Need help?** Check the full docs! 📖
