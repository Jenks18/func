# ✅ RBAC Integration Checklist

Use this checklist to integrate the RBAC system into your JumbaJot app.

## Phase 1: Basic Setup (5 minutes)

### Step 1: Wrap App with AuthProvider

- [ ] Open `src/main.jsx`
- [ ] Import AuthProvider
  ```jsx
  import { AuthProvider } from './contexts/AuthContext';
  ```
- [ ] Wrap your `<App />` component
  ```jsx
  <AuthProvider>
    <App />
  </AuthProvider>
  ```
- [ ] Save and verify no errors

### Step 2: Add Role Switcher for Testing

- [ ] Open `src/App.jsx` (or `src/AppMobile.jsx`)
- [ ] Import RoleSwitcher
  ```jsx
  import RoleSwitcher from './components/RoleSwitcher';
  ```
- [ ] Add at the bottom of your JSX (before closing div)
  ```jsx
  <RoleSwitcher />
  ```
- [ ] Save and check bottom-right corner of your app

### Step 3: Test the System

- [ ] Run `npm run dev`
- [ ] Look for blue button in bottom-right corner
- [ ] Click it to open role switcher
- [ ] Try switching to "Property Manager"
- [ ] Try switching to "Tenant"
- [ ] Try switching to "Accountant"
- [ ] Verify the button changes to show current role

**✨ If you can see and switch roles, basic setup is complete!**

---

## Phase 2: Filter Menu Items (10 minutes)

### Step 4: Import Required Functions

- [ ] Open `src/App.jsx`
- [ ] Add imports at the top
  ```jsx
  import { useAuth } from './contexts/AuthContext';
  import { getMenuItemsForUser } from './utils/rbac';
  ```

### Step 5: Get Current User

- [ ] Inside your `App` component, add
  ```jsx
  const { currentUser } = useAuth();
  ```

### Step 6: Filter Menu Items

- [ ] Find where you define `menuItems` (around line 22)
- [ ] Replace static menu items with
  ```jsx
  const menuItems = getMenuItemsForUser(currentUser);
  ```
- [ ] Remove the hardcoded array of menu items

### Step 7: Test Menu Filtering

- [ ] Save and refresh
- [ ] Switch to "Super Admin" role
  - [ ] Verify you see all menu items
- [ ] Switch to "Accountant" role
  - [ ] Verify you only see Dashboard, Properties, Tenants, Leases, Income, Expenses
  - [ ] Verify you DON'T see Applications, Maintenance, Messaging, Listings
- [ ] Switch to "Tenant" role
  - [ ] Verify you only see Dashboard, Leases, Maintenance
- [ ] Switch to "Maintenance" role
  - [ ] Verify you only see Dashboard, Properties, Maintenance

**✨ If menu items change based on role, filtering is working!**

---

## Phase 3: Add Permission Guards (15 minutes)

### Step 8: Import Permission Components

- [ ] In your page files, add
  ```jsx
  import { PermissionGuard, ConditionalButton } from './components/auth/RBAC';
  import { PERMISSIONS } from './contexts/AuthContext';
  ```

### Step 9: Protect Create Buttons

- [ ] Find "Add Property" button in PropertiesPage
- [ ] Wrap it with
  ```jsx
  <PermissionGuard permission={PERMISSIONS.CREATE_PROPERTY}>
    <button>Add Property</button>
  </PermissionGuard>
  ```
- [ ] Repeat for other create buttons

### Step 10: Protect Edit/Delete Buttons

- [ ] Use ConditionalButton for actions
  ```jsx
  <ConditionalButton 
    permission={PERMISSIONS.EDIT_PROPERTY}
    onClick={handleEdit}
  >
    Edit
  </ConditionalButton>
  ```

### Step 11: Protect Entire Sections

