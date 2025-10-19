# 👥 User Management - Complete Visual Workflow

## 🎯 How to Add New Users (Step-by-Step)

### Step 1: Navigate to Users Page

```
Sidebar → Click "👥 Users"
```

You'll see:
```
┌─────────────────────────────────────────────────────────────┐
│  Users                                      [+ Add New User] │
│  Manage team members and access levels                      │
├─────────────────────────────────────────────────────────────┤
│  [🔍 Search by user name or email]  [Filter] [Showing 5/5] │
├─────────────────────────────────────────────────────────────┤
│  Name        │ Email      │ Phone       │ Status │ Role     │
│  John Doe    │ john@...   │ (511)...    │ ⚪ ON  │ Manager  │
│  Jane Smith  │ jane@...   │ (511)...    │ ⚪ ON  │ Owner    │
└─────────────────────────────────────────────────────────────┘
```

---

### Step 2: Click "+ Add New User" Button

The beautiful blue gradient button in the top right:
```
[+ Add New User] ← Click this!
```

**Button shows for:**
- ✅ Property Owners
- ✅ Property Managers  
- ✅ Organization Admins
- ✅ Super Admins

**Button hidden for:**
- ❌ Tenants
- ❌ Regular users without permission

---

### Step 3: New User Modal Opens

Split-screen modal appears:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        NEW USER                                     │
├──────────────────────┬──────────────────────────────────────────────┤
│  [Profile Picture]   │  ACCESS LEVELS                               │
│                      │  ┌──────────────────────────────────────┐   │
│  First Name*         │  │ Features  │ PM │ LM │ MS │ PO │       │   │
│  [John            ]  │  │ Property  │All │View│None│View│       │   │
│                      │  │ Invoice   │All │None│None│View│       │   │
│  Last Name*          │  │ Lease     │All │All │None│View│       │   │
│  [Smith           ]  │  │ Tenant    │All │All │None│View│       │   │
│                      │  │ ...12 more features...              │   │
│  Email*              │  └──────────────────────────────────────┘   │
│  [john@example.com]  │                                              │
│                      │  Legend:                                     │
│  Phone*              │  • All = Full access (create, edit, delete)│
│  [(555) 123-4567  ]  │  • View = Read-only access                 │
│                      │  • None = No access                         │
│  Role*               │                                              │
│  [Property Manager▾] │                                              │
│                      │                                              │
│  Assign Properties   │                                              │
│  [Select Properties▾]│                                              │
│                      │                                              │
├──────────────────────┴──────────────────────────────────────────────┤
│                                      [Cancel]  [Save]               │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Step 4: Fill Out User Information

**Left Column - Basic Info:**
```javascript
1. ✅ Upload profile picture (optional)
2. ✅ First Name: "John"
3. ✅ Last Name: "Smith"  
4. ✅ Email: "john@maintenancepro.com"
5. ✅ Phone: "(555) 123-4567"
6. ✅ Role: Select from dropdown:
   - Property Owner
   - Property Manager ← Select this
   - Maintenance Staff
   - Lease Manager
   - Custom
7. ✅ Assign Properties (optional)
```

**Right Column - Access Levels:**

Click dropdowns to customize permissions:

```
Feature         │ Prop Mgr │ Lease Mgr │ Maint Staff │ Prop Owner
────────────────┼──────────┼───────────┼─────────────┼───────────
Property        │ [All ▾]  │ [View ▾]  │ [None ▾]    │ [View ▾]
Invoice         │ [All ▾]  │ [None ▾]  │ [None ▾]    │ [View ▾]
Lease/Term      │ [All ▾]  │ [All ▾]   │ [None ▾]    │ [View ▾]
Tenant/Owner    │ [All ▾]  │ [All ▾]   │ [None ▾]    │ [View ▾]
Application     │ [All ▾]  │ [All ▾]   │ [None ▾]    │ [View ▾]
Maintenance     │ [All ▾]  │ [None ▾]  │ [All ▾]     │ [View ▾]
Reports         │ [All ▾]  │ [None ▾]  │ [None ▾]    │ [All ▾]
Settings        │ [All ▾]  │ [None ▾]  │ [None ▾]    │ [None ▾]
Messaging       │ [All ▾]  │ [None ▾]  │ [None ▾]    │ [None ▾]
Expense         │ [All ▾]  │ [None ▾]  │ [None ▾]    │ [View ▾]
Bank            │ [All ▾]  │ [None ▾]  │ [None ▾]    │ [None ▾]
Listings        │ [All ▾]  │ [All ▾]   │ [None ▾]    │ [View ▾]
```

