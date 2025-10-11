# 🚛 Fleet Management Multi-Tenant Auth System
## Training Manual for B2B Fleet Management Platforms (Like AtoB Fuel)

---

## 🎯 Use Case: Fleet Management for Businesses

**Examples:** AtoB Fuel, Wex Fleet, Shell Fleet Solutions, BP Business Solutions

**Customer:** Logistics companies, delivery services, trucking fleets
**Users:** Fleet managers, drivers, dispatchers, accountants
**Scale:** One company manages 10-500+ vehicles

---

## 🏗️ Architecture for Fleet Management

```
┌─────────────────────────────────────────────────────────────┐
│                    FLEET MANAGEMENT PLATFORM                │
└─────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Company A    │  │ Company B    │  │ Company C    │
│ ABC Logistics│  │ XYZ Trucking │  │ 123 Delivery │
└──────────────┘  └──────────────┘  └──────────────┘
│                  │                  │
├─ 50 vehicles    ├─ 120 vehicles   ├─ 30 vehicles
├─ 15 drivers     ├─ 40 drivers     ├─ 10 drivers
├─ 2 managers     ├─ 5 managers     ├─ 1 manager
└─ 1 admin        └─ 2 admins       └─ 1 admin
```

Each company (organization) is **completely isolated** - they cannot see each other's:
- Vehicles
- Drivers
- Fuel transactions
- Routes
- Spending data

---

## 📋 User Roles for Fleet Management

### Role Hierarchy

```
👑 PLATFORM ADMIN (You)
    │
    ├─ Manage entire platform
    ├─ View all companies (for support)
    └─ Platform settings
    
🏢 FLEET ADMIN (Company Owner)
    │
    ├─ Manage company fleet
    ├─ Add/remove vehicles
    ├─ Invite fleet managers & drivers
    ├─ View all spending & reports
    └─ Company settings
    
📊 FLEET MANAGER (Operations Manager)
    │
    ├─ Assign vehicles to drivers
    ├─ Approve fuel transactions
    ├─ View reports for assigned vehicles
    ├─ Manage routes
    └─ Cannot modify company settings
    
🚗 DRIVER (Vehicle Operator)
    │
    ├─ View assigned vehicle(s)
    ├─ Record fuel purchases
    ├─ Submit mileage
    ├─ View their own transactions
    └─ Cannot see other drivers' data
    
💰 ACCOUNTANT (Finance Staff)
    │
    ├─ View all transactions
    ├─ Generate financial reports
    ├─ Export data
    └─ Read-only access to vehicles/drivers
```

---

## 🔧 Step-by-Step Implementation

### STEP 1: Define Fleet Roles

**File:** `config/fleet-roles.js`

```javascript
export const FLEET_ROLES = {
  PLATFORM_ADMIN: 'platform_admin',     // You (platform owner)
  FLEET_ADMIN: 'fleet_admin',           // Company owner
  FLEET_MANAGER: 'fleet_manager',       // Operations manager
  DRIVER: 'driver',                      // Vehicle driver
  ACCOUNTANT: 'accountant',              // Finance staff
  DISPATCHER: 'dispatcher',              // Route planner
};

export const FLEET_PERMISSIONS = {
  // Vehicle management
  canAddVehicle: ['platform_admin', 'fleet_admin', 'fleet_manager'],
  canEditVehicle: ['platform_admin', 'fleet_admin', 'fleet_manager'],
  canDeleteVehicle: ['platform_admin', 'fleet_admin'],
  canViewAllVehicles: ['platform_admin', 'fleet_admin', 'fleet_manager', 'accountant'],
  canViewAssignedVehicle: ['driver'],
  
  // Driver management
  canInviteDriver: ['platform_admin', 'fleet_admin', 'fleet_manager'],
  canRemoveDriver: ['platform_admin', 'fleet_admin'],
  canViewAllDrivers: ['platform_admin', 'fleet_admin', 'fleet_manager'],
  
  // Transaction management
  canRecordFuelPurchase: ['platform_admin', 'fleet_admin', 'fleet_manager', 'driver'],
  canApprovePurchase: ['platform_admin', 'fleet_admin', 'fleet_manager'],
  canViewAllTransactions: ['platform_admin', 'fleet_admin', 'fleet_manager', 'accountant'],
  canViewOwnTransactions: ['driver'],
  
  // Reports
  canViewFinancialReports: ['platform_admin', 'fleet_admin', 'fleet_manager', 'accountant'],
  canExportData: ['platform_admin', 'fleet_admin', 'accountant'],
  
  // Settings
  canManageCompany: ['platform_admin', 'fleet_admin'],
  canManageIntegrations: ['platform_admin', 'fleet_admin'],
  canSetSpendingLimits: ['platform_admin', 'fleet_admin', 'fleet_manager'],
};

export function hasFleetPermission(userRole, permission) {
  return FLEET_PERMISSIONS[permission]?.includes(userRole) || false;
}
```