- [ ] For entire sections (like financial data)
  ```jsx
  <PermissionGuard 
    permission={PERMISSIONS.VIEW_INCOME} 
    showMessage
  >
    <IncomeSection />
  </PermissionGuard>
  ```

### Step 12: Test Permission Guards

- [ ] Switch to "Property Manager"
  - [ ] Verify you CAN see create property button
  - [ ] Verify you CAN see edit buttons
- [ ] Switch to "Viewer"
  - [ ] Verify create/edit buttons are gone or disabled
  - [ ] Verify you can still view data
- [ ] Switch to "Tenant"
  - [ ] Verify you only see limited content

**✨ If buttons hide/disable based on role, guards are working!**

---

## Phase 4: Add User Info Display (5 minutes)

### Step 13: Add User Info to Sidebar/Header

- [ ] Import UserInfo component
  ```jsx
  import { UserInfo } from './components/auth/RBAC';
  ```
- [ ] Add to your sidebar or header
  ```jsx
  <UserInfo style={{ marginTop: '16px' }} />
  ```

### Step 14: Add Tenant Name Display

- [ ] In your header/navbar, add
  ```jsx
  {currentUser?.tenantName && (
    <div style={{ 
      padding: '6px 12px',
      background: '#f0f9ff',
      border: '1px solid #bfdbfe',
      borderRadius: '6px',
      color: '#1e40af'
    }}>
      {currentUser.tenantName}
    </div>
  )}
  ```

### Step 15: Test User Display

- [ ] Verify you see current user's name
- [ ] Verify you see current user's email
- [ ] Verify you see current role
- [ ] Verify you see organization name
- [ ] Switch roles and verify info updates

**✨ If user info displays and updates, display is working!**

---

## Phase 5: Data Filtering (20 minutes)

### Step 16: Import Filtering Functions

- [ ] In your data service or page components
  ```jsx
  import { filterByTenant, filterByRole } from './utils/rbac';
  import { useAuth } from './contexts/AuthContext';
  ```

### Step 17: Filter Properties Data

- [ ] In PropertiesPage, after fetching data
  ```jsx
  const { currentUser } = useAuth();
  const allProperties = [...]; // from API/database
  const visibleProperties = filterByRole(allProperties, currentUser, 'property');
  ```

### Step 18: Filter Tenants Data

- [ ] In TenantsPage
  ```jsx
  const visibleTenants = filterByRole(allTenants, currentUser, 'tenant');
  ```

### Step 19: Add Tenant ID to Mock Data

- [ ] In your mock data, add tenantId field
  ```jsx
  const mockProperties = [
    { id: 1, name: 'Property 1', tenantId: 'tenant_1', ... },
    { id: 2, name: 'Property 2', tenantId: 'tenant_2', ... },
  ];
  ```

### Step 20: Test Data Filtering

- [ ] Add some mock data with different tenant IDs
- [ ] Switch to "Super Admin"
  - [ ] Verify you see ALL data
- [ ] Switch to "Property Manager"
  - [ ] Verify you only see tenant_1 data
- [ ] Switch to "Tenant"
  - [ ] Verify you only see your own data

**✨ If data filters based on role and tenant, filtering is working!**

---

## Phase 6: Advanced Features (Optional)

### Step 21: Add Role-Based Dashboard

- [ ] Import dashboard utility
  ```jsx
  import { getDashboardWidgets } from './utils/rbac';
  ```
- [ ] In DashboardPage
  ```jsx
  const widgets = getDashboardWidgets(currentUser);
  ```
- [ ] Map over widgets to render
  ```jsx
  {widgets.map(widget => <Widget key={widget.id} {...widget} />)}
  ```

### Step 22: Add Feature Flags

- [ ] For experimental features
  ```jsx
  import { FeatureFlag } from './components/auth/RBAC';
  
  <FeatureFlag 
    feature="advanced_reports" 
    enabledFor={['super_admin', 'property_manager']}
  >
    <AdvancedReports />
  </FeatureFlag>
  ```

