# Multi-Tenant RBAC System - Quick Reference

## What You Now Have

### 1. **Core Files Created**

```
src/
├── contexts/
│   └── AuthContext.jsx          ← Main auth logic & role management
├── components/
│   ├── auth/
│   │   └── RBAC.jsx            ← React components for access control
│   └── RoleSwitcher.jsx        ← Testing tool (dev only)
├── utils/
│   └── rbac.js                 ← Helper functions for data filtering
├── RBAC_GUIDE.md               ← Complete documentation
└── RBAC_INTEGRATION_EXAMPLE.jsx ← Integration guide
```

### 2. **6 User Roles**

| Role | Access Level | Use Case |
|------|--------------|----------|
| **Super Admin** | All tenants, all features | System administrator |
| **Property Manager** | Full management within tenant | Day-to-day operations |
| **Accountant** | Financial data only | Bookkeeping |
| **Maintenance** | Maintenance requests only | Repair staff |
| **Tenant** | Own data only | Property tenants |
| **Viewer** | Read-only access | Stakeholders |

### 3. **Key Features**

✅ **Multi-tenancy** - Separate data between organizations  
✅ **Role-based permissions** - Granular access control  
✅ **Permission guards** - Hide/show UI based on permissions  
✅ **Data filtering** - Automatic tenant isolation  
✅ **Feature flags** - Enable features per role/tenant  
✅ **Mock authentication** - Ready for testing  

## Quick Start (3 Steps)

### Step 1: Wrap Your App with AuthProvider

```jsx
// src/main.jsx
import { AuthProvider } from './contexts/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
```

### Step 2: Add Role Switcher to Your App (for testing)

```jsx
// src/App.jsx
import RoleSwitcher from './components/RoleSwitcher';

function App() {
  return (
    <div>
      {/* Your app content */}
      <RoleSwitcher /> {/* Bottom-right corner */}
    </div>
  );
}
```

### Step 3: Test Different Roles

1. Run your app: `npm run dev`
2. Click the role switcher button (bottom-right)
3. Select different roles to see how the UI changes
4. Notice how menu items and permissions change

## Common Use Cases

### Hide/Show Menu Items by Role

```jsx
import { useAuth } from './contexts/AuthContext';
import { getMenuItemsForUser } from './utils/rbac';

const { currentUser } = useAuth();
const menuItems = getMenuItemsForUser(currentUser);

// menuItems is already filtered based on role!
menuItems.map(item => <MenuItem {...item} />)
```

### Show Content Only with Permission

```jsx
import { PermissionGuard } from './components/auth/RBAC';
import { PERMISSIONS } from './contexts/AuthContext';

<PermissionGuard permission={PERMISSIONS.CREATE_PROPERTY}>
  <button>Add Property</button>
</PermissionGuard>
```

### Show Message When No Permission

```jsx
<PermissionGuard permission={PERMISSIONS.VIEW_INCOME} showMessage>
  <IncomeChart />
</PermissionGuard>
// Shows "No permission" message if user can't access
```

### Disable Button Without Permission

```jsx
import { ConditionalButton } from './components/auth/RBAC';

<ConditionalButton 
  permission={PERMISSIONS.DELETE_PROPERTY}
  onClick={handleDelete}
>
  Delete
</ConditionalButton>
// Button is automatically disabled if no permission
```

### Filter Data by Tenant

```jsx
import { filterByRole } from './utils/rbac';
import { useAuth } from './contexts/AuthContext';

const { currentUser } = useAuth();
const allProperties = [...]; // All properties from API

// Automatically filters by tenant and role
const visibleProperties = filterByRole(allProperties, currentUser, 'property');
```

### Check Permission in Code

```jsx
import { useAuth } from './contexts/AuthContext';

const { hasPermission, PERMISSIONS } = useAuth();

if (hasPermission(PERMISSIONS.EDIT_PROPERTY)) {
  // Show edit button
}
```

## Test Users (Built-in)

Switch roles using the RoleSwitcher or use these for login:

| Email | Role | What You'll See |
|-------|------|-----------------|
| `admin@example.com` | Super Admin | Everything, all tenants |
| `manager@example.com` | Property Manager | Full management UI |
| `accountant@example.com` | Accountant | Financial pages only |
| `maintenance@example.com` | Maintenance | Maintenance pages only |
| `tenant@example.com` | Tenant | Limited view |

