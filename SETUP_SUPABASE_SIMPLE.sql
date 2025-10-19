-- ============================================
-- SIMPLIFIED LEASES SETUP (NO RLS FOR TESTING)
-- Project: ptwgxoamojvbbezysgnq.supabase.co
-- Run this FIRST to test basic functionality
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. DROP EXISTING TABLES (clean start)
-- ============================================
DROP TABLE IF EXISTS files CASCADE;
DROP TABLE IF EXISTS leases CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;
DROP TABLE IF EXISTS units CASCADE;
DROP TABLE IF EXISTS properties CASCADE;

-- ============================================
-- 2. CREATE PROPERTIES TABLE
-- ============================================
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id TEXT DEFAULT 'default_org',
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  property_type TEXT DEFAULT 'apartment',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_properties_organization_id ON properties(organization_id);

-- ============================================
-- 3. CREATE UNITS TABLE
-- ============================================
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id TEXT DEFAULT 'default_org',
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  unit_number TEXT,
  unit_name TEXT,
  bedrooms INTEGER DEFAULT 1,
  bathrooms DECIMAL(3,1) DEFAULT 1.0,
  square_feet INTEGER,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_units_property_id ON units(property_id);
CREATE INDEX idx_units_organization_id ON units(organization_id);

-- ============================================
-- 4. CREATE TENANTS TABLE
-- ============================================
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id TEXT DEFAULT 'default_org',
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tenants_organization_id ON tenants(organization_id);
CREATE INDEX idx_tenants_email ON tenants(email);

-- ============================================
-- 5. CREATE LEASES TABLE (MAIN TABLE)
-- ============================================
CREATE TABLE leases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id TEXT DEFAULT 'default_org',
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  lease_start_date DATE NOT NULL,
  lease_end_date DATE NOT NULL,
  rent_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  deposit_amount DECIMAL(10, 2) DEFAULT 0,
  payment_due_day INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active',
  lease_terms TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leases_organization_id ON leases(organization_id);
CREATE INDEX idx_leases_property_id ON leases(property_id);
CREATE INDEX idx_leases_tenant_id ON leases(tenant_id);
CREATE INDEX idx_leases_status ON leases(status);

-- ============================================
-- 6. CREATE FILES TABLE
-- ============================================
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id TEXT DEFAULT 'default_org',
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

CREATE INDEX idx_files_lease_id ON files(lease_id);
CREATE INDEX idx_files_organization_id ON files(organization_id);

-- ============================================
-- 7. DISABLE RLS FOR TESTING (we'll add it later)
-- ============================================
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE units DISABLE ROW LEVEL SECURITY;
ALTER TABLE tenants DISABLE ROW LEVEL SECURITY;
ALTER TABLE leases DISABLE ROW LEVEL SECURITY;
ALTER TABLE files DISABLE ROW LEVEL SECURITY;

-- ============================================
-- 8. INSERT SAMPLE DATA
-- ============================================

-- Sample Property
INSERT INTO properties (id, organization_id, name, address, city, state, zip_code, property_type)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'default_org', 'Main Street Lofts', '101 Main St', 'Milford Oaks', 'OH', '45140', 'apartment');

-- Sample Units
INSERT INTO units (id, organization_id, property_id, unit_number, unit_name, bedrooms, bathrooms, status)
VALUES 
  ('22222222-2222-2222-2222-222222222222', 'default_org', '11111111-1111-1111-1111-111111111111', '101', 'Unit 101', 1, 1.0, 'available'),
  ('22222222-2222-2222-2222-222222222223', 'default_org', '11111111-1111-1111-1111-111111111111', '201', 'Unit 201', 2, 1.5, 'available'),
  ('22222222-2222-2222-2222-222222222224', 'default_org', '11111111-1111-1111-1111-111111111111', '202', 'Unit 202', 2, 2.0, 'available');

-- Sample Tenants
INSERT INTO tenants (id, organization_id, first_name, last_name, email, phone)
VALUES 
  ('33333333-3333-3333-3333-333333333333', 'default_org', 'John', 'Smith', 'john.smith@email.com', '+1 (555) 123-4567'),
  ('33333333-3333-3333-3333-333333333334', 'default_org', 'Jane', 'Doe', 'jane.doe@email.com', '+1 (555) 234-5678');

-- Sample Leases
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
    'default_org',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    '2024-01-01',
    '2024-12-31',
    1200.00,
    2400.00,
    1,
    'active',
    '{"leaseType":"fixed","paymentFrequency":"Monthly"}'
  ),
  (
    '44444444-4444-4444-4444-444444444445',
    'default_org',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222223',
    '33333333-3333-3333-3333-333333333334',
    '2024-02-01',
    '2025-01-31',
    1500.00,
    3000.00,
    1,
    'active',
    '{"leaseType":"fixed","paymentFrequency":"Monthly"}'
  );

-- ============================================
-- 9. VERIFY SETUP
-- ============================================

-- Check tables exist
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN ('properties', 'units', 'tenants', 'leases', 'files')
ORDER BY table_name;

-- Check data was inserted
SELECT 
  'properties' as table_name, COUNT(*) as row_count FROM properties
UNION ALL
SELECT 'units', COUNT(*) FROM units
UNION ALL
SELECT 'tenants', COUNT(*) FROM tenants
UNION ALL
SELECT 'leases', COUNT(*) FROM leases
UNION ALL
SELECT 'files', COUNT(*) FROM files;

-- Check RLS is disabled
SELECT 
  tablename, 
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('properties', 'units', 'tenants', 'leases', 'files')
ORDER BY tablename;

-- ============================================
-- SETUP COMPLETE!
-- ============================================

-- You should see:
-- ✅ 5 tables created
-- ✅ 1 property, 3 units, 2 tenants, 2 leases
-- ✅ RLS disabled (shows 'f' for false)

-- Next: Restart your app and test!