**Each dropdown has 3 options:**
- 🔵 **All** - Create, edit, delete
- 🟡 **View** - Read-only  
- 🔴 **None** - No access

---

### Step 5: Click "Save"

Behind the scenes, the system:

```javascript
1. ✅ Sends Clerk organization invitation
   → john@maintenancepro.com receives email:
   
   ┌────────────────────────────────────────┐
   │ 📧 You're invited to join              │
   │    ABC Property Management!            │
   │                                        │
   │    John, you've been invited by        │
   │    Jane Doe to join the team.          │
   │                                        │
   │    [Accept Invitation]                 │
   └────────────────────────────────────────┘

2. ✅ Creates database record in Supabase:
   {
     email: "john@maintenancepro.com",
     first_name: "John",
     last_name: "Smith",
     role: "property_manager",
     access_levels: {
       property: "All",
       maintenance: "All",
       // ... custom permissions
     },
     status: "invited"  ← Not active yet!
   }

3. ✅ Shows success message:
   "Invitation sent to john@maintenancepro.com!
    They will receive an email to join."

4. ✅ Closes modal and refreshes user list
```

---

### Step 6: User Receives Email

John checks his email inbox:

```
┌────────────────────────────────────────────────────┐
│ From: ABC Property Management via Clerk            │
│ Subject: You've been invited to join!              │
│                                                    │
│ Hi John,                                           │
│                                                    │
│ Jane Doe has invited you to join ABC Property     │
│ Management on JumbaJot.                           │
│                                                    │
│ As a Property Manager, you'll have access to:     │
│ • Manage properties                                │
│ • Handle maintenance requests                      │
│ • View tenant information                          │
│                                                    │
│ Click below to accept and create your account:    │
│                                                    │
│ ┌──────────────────────────────┐                  │
│ │   Accept Invitation          │                  │
│ └──────────────────────────────┘                  │
│                                                    │
│ This invitation expires in 7 days.                │
└────────────────────────────────────────────────────┘
```

---

### Step 7: User Accepts Invitation

John clicks "Accept Invitation" and is taken to:

```
https://your-app.vercel.app/sign-up?invitation=abc123

┌─────────────────────────────────────────┐
│  Welcome to JumbaJot!                   │
│  Complete your account setup            │
├─────────────────────────────────────────┤
│  Full Name                              │
│  [John Smith                         ]  │
│                                         │
│  Email (verified)                       │
│  [john@maintenancepro.com            ]  │
│                                         │
│  Create Password                        │
│  [••••••••••                          ]  │
│                                         │
│  Confirm Password                       │
│  [••••••••••                          ]  │
│                                         │
│  OR                                     │
│                                         │
│  [🔵 Continue with Google]              │
│                                         │
│  [Complete Setup]                       │
└─────────────────────────────────────────┘
```

---

### Step 8: User Joins & Logs In

```javascript
1. ✅ John creates account (password or Google)
2. ✅ Automatically joins ABC Property Management org
3. ✅ Database record updated:
   {
     clerk_id: "user_abc123",  ← Now has Clerk ID
     status: "active"          ← Changed from "invited"
   }
4. ✅ Redirects to /dashboard
5. ✅ John sees only what his role allows:
   
   ✅ Can see: Properties, Maintenance, Tenants
   ✅ Can edit: Properties, Maintenance  
   ❌ Cannot see: Financial reports, Bank accounts
```

---

### Step 9: Permission Enforcement

When John tries to access different features:

```javascript
// Example: John clicks "Settings"
if (hasPermission(user.role, 'canManageOrganization')) {
  showSettings(); // ❌ NO - Property Managers can't
} else {
  showError("You don't have permission");
}

// Example: John clicks "Maintenance"
if (user.accessLevels.maintenance === 'All') {
  showMaintenanceFullAccess(); // ✅ YES
}

// Example: John tries to see Expenses
if (user.accessLevels.expense === 'None') {
  hideExpensesTab(); // ❌ Hidden completely
}
```

---

## 🎨 What You See in Users Page

After adding John, your Users page shows:

```
┌───────────────────────────────────────────────────────────────────────┐
│  Users                                            [+ Add New User]    │
├───────────────────────────────────────────────────────────────────────┤
│  [🔍 Search]  [Filter: All ▾]              Showing 3 of 3             │
├───────────────────────────────────────────────────────────────────────┤
│ Name         │Email            │Phone        │Status    │Role    │⚪│⋮│
├───────────────────────────────────────────────────────────────────────┤
│ 👤 Jane Doe │ jane@abc.com    │(555)111-1111│Verified  │Owner   │ON│⋮│
│ 👤 John Smith│john@maint.com   │(555)123-4567│Unverified│Manager │ON│⋮│
│ 👤 Bob Worker│bob@abc.com      │(555)222-3333│Verified  │Maint   │ON│⋮│
└───────────────────────────────────────────────────────────────────────┘
```

**Interactive Elements:**
- ✅ **Search**: Filter by name/email in real-time
- ✅ **Status Filter**: Show Active/Inactive/All
- ✅ **Toggle Switch (⚪)**: Turn user on/off
- ✅ **Action Menu (⋮)**: Edit, Delete, Resend Invitation
- ✅ **Role Badges**: Color-coded by role

---

## 🔒 Security & Multi-Tenancy

### Data Isolation

```javascript
// John at ABC Property Management
{
  organization_id: "org_abc123",
  can_see: [
    "Properties owned by ABC Property Management",
    "Tenants in ABC properties",
    "Maintenance for ABC properties"
  ],
  cannot_see: [
    "XYZ Realty's properties ❌",
    "Downtown LLC's data ❌",
    "ANY other company's data ❌"
  ]
}
```

### Automatic Enforcement

```sql
-- Supabase RLS Policy (automatic)
CREATE POLICY users_isolation ON users
FOR SELECT USING (
  organization_id = current_user_organization_id()
);

-- What this means:
SELECT * FROM users;
-- Returns ONLY users from YOUR organization
-- Other companies' users are invisible
-- No way to hack around this
```

---

## 📊 Access Levels Table Explained

### How It Works

Each user has a `access_levels` JSON object:

```javascript
{
  property: "All",      // Can create, edit, delete properties
  maintenance: "All",   // Full maintenance access
  tenants: "View",      // Can view but not edit tenants
  expenses: "None",     // Cannot see expenses at all
  reports: "All",       // Full report access
  // ... 12 features total
}
```

### In Code

```javascript
// Check if user can edit property
if (user.accessLevels.property === 'All') {
  showEditButton(); ✅
}

// Check if user can only view
if (user.accessLevels.tenants === 'View') {
  showReadOnlyView(); ✅
  hideEditButton(); ❌
}

// Check if user has no access
if (user.accessLevels.expenses === 'None') {
  hideExpensesTab(); ❌
}
```

---

## ✅ Summary: Complete Workflow

```
1. Click "👥 Users" in sidebar
2. Click "[+ Add New User]" button
3. Fill form:
   - Name, Email, Phone
   - Select Role
   - Customize access levels (12 features x 4 roles)
4. Click "Save"
5. User gets invitation email
6. User accepts, creates account
7. User joins your organization
8. User logs in with custom permissions
9. System enforces access levels automatically
10. Multi-tenant isolation works automatically
```

---

## 🎯 What You Have Now

```
✅ Beautiful Users management page
✅ Search and filter functionality
✅ Status toggle (active/inactive)
✅ "+ Add New User" button (permission-gated)
✅ Innago-style modal with split layout
✅ Editable access levels table (12x4 matrix)
✅ Real Clerk invitation emails
✅ Multi-tenant data isolation
✅ Role-based permissions
✅ Custom per-user access controls
```

**Everything is working and ready to use!** 🚀