### Step 23: Add Action Checks

- [ ] For complex logic
  ```jsx
  import { canPerformAction } from './utils/rbac';
  
  const canDelete = canPerformAction(
    currentUser, 
    'delete', 
    'property', 
    propertyData
  );
  
  if (canDelete) {
    // Show delete button
  }
  ```

---

## Testing Checklist

### Verify Each Role

- [ ] **Super Admin**
  - [ ] Can see all menu items
  - [ ] Can see all data
  - [ ] Can create/edit/delete everything
  - [ ] Can see all tenants

- [ ] **Property Manager**
  - [ ] Sees reduced menu (no Applications, System Settings)
  - [ ] Can create/edit properties and tenants
  - [ ] Can view but not edit financials
  - [ ] Only sees own tenant's data

- [ ] **Accountant**
  - [ ] Sees financial pages
  - [ ] Can create/edit income and expenses
  - [ ] Can view but not edit properties
  - [ ] Only sees own tenant's data

- [ ] **Maintenance**
  - [ ] Sees maintenance page
  - [ ] Can view properties (read-only)
  - [ ] Cannot see financials
  - [ ] Cannot see tenant details

- [ ] **Tenant**
  - [ ] Sees very limited menu
  - [ ] Can only see own data
  - [ ] Can submit maintenance requests
  - [ ] Cannot see other tenants

- [ ] **Viewer**
  - [ ] Can see all pages
  - [ ] All buttons are disabled/hidden
  - [ ] Can view but not edit anything

---

## Before Production

### Remove Development Tools

- [ ] Remove `<RoleSwitcher />` from App.jsx
- [ ] Remove mock user data from AuthContext
- [ ] Add real authentication (Firebase, Auth0, etc.)
- [ ] Add login/logout pages
- [ ] Add user registration flow

### Add Backend Security

- [ ] Add `tenant_id` column to all database tables
- [ ] Implement row-level security in database
- [ ] Add authentication middleware to API
- [ ] Verify tenant ID on every API request
- [ ] Add permission checks on backend

### Add Monitoring

- [ ] Add audit logging (who did what, when)
- [ ] Add error tracking for permission denials
- [ ] Add analytics for feature usage per role
- [ ] Add alerts for suspicious activity

---

## Troubleshooting

### "Cannot read property 'role' of null"
**Solution:** Make sure app is wrapped in `<AuthProvider>`

### Menu items not filtering
**Solution:** Check `getMenuItemsForUser(currentUser)` is called with valid user

### Permission guards not showing
**Solution:** Verify you're using correct permission constant from PERMISSIONS

### Data showing from other tenants
**Solution:** Make sure your data has `tenantId` field and you're using `filterByTenant()`

### Role switcher not appearing
**Solution:** Check z-index, make sure it's added to JSX, verify no CSS conflicts

---

## Support Files

📚 **Documentation:**
- `RBAC_SUMMARY.md` - Overview of entire system
- `RBAC_QUICK_START.md` - Quick reference guide
- `RBAC_GUIDE.md` - Detailed guide with examples
- `RBAC_ARCHITECTURE.md` - System diagrams

💻 **Code Files:**
- `src/contexts/AuthContext.jsx` - Core auth system
- `src/components/auth/RBAC.jsx` - React components
- `src/utils/rbac.js` - Helper functions
- `RBAC_INTEGRATION_EXAMPLE.jsx` - Full example

---

## Success Criteria

✅ **You've successfully integrated RBAC when:**
1. You can switch roles using RoleSwitcher
2. Menu items change based on role
3. Buttons hide/disable based on permissions
4. Data filters based on tenant and role
5. User info displays correctly
6. Different roles see different content

**Estimated time to complete:** 1-2 hours

**Difficulty level:** Intermediate

**Required knowledge:** Basic React, understanding of your app structure

---

Ready to start? Begin with Phase 1! 🚀