## What Each Role Sees

### Super Admin
- ✅ Dashboard, Properties, Tenants, Applications, Leases, Income, Expenses, Maintenance, Messaging, Listings
- ✅ Can switch between tenants
- ✅ Can create/edit/delete everything

### Property Manager
- ✅ Dashboard, Properties, Tenants, Applications, Leases, Maintenance, Messaging, Listings
- ✅ Can view income/expenses (read-only)
- ✅ Can manage properties and tenants

### Accountant
- ✅ Dashboard, Properties (view), Tenants (view), Leases (view)
- ✅ Income, Expenses (full access)
- ❌ Cannot create properties or manage maintenance

### Maintenance
- ✅ Dashboard, Properties (view)
- ✅ Maintenance (full access)
- ❌ Cannot see financials or tenant details

### Tenant
- ✅ Dashboard (own stats)
- ✅ Leases (own lease only)
- ✅ Maintenance (can create requests)
- ❌ Cannot see other tenants or financials

### Viewer
- ✅ Can view all pages
- ❌ Cannot create, edit, or delete anything

## Visual Example

```
Without Permission:
┌─────────────────────────┐
│ [Button Hidden]         │
└─────────────────────────┘

With PermissionGuard:
┌─────────────────────────┐
│ 🔒 No permission        │
│ You can't view this     │
└─────────────────────────┘

With Permission:
┌─────────────────────────┐
│ ✅ [Add Property]       │
│ Your content here...    │
└─────────────────────────┘
```

## Integration Checklist

- [ ] Wrap app in `<AuthProvider>` (main.jsx)
- [ ] Add `<RoleSwitcher />` to App.jsx
- [ ] Import `useAuth` hook where needed
- [ ] Filter menu items with `getMenuItemsForUser()`
- [ ] Wrap sensitive content in `<PermissionGuard>`
- [ ] Use `<ConditionalButton>` for actions
- [ ] Filter data with `filterByRole()` or `filterByTenant()`
- [ ] Test all roles using the switcher
- [ ] Remove `<RoleSwitcher>` before production

## Next Steps for Production

1. **Replace mock auth with real authentication**
   - Integrate with Firebase, Auth0, or your backend
   - Store JWT tokens
   - Add login/logout pages

2. **Connect to database**
   - Add `tenant_id` column to all tables
   - Implement row-level security
   - Filter queries by tenant

3. **Add user management**
   - Create admin panel
   - Allow role assignment
   - Invite users to organization

4. **Implement audit logging**
   - Track who does what
   - Log permission changes
   - Monitor security events

5. **Add API security**
   - Verify tenant ID on every request
   - Check permissions server-side
   - Implement rate limiting

## Troubleshooting

**Menu items not filtering?**
- Make sure you wrapped app in `<AuthProvider>`
- Check `currentUser` is not null
- Verify `getMenuItemsForUser(currentUser)` is called

**Permission guards not working?**
- Import from `./components/auth/RBAC`
- Use correct permission constant
- Check user has permissions array

**Data showing from other tenants?**
- Use `filterByTenant()` or `filterByRole()`
- Verify `tenantId` is set on data objects
- Check user's `tenantId` matches

**Role switcher not appearing?**
- Make sure `<RoleSwitcher />` is in your JSX
- Check it's not hidden by z-index
- Verify AuthContext is providing currentUser

## Documentation Files

- **`RBAC_GUIDE.md`** - Complete documentation with examples
- **`RBAC_INTEGRATION_EXAMPLE.jsx`** - Full integration example
- **This file** - Quick reference

## Support & Resources

All code is documented with JSDoc comments. Key files:
- `src/contexts/AuthContext.jsx` - Start here
- `src/components/auth/RBAC.jsx` - React components
- `src/utils/rbac.js` - Utility functions

## Remember

⚠️ **Client-side checks are for UX only!**  
Always validate permissions on your backend/API.

🎨 **The blue theme is maintained throughout**  
All RBAC components use your app's blue color palette.

🔄 **This is a foundation**  
Extend and customize based on your needs.
