-- ============================================
-- LEASES & FILES TABLE SETUP FOR SUPABASE
-- Project: ptwgxoamojvbbezysgnq.supabase.co
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROPERTIES TABLE (if not exists)
-- ============================================
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  property_type TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_properties_organization_id ON properties(organization_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);

-- ============================================
-- 2. UNITS TABLE (if not exists)
-- ============================================
CREATE TABLE IF NOT EXISTS units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  unit_number TEXT,
  unit_name TEXT,
  bedrooms INTEGER,
  bathrooms DECIMAL(3,1),
  square_feet INTEGER,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_units_organization_id ON units(organization_id);
CREATE INDEX IF NOT EXISTS idx_units_property_id ON units(property_id);
CREATE INDEX IF NOT EXISTS idx_units_status ON units(status);

-- ============================================
-- 3. TENANTS TABLE (if not exists)
-- ============================================
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_tenants_organization_id ON tenants(organization_id);
CREATE INDEX IF NOT EXISTS idx_tenants_email ON tenants(email);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);

-- ============================================
-- 4. LEASES TABLE (MAIN TABLE)
-- ============================================
CREATE TABLE IF NOT EXISTS leases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
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

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_leases_organization_id ON leases(organization_id);
CREATE INDEX IF NOT EXISTS idx_leases_property_id ON leases(property_id);
CREATE INDEX IF NOT EXISTS idx_leases_tenant_id ON leases(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leases_status ON leases(status);
CREATE INDEX IF NOT EXISTS idx_leases_start_date ON leases(lease_start_date);
CREATE INDEX IF NOT EXISTS idx_leases_end_date ON leases(lease_end_date);

-- ============================================
-- 5. FILES TABLE (for lease documents)
-- ============================================
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  lease_id UUID REFERENCES leases(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  file_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_files_organization_id ON files(organization_id);
CREATE INDEX IF NOT EXISTS idx_files_lease_id ON files(lease_id);
CREATE INDEX IF NOT EXISTS idx_files_property_id ON files(property_id);

-- ============================================
-- 6. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 7. RLS POLICIES FOR LEASES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view leases in their organization" ON leases;
DROP POLICY IF EXISTS "Users can create leases in their organization" ON leases;
DROP POLICY IF EXISTS "Users can update leases in their organization" ON leases;
DROP POLICY IF EXISTS "Users can delete leases in their organization" ON leases;

-- CREATE: Users can view leases in their organization
CREATE POLICY "Users can view leases in their organization"
  ON leases
  FOR SELECT
  USING (
    organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid
  );

-- CREATE: Users can insert leases in their organization
CREATE POLICY "Users can create leases in their organization"
  ON leases
  FOR INSERT
  WITH CHECK (
    organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid
  );

-- UPDATE: Users can update leases in their organization
CREATE POLICY "Users can update leases in their organization"
  ON leases
  FOR UPDATE
  USING (
    organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid
  );

-- DELETE: Users can delete leases in their organization
CREATE POLICY "Users can delete leases in their organization"
  ON leases
  FOR DELETE
  USING (
    organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid
  );

-- ============================================
-- 8. RLS POLICIES FOR PROPERTIES
-- ============================================

DROP POLICY IF EXISTS "Users can view properties in their organization" ON properties;
DROP POLICY IF EXISTS "Users can create properties in their organization" ON properties;
DROP POLICY IF EXISTS "Users can update properties in their organization" ON properties;
DROP POLICY IF EXISTS "Users can delete properties in their organization" ON properties;

CREATE POLICY "Users can view properties in their organization"
  ON properties FOR SELECT
  USING (organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid);

CREATE POLICY "Users can create properties in their organization"
  ON properties FOR INSERT
  WITH CHECK (organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid);

CREATE POLICY "Users can update properties in their organization"
  ON properties FOR UPDATE
  USING (organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid);

CREATE POLICY "Users can delete properties in their organization"
  ON properties FOR DELETE
  USING (organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid);

-- ============================================
-- 9. RLS POLICIES FOR UNITS
-- ============================================

DROP POLICY IF EXISTS "Users can view units in their organization" ON units;
DROP POLICY IF EXISTS "Users can create units in their organization" ON units;
DROP POLICY IF EXISTS "Users can update units in their organization" ON units;
DROP POLICY IF EXISTS "Users can delete units in their organization" ON units;

CREATE POLICY "Users can view units in their organization"
  ON units FOR SELECT
  USING (organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid);

CREATE POLICY "Users can create units in their organization"
  ON units FOR INSERT
  WITH CHECK (organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid);

CREATE POLICY "Users can update units in their organization"
  ON units FOR UPDATE
  USING (organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid);

CREATE POLICY "Users can delete units in their organization"
  ON units FOR DELETE
  USING (organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid);

-- ============================================
-- 10. RLS POLICIES FOR TENANTS
-- ============================================

DROP POLICY IF EXISTS "Users can view tenants in their organization" ON tenants;
DROP POLICY IF EXISTS "Users can create tenants in their organization" ON tenants;
DROP POLICY IF EXISTS "Users can update tenants in their organization" ON tenants;
DROP POLICY IF EXISTS "Users can delete tenants in their organization" ON tenants;

CREATE POLICY "Users can view tenants in their organization"
  ON tenants FOR SELECT
  USING (organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid);

CREATE POLICY "Users can create tenants in their organization"
  ON tenants FOR INSERT
  WITH CHECK (organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid);

CREATE POLICY "Users can update tenants in their organization"
  ON tenants FOR UPDATE
  USING (organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid);

CREATE POLICY "Users can delete tenants in their organization"
  ON tenants FOR DELETE
  USING (organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid);

-- ============================================
-- 11. RLS POLICIES FOR FILES
-- ============================================

DROP POLICY IF EXISTS "Users can view files in their organization" ON files;
DROP POLICY IF EXISTS "Users can create files in their organization" ON files;
DROP POLICY IF EXISTS "Users can update files in their organization" ON files;
DROP POLICY IF EXISTS "Users can delete files in their organization" ON files;

CREATE POLICY "Users can view files in their organization"
  ON files FOR SELECT
  USING (organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid);

CREATE POLICY "Users can create files in their organization"
  ON files FOR INSERT
  WITH CHECK (organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid);

CREATE POLICY "Users can update files in their organization"
  ON files FOR UPDATE
  USING (organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid);

CREATE POLICY "Users can delete files in their organization"
  ON files FOR DELETE
  USING (organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid);

-- ============================================
-- 12. INSERT SAMPLE DATA (OPTIONAL - for testing)
-- ============================================

-- First, you need to know your organization_id from Clerk
-- Replace 'YOUR_ORG_ID_HERE' with your actual organization ID

-- Sample Property
INSERT INTO properties (id, organization_id, name, address, city, state, zip_code, property_type, status)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'YOUR_ORG_ID_HERE', 'Main Street Lofts', '101 Main St', 'Milford Oaks', 'OH', '45140', 'apartment', 'active')
ON CONFLICT (id) DO NOTHING;

-- Sample Unit
INSERT INTO units (id, organization_id, property_id, unit_number, unit_name, bedrooms, bathrooms, status)
VALUES 
  ('22222222-2222-2222-2222-222222222222', 'YOUR_ORG_ID_HERE', '11111111-1111-1111-1111-111111111111', '201', 'Unit 201', 2, 1.5, 'available')
ON CONFLICT (id) DO NOTHING;

-- Sample Tenant
INSERT INTO tenants (id, organization_id, first_name, last_name, email, phone, status)
VALUES 
  ('33333333-3333-3333-3333-333333333333', 'YOUR_ORG_ID_HERE', 'John', 'Smith', 'john.smith@email.com', '+1 (555) 123-4567', 'active')
ON CONFLICT (id) DO NOTHING;

-- Sample Lease
INSERT INTO leases (
  id, 
  organization_id, 
  property_id, 
  unit_id, 
  tenant_id, 
  lease_start_date, 
  lease_end_date, 
  rent_amount, 
  deposit_amount, 
  payment_due_day, 
  status,
  lease_terms
)
VALUES 
  (
    '44444444-4444-4444-4444-444444444444',
    'YOUR_ORG_ID_HERE',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    '2024-01-01',
    '2024-12-31',
    1500.00,
    2500.00,
    1,
    'active',
    '{"leaseType":"fixed","paymentFrequency":"Monthly"}'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SETUP COMPLETE!
-- ============================================

-- Verify tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('properties', 'units', 'tenants', 'leases', 'files')
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('properties', 'units', 'tenants', 'leases', 'files');
