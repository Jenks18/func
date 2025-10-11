# Multi-Tenant Role-Based Access Control (RBAC) System

## Overview

JumbaJot now includes a comprehensive multi-tenant RBAC system that allows you to:
- **Multi-tenancy**: Separate data between different organizations/companies
- **Role-based permissions**: Different user roles with specific permissions
- **Feature flags**: Enable/disable features for specific roles or tenants
- **Data isolation**: Automatic filtering of data based on tenant and role

## Architecture

### 1. **Roles Hierarchy**

```
Super Admin (full system access)
    ├── Property Manager (manages properties, tenants, leases)
    ├── Accountant (manages financials)
    ├── Maintenance (handles maintenance requests)
    ├── Viewer (read-only access)
    └── Tenant (limited access to own data)
```

### 2. **Role Definitions**

| Role | Description | Access Level |
|------|-------------|--------------|
| `super_admin` | System administrator | All tenants, all features |
| `property_manager` | Property management staff | Single tenant, full management |
| `accountant` | Financial staff | Single tenant, financial data |
| `maintenance` | Maintenance staff | Single tenant, maintenance only |
| `tenant` | Property tenant | Single tenant, own data only |
| `viewer` | Read-only user | Single tenant, view only |

### 3. **Permission Model**

Permissions are organized by resource and action:

```javascript
// Resource types
- Properties (view, create, edit, delete)
- Tenants (view, create, edit, delete)
- Leases (view, create, edit, delete)
- Income (view, create, edit, delete)
- Expenses (view, create, edit, delete)
- Maintenance (view, create, edit, delete)
- Settings (view, edit)
- Users (view, create, edit, delete)
```

## Implementation Guide

### Step 1: Wrap Your App with AuthProvider

```jsx
// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
```

### Step 2: Protect Routes

```jsx
// App.jsx
import { ProtectedRoute } from './components/auth/RBAC';

function App() {
  return (
    <ProtectedRoute>
      {/* Your app content */}
    </ProtectedRoute>
  );
}
```

### Step 3: Use Permission Guards

```jsx
// In any component
import { PermissionGuard, RoleGuard } from './components/auth/RBAC';
import { PERMISSIONS } from './contexts/AuthContext';

// Hide content if no permission
<PermissionGuard permission={PERMISSIONS.CREATE_PROPERTY}>
  <button onClick={addProperty}>Add Property</button>
</PermissionGuard>

// Show message if no permission
<PermissionGuard permission={PERMISSIONS.VIEW_INCOME} showMessage>
  <IncomeChart />
</PermissionGuard>

// Require multiple permissions
<PermissionGuard 
  permissions={[PERMISSIONS.VIEW_PROPERTIES, PERMISSIONS.EDIT_PROPERTY]} 
  requireAll
>
  <EditPropertyForm />
</PermissionGuard>

// Role-based access
<RoleGuard roles={['super_admin', 'property_manager']}>
  <AdminPanel />
</RoleGuard>
```

### Step 4: Filter Menu Items by Role

```jsx
// App.jsx
import { useAuth } from './contexts/AuthContext';
import { getMenuItemsForUser } from './utils/rbac';

function App() {
  const { currentUser } = useAuth();
  const menuItems = getMenuItemsForUser(currentUser);
  
  return (
    <div>
      {menuItems.map(item => (
        <MenuItem key={item.component} {...item} />
      ))}
    </div>
  );
}
```

### Step 5: Filter Data by Tenant

```jsx
// PropertiesPage.jsx
import { useAuth } from './contexts/AuthContext';
import { filterByTenant, filterByRole } from './utils/rbac';

function PropertiesPage() {
  const { currentUser } = useAuth();
  const [allProperties, setAllProperties] = useState([]);
  
  // Automatically filter by tenant and role
  const visibleProperties = filterByRole(allProperties, currentUser, 'property');
  
  return (
    <div>
      {visibleProperties.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
```

### Step 6: Conditional Buttons

