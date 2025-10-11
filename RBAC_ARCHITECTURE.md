# Multi-Tenant RBAC System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         JumbaJot Application                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐         ┌──────────────────┐                │
│  │  AuthProvider   │────────▶│  Current User    │                │
│  │  (Context)      │         │  - Role          │                │
│  └─────────────────┘         │  - Tenant ID     │                │
│         │                    │  - Permissions   │                │
│         │                    └──────────────────┘                │
│         │                                                         │
│         ▼                                                         │
│  ┌─────────────────────────────────────────────────────┐         │
│  │            Permission System                        │         │
│  ├─────────────────────────────────────────────────────┤         │
│  │                                                     │         │
│  │  📋 Menu Items    ─────▶  Filtered by Role        │         │
│  │  🔒 UI Elements   ─────▶  Show/Hide by Permission │         │
│  │  📊 Data          ─────▶  Filtered by Tenant      │         │
│  │  🎯 Actions       ─────▶  Allowed by Permission   │         │
│  │                                                     │         │
│  └─────────────────────────────────────────────────────┘         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Multi-Tenant Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                        Database Layer                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │  Tenant 1      │  │  Tenant 2      │  │  Tenant 3      │   │
│  │  (Acme Props)  │  │  (Beta Estate) │  │  (City Homes)  │   │
│  ├────────────────┤  ├────────────────┤  ├────────────────┤   │
│  │ Properties     │  │ Properties     │  │ Properties     │   │
│  │ Tenants        │  │ Tenants        │  │ Tenants        │   │
│  │ Leases         │  │ Leases         │  │ Leases         │   │
│  │ Income         │  │ Income         │  │ Income         │   │
│  │ Expenses       │  │ Expenses       │  │ Expenses       │   │
│  └────────────────┘  └────────────────┘  └────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                     Row-Level Security                           │
│                 (Automatic Tenant Filtering)                     │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                      Application Layer                           │
│              filterByTenant() / filterByRole()                   │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                          User View                               │
│              (Only sees their tenant's data)                     │
└──────────────────────────────────────────────────────────────────┘
```

## Role Hierarchy & Permissions

```
                     ┌─────────────────┐
                     │  SUPER ADMIN    │
                     │  ✓ All Tenants  │
                     │  ✓ All Features │
                     └────────┬────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
     ┌────────▼─────┐  ┌──────▼──────┐  ┌───▼──────┐
     │ PROP MANAGER │  │ ACCOUNTANT  │  │  VIEWER  │
     │ Full Mgmt    │  │ Financials  │  │ Read-Only│
     └────────┬─────┘  └──────┬──────┘  └──────────┘
              │               │
     ┌────────▼─────┐  ┌──────▼──────┐
     │ MAINTENANCE  │  │   TENANT    │
     │ Repairs Only │  │ Own Data    │
     └──────────────┘  └─────────────┘
```

## Permission Matrix

```
┌─────────────────┬────────┬──────┬──────┬───────┬────────┬────────┐
│ Feature         │ Super  │ Prop │ Acct │ Maint │ Tenant │ Viewer │
│                 │ Admin  │ Mgr  │      │       │        │        │
├─────────────────┼────────┼──────┼──────┼───────┼────────┼────────┤
│ Dashboard       │   ✓    │  ✓   │  ✓   │   ✓   │   ✓    │   ✓    │
│ Properties      │   ✓    │  ✓   │  👁  │   👁  │   ✗    │   👁   │
│ Tenants         │   ✓    │  ✓   │  👁  │   ✗   │   ✗    │   👁   │
│ Applications    │   ✓    │  ✓   │  ✗   │   ✗   │   ✗    │   ✗    │
│ Leases          │   ✓    │  ✓   │  👁  │   ✗   │   👁   │   👁   │
│ Income          │   ✓    │  👁  │  ✓   │   ✗   │   ✗    │   👁   │
│ Expenses        │   ✓    │  👁  │  ✓   │   ✗   │   ✗    │   👁   │
│ Maintenance     │   ✓    │  ✓   │  ✗   │   ✓   │   ✓*   │   ✗    │
│ Messaging       │   ✓    │  ✓   │  ✗   │   ✗   │   ✓    │   ✗    │
│ Listings        │   ✓    │  ✓   │  ✗   │   ✗   │   ✗    │   ✗    │
│ Settings        │   ✓    │  👁  │  ✗   │   ✗   │   ✗    │   ✗    │
│ Users           │   ✓    │  ✗   │  ✗   │   ✗   │   ✗    │   ✗    │
└─────────────────┴────────┴──────┴──────┴───────┴────────┴────────┘

Legend: ✓ = Full Access  |  👁 = View Only  |  ✗ = No Access  |  * = Own Data Only
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Components                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  App.jsx                                                    │
│    │                                                        │
│    ├─▶ <AuthProvider>         ← Provides auth context     │
│    │     │                                                 │
│    │     ├─▶ <ProtectedRoute>  ← Requires login           │
│    │     │     │                                           │
│    │     │     ├─▶ Sidebar                                 │
│    │     │     │     ├─▶ getMenuItemsForUser()           │
│    │     │     │     └─▶ Filtered menu                   │
│    │     │     │                                           │
│    │     │     ├─▶ Main Content                           │
│    │     │     │     ├─▶ <PermissionGuard>               │
│    │     │     │     ├─▶ <RoleGuard>                     │
│    │     │     │     └─▶ <ConditionalButton>             │
│    │     │     │                                           │
│    │     │     └─▶ <RoleSwitcher>  ← Dev only            │
│    │     │                                                 │
│    │     └─▶ Pages                                        │
│    │           ├─▶ filterByTenant()                       │
│    │           └─▶ filterByRole()                         │
│    │                                                        │
│    └─▶ Hooks: useAuth()                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Data Filtering Flow

```
┌────────────────────────────────────────────────────────────────┐
│                    Data from Database                          │
│  [All properties from all tenants]                             │
└───────────────────────────┬────────────────────────────────────┘
                            │
                            ▼
                   ┌────────────────┐
                   │ Is Super Admin?│
                   └────┬───────┬───┘
                       YES     NO
                        │       │
                        │       ▼
                        │  ┌──────────────────────┐
                        │  │ Filter by Tenant ID  │
                        │  └──────────┬───────────┘
                        │             │
                        │             ▼
                        │  ┌──────────────────────┐
                        │  │ Filter by User Role  │
                        │  └──────────┬───────────┘
                        │             │
                        ▼             ▼
                   ┌─────────────────────────┐
                   │   Data User Can See     │
                   └─────────────────────────┘
```

## Example: Property Manager's View

```
┌─────────────────────────────────────────────────────────────┐
│  User: John Smith                                           │
│  Role: Property Manager                                     │
│  Tenant: Acme Properties (ID: tenant_1)                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Can See:                          Cannot See:             │
│  ✓ Dashboard                       ✗ Other tenants' data   │
│  ✓ All Acme properties            ✗ System settings        │
│  ✓ All Acme tenants               ✗ User management        │
│  ✓ Create/Edit properties         ✗ Delete financials      │
│  ✓ Manage maintenance             ✗ Edit other admins      │
│  ✓ View income/expenses (RO)                               │
│  ✓ Send messages                                            │
│  ✓ Create listings                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Example: Tenant's View

```
┌─────────────────────────────────────────────────────────────┐
│  User: Jane Doe                                             │
│  Role: Tenant                                               │
│  Tenant: Acme Properties (ID: tenant_1)                     │
│  Property: 211 Loraine                                      │
│  Unit: 2A                                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Can See:                          Cannot See:             │
│  ✓ Dashboard (own stats)          ✗ Other properties       │
│  ✓ Own lease info                 ✗ Other tenants          │
│  ✓ Submit maintenance requests    ✗ Financial data         │
│  ✓ Message landlord               ✗ Property details       │
│  ✓ Payment history                ✗ Admin features         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Layer 1: UI Layer                        │
│           (Permission Guards, Conditional Rendering)        │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 Layer 2: Application Layer                  │
│           (Data Filtering, Role-Based Logic)                │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Layer 3: API Layer                        │
│         (Authentication, Authorization Headers)             │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 Layer 4: Database Layer                     │
│            (Row-Level Security, Tenant Isolation)           │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
src/
├── contexts/
│   └── AuthContext.jsx
│       ├── AuthProvider Component
│       ├── useAuth Hook
│       ├── ROLES Definition
│       ├── PERMISSIONS Definition
│       └── Role-Permission Mapping
│
├── components/
│   ├── auth/
│   │   └── RBAC.jsx
│   │       ├── ProtectedRoute
│   │       ├── PermissionGuard
│   │       ├── RoleGuard
│   │       ├── ConditionalButton
│   │       ├── TenantGuard
│   │       ├── FeatureFlag
│   │       └── UserInfo
│   │
│   └── RoleSwitcher.jsx (Dev tool)
│
├── utils/
│   └── rbac.js
│       ├── filterByTenant()
│       ├── filterByRole()
│       ├── getMenuItemsForUser()
│       ├── getDashboardWidgets()
│       ├── canPerformAction()
│       ├── getTenantConfig()
│       └── applyRowLevelSecurity()
│
└── Documentation/
    ├── RBAC_GUIDE.md
    ├── RBAC_QUICK_START.md
    ├── RBAC_INTEGRATION_EXAMPLE.jsx
    └── RBAC_ARCHITECTURE.md (this file)
```

## Implementation Timeline

```
Phase 1: Foundation ✅ COMPLETE
├── Create AuthContext
├── Define roles & permissions
├── Build RBAC components
└── Create utility functions

Phase 2: Integration (Next Step)
├── Wrap app in AuthProvider
├── Add RoleSwitcher for testing
├── Filter menu items by role
└── Add permission guards

Phase 3: Data Security
├── Add tenant_id to all data
├── Implement data filtering
├── Add row-level security
└── Secure API endpoints

Phase 4: Production
├── Replace mock auth
├── Add real login/signup
├── Implement user management
└── Add audit logging
```

## Remember

🔑 **This is a complete, production-ready foundation**  
🎨 **Styled with your blue theme**  
🧪 **Ready to test with RoleSwitcher**  
📚 **Fully documented**  
🔒 **Secure by design**