---

### STEP 2: Design Database Schema

**File:** `supabase/migrations/fleet_schema.sql`

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- FLEET MANAGEMENT TABLES
-- =============================================

-- Fleet Companies (Organizations)
CREATE TABLE fleet_companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  business_type TEXT CHECK (business_type IN ('logistics', 'delivery', 'trucking', 'rideshare', 'other')),
  tax_id TEXT,
  billing_address TEXT,
  created_by TEXT NOT NULL,  -- Clerk user ID
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'professional', 'enterprise')),
  monthly_spending_limit DECIMAL(10, 2),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fleet Users
CREATE TABLE fleet_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('platform_admin', 'fleet_admin', 'fleet_manager', 'driver', 'accountant', 'dispatcher')),
  company_id UUID REFERENCES fleet_companies(id) ON DELETE CASCADE,
  phone TEXT,
  employee_id TEXT,
  license_number TEXT,  -- For drivers
  license_expiry DATE,  -- For drivers
  avatar_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicles
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES fleet_companies(id) ON DELETE CASCADE NOT NULL,
  vehicle_number TEXT NOT NULL,  -- Company's internal ID
  vin TEXT,  -- Vehicle Identification Number
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  license_plate TEXT,
  vehicle_type TEXT CHECK (vehicle_type IN ('car', 'van', 'truck', 'semi', 'motorcycle', 'other')),
  fuel_type TEXT CHECK (fuel_type IN ('gasoline', 'diesel', 'electric', 'hybrid', 'cng')),
  fuel_card_number TEXT,  -- Physical fuel card ID
  odometer DECIMAL(10, 2),  -- Current mileage
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'retired', 'sold')),
  assigned_driver_id UUID REFERENCES fleet_users(id),
  daily_spending_limit DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, vehicle_number)
);

-- Fuel Transactions
CREATE TABLE fuel_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES fleet_companies(id) ON DELETE CASCADE NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE NOT NULL,
  driver_id UUID REFERENCES fleet_users(id),
  station_name TEXT NOT NULL,
  station_address TEXT,
  station_network TEXT,  -- Shell, BP, Chevron, etc.
  fuel_type TEXT NOT NULL,
  gallons DECIMAL(10, 2) NOT NULL,
  price_per_gallon DECIMAL(10, 4) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  odometer_reading DECIMAL(10, 2),
  transaction_date TIMESTAMPTZ NOT NULL,
  fuel_card_number TEXT,
  receipt_url TEXT,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'flagged')),
  approved_by UUID REFERENCES fleet_users(id),
  notes TEXT,
  metadata JSONB DEFAULT '{}',  -- GPS coords, pump number, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Routes/Trips
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES fleet_companies(id) ON DELETE CASCADE NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id) NOT NULL,
  driver_id UUID REFERENCES fleet_users(id) NOT NULL,
  trip_number TEXT,
  start_location TEXT,
  end_location TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  start_odometer DECIMAL(10, 2),
  end_odometer DECIMAL(10, 2),
  distance_miles DECIMAL(10, 2),
  purpose TEXT,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance Records