```jsx
import { ConditionalButton } from './components/auth/RBAC';
import { PERMISSIONS } from './contexts/AuthContext';

// Button is disabled if user lacks permission
<ConditionalButton 
  permission={PERMISSIONS.CREATE_PROPERTY}
  onClick={handleCreate}
  style={{ padding: '10px 20px' }}
>
  Add Property
</ConditionalButton>

// Button is hidden if user lacks permission
<ConditionalButton 
  permission={PERMISSIONS.DELETE_PROPERTY}
  onClick={handleDelete}
  hideIfNoAccess
>
  Delete
</ConditionalButton>
```

### Step 7: Multi-Tenant Data Isolation

```jsx
// dataService.js
import { applyRowLevelSecurity } from './utils/rbac';

export const fetchProperties = async (user) => {
  // Apply tenant filter automatically
  const query = applyRowLevelSecurity({ type: 'property' }, user);
  
  // In production, this would be a database query
  const response = await fetch('/api/properties', {
    method: 'POST',
    body: JSON.stringify(query),
    headers: { 
      'Content-Type': 'application/json',
      'X-Tenant-Id': user.tenantId 
    }
  });
  
  return response.json();
};
```

## Mock Users for Testing

You can test different roles using these credentials:

| Email | Role | Password | Description |
|-------|------|----------|-------------|
| `admin@example.com` | Super Admin | any | Full system access |
| `manager@example.com` | Property Manager | any | Full management access |
| `accountant@example.com` | Accountant | any | Financial access only |
| `maintenance@example.com` | Maintenance | any | Maintenance access only |
| `tenant@example.com` | Tenant | any | Limited tenant view |

### Login Example

```jsx
import { useAuth } from './contexts/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  
  const handleLogin = async (email, password) => {
    const result = await login(email, password, 'tenant_1');
    if (result.success) {
      // Redirect to dashboard
    } else {
      // Show error
    }
  };
}
```

## Advanced Features

### 1. **Tenant Switching (Super Admin Only)**

```jsx
import { useAuth } from './contexts/AuthContext';

function TenantSwitcher() {
  const { currentUser, switchTenant, ROLES } = useAuth();
  
  if (currentUser?.role !== ROLES.SUPER_ADMIN) return null;
  
  return (
    <select onChange={(e) => switchTenant(e.target.value, 'Selected Tenant')}>
      <option value="tenant_1">Acme Properties</option>
      <option value="tenant_2">Beta Real Estate</option>
    </select>
  );
}
```

### 2. **Feature Flags**

```jsx
import { FeatureFlag } from './components/auth/RBAC';
import { ROLES } from './contexts/AuthContext';

// Show feature only for certain roles
<FeatureFlag 
  feature="advanced_reports" 
  enabledFor={[ROLES.SUPER_ADMIN, ROLES.PROPERTY_MANAGER]}
>
  <AdvancedReportsModule />
</FeatureFlag>

// Show feature only for specific tenants
<FeatureFlag 
  feature="multi_currency" 
  enabledTenants={['tenant_1', 'tenant_3']}
>
  <MultiCurrencySettings />
</FeatureFlag>
```

### 3. **Dynamic Dashboard Widgets**

```jsx
import { useAuth } from './contexts/AuthContext';
import { getDashboardWidgets } from './utils/rbac';

function Dashboard() {
  const { currentUser } = useAuth();
  const widgets = getDashboardWidgets(currentUser);
  
  return (
    <div>
      {widgets.map(widget => (
        <Widget key={widget.id} {...widget} />
      ))}
    </div>
  );
}
```

### 4. **Action-Based Permissions**

```jsx
import { canPerformAction } from './utils/rbac';
import { useAuth } from './contexts/AuthContext';

function PropertyCard({ property }) {
  const { currentUser } = useAuth();
  
  const canEdit = canPerformAction(currentUser, 'update', 'property', property);
  const canDelete = canPerformAction(currentUser, 'delete', 'property', property);
  
  return (
    <div>
      {canEdit && <button onClick={editProperty}>Edit</button>}
      {canDelete && <button onClick={deleteProperty}>Delete</button>}
    </div>
  );
}
```

