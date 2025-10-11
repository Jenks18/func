-- JumbaJot Multi-Tenant Database Schema
-- This schema supports multiple organizations with role-based access control

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES
-- ============================================

-- Organizations (Property Management Companies)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_by TEXT NOT NULL, -- Clerk user ID
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (synced from Clerk)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'org_admin', 'property_owner', 'manager', 'maintenance', 'tenant')),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  avatar_url TEXT,
  phone TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Properties
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES users(id),
  manager_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'USA',
  property_type TEXT CHECK (property_type IN ('single_family', 'multi_family', 'apartment', 'condo', 'commercial')),
  units_count INTEGER DEFAULT 0,
  year_built INTEGER,
  square_footage INTEGER,
  purchase_price DECIMAL(12, 2),
  current_value DECIMAL(12, 2),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Units
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  unit_number TEXT NOT NULL,
  bedrooms INTEGER,
  bathrooms DECIMAL(3, 1),
  square_footage INTEGER,
  rent_amount DECIMAL(10, 2),
  deposit_amount DECIMAL(10, 2),
  status TEXT DEFAULT 'vacant' CHECK (status IN ('vacant', 'occupied', 'maintenance', 'reserved')),
  amenities TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(property_id, unit_number)
);

-- Tenants
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  employment_info JSONB,
  credit_score INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leases
CREATE TABLE leases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  lease_start_date DATE NOT NULL,
  lease_end_date DATE NOT NULL,
  rent_amount DECIMAL(10, 2) NOT NULL,
  deposit_amount DECIMAL(10, 2),
  payment_due_day INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'expired', 'terminated')),
  lease_terms TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions (Income & Expenses)
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES units(id),
  tenant_id UUID REFERENCES tenants(id),
  lease_id UUID REFERENCES leases(id),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  payment_method TEXT,
  reference_number TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance Requests
CREATE TABLE maintenance_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  unit_id UUID REFERENCES units(id),
  tenant_id UUID REFERENCES tenants(id),
  assigned_to UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  category TEXT,
  cost DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES users(id) NOT NULL,
  recipient_id UUID REFERENCES users(id) NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  property_id UUID REFERENCES properties(id),
  maintenance_request_id UUID REFERENCES maintenance_requests(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Files (for leases, documents, photos)
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  uploaded_by UUID REFERENCES users(id) NOT NULL,
  property_id UUID REFERENCES properties(id),
  lease_id UUID REFERENCES leases(id),
  maintenance_request_id UUID REFERENCES maintenance_requests(id),
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Listings (for marketing vacant units)
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  unit_id UUID REFERENCES units(id),
  title TEXT NOT NULL,
  description TEXT,
  rent_amount DECIMAL(10, 2) NOT NULL,
  available_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'rented', 'inactive')),
  photos TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_properties_organization_id ON properties(organization_id);
CREATE INDEX idx_properties_owner_id ON properties(owner_id);
CREATE INDEX idx_properties_manager_id ON properties(manager_id);

CREATE INDEX idx_units_property_id ON units(property_id);
CREATE INDEX idx_units_status ON units(status);

CREATE INDEX idx_tenants_organization_id ON tenants(organization_id);
CREATE INDEX idx_tenants_user_id ON tenants(user_id);

CREATE INDEX idx_leases_organization_id ON leases(organization_id);
CREATE INDEX idx_leases_property_id ON leases(property_id);
CREATE INDEX idx_leases_tenant_id ON leases(tenant_id);
CREATE INDEX idx_leases_status ON leases(status);

CREATE INDEX idx_transactions_organization_id ON transactions(organization_id);
CREATE INDEX idx_transactions_property_id ON transactions(property_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);

CREATE INDEX idx_maintenance_organization_id ON maintenance_requests(organization_id);
CREATE INDEX idx_maintenance_property_id ON maintenance_requests(property_id);
CREATE INDEX idx_maintenance_status ON maintenance_requests(status);
CREATE INDEX idx_maintenance_assigned_to ON maintenance_requests(assigned_to);

CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_read ON messages(read);