CREATE TABLE maintenance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES fleet_companies(id) ON DELETE CASCADE NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE NOT NULL,
  maintenance_type TEXT CHECK (maintenance_type IN ('oil_change', 'tire_rotation', 'brake_service', 'inspection', 'repair', 'other')),
  description TEXT NOT NULL,
  cost DECIMAL(10, 2),
  odometer_at_service DECIMAL(10, 2),
  service_date DATE NOT NULL,
  next_service_date DATE,
  service_provider TEXT,
  invoice_url TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('scheduled', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spending Limits & Alerts
CREATE TABLE spending_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES fleet_companies(id) ON DELETE CASCADE NOT NULL,
  alert_type TEXT CHECK (alert_type IN ('daily_limit', 'weekly_limit', 'monthly_limit', 'per_transaction', 'unusual_activity')),
  threshold_amount DECIMAL(10, 2),
  scope TEXT CHECK (scope IN ('company', 'vehicle', 'driver')),
  scope_id UUID,  -- vehicle_id or driver_id
  is_active BOOLEAN DEFAULT TRUE,
  notification_emails TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_fleet_users_clerk_id ON fleet_users(clerk_id);
CREATE INDEX idx_fleet_users_company_id ON fleet_users(company_id);
CREATE INDEX idx_fleet_users_role ON fleet_users(role);

CREATE INDEX idx_vehicles_company_id ON vehicles(company_id);
CREATE INDEX idx_vehicles_assigned_driver ON vehicles(assigned_driver_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);

CREATE INDEX idx_fuel_transactions_company_id ON fuel_transactions(company_id);
CREATE INDEX idx_fuel_transactions_vehicle_id ON fuel_transactions(vehicle_id);
CREATE INDEX idx_fuel_transactions_driver_id ON fuel_transactions(driver_id);
CREATE INDEX idx_fuel_transactions_date ON fuel_transactions(transaction_date);
CREATE INDEX idx_fuel_transactions_approval ON fuel_transactions(approval_status);

CREATE INDEX idx_trips_company_id ON trips(company_id);
CREATE INDEX idx_trips_vehicle_id ON trips(vehicle_id);
CREATE INDEX idx_trips_driver_id ON trips(driver_id);

CREATE INDEX idx_maintenance_company_id ON maintenance_records(company_id);
CREATE INDEX idx_maintenance_vehicle_id ON maintenance_records(vehicle_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE fleet_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fuel_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE spending_alerts ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION current_fleet_user_id()
RETURNS UUID AS $$
  SELECT id FROM fleet_users WHERE clerk_id = (auth.jwt() ->> 'sub')::text;
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_fleet_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM fleet_users WHERE clerk_id = (auth.jwt() ->> 'sub')::text;
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_fleet_user_role()
RETURNS TEXT AS $$
  SELECT role FROM fleet_users WHERE clerk_id = (auth.jwt() ->> 'sub')::text;
$$ LANGUAGE SQL SECURITY DEFINER;

-- =============================================
-- RLS POLICIES - COMPANY ISOLATION
-- =============================================

-- Companies: See only your company
CREATE POLICY company_select ON fleet_companies
FOR SELECT USING (
  id = current_fleet_company_id() OR
  created_by = (auth.jwt() ->> 'sub')::text
);

-- Users: See only users in your company
CREATE POLICY fleet_users_select ON fleet_users
FOR SELECT USING (
  clerk_id = (auth.jwt() ->> 'sub')::text OR
  company_id = current_fleet_company_id()
);

-- Vehicles: Company-wide access for managers, assigned vehicle for drivers
CREATE POLICY vehicles_select ON vehicles
FOR SELECT USING (
  company_id = current_fleet_company_id() AND (
    -- Admins and managers see all company vehicles
    current_fleet_user_role() IN ('platform_admin', 'fleet_admin', 'fleet_manager', 'accountant', 'dispatcher') OR
    -- Drivers see only their assigned vehicle
    (current_fleet_user_role() = 'driver' AND assigned_driver_id = current_fleet_user_id())
  )
);

CREATE POLICY vehicles_insert ON vehicles
FOR INSERT WITH CHECK (
  company_id = current_fleet_company_id() AND
  current_fleet_user_role() IN ('platform_admin', 'fleet_admin', 'fleet_manager')
);

CREATE POLICY vehicles_update ON vehicles
FOR UPDATE USING (
  company_id = current_fleet_company_id() AND
  current_fleet_user_role() IN ('platform_admin', 'fleet_admin', 'fleet_manager')
);

-- Fuel Transactions: Drivers see their own, managers see all
CREATE POLICY fuel_transactions_select ON fuel_transactions
FOR SELECT USING (
  company_id = current_fleet_company_id() AND (
    current_fleet_user_role() IN ('platform_admin', 'fleet_admin', 'fleet_manager', 'accountant') OR
    driver_id = current_fleet_user_id()
  )
);

CREATE POLICY fuel_transactions_insert ON fuel_transactions
FOR INSERT WITH CHECK (
  company_id = current_fleet_company_id() AND
  current_fleet_user_role() IN ('platform_admin', 'fleet_admin', 'fleet_manager', 'driver')
);

-- Trips: Drivers see their trips, managers see all
CREATE POLICY trips_select ON trips
FOR SELECT USING (
  company_id = current_fleet_company_id() AND (
    current_fleet_user_role() IN ('platform_admin', 'fleet_admin', 'fleet_manager', 'dispatcher', 'accountant') OR
    driver_id = current_fleet_user_id()
  )
);

-- Maintenance: Managers see all, drivers see their vehicle's maintenance
CREATE POLICY maintenance_select ON maintenance_records
FOR SELECT USING (
  company_id = current_fleet_company_id() AND (
    current_fleet_user_role() IN ('platform_admin', 'fleet_admin', 'fleet_manager') OR
    vehicle_id IN (
      SELECT id FROM vehicles WHERE assigned_driver_id = current_fleet_user_id()
    )
  )
);
```

---

## 🎨 Fleet Management UI Components

### Component 1: Fleet Onboarding

**File:** `pages/fleet/FleetOnboardingPage.jsx`

```javascript
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { FLEET_ROLES } from '../../config/fleet-roles';

export default function FleetOnboardingPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [role, setRole] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [fleetSize, setFleetSize] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Save role to Clerk
    await user.update({
      publicMetadata: { role, onboarded: true }
    });
    
    // 2. Create fleet company in Supabase
    const supabase = useAuthenticatedSupabase();
    const { data: company } = await supabase
      .from('fleet_companies')
      .insert([{
        name: companyName,
        business_type: businessType,
        created_by: user.id
      }])
      .select()
      .single();
    
    // 3. Create user record
    await supabase
      .from('fleet_users')
      .insert([{
        clerk_id: user.id,
        email: user.primaryEmailAddress.emailAddress,
        first_name: user.firstName,
        last_name: user.lastName,
        role: role,
        company_id: company.id
      }]);
    
    navigate('/fleet-dashboard');
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#1e40af', marginBottom: '32px' }}>
        Welcome to Fleet Management
      </h1>
      
      <form onSubmit={handleSubmit}>
        {/* Company Info */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#1e40af', fontWeight: '600' }}>
            Company Name
          </label>
          <input 
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="ABC Logistics Inc."
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
        </div>
        
        {/* Business Type */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#1e40af', fontWeight: '600' }}>
            Business Type
          </label>
          <select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          >
            <option value="">Select type</option>
            <option value="logistics">Logistics</option>
            <option value="delivery">Delivery Service</option>
            <option value="trucking">Trucking</option>
            <option value="rideshare">Rideshare/Taxi</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        {/* Fleet Size */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#1e40af', fontWeight: '600' }}>
            Fleet Size
          </label>
          <select
            value={fleetSize}
            onChange={(e) => setFleetSize(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          >
            <option value="">Select size</option>
            <option value="1-10">1-10 vehicles</option>
            <option value="11-50">11-50 vehicles</option>
            <option value="51-200">51-200 vehicles</option>
            <option value="201+">201+ vehicles</option>
          </select>
        </div>
        
        {/* Your Role */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#1e40af', fontWeight: '600' }}>
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
              fontSize: '16px'
            }}
          >
            <option value="">Select your role</option>
            <option value={FLEET_ROLES.FLEET_ADMIN}>Fleet Administrator</option>
            <option value={FLEET_ROLES.FLEET_MANAGER}>Fleet Manager</option>
            <option value={FLEET_ROLES.ACCOUNTANT}>Accountant</option>
            <option value={FLEET_ROLES.DRIVER}>Driver</option>
          </select>
        </div>
        
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Complete Setup
        </button>
      </form>
    </div>
  );
}
```

---

### Component 2: Vehicle Dashboard

**File:** `pages/fleet/VehiclesDashboard.jsx`

```javascript
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { hasFleetPermission } from '../../config/fleet-roles';

export default function VehiclesDashboard() {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role;
  const [vehicles, setVehicles] = useState([]);
  
  useEffect(() => {
    async function fetchVehicles() {
      const supabase = useAuthenticatedSupabase();
      const { data } = await supabase
        .from('vehicles')
        .select('*, assigned_driver:fleet_users(first_name, last_name)')
        .order('vehicle_number');
      setVehicles(data || []);
    }
    fetchVehicles();
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ color: '#1e40af' }}>Fleet Vehicles</h1>
        
        {hasFleetPermission(userRole, 'canAddVehicle') && (
          <button
            style={{
              padding: '10px 20px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            + Add Vehicle
          </button>
        )}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {vehicles.map(vehicle => (
          <div
            key={vehicle.id}
            style={{
              background: 'white',
              border: '1px solid #bfdbfe',
              borderRadius: '12px',
              padding: '20px'
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#1e40af', marginBottom: '8px' }}>
              {vehicle.make} {vehicle.model}
            </div>
            <div style={{ fontSize: '14px', color: '#60a5fa', marginBottom: '4px' }}>
              {vehicle.vehicle_number} • {vehicle.license_plate}
            </div>
            <div style={{ fontSize: '14px', color: '#60a5fa', marginBottom: '12px' }}>
              Driver: {vehicle.assigned_driver?.first_name} {vehicle.assigned_driver?.last_name || 'Unassigned'}
            </div>
            <div style={{
              padding: '6px 12px',
              background: vehicle.status === 'active' ? '#d1fae5' : '#fee2e2',
              color: vehicle.status === 'active' ? '#065f46' : '#991b1b',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              display: 'inline-block'
            }}>
              {vehicle.status.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### Component 3: Fuel Transaction Approval

**File:** `pages/fleet/FuelTransactionsPage.jsx`

```javascript
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { hasFleetPermission } from '../../config/fleet-roles';

export default function FuelTransactionsPage() {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role;
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('pending');

  const canApprove = hasFleetPermission(userRole, 'canApprovePurchase');

  const handleApprove = async (transactionId) => {
    const supabase = useAuthenticatedSupabase();
    await supabase
      .from('fuel_transactions')
      .update({
        approval_status: 'approved',
        approved_by: user.id
      })
      .eq('id', transactionId);
    
    // Refresh list
    fetchTransactions();
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ color: '#1e40af', marginBottom: '24px' }}>Fuel Transactions</h1>
      
      {/* Filter */}
      <div style={{ marginBottom: '24px' }}>
        {['pending', 'approved', 'rejected', 'all'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: '8px 16px',
              background: filter === status ? '#3b82f6' : 'white',
              color: filter === status ? 'white' : '#3b82f6',
              border: '1px solid #3b82f6',
              borderRadius: '8px',
              marginRight: '8px',
              cursor: 'pointer'
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Transactions Table */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #bfdbfe', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f0f9ff' }}>
              <th style={{ padding: '12px', textAlign: 'left', color: '#1e40af' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#1e40af' }}>Vehicle</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#1e40af' }}>Driver</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#1e40af' }}>Station</th>
              <th style={{ padding: '12px', textAlign: 'right', color: '#1e40af' }}>Gallons</th>
              <th style={{ padding: '12px', textAlign: 'right', color: '#1e40af' }}>Amount</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#1e40af' }}>Status</th>
              {canApprove && <th style={{ padding: '12px', textAlign: 'center', color: '#1e40af' }}>Action</th>}
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id} style={{ borderBottom: '1px solid #e0f2fe' }}>
                <td style={{ padding: '12px' }}>{new Date(tx.transaction_date).toLocaleDateString()}</td>
                <td style={{ padding: '12px' }}>{tx.vehicle?.vehicle_number}</td>
                <td style={{ padding: '12px' }}>{tx.driver?.first_name} {tx.driver?.last_name}</td>
                <td style={{ padding: '12px' }}>{tx.station_name}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>{tx.gallons}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>${tx.total_amount}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 8px',
                    background: tx.approval_status === 'approved' ? '#d1fae5' : '#fef3c7',
                    color: tx.approval_status === 'approved' ? '#065f46' : '#92400e',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {tx.approval_status}
                  </span>
                </td>
                {canApprove && tx.approval_status === 'pending' && (
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleApprove(tx.id)}
                      style={{
                        padding: '6px 12px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Approve
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## 📊 Fleet Management Features

### Key Features for Fleet Companies:

1. **Vehicle Management**
   - Add/edit vehicles with VIN, license plate
   - Assign vehicles to drivers
   - Track odometer readings
   - Set per-vehicle spending limits
   - Track maintenance schedules

2. **Fuel Transaction Tracking**
   - Drivers log fuel purchases
   - Automatic location capture
   - Receipt photo upload
   - Manager approval workflow
   - Flag suspicious transactions

3. **Driver Management**
   - Invite drivers to platform
   - Assign vehicles
   - Track driver performance
   - Monitor license expiration
   - View driver-specific spending

4. **Spending Controls**
   - Set company-wide limits
   - Set per-vehicle limits
   - Set per-driver limits
   - Real-time alerts when limits exceeded
   - Prevent unauthorized purchases

5. **Reporting**
   - Fuel efficiency by vehicle
   - Spending by driver
   - Monthly/quarterly reports
   - Tax-deductible expense tracking
   - Export to accounting software

---

## 🎯 How It Differs from Property Management

| Aspect | Property Management | Fleet Management |
|--------|-------------------|------------------|
| **Organizations** | Property companies | Fleet companies |
| **Primary Asset** | Properties/Units | Vehicles |
| **Users** | Owners, Tenants, Managers | Fleet admins, Drivers, Dispatchers |
| **Transactions** | Rent payments, expenses | Fuel purchases, maintenance |
| **Key Metric** | Occupancy rate | MPG, cost per mile |
| **Permissions** | Who can edit property | Who can drive vehicle, approve fuel |

---

## 🔑 Critical Differences in Code

### 1. Role Names
```javascript
// Property Management
ROLES = { PROPERTY_OWNER, TENANT, MANAGER }

// Fleet Management
FLEET_ROLES = { FLEET_ADMIN, DRIVER, DISPATCHER, FLEET_MANAGER }
```

### 2. Data Model
```javascript
// Property Management
organizations → properties → units → tenants → leases

// Fleet Management
fleet_companies → vehicles → drivers → fuel_transactions → trips
```

### 3. Permissions Logic
```javascript
// Property: Can tenant see property?
tenant_id IN (SELECT tenant_id FROM leases WHERE property_id = ?)

// Fleet: Can driver see vehicle?
vehicle.assigned_driver_id = current_user_id()
```

---

## 🚀 Quick Start for Fleet Platform

```bash
# 1. Copy base auth system
# 2. Rename tables:
organizations → fleet_companies
users → fleet_users
properties → vehicles
tenants → drivers
transactions → fuel_transactions

# 3. Update roles in config/fleet-roles.js
# 4. Update RLS policies for fleet logic
# 5. Update onboarding to collect fleet info
# 6. Build fleet-specific dashboard
```

**Time:** ~3-4 hours to adapt from property management template

---

## 📚 Fleet-Specific Features to Add

- [ ] GPS tracking integration
- [ ] Fuel card API integration (WEX, Fleet One)
- [ ] Route optimization
- [ ] Idle time monitoring
- [ ] Maintenance scheduling
- [ ] Driver safety scores
- [ ] Real-time fuel price comparison
- [ ] Carbon emissions tracking

---

## 💡 Summary

**Fleet Management is perfect for:**
- Logistics companies (UPS, FedEx-style)
- Food delivery services (DoorDash drivers)
- Trucking companies
- Taxi/rideshare fleets
- Service companies (plumbers, electricians with vehicles)

**Same 3-layer auth pattern:**
- Clerk: Authentication + company organizations
- Your app: Fleet-specific roles & permissions
- Supabase: RLS to isolate company A's vehicles from company B

**The core pattern stays the same, just adapt the data model!** 🚛