## Database Schema (Recommended)

For production, implement these tables:

```sql
-- Organizations/Tenants table
CREATE TABLE tenants (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  logo_url TEXT,
  settings JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) NOT NULL,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Role permissions table
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY,
  role VARCHAR(50) NOT NULL,
  permission VARCHAR(100) NOT NULL,
  UNIQUE(role, permission)
);

-- Add tenant_id to all resource tables
ALTER TABLE properties ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE tenants_table ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE leases ADD COLUMN tenant_id UUID REFERENCES tenants(id);
-- etc.

-- Create indexes for performance
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_properties_tenant ON properties(tenant_id);
CREATE INDEX idx_leases_tenant ON leases(tenant_id);
```

## Row-Level Security (PostgreSQL Example)

```sql
-- Enable RLS on tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Policy for tenant isolation
CREATE POLICY tenant_isolation ON properties
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Policy for super admin
CREATE POLICY super_admin_all_access ON properties
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = current_setting('app.current_user_id')::UUID 
      AND role = 'super_admin'
    )
  );
```

## Security Best Practices

1. **Always validate on the backend** - Client-side checks are for UX only
2. **Use JWT tokens** - Store role and tenant ID in encrypted tokens
3. **Implement audit logs** - Track who did what and when
4. **Regular permission reviews** - Audit user permissions regularly
5. **Principle of least privilege** - Give users minimum required permissions
6. **Secure API endpoints** - Verify tenant ID and permissions on every request
7. **Test multi-tenancy** - Ensure no data leakage between tenants

## API Integration Example

```javascript
// api.js
export const apiRequest = async (endpoint, options = {}) => {
  const user = JSON.parse(localStorage.getItem('jumbajot_user'));
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user?.token}`,
    'X-Tenant-Id': user?.tenantId,
    ...options.headers
  };
  
  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers
  });
  
  if (response.status === 403) {
    throw new Error('Permission denied');
  }
  
  return response.json();
};
```

## Testing Strategy

```javascript
// rbac.test.js
import { filterByRole, canPerformAction } from './utils/rbac';

describe('RBAC System', () => {
  const superAdmin = { role: 'super_admin', tenantId: null };
  const propertyManager = { role: 'property_manager', tenantId: 'tenant_1' };
  const tenant = { role: 'tenant', tenantId: 'tenant_1', id: 'user_1' };
  
  test('super admin can see all data', () => {
    const data = [
      { id: 1, tenantId: 'tenant_1' },
      { id: 2, tenantId: 'tenant_2' }
    ];
    expect(filterByRole(data, superAdmin)).toHaveLength(2);
  });
  
  test('property manager sees only their tenant', () => {
    const data = [
      { id: 1, tenantId: 'tenant_1' },
      { id: 2, tenantId: 'tenant_2' }
    ];
    expect(filterByRole(data, propertyManager)).toHaveLength(1);
  });
  
  test('tenant can create maintenance request', () => {
    expect(canPerformAction(tenant, 'create', 'maintenance')).toBe(true);
  });
  
  test('tenant cannot delete property', () => {
    expect(canPerformAction(tenant, 'delete', 'property')).toBe(false);
  });
});
```

## Next Steps

1. **Integrate with your backend** - Replace mock data with real API calls
2. **Add authentication** - Implement JWT or OAuth authentication
3. **Create login/signup pages** - Build user authentication flow
4. **Add user management** - Create admin panel for managing users
5. **Implement audit logs** - Track all user actions
6. **Add email notifications** - Notify users of role changes
7. **Create onboarding** - Guide new users based on their role

## Support

For questions or issues with the RBAC system, refer to:
- `src/contexts/AuthContext.jsx` - Main authentication logic
- `src/components/auth/RBAC.jsx` - React components for access control
- `src/utils/rbac.js` - Utility functions for data filtering