CREATE INDEX idx_files_organization_id ON files(organization_id);
CREATE INDEX idx_files_property_id ON files(property_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user from JWT
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS UUID AS $$
  SELECT id FROM users WHERE clerk_id = (auth.jwt() ->> 'sub')::text;
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM users WHERE clerk_id = (auth.jwt() ->> 'sub')::text;
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM users WHERE clerk_id = (auth.jwt() ->> 'sub')::text;
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================
-- ORGANIZATIONS POLICIES
-- ============================================

-- Users can see their own organizations
CREATE POLICY org_select ON organizations
FOR SELECT USING (
  id = current_organization_id() OR
  created_by = (auth.jwt() ->> 'sub')::text
);

-- Only org creators can update their organization
CREATE POLICY org_update ON organizations
FOR UPDATE USING (
  created_by = (auth.jwt() ->> 'sub')::text OR
  current_user_role() = 'org_admin'
);

-- ============================================
-- USERS POLICIES
-- ============================================

-- Users can see themselves and users in their organization
CREATE POLICY users_select ON users
FOR SELECT USING (
  clerk_id = (auth.jwt() ->> 'sub')::text OR
  organization_id = current_organization_id()
);

-- Users can update their own data
CREATE POLICY users_update ON users
FOR UPDATE USING (
  clerk_id = (auth.jwt() ->> 'sub')::text
);

-- ============================================
-- PROPERTIES POLICIES
-- ============================================

-- View properties based on role
CREATE POLICY properties_select ON properties
FOR SELECT USING (
  organization_id = current_organization_id() OR
  owner_id = current_user_id() OR
  manager_id = current_user_id() OR
  -- Tenants can see properties they're leasing
  id IN (
    SELECT property_id FROM leases 
    WHERE tenant_id IN (
      SELECT id FROM tenants WHERE user_id = current_user_id()
    )
    AND status = 'active'
  )
);

-- Insert properties (owner, manager, admin)
CREATE POLICY properties_insert ON properties
FOR INSERT WITH CHECK (
  organization_id = current_organization_id() AND
  current_user_role() IN ('org_admin', 'property_owner', 'manager')
);

-- Update properties (owner, manager, admin)
CREATE POLICY properties_update ON properties
FOR UPDATE USING (
  (organization_id = current_organization_id() AND
   current_user_role() IN ('org_admin', 'property_owner', 'manager')) OR
  owner_id = current_user_id() OR
  manager_id = current_user_id()
);

-- Delete properties (owner, admin only)
CREATE POLICY properties_delete ON properties
FOR DELETE USING (
  (organization_id = current_organization_id() AND
   current_user_role() IN ('org_admin', 'property_owner')) OR
  owner_id = current_user_id()
);

-- ============================================
-- UNITS POLICIES
-- ============================================

-- Users can see units from properties they can see
CREATE POLICY units_select ON units
FOR SELECT USING (
  property_id IN (SELECT id FROM properties)
);

-- Insert/Update/Delete units follows property permissions
CREATE POLICY units_insert ON units
FOR INSERT WITH CHECK (
  property_id IN (
    SELECT id FROM properties 
    WHERE organization_id = current_organization_id()
  )
);

CREATE POLICY units_update ON units
FOR UPDATE USING (
  property_id IN (
    SELECT id FROM properties 
    WHERE organization_id = current_organization_id()
  )
);

CREATE POLICY units_delete ON units
FOR DELETE USING (
  property_id IN (
    SELECT id FROM properties 
    WHERE organization_id = current_organization_id()
  )
);

-- ============================================
-- TENANTS POLICIES
-- ============================================

-- View tenants in your organization or if you are the tenant
CREATE POLICY tenants_select ON tenants
FOR SELECT USING (
  organization_id = current_organization_id() OR
  user_id = current_user_id()
);

-- Create/Update/Delete tenants (admin, manager only)
CREATE POLICY tenants_insert ON tenants
FOR INSERT WITH CHECK (
  organization_id = current_organization_id() AND
  current_user_role() IN ('org_admin', 'manager')
);

CREATE POLICY tenants_update ON tenants
FOR UPDATE USING (
  organization_id = current_organization_id() AND
  current_user_role() IN ('org_admin', 'manager')
);

CREATE POLICY tenants_delete ON tenants
FOR DELETE USING (
  organization_id = current_organization_id() AND
  current_user_role() = 'org_admin'
);

-- ============================================
-- LEASES POLICIES
-- ============================================

-- View leases based on role
CREATE POLICY leases_select ON leases
FOR SELECT USING (
  organization_id = current_organization_id() OR
  tenant_id IN (
    SELECT id FROM tenants WHERE user_id = current_user_id()
  )
);

-- Create/Update leases (admin, manager only)
CREATE POLICY leases_insert ON leases
FOR INSERT WITH CHECK (
  organization_id = current_organization_id() AND
  current_user_role() IN ('org_admin', 'manager')
);

CREATE POLICY leases_update ON leases
FOR UPDATE USING (
  organization_id = current_organization_id() AND
  current_user_role() IN ('org_admin', 'manager')
);

-- ============================================
-- TRANSACTIONS POLICIES
-- ============================================

-- View transactions based on role
CREATE POLICY transactions_select ON transactions
FOR SELECT USING (
  organization_id = current_organization_id() OR
  -- Tenants see their own transactions
  tenant_id IN (
    SELECT id FROM tenants WHERE user_id = current_user_id()
  )
);

-- Create/Update transactions (admin, manager only)
CREATE POLICY transactions_insert ON transactions
FOR INSERT WITH CHECK (
  organization_id = current_organization_id() AND
  current_user_role() IN ('org_admin', 'manager', 'property_owner')
);

CREATE POLICY transactions_update ON transactions
FOR UPDATE USING (
  organization_id = current_organization_id() AND
  current_user_role() IN ('org_admin', 'manager')
);

-- ============================================
-- MAINTENANCE POLICIES
-- ============================================

-- View maintenance requests
CREATE POLICY maintenance_select ON maintenance_requests
FOR SELECT USING (
  organization_id = current_organization_id() OR
  assigned_to = current_user_id() OR
  tenant_id IN (
    SELECT id FROM tenants WHERE user_id = current_user_id()
  )
);

-- Anyone can create maintenance requests
CREATE POLICY maintenance_insert ON maintenance_requests
FOR INSERT WITH CHECK (
  organization_id = current_organization_id() OR
  tenant_id IN (
    SELECT id FROM tenants WHERE user_id = current_user_id()
  )
);

-- Update maintenance (assigned person, admin, manager)
CREATE POLICY maintenance_update ON maintenance_requests
FOR UPDATE USING (
  assigned_to = current_user_id() OR
  (organization_id = current_organization_id() AND
   current_user_role() IN ('org_admin', 'manager'))
);

-- ============================================
-- MESSAGES POLICIES
-- ============================================

-- Users can see messages they sent or received
CREATE POLICY messages_select ON messages
FOR SELECT USING (
  sender_id = current_user_id() OR
  recipient_id = current_user_id()
);

-- Users can send messages
CREATE POLICY messages_insert ON messages
FOR INSERT WITH CHECK (
  sender_id = current_user_id() AND
  organization_id = current_organization_id()
);

-- Users can update messages they received (mark as read)
CREATE POLICY messages_update ON messages
FOR UPDATE USING (
  recipient_id = current_user_id()
);

-- ============================================
-- FILES POLICIES
-- ============================================

-- View files based on related entity access
CREATE POLICY files_select ON files
FOR SELECT USING (
  organization_id = current_organization_id() OR
  uploaded_by = current_user_id()
);

-- Upload files
CREATE POLICY files_insert ON files
FOR INSERT WITH CHECK (
  organization_id = current_organization_id() AND
  uploaded_by = current_user_id()
);

-- Delete files (uploader or admin)
CREATE POLICY files_delete ON files
FOR DELETE USING (
  uploaded_by = current_user_id() OR
  (organization_id = current_organization_id() AND
   current_user_role() IN ('org_admin'))
);

-- ============================================
-- LISTINGS POLICIES
-- ============================================

-- Anyone can view active listings
CREATE POLICY listings_select ON listings
FOR SELECT USING (
  status = 'active' OR
  organization_id = current_organization_id()
);

-- Create/Update/Delete listings (admin, manager, owner)
CREATE POLICY listings_insert ON listings
FOR INSERT WITH CHECK (
  organization_id = current_organization_id() AND
  current_user_role() IN ('org_admin', 'property_owner', 'manager')
);

CREATE POLICY listings_update ON listings
FOR UPDATE USING (
  organization_id = current_organization_id() AND
  current_user_role() IN ('org_admin', 'property_owner', 'manager')
);

CREATE POLICY listings_delete ON listings
FOR DELETE USING (
  organization_id = current_organization_id() AND
  current_user_role() IN ('org_admin', 'property_owner')
);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON units
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leases_updated_at BEFORE UPDATE ON leases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_updated_at BEFORE UPDATE ON maintenance_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample organization
INSERT INTO organizations (id, name, created_by, plan) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Demo Property Management', 'clerk_demo_user', 'pro');

-- Insert sample users
INSERT INTO users (clerk_id, email, first_name, last_name, role, organization_id) VALUES
  ('clerk_demo_admin', 'admin@demo.com', 'John', 'Admin', 'org_admin', '00000000-0000-0000-0000-000000000001'),
  ('clerk_demo_owner', 'owner@demo.com', 'Jane', 'Owner', 'property_owner', '00000000-0000-0000-0000-000000000001'),
  ('clerk_demo_manager', 'manager@demo.com', 'Bob', 'Manager', 'manager', '00000000-0000-0000-0000-000000000001'),
  ('clerk_demo_tenant', 'tenant@demo.com', 'Alice', 'Tenant', 'tenant', '00000000-0000-0000-0000-000000000001');
